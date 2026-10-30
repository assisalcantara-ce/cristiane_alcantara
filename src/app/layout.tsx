import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://www.cristianealcantara.com.br";
const APEX_URL = "https://cristianealcantara.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cristiane Alcântara | Psicanalista Cristã",
  description:
    "Cuidar da sua história também é um ato de fé. Acolhimento profissional para adultos, jovens e casais que buscam curar feridas emocionais, fortalecer seus relacionamentos e viver com mais sentido e propósito.",
  keywords: [
    "Psicanálise Cristã",
    "Cristiane Alcântara",
    "Saúde Emocional",
    "Atendimento para Casais",
    "Juventude",
    "Assuma Seus B.O.s",
    "Atendimento Individual",
    "Orientação Cristã",
    "Palestras e Eventos",
  ],
  authors: [{ name: "Cristiane Alcântara" }],
  alternates: {
    canonical: SITE_URL,
    languages: {
      "pt-BR": SITE_URL,
    },
  },
  openGraph: {
    title: "Cristiane Alcântara | Psicanalista Cristã",
    description: "Cuidar da sua história também é um ato de fé. Espaço seguro de escuta, ciência e transformação.",
    url: SITE_URL,
    siteName: "Cristiane Alcântara",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const rawApiUrl = process.env.NEXT_PUBLIC_CLINIVA_API_URL?.trim();

  // Validação estrita da URL do Cliniva:
  // Em produção: EXIGE NEXT_PUBLIC_CLINIVA_API_URL configurada como URL HTTPS válida, sem localhost.
  // Em desenvolvimento: aceita http://localhost:3002 ou a URL configurada localmente.
  let clinivaApiUrl: string | null = null;
  let widgetWarning: string | null = null;

  if (isProduction) {
    if (!rawApiUrl) {
      widgetWarning =
        "[Cliniva Widget] NEXT_PUBLIC_CLINIVA_API_URL não configurada no ambiente de produção. O widget não foi carregado.";
    } else if (rawApiUrl.includes("localhost") || rawApiUrl.includes("127.0.0.1")) {
      widgetWarning =
        "[Cliniva Widget] NEXT_PUBLIC_CLINIVA_API_URL configurada com endereço local em produção. O widget não foi carregado.";
    } else if (!rawApiUrl.startsWith("https://")) {
      widgetWarning =
        "[Cliniva Widget] NEXT_PUBLIC_CLINIVA_API_URL deve utilizar o protocolo seguro HTTPS em produção. O widget não foi carregado.";
    } else {
      clinivaApiUrl = rawApiUrl.replace(/\/$/, "");
    }
  } else {
    clinivaApiUrl = (rawApiUrl || "http://localhost:3002").replace(/\/$/, "");
  }

  const clinivaTherapist = process.env.NEXT_PUBLIC_CLINIVA_THERAPIST || "dra-cristiane";

  if (widgetWarning && typeof console !== "undefined") {
    console.warn(widgetWarning);
  }

  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FAF6F1] text-[#342A2D] selection:bg-[#68152D] selection:text-[#FAF6F1]">
        {children}

        {/* Widget Universal de Atendimento com IA do Cliniva v1.0 (carregado apenas com URL validada) */}
        {clinivaApiUrl && (
          <script
            src={`${clinivaApiUrl}/widget.js`}
            data-slug={clinivaTherapist}
            data-api-url={clinivaApiUrl}
            data-primary-color="#68152D"
            data-accent-color="#B78449"
            data-title="Dra. Cristiane Alcântara"
            data-subtitle="Psicóloga e Psicanalista Clínica"
            async
          />
        )}
      </body>
    </html>
  );
}
