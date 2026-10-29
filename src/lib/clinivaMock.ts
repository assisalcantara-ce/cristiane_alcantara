import { PublicSlot } from "@/types/cliniva";

/**
 * Mocks identificados para desenvolvimento e testes quando a API do Cliniva
 * estiver inacessível ou sem backend Supabase ativo localmente.
 * Retorna slots realistas para os próximos 14 dias (segunda a sexta, das 09h às 18h).
 */
export function generateIdentifiedMockSlots(startDateStr: string, endDateStr: string): PublicSlot[] {
  const slots: PublicSlot[] = [];
  const start = new Date(`${startDateStr}T00:00:00-03:00`);
  const end = new Date(`${endDateStr}T23:59:59-03:00`);
  const now = new Date();

  // Horários de atendimento de consultório (9h às 18h com 50m de duração)
  const times = [
    { start: "09:00", end: "09:50" },
    { start: "10:00", end: "10:50" },
    { start: "11:00", end: "11:50" },
    { start: "14:00", end: "14:50" },
    { start: "15:00", end: "15:50" },
    { start: "16:00", end: "16:50" },
    { start: "17:00", end: "17:50" },
  ];

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 = Domingo, 6 = Sábado
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateIso = current.toISOString().split("T")[0];

      times.forEach((slotTime, idx) => {
        const slotDate = new Date(`${dateIso}T${slotTime.start}:00-03:00`);
        // Simula disponibilidade real: horários passados indisponíveis, alguns horários ocupados
        const isPast = slotDate <= now;
        const isOccupied = (dayOfWeek + idx) % 3 === 0;

        slots.push({
          date: dateIso,
          start: slotTime.start,
          end: slotTime.end,
          available: !isPast && !isOccupied,
        });
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return slots;
}
