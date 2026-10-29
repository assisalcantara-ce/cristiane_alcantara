import { NextRequest, NextResponse } from "next/server";
import { LandingAppointmentPayload, LandingAppointmentResponse } from "@/types/cliniva";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LandingAppointmentPayload;

    if (!body.full_name || body.full_name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nome completo é obrigatório e deve ter pelo menos 2 caracteres" },
        { status: 400 },
      );
    }

    if (!body.date || !body.time) {
      return NextResponse.json(
        { error: "Data e horário são obrigatórios" },
        { status: 400 },
      );
    }

    if (!body.consent || body.consent.accepted !== true) {
      return NextResponse.json(
        { error: "O consentimento informado é obrigatório para realizar o agendamento." },
        { status: 400 },
      );
    }

    if (!body.idempotency_key || body.idempotency_key.trim().length < 8) {
      return NextResponse.json(
        { error: "A chave de idempotência é obrigatória para processar o agendamento com segurança." },
        { status: 400 },
      );
    }

    // Validação de Honeypot contra robôs/spam
    if (body.website_hp && body.website_hp.length > 0) {
      return NextResponse.json({ error: "Acesso rejeitado" }, { status: 400 });
    }

    const clinivaBase = process.env.NEXT_PUBLIC_CLINIVA_API_URL?.trim();
    const isProduction = process.env.NODE_ENV === "production";

    // Extrai o telefone do payload para montar o anamnesis mínimo conforme contrato oficial
    const rawPhone = body.anamnesis?.personal?.celular?.trim() || "";

    // Se houver uma URL base do Cliniva configurada, envia para a API oficial do Cliniva
    if (clinivaBase) {
      try {
        const targetUrl = `${clinivaBase.replace(/\/$/, "")}/api/appointments/landing`;

        // Payload estritamente compatível com o schema do Cliniva (landingSchema)
        const clinivaPayload = {
          idempotency_key: body.idempotency_key.trim(),
          therapist: body.therapist || "dra-cristiane",
          full_name: body.full_name.trim(),
          date: body.date,
          time: body.time,
          notes: body.notes?.trim() || undefined,
          consent: {
            accepted: true as const,
            purpose: body.consent.purpose.trim(),
            notice_version: body.consent.notice_version.trim(),
            consented_at: body.consent.consented_at,
          },
          anamnesis: rawPhone
            ? {
                personal: {
                  celular: rawPhone,
                  birth_date: body.anamnesis?.personal?.birth_date || "1900-01-01",
                  email: body.anamnesis?.personal?.email?.trim() || undefined,
                },
              }
            : undefined,
          website_hp: body.website_hp,
        };

        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(clinivaPayload),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      } catch {
        // Falha de rede para o backend real: NUNCA retorna mock
        return NextResponse.json(
          {
            error:
              "Não foi possível conectar ao servidor de agendamentos no momento. Por favor, tente novamente ou solicite pelo WhatsApp.",
          },
          { status: 503 },
        );
      }
    }

    // Em produção, se a URL base não estiver configurada, rejeita categoricamente
    if (isProduction) {
      return NextResponse.json(
        {
          error:
            "Configuração de agendamento não definida no ambiente de produção. Por favor, realize o contato pelo WhatsApp oficial.",
        },
        { status: 500 },
      );
    }

    // Modo Mock identificado EXCLUSIVO para desenvolvimento local (quando sem Cliniva online)
    const mockResponse: LandingAppointmentResponse = {
      message: "Solicitação recebida em ambiente de teste local (Mock identificado). Não é um agendamento real.",
      patient: {
        id: "mock-patient-id-123",
        full_name: body.full_name.trim(),
      },
      appointment: {
        id: "mock-appointment-id-456",
        status: "requested",
        scheduled_start: `${body.date}T${body.time}:00-03:00`,
        scheduled_end: `${body.date}T${body.time}:50-03:00`,
      },
      isMock: true,
    };

    return NextResponse.json(mockResponse, {
      status: 201,
      headers: { "x-cliniva-mock": "true" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno no servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
