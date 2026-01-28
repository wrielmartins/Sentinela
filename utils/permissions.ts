import { User, UserRole } from '../types';

/**
 * Checks if the user has permission to edit the Daily Scale.
 * @param user The current user.
 * @param targetTeam The team associated with the scale (optional, for Supervisors).
 */
export const canEditScale = (user: User | null, targetTeam?: string): boolean => {
    if (!user) return false;

    // Admin, Diretor, Gerente: Can edit ANY scale
    if (['Admin', 'Diretor', 'Gerente'].includes(user.role)) return true;

    // Supervisor: Can ONLY edit their own team's scale
    if (user.role === 'Supervisor') {
        if (!targetTeam || !user.team) return true; // Fallback: if no team defined, allow (or deny, depending on strictness)
        return user.team === targetTeam;
    }

    // Policial: Cannot edit scale
    return false;
};

/**
 * Checks if the user can approve/deny Swap Requests.
 */
export const canManageSwaps = (user: User | null): boolean => {
    if (!user) return false;
    return ['Admin', 'Diretor', 'Gerente'].includes(user.role);
};

/**
 * Checks if the user can create System Broadcasts (Avisos).
 */
export const canCreateBroadcast = (user: User | null): boolean => {
    if (!user) return false;
    // Supervisors can create, but typically only for their team (logic handled in UI/Backend)
    return ['Admin', 'Diretor', 'Gerente', 'Supervisor'].includes(user.role);
};

/**
 * Checks if the user can manage team assignments (move officers between teams).
 */
export const canManageTeamMembers = (user: User | null): boolean => {
    if (!user) return false;
    return ['Admin', 'Diretor', 'Gerente'].includes(user.role);
};
