"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { PublicSlot, SlotsPublicResponse, LandingAppointmentResponse } from "@/types/cliniva";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTherapist?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  defaultTherapist = "dra-cristiane",
}: AppointmentModalProps) {
  // Estados do fluxo
  const [step, setStep] = useState<"slot" | "form" | "success">("slot");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);

  // Dados de agendamento selecionados
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [isMockActive, setIsMockActive] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Dados do formulário (mínimos necessários para agendamento)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [websiteHp, setWebsiteHp] = useState(""); // Honeypot anti-spam

  // Confirmação de retorno
  const [successData, setSuccessData] = useState<LandingAppointmentResponse | null>(null);

  // Consentimento LGPD e Idempotência
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");

  // Intervalo de datas calculado após a montagem do componente no cliente (evita blocking de prerender)
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
    dateList: { dateStr: string; label: string; weekday: string }[];
  }>({
    startDate: "",
    endDate: "",
    dateList: [],
  });

  // Busca de slots ao abrir
  useEffect(() => {
    if (!isOpen) return;

    const today = new Date();
    const startStr = today.toISOString().split("T")[0];

    const targetEnd = new Date(today);
    targetEnd.setDate(today.getDate() + 14);
    const endStr = targetEnd.toISOString().split("T")[0];

    const list: { dateStr: string; label: string; weekday: string }[] = [];
    const cur = new Date(today);
    while (cur <= targetEnd) {
      const dStr = cur.toISOString().split("T")[0];
      const weekday = cur.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
      const dayNum = cur.getDate().toString().padStart(2, "0");
      const monthNum = (cur.getMonth() + 1).toString().padStart(2, "0");
      list.push({
        dateStr: dStr,
        label: `${dayNum}/${monthNum}`,
        weekday: weekday.toUpperCase(),
      });
      cur.setDate(cur.getDate() + 1);
    }

    setDateRange({ startDate: startStr, endDate: endStr, dateList: list });

    setStep("slot");
    setErrorMessage(null);
    setSelectedDate("");
    setSelectedTime("");
    setConsentAccepted(false);
    setIdempotencyKey(crypto.randomUUID());
    setLoadingSlots(true);

    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `/api/cliniva/slots?therapist=${encodeURIComponent(
            defaultTherapist,
          )}&start_date=${startStr}&end_date=${endStr}`,
        );

        if (res.status === 429) {
          setErrorMessage("Muitas consultas simultâneas. Por favor, aguarde alguns instantes.");
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setErrorMessage(errData.error || "Não foi possível carregar os horários disponíveis.");
          return;
        }

        const data: SlotsPublicResponse = await res.json();
        // Cliniva retorna slots disponíveis. Se available for omitido pela API real, consideramos true
        const normalizedSlots = (data.slots || []).map((s) => ({
          ...s,
          available: s.available !== undefined ? s.available : true,
        }));
        setSlots(normalizedSlots);
        setIsMockActive(Boolean(data.isMock));

        // Seleciona por padrão o primeiro dia com horários livres
        const firstAvailable = normalizedSlots.find((s) => s.available);
        if (firstAvailable) {
          setSelectedDate(firstAvailable.date);
        } else if (list.length > 0) {
          setSelectedDate(list[0].dateStr);
        }
      } catch {
        setErrorMessage("Falha de conexão com o serviço de horários.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [isOpen, defaultTherapist]);

  const { dateList } = dateRange;

  // Slots do dia selecionado
  const availableSlotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((s) => s.date === selectedDate);
  }, [slots, selectedDate]);

  // Submissão do agendamento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage("Por favor, preencha seu nome completo.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage("Por favor, informe um número de WhatsApp válido para confirmação.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      setErrorMessage("Por favor, selecione uma data e um horário.");
      return;
    }

    if (!consentAccepted) {
      setErrorMessage("É necessário concordar com os termos de consentimento para solicitar o agendamento.");
      return;
    }

    // Garante que exista uma idempotency_key gerada; caso contrário cria uma e a preserva para retentativas
    const currentKey = idempotencyKey || crypto.randomUUID();
    if (!idempotencyKey) {
      setIdempotencyKey(currentKey);
    }

    setSubmitting(true);

    try {
      // Concatena notas para contato da recepção, sem enviar anamnese clínica não autorizada
      const finalNotes = [
        phone.trim() ? `WhatsApp de contato: ${phone.trim()}` : "",
        notes.trim() ? `Observações: ${notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const consentPayload = {
        accepted: true as const,
        purpose: "Agendamento de consulta inicial e contato da equipe do consultorio",
        notice_version: "2026.1",
        consented_at: new Date().toISOString(),
      };

      const res = await fetch("/api/cliniva/landing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: currentKey,
          therapist: defaultTherapist,
          full_name: fullName.trim(),
          date: selectedDate,
          time: selectedTime,
          notes: finalNotes || undefined,
          consent: consentPayload,
          anamnesis: {
            personal: {
              celular: phone.trim(),
            },
          },
          website_hp: websiteHp, // Honeypot
        }),
      });

      if (res.status === 409) {
        setErrorMessage(
          "Este horário acabou de ser reservado por outro paciente. Por favor, escolha outro horário disponível.",
        );
        // Gera nova chave pois mudará o horário
        setIdempotencyKey(crypto.randomUUID());
        setStep("slot");
        setSelectedTime("");
        return;
      }

      if (res.status === 422) {
        setErrorMessage(
          "Os dados da solicitação foram alterados durante a retentativa. Por favor, confirme os campos e tente novamente.",
        );
        // Gera nova chave idempotente para novos parâmetros
        setIdempotencyKey(crypto.randomUUID());
        return;
      }

      if (res.status === 429) {
        const retryHeader = res.headers.get("Retry-After");
        const seconds = retryHeader ? parseInt(retryHeader, 10) : 60;
        setRetryAfterSeconds(seconds);
        setErrorMessage(
          `Limite de solicitações atingido temporariamente. Por favor, aguarde ${seconds} segundos antes de tentar novamente.`,
        );
        return;
      }

      if (res.status === 503) {
        const errData = await res.json().catch(() => ({}));
        setErrorMessage(
          errData.error ||
            "O serviço de agendamentos está temporariamente indisponível. Por favor, tente novamente em instantes ou utilize nosso WhatsApp oficial.",
        );
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setErrorMessage(errorData.error || "Ocorreu um erro ao processar sua solicitação.");
        return;
      }

      const data: LandingAppointmentResponse = await res.json();
      setSuccessData(data);
      setStep("success");
    } catch {
      setErrorMessage("Erro de comunicação com o servidor de agendamento.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
    >
      <div className="relative w-full max-w-xl bg-[#FAF6F1] rounded-[24px] shadow-2xl border border-[#B78449]/25 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#68152D] text-[#FAF6F1] border-b border-[#B78449]/25">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#470E20] flex items-center justify-center text-[#B78449] border border-[#B78449]/30">
              <CalendarDays className="w-5 h-5 text-[#EED9CF]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold leading-tight">Solicitar Agendamento</h3>
              <p className="text-[11px] text-[#EED9CF]/80">Atendimento com a Dra. Cristiane Alcântara</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#FAF6F1]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner informativo de Mock caso o backend Cliniva esteja operando em modo de teste */}
        {isMockActive && (
          <div className="px-6 py-2 bg-[#B78449]/15 border-b border-[#B78449]/30 text-[11px] text-[#68152D] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B78449] animate-pulse" />
            <span>
              <strong>Modo de Demonstração / Mock:</strong> Demonstração de agendamento integrada com a API Cliniva.
            </span>
          </div>
        )}

        {/* Mensagem de Erro Geral */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              {retryAfterSeconds && (
                <p className="text-[11px] mt-1 text-red-700">Aguarde a liberação automática do sistema.</p>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo com Abas de Etapa */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ETAPA 1: ESCOLHA DE DATA E HORÁRIO */}
          {step === "slot" && (
            <div>
              {loadingSlots ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-[#68152D] animate-spin mb-3" />
                  <p className="text-sm text-[#342A2D]/80 font-medium">Buscando horários disponíveis...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Seleção de Data em carrossel horizontal */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#68152D] flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#B78449]" />
                        <span>1. Selecione a Data</span>
                      </label>
                      <span className="text-[11px] text-[#342A2D]/60">Próximos 14 dias</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {dateList.map((d) => {
                        const isSelected = selectedDate === d.dateStr;
                        const daySlots = slots.filter((s) => s.date === d.dateStr && s.available);
                        const hasAvailable = daySlots.length > 0;

                        return (
                          <button
                            key={d.dateStr}
                            type="button"
                            onClick={() => {
                              setSelectedDate(d.dateStr);
                              setSelectedTime("");
                            }}
                            className={`flex flex-col items-center justify-center min-w-[70px] py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-[#68152D] text-[#FAF6F1] border-[#68152D] shadow-md scale-102"
                                : hasAvailable
                                ? "bg-white text-[#342A2D] border-[#B78449]/30 hover:border-[#68152D] hover:bg-[#EED9CF]/20"
                                : "bg-gray-100/70 text-gray-400 border-gray-200 opacity-60"
                            }`}
                          >
                            <span className="text-[10px] tracking-wide uppercase opacity-80">{d.weekday}</span>
                            <span className="text-sm font-bold my-0.5">{d.label}</span>
                            <span className="text-[9px] font-normal opacity-75">
                              {hasAvailable ? `${daySlots.length} vaga${daySlots.length > 1 ? "s" : ""}` : "Lotado"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seleção de Horário */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#68152D] flex items-center gap-1.5 mb-2.5">
                      <Clock className="w-3.5 h-3.5 text-[#B78449]" />
                      <span>2. Selecione o Horário</span>
                    </label>

                    {availableSlotsForSelectedDate.length === 0 ? (
                      <div className="p-6 text-center bg-white/70 rounded-xl border border-dashed border-[#B78449]/30 text-xs text-[#342A2D]/70">
                        Nenhum horário disponível para esta data. Por favor, escolha outro dia acima.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {availableSlotsForSelectedDate.map((s) => {
                          const displayTime = s.time || (s.start.includes("T") ? s.start.substring(11, 16) : s.start);
                          const isSelected = selectedTime === displayTime;
                          return (
                            <button
                              key={s.start || displayTime}
                              type="button"
                              disabled={!s.available}
                              onClick={() => setSelectedTime(displayTime)}
                              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex flex-col items-center justify-center ${
                                isSelected
                                  ? "bg-[#68152D] text-[#FAF6F1] border-[#68152D] shadow-sm"
                                  : s.available
                                  ? "bg-white text-[#342A2D] border-[#B78449]/30 hover:border-[#68152D] hover:bg-[#EED9CF]/30"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                              }`}
                            >
                              <span>{displayTime}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Botão de Avançar para dados pessoais */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep("form")}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        selectedDate && selectedTime
                          ? "bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] shadow-md hover:shadow-lg cursor-pointer"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <span>Avançar para identificação</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 2: FORMULÁRIO COM DADOS MÍNIMOS */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resumo da Data/Hora selecionada */}
              <div className="p-3 bg-[#EED9CF]/40 rounded-xl border border-[#B78449]/25 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#68152D] font-medium">
                  <CalendarDays className="w-4 h-4 text-[#B78449]" />
                  <span>
                    Data: <strong>{selectedDate.split("-").reverse().join("/")}</strong> às{" "}
                    <strong>{selectedTime}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("slot")}
                  className="text-[11px] text-[#68152D] underline hover:text-[#B78449] cursor-pointer"
                >
                  Alterar horário
                </button>
              </div>

              {/* Honeypot invisível para bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Não preencha este campo</label>
                <input
                  type="text"
                  id="website_hp"
                  name="website_hp"
                  value={websiteHp}
                  onChange={(e) => setWebsiteHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-bold text-[#68152D] uppercase tracking-wider mb-1.5">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#342A2D]/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-white border border-[#B78449]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#342A2D] placeholder-[#342A2D]/40 focus:outline-none focus:border-[#68152D] focus:ring-1 focus:ring-[#68152D]"
                  />
                </div>
              </div>

              {/* Telefone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-[#68152D] uppercase tracking-wider mb-1.5">
                  WhatsApp para Confirmação <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#342A2D]/40" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(91) 99999-9999"
                    className="w-full bg-white border border-[#B78449]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#342A2D] placeholder-[#342A2D]/40 focus:outline-none focus:border-[#68152D] focus:ring-1 focus:ring-[#68152D]"
                  />
                </div>
              </div>

              {/* Observações Opcionais */}
              <div>
                <label className="block text-xs font-bold text-[#68152D] uppercase tracking-wider mb-1.5">
                  Observações ou Preferência (Opcional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-3 text-[#342A2D]/40" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Deseja acrescentar algum detalhe para a recepção?"
                    className="w-full bg-white border border-[#B78449]/30 rounded-xl pl-10 pr-4 py-2 text-xs text-[#342A2D] placeholder-[#342A2D]/40 focus:outline-none focus:border-[#68152D] focus:ring-1 focus:ring-[#68152D]"
                  />
                </div>
              </div>

              {/* Checkbox de Consentimento Informado (LGPD) - Desmarcado por padrão */}
              <div className="p-3.5 bg-white rounded-xl border border-[#B78449]/30 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#68152D] rounded border-[#B78449]/40 focus:ring-[#68152D] focus:ring-1 cursor-pointer accent-[#68152D]"
                  />
                  <div className="text-[11px] text-[#342A2D]/85 leading-relaxed">
                    <span>
                      Declaro que concordo com o envio dos meus dados para a <strong>finalidade exclusiva</strong> de contato e análise do pedido de agendamento pela equipe do consultório, em conformidade com a LGPD (Aviso de Privacidade v2026.1).
                    </span>
                  </div>
                </label>
              </div>

              {/* Informação sobre aprovação e privacidade */}
              <div className="p-3 bg-[#EED9CF]/25 rounded-xl border border-[#B78449]/20 text-[11px] text-[#342A2D]/80 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B78449] shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso Importante:</strong> Esta ação registra uma <strong>solicitação de agendamento</strong> (status aguardando aprovação). O horário só é efetivamente confirmado após contato e validação da recepção.
                </span>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("slot")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68152D] hover:text-[#B78449]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar aos horários</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#EED9CF]" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#EED9CF]" />
                      <span>Confirmar Solicitação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ETAPA 3: CONFIRMAÇÃO DE SOLICITAÇÃO RECEBIDA */}
          {step === "success" && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-serif text-2xl font-bold text-[#68152D]">Solicitação Recebida!</h4>
                <p className="text-xs sm:text-sm text-[#342A2D]/80 max-w-md">
                  Seu pedido de agendamento foi registrado com sucesso e{" "}
                  <strong>aguarda aprovação da equipe do consultório</strong>.
                </p>
              </div>

              {/* Caixa de detalhes da solicitação */}
              <div className="w-full max-w-sm p-4 bg-white rounded-2xl border border-[#B78449]/25 text-left text-xs space-y-2">
                {successData?.isMock && (
                  <div className="p-2 mb-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                    <strong>Nota de Teste:</strong> Resposta gerada por Mock de Desenvolvimento. Em produção, este aviso não é exibido e apenas agendamentos reais da API Cliniva são processados.
                  </div>
                )}
                <div className="flex justify-between border-b border-[#B78449]/15 pb-2">
                  <span className="text-[#342A2D]/60">Paciente:</span>
                  <span className="font-semibold text-[#342A2D]">{successData?.patient?.full_name || fullName}</span>
                </div>
                <div className="flex justify-between border-b border-[#B78449]/15 pb-2">
                  <span className="text-[#342A2D]/60">Profissional:</span>
                  <span className="font-semibold text-[#68152D]">Dra. Cristiane Alcântara</span>
                </div>
                <div className="flex justify-between border-b border-[#B78449]/15 pb-2">
                  <span className="text-[#342A2D]/60">Data e Horário:</span>
                  <span className="font-semibold text-[#342A2D]">
                    {selectedDate.split("-").reverse().join("/")} às {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#342A2D]/60">Status do Pedido:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                    Aguardando Aprovação
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#342A2D]/65 max-w-sm">
                Nossa equipe entrará em contato via WhatsApp para confirmar seu horário e fornecer as orientações do
                atendimento.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-[#68152D] hover:bg-[#470E20] text-[#FAF6F1] text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
