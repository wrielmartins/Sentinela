import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Incident, SwapRequest, Post } from '../types';

interface AppContextData {
    user: User | null;
    loading: boolean;
    login: () => void; // Legacy placeholder, now handled via supabase.auth directly mostly
    logout: () => void;

    // Data
    incidents: Incident[];
    swaps: SwapRequest[];
    dayPosts: Post[];
    nightPosts: Post[];

    // Actions
    addIncident: (incident: Incident) => void;
    updateIncident: (id: string, data: Partial<Incident>) => void;
    deleteIncident: (id: string) => void;

    addSwap: (swap: SwapRequest) => void;
    updateSwapStatus: (id: string, status: SwapRequest['status']) => void;
    deleteSwap: (id: string) => void;

    updatePost: (type: 'day' | 'night', id: string, data: Partial<Post>) => void;

    // UI State
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

// Initial Mock Data (kept for UI demonstration)
const initialIncidents: Incident[] = [
    {
        id: '1',
        time: '14:32',
        category: 'Segurança',
        description: 'Tentativa de comunicação externa não autorizada em Bloco C',
        location: 'Bloco C - Ala Norte',
        severity: 'Crítico',
        officer: 'Of. Mendes',
        officerAvatar: 'https://picsum.photos/24/24?random=10'
    }
];

const initialSwaps: SwapRequest[] = [
    {
        id: '1',
        date: '2023-11-15',
        requester: 'Of. Silva',
        requesterAvatar: 'https://picsum.photos/32/32?random=8',
        substitute: 'Of. Santos',
        substituteAvatar: 'https://picsum.photos/32/32?random=9',
        status: 'Aprovado',
        time: '07:00 - 19:00'
    }
];

const initialDayPosts: Post[] = [
    {
        id: 'g1',
        name: 'Guarita G1',
        location: 'Setor Externo',
        officer: 'Agente R. Santos',
        officerAvatar: 'https://picsum.photos/32/32?random=6',
        weapon: 'Fuzil 5.56',
        status: 'Ativo',
        icon: 'cell_tower'
    },
    {
        id: 'portaria',
        name: 'Portaria Principal',
        location: 'Acesso Principal',
        officer: 'Agente M. Souza',
        officerAvatar: 'https://picsum.photos/32/32?random=7',
        weapon: 'Pistola .40',
        status: 'Ativo',
        icon: 'door_front'
    }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Data State
    const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
    const [swaps, setSwaps] = useState<SwapRequest[]>(initialSwaps);
    const [dayPosts, setDayPosts] = useState<Post[]>(initialDayPosts);
    const [nightPosts, setNightPosts] = useState<Post[]>([]);

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, email?: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setUser({
                    id: data.id,
                    name: data.name || 'Usuário',
                    email: data.email || email,
                    role: data.role || 'Agente',
                    avatar: data.avatar_url,
                    badge: data.badge,
                    phone: '(00) 0000-0000' // mock
                });
            } else if (email) {
                // Fallback if profile trigger failed or not ready
                setUser({
                    id: userId,
                    name: 'Novo Usuário',
                    email: email,
                    role: 'Agente',
                    avatar: 'https://picsum.photos/200',
                    badge: '00000',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        // No-op in Supabase version, handled by Login page calling supabase directly
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    // Actions
    const addIncident = (incident: Incident) => {
        setIncidents(prev => [incident, ...prev]);
    };

    const updateIncident = (id: string, data: Partial<Incident>) => {
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, ...data } : inc));
    };

    const deleteIncident = (id: string) => {
        setIncidents(prev => prev.filter(inc => inc.id !== id));
    };

    const addSwap = (swap: SwapRequest) => {
        setSwaps(prev => [swap, ...prev]);
    };

    const updateSwapStatus = (id: string, status: SwapRequest['status']) => {
        setSwaps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const deleteSwap = (id: string) => {
        setSwaps(prev => prev.filter(s => s.id !== id));
    };

    const updatePost = (type: 'day' | 'night', id: string, data: Partial<Post>) => {
        if (type === 'day') {
            setDayPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        } else {
            setNightPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        }
    };

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <AppContext.Provider value={{
            user, loading, login, logout,
            incidents, swaps, dayPosts, nightPosts,
            addIncident, updateIncident, deleteIncident,
            addSwap, updateSwapStatus, deleteSwap,
            updatePost,
            sidebarOpen, toggleSidebar, closeSidebar
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
