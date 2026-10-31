"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Heart,
  Sparkles,
  Users,
  Compass,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Eye,
  CheckCircle2,
  Phone,
  Mail,
  UserCheck
} from "lucide-react";
import AppointmentModal from "@/components/AppointmentModal";

export default function Home() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const whatsappUrl =
    "https://wa.me/5591993948373?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20atendimento%20com%20a%20Cristiane%20Alc%C3%A2ntara.";

  return (
    <div className="min-h-screen bg-[#FAF6F1] text-[#342A2D] flex flex-col font-sans selection:bg-[#68152D] selection:text-[#FAF6F1]">
      {/* Modal de Agendamento Inteligente com Cliniva */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        defaultTherapist={process.env.NEXT_PUBLIC_CLINIVA_THERAPIST || "dra-cristiane"}
      />
      {/* ==========================================
          HEADER — ALTURA 80px (Sticky / Translúcido)
          ========================================== */}
      <header className="sticky top-0 z-50 h-20 bg-[#FAF6F1]/90 backdrop-blur-md border-b border-[#B78449]/15 transition-all">
        <div className="max-w-[1200px] mx-auto h-full px-6 lg:px-8 flex items-center justify-between">
          {/* Logo oficial Cristiane Alcântara à esquerda (X=120) */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-48 sm:w-60 h-11 sm:h-12">
              <Image
                src="/images/logoh4.png"
                alt="Cristiane Alcântara — Psicanalista Cristã"
                fill
                priority
                className="object-contain object-left group-hover:opacity-90 transition-opacity"
              />
            </div>
          </Link>

          {/* Menu horizontal centralizado (X=485, gap 28px) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide font-medium text-[#342A2D]/85">
            <Link
              href="#inicio"
              className="text-[#68152D] font-semibold border-b-2 border-[#68152D] pb-0.5 hover:text-[#B78449] transition-colors"
            >
              Início
            </Link>
            <Link
              href="#sobre"
              className="hover:text-[#68152D] transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="#atendimentos"
              className="hover:text-[#68152D] transition-colors"
            >
              Atendimentos
            </Link>
            <Link
              href="#livro"
              className="hover:text-[#68152D] transition-colors"
            >
              Livro
            </Link>
            <Link
              href="#palestras"
              className="hover:text-[#68152D] transition-colors"
            >
              Palestras
            </Link>
            <Link
              href="#conteudos"
              className="hover:text-[#68152D] transition-colors"
            >
              Conteúdos
            </Link>
            <Link
              href="#contato"
              className="hover:text-[#68152D] transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* CTA Superior Vinho (X=1140, 180x44px) */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-medium tracking-wide shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#EED9CF]" />
              <span>Agendar atendimento</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          HERO SECTION — ALTURA ~620px
          ========================================== */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-[#FAF6F1] min-h-[580px] lg:min-h-[620px] xl:min-h-[660px] flex items-center border-b border-[#B78449]/15"
      >
        {/* Background Full Oficial do Hero (/img/bg_hero.png) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/bg_hero.png"
            alt="Cristiane Alcântara — Psicanalista Cristã"
            fill
            priority
            className="object-cover object-right lg:object-[center_35%]"
          />
          {/* Gradiente marfim translúcido sutil atrás do texto à esquerda para leitura confortável */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F1]/90 via-[#FAF6F1]/65 to-transparent w-full md:w-[60%] lg:w-[48%]" />
          {/* Overlay suave para mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F1]/95 via-[#FAF6F1]/80 to-transparent md:hidden" />
        </div>

        {/* Bloco Textual à Esquerda */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-20 w-full py-12 lg:py-16">
          <div className="max-w-[530px] flex flex-col justify-center text-left">
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-[#B78449] uppercase mb-4">
              FÉ · CIÊNCIA · METANOIA
            </p>

            {/* Título Principal */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.06] font-bold text-[#68152D] tracking-tight">
              Cuidar da sua <br />
              história também <br />
              <span className="italic font-normal text-[#B78449]">é um ato de fé.</span>
            </h1>

            {/* Parágrafo de Acolhimento */}
            <p className="mt-5 text-[15px] sm:text-[17px] text-[#342A2D]/85 leading-relaxed max-w-[450px]">
              Acolhimento profissional para adultos, jovens e casais que desejam curar suas feridas, compreender suas emoções e viver uma vida com mais sentido, equilíbrio e propósito.
            </p>

            {/* Botões de Ação */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] px-6 py-3.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-[#EED9CF]" />
                <span>Agendar atendimento</span>
              </button>

              <a
                href="#sobre"
                className="inline-flex items-center justify-center gap-2 border border-[#68152D]/40 hover:border-[#68152D] text-[#68152D] bg-[#FAF6F1]/80 hover:bg-[#EED9CF]/40 px-6 py-3.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-300"
              >
                <span>Conheça minha história</span>
              </a>
            </div>

            {/* 3 Diferenciais Discretos */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-[#B78449]/20 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <Heart className="w-4 h-4 text-[#B78449] mb-1.5" />
                <span className="text-[11px] leading-tight font-medium text-[#342A2D]/80">
                  Acolhimento <br />sem julgamentos
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Sparkles className="w-4 h-4 text-[#B78449] mb-1.5" />
                <span className="text-[11px] leading-tight font-medium text-[#342A2D]/80">
                  Ciência e fé <br />caminhando juntas
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Users className="w-4 h-4 text-[#B78449] mb-1.5" />
                <span className="text-[11px] leading-tight font-medium text-[#342A2D]/80">
                  Um novo <br />começo é possível
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SEÇÃO SOBRE A CRISTIANE — ALTURA ~480px
          ========================================== */}
      <section
        id="sobre"
        className="relative bg-[#FAF6F1] py-16 sm:py-20 overflow-hidden border-b border-[#B78449]/15"
      >
        {/* Elemento botânico discreto ao fundo à direita */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-15 pointer-events-none select-none">
          <Image
            src="/images/simbolo_floral_transparente.svg"
            alt="Floral decorativo"
            fill
            className="object-contain"
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Lado Esquerdo: Imagem oficial card1.png (Desktop/Tablet) e cris.jpeg (Mobile) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              {/* Versão Mobile (< 768px): cris.jpeg */}
              <div className="md:hidden relative w-full max-w-[320px] sm:max-w-[360px] aspect-[1086/1448] rounded-[24px] overflow-hidden shadow-xl border border-[#B78449]/20 group">
                <Image
                  src="/images/cris.jpeg"
                  alt="Cristiane Alcântara — Psicanalista Cristã"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  sizes="(max-width: 768px) 320px, 360px"
                />
              </div>

              {/* Versão Desktop/Tablet (>= 768px): card1.png */}
              <div className="hidden md:block relative w-full max-w-[340px] sm:max-w-[380px] aspect-[1136/1385] rounded-[24px] overflow-hidden shadow-xl border border-[#B78449]/20 group">
                <Image
                  src="/images/card1.png"
                  alt="Cristiane Alcântara — Psicanalista Cristã"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  sizes="(max-width: 1024px) 380px, 420px"
                />
              </div>
            </div>

            {/* Lado Direito: Texto de Apresentação Profissional */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left max-w-[560px]">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#B78449] uppercase mb-2">
                SOBRE A CRISTIANE
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-bold text-[#68152D] mb-5">
                Ciência, fé e <br />
                <span className="italic font-normal text-[#B78449]">pessoas reais.</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-[15px] text-[#342A2D]/85 leading-relaxed">
                <p>
                  Cristiane Alcântara é psicanalista cristã, especializada em sexualidade, com pós-graduação em Saúde Mental Integrativa e Relações Humanas.
                </p>
                <p>
                  Atua com uma abordagem que une a ciência, a fé e a escuta genuína, ajudando pessoas, jovens e casais a enfrentarem suas dores, ressignificarem suas histórias e viverem com mais sentido e equilíbrio.
                </p>
              </div>

              <div className="mt-8">
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 border border-[#68152D] text-[#68152D] hover:bg-[#68152D] hover:text-[#FAF6F1] px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300"
                >
                  <span>Conheça minha história</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ATENDIMENTOS — COM BACKGROUND FULL OFICIAL (~540px)
          ========================================== */}
      <section
        id="atendimentos"
        className="relative bg-[#470E20] text-[#FAF6F1] py-20 lg:py-24 overflow-hidden border-b border-[#B78449]/20"
      >
        {/* Background Full Oficial de Atendimentos */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg_atendimentos.png"
            alt="Ambiente Atendimentos Cristiane Alcântara"
            fill
            priority
            className="object-cover object-right md:object-center"
          />
          {/* Overlay suave para assegurar excelente contraste dos textos e cards */}
          <div className="absolute inset-0 bg-[#470E20]/50" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          {/* Cabeçalho da Seção */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#D8AFA6] uppercase mb-2">
                ATENDIMENTOS
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#FAF6F1] leading-tight">
                Um espaço seguro <br />
                para você se reencontrar.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EED9CF]/85 max-w-md leading-relaxed">
              Atendimento online, com escuta acolhedora e abordagem que une a psicanálise, a fé e a realidade da sua vida.
            </p>
          </div>

          {/* Cards de Serviços Oficiais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Atendimento Individual */}
            <div className="bg-[#551429] hover:bg-[#60172F] rounded-[20px] p-8 border border-[#B78449]/20 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#470E20] flex items-center justify-center text-[#B78449] mb-5 border border-[#B78449]/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FAF6F1] mb-2.5">
                  Atendimento <br />Individual e Casais
                </h3>
                <p className="text-xs sm:text-[13px] text-[#EED9CF]/85 leading-relaxed">
                  Para adultos, jovens e casais que desejam compreender suas emoções, curar suas feridas e fortalecer seus vínculos com mais leveza.
                </p>
              </div>
            </div>

            {/* Card 2: Orientação Cristã */}
            <div className="bg-[#551429] hover:bg-[#60172F] rounded-[20px] p-8 border border-[#B78449]/20 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#470E20] flex items-center justify-center text-[#B78449] mb-5 border border-[#B78449]/30">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FAF6F1] mb-2.5">
                  Orientação <br />Cristã
                </h3>
                <p className="text-xs sm:text-[13px] text-[#EED9CF]/85 leading-relaxed">
                  Integração entre fé e ciência para uma vida emocional mais saudável e alinhada com o propósito de Deus.
                </p>
              </div>
            </div>

            {/* Card 3: Palestras e Eventos */}
            <div className="bg-[#551429] hover:bg-[#60172F] rounded-[20px] p-8 border border-[#B78449]/20 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-[#470E20] flex items-center justify-center text-[#B78449] mb-5 border border-[#B78449]/30">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FAF6F1] mb-2.5">
                  Palestras <br />e Eventos
                </h3>
                <p className="text-xs sm:text-[13px] text-[#EED9CF]/85 leading-relaxed">
                  Temas sobre saúde mental, relacionamentos, propósito e vida cristã para igrejas, empresas e instituições.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          LIVRO ASSUMA SEUS B.O.S — ALTURA ~470px
          ========================================== */}
      <section
        id="livro"
        className="relative bg-[#FAF6F1] py-16 sm:py-20 overflow-hidden border-b border-[#B78449]/15"
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Lado Esquerdo: Imagem oficial livro.png transparente e sem moldura */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[460px] aspect-[1536/1024]">
                <Image
                  src="/images/livro.png"
                  alt="Livro Assuma seus B.O.s — Cristiane Alcântara"
                  fill
                  priority
                  className="object-contain object-center drop-shadow-xl"
                />
              </div>
            </div>

            {/* Lado Direito: Textos do Livro e Destaques */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left max-w-[540px]">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#B78449] uppercase mb-2">
                MEU LIVRO
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#68152D] mb-1">
                Assuma seus B.O.s
              </h2>

              <p className="font-serif italic text-base sm:text-lg text-[#B78449] mb-4">
                Encare a responsabilidade da sua história.
              </p>

              <p className="text-xs sm:text-sm text-[#342A2D]/85 leading-relaxed mb-6">
                Um convite à transformação interior, à cura emocional e ao encontro profundo com a sua verdadeira identidade em Deus.
              </p>

              {/* Botão de Aquisição / Saiba Mais */}
              <div className="mb-8">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] px-6 py-3.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span>Saiba mais sobre o livro</span>
                  <ArrowRight className="w-4 h-4 text-[#EED9CF]" />
                </a>
              </div>

              {/* 4 Destaques do Livro à Direita */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#B78449]/20 text-xs text-[#342A2D]/85">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#B78449] shrink-0" />
                  <span>Histórias reais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#B78449] shrink-0" />
                  <span>Reflexões profundas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B78449] shrink-0" />
                  <span>Propósito e recomeços</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#B78449] shrink-0" />
                  <span>Uma nova perspectiva de vida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ENCERRAMENTO — FAIXA EDITORIAL COM BG03.PNG (~330px)
          ========================================== */}
      <section
        id="palestras"
        className="relative overflow-hidden min-h-[300px] sm:min-h-[340px] lg:min-h-[380px] flex items-center bg-[#EED9CF]/60 border-b border-[#B78449]/20"
      >
        {/* Background Full Oficial com a jovem contemplando o pôr do sol à esquerda */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg03.png"
            alt="Ambiente de acolhimento e nova história"
            fill
            priority
            className="object-cover object-left md:object-center"
          />
          {/* Gradiente suave à direita para garantir contraste impecável com o texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF6F1]/70 to-[#FAF6F1]/95 sm:w-3/5 ml-auto" />
          {/* Overlay suave para mobile */}
          <div className="absolute inset-0 bg-[#FAF6F1]/60 sm:hidden" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10 w-full py-12 flex justify-end">
          <div className="max-w-lg text-right">
            <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#68152D] font-normal mb-2 leading-tight">
              Você pode viver uma nova história.
            </h3>
            <p className="text-xs sm:text-sm text-[#342A2D]/85 mb-6">
              Dê o primeiro passo. Estou aqui para caminhar com você.
            </p>

            <div>
              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(true)}
                className="inline-flex items-center gap-2.5 bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] px-6 py-3.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-[#EED9CF]" />
                <span>Agendar atendimento</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER — ALTURA MÍNIMA 220px
          ========================================== */}
      <footer id="contato" className="bg-[#470E20] text-[#FAF6F1] py-14 border-t border-[#B78449]/30">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-[#B78449]/20">
            {/* Logo oficial no rodapé aumentada em 2x */}
            <div className="md:col-span-5">
              <div className="relative w-72 sm:w-[380px] lg:w-[440px] h-24 sm:h-28">
                <Image
                  src="/images/logoh2.png"
                  alt="Cristiane Alcântara — Psicanalista Cristã"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Navegação institucional */}
            <div className="md:col-span-5 flex flex-wrap gap-5 text-xs text-[#EED9CF]/90">
              <Link href="#inicio" className="hover:text-[#FAF6F1] transition-colors">Início</Link>
              <Link href="#sobre" className="hover:text-[#FAF6F1] transition-colors">Sobre</Link>
              <Link href="#atendimentos" className="hover:text-[#FAF6F1] transition-colors">Atendimentos</Link>
              <Link href="#livro" className="hover:text-[#FAF6F1] transition-colors">Livro</Link>
              <Link href="#palestras" className="hover:text-[#FAF6F1] transition-colors">Palestras</Link>
              <Link href="#conteudos" className="hover:text-[#FAF6F1] transition-colors">Conteúdos</Link>
            </div>

            {/* Contato & Redes */}
            <div className="md:col-span-3 flex flex-col gap-2.5 text-xs text-[#EED9CF]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FAF6F1] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B78449]" />
                <span>+55 91 99394-8373</span>
              </a>
              <a
                href="https://instagram.com/cris.alcantara.ce"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FAF6F1] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#B78449]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>@cris.alcantara.ce</span>
              </a>
              <a
                href="mailto:contato@cristianealcantara.com.br"
                className="flex items-center gap-2 hover:text-[#FAF6F1] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#B78449]" />
                <span>cristianealcantara.com.br</span>
              </a>
            </div>
          </div>

          {/* Sub-rodapé com créditos e direitos */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EED9CF]/60 gap-3">
            <p>© 2026 Cristiane Alcântara — Psicanalista Cristã. Todos os direitos reservados.</p>
            <p>Fé · Ciência · Metanoia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
