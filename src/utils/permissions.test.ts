import { describe, it, expect } from 'vitest';
import { canEditScale, canManageSwaps } from './permissions';
import { User } from '../types';

describe('RBAC Permissions', () => {
    const mockUser = (role: any, team?: any): User => ({
        id: '1', name: 'Test', role, team, avatar: ''
    });

    it('Admin can edit everything', () => {
        expect(canEditScale(mockUser('Admin'))).toBe(true);
        expect(canManageSwaps(mockUser('Admin'))).toBe(true);
    });

    it('Supervisor can only edit their own team', () => {
        const supervisor = mockUser('Supervisor', 'Charlie');

        // Own team -> Checked via DayShift logic (we passed 'Charlie' as target)
        expect(canEditScale(supervisor, 'Charlie')).toBe(true);

        // Other team
        expect(canEditScale(supervisor, 'Alpha')).toBe(false);
    });

    it('Policial cannot edit anything', () => {
        expect(canEditScale(mockUser('Policial'))).toBe(false);
        expect(canManageSwaps(mockUser('Policial'))).toBe(false);
    });
});
