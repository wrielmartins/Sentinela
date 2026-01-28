export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badge?: string;
  email?: string;
  phone?: string;
}

export type IncidentCategory = 'Segurança' | 'Médico' | 'Infraestrutura' | 'Conduta';
export type IncidentSeverity = 'Crítico' | 'Urgente' | 'Normal';

export interface Incident {
  id: string; // Changed to string for easier generation
  time: string;
  category: IncidentCategory;
  description: string;
  location: string;
  severity: IncidentSeverity;
  officer: string;
  officerAvatar: string;
}

export type SwapStatus = 'Aprovado' | 'Pendente' | 'Negado';

export interface SwapRequest {
  id: string; // Changed to string
  date: string;
  requester: string;
  requesterAvatar: string;
  substitute: string;
  substituteAvatar: string;
  status: SwapStatus;
  time: string; // e.g., "07:00 - 19:00"
  reason?: string;
}

export interface Post {
  id: string;
  name: string;
  location: string;
  officer: string;
  officerAvatar: string;
  weapon: string;
  status: 'Ativo' | 'Em Pausa' | 'Em Trânsito' | 'Posto Anterior' | 'Descanso';
  icon: string;
  shift?: 'A' | 'B' | 'C'; // For rotation tables
}
