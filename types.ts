export type UserRole = 'Admin' | 'Diretor' | 'Gerente' | 'Supervisor' | 'Policial';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  team?: 'Alpha' | 'Bravo' | 'Charlie' | 'Delta'; // Teams for logic
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
  weapon?: string; // Kept for backward compatibility if needed, but equipment is preferred
  equipment: string[];
  status: 'Ativo' | 'Em Pausa' | 'Em Trânsito' | 'Posto Anterior' | 'Descanso';
  icon: string;
  group: 'Comando' | 'Supervisor' | 'Operacional Bloco' | 'Vigilância e Sistemas' | 'Unidade de Reinserção (Semiaberto)' | 'Logística e Externo' | 'Grade de Turnos' | 'Outros' | 'COMANDO' | 'SUPERVISOR' | 'OPERACIONAL BLOCO' | 'VIGILÂNCIA E SISTEMAS' | 'UNIDADE DE REINSERÇÃO (SEMIABERTO)' | 'LOGÍSTICA E EXTERNO' | 'GRADE DE TURNOS (MONITORAMENTO E PORTARIA)';
  shift?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'; // Extended specifically for grade de turnos if needed
}
