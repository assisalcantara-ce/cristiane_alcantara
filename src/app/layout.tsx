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

export const metadata: Metadata = {
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
    "Palestras e Eventos"
  ],
  authors: [{ name: "Cristiane Alcântara" }],
  openGraph: {
    title: "Cristiane Alcântara | Psicanalista Cristã",
    description: "Cuidar da sua história também é um ato de fé. Espaço seguro de escuta, ciência e transformação.",
    url: "https://cristianealcantara.com.br",
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
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FAF6F1] text-[#342A2D] selection:bg-[#68152D] selection:text-[#FAF6F1]">
        {children}
      </body>
    </html>
  );
}
