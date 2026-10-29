/**
 * Tipos e contratos oficiais para a integração com a API Cliniva.
 * Não inventa contratos: segue rigorosamente as rotas:
 * GET  /api/appointments/slots/public
 * POST /api/appointments/landing
 */

export interface PublicSlot {
  date: string; // "YYYY-MM-DD"
  time?: string; // "HH:MM" (retornado pela API oficial do Cliniva)
  start: string; // "HH:MM" ou ISO string
  end: string; // "HH:MM" ou ISO string
  available?: boolean;
}

export interface SlotsPublicResponse {
  therapist?: {
    name: string;
    slug: string;
  };
  slots: PublicSlot[];
  isMock?: boolean;
}

export interface ConsentPayload {
  accepted: true;
  purpose: string;
  notice_version: string;
  consented_at: string;
}

export interface LandingAppointmentPayload {
  idempotency_key: string;
  therapist?: string; // "dra-cristiane"
  full_name: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  notes?: string;
  consent: ConsentPayload;
  anamnesis?: {
    personal?: {
      celular: string;
      email?: string;
      birth_date?: string;
    };
  };
  // website_hp é o honeypot anti-spam (deve ser vazio)
  website_hp?: string;
}

export interface LandingAppointmentResponse {
  message: string;
  patient?: {
    id: string;
    full_name: string;
  };
  appointment?: {
    id: string;
    status: "requested" | "scheduled" | "confirmed" | "cancelled";
    scheduled_start: string;
    scheduled_end: string;
  };
  isMock?: boolean;
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}
