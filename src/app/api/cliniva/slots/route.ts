import { NextRequest, NextResponse } from "next/server";
import { generateIdentifiedMockSlots } from "@/lib/clinivaMock";
import { SlotsPublicResponse } from "@/types/cliniva";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const therapist = url.searchParams.get("therapist") || "dra-cristiane";
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Parâmetros start_date e end_date são obrigatórios (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  const clinivaBase = process.env.NEXT_PUBLIC_CLINIVA_API_URL?.trim().replace(/^["']|["']$/g, "");
  const isProduction = process.env.NODE_ENV === "production";

  // Se houver uma URL base do Cliniva configurada, SEMPRE consulta a API real do Cliniva
  if (clinivaBase) {
    try {
      const targetUrl = `${clinivaBase.replace(/\/$/, "")}/api/appointments/slots/public?therapist=${encodeURIComponent(
        therapist,
      )}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;

      const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      // Em produção, É EXPRESSAMENTE PROIBIDO retornar mock em falha de conexão com a API real
      if (isProduction) {
        return NextResponse.json(
          {
            error:
              "Serviço de horários indisponível no momento. Por favor, tente novamente mais tarde ou agende pelo WhatsApp.",
          },
          { status: 503 },
        );
      }

      // Em desenvolvimento local sem backend ativo, utiliza mock identificado
      const mockSlots = generateIdentifiedMockSlots(startDate, endDate);
      const mockResponse: SlotsPublicResponse = {
        therapist: {
          name: "Dra. Cristiane",
          slug: therapist,
        },
        slots: mockSlots,
        isMock: true,
      };
      return NextResponse.json(mockResponse, {
        status: 200,
        headers: { "x-cliniva-mock": "true" },
      });
    }
  }

  // Em produção, se a URL base não estiver configurada, rejeita categoricamente
  if (isProduction) {
    return NextResponse.json(
      {
        error:
          "Configuração de integração não definida no ambiente de produção. Por favor, contate o consultório pelo WhatsApp.",
      },
      { status: 500 },
    );
  }

  // Apenas em ambiente local de desenvolvimento (sem URL configurada)
  const mockSlots = generateIdentifiedMockSlots(startDate, endDate);
  const mockResponse: SlotsPublicResponse = {
    therapist: {
      name: "Dra. Cristiane",
      slug: therapist,
    },
    slots: mockSlots,
    isMock: true,
  };

  return NextResponse.json(mockResponse, {
    status: 200,
    headers: { "x-cliniva-mock": "true" },
  });
}

