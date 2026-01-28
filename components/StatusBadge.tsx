import React from 'react';

type StatusVariant =
    | 'active'
    | 'pending'
    | 'approved'
    | 'denied'
    | 'critical'
    | 'urgent'
    | 'normal'
    | 'info'
    | 'security'
    | 'medical';

interface StatusBadgeProps {
    status: StatusVariant;
    label?: string;
    pulse?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    label,
    pulse = false,
    size = 'sm',
    className = '',
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'active':
            case 'approved':
                return {
                    bg: 'bg-green-500/10',
                    text: 'text-green-600 dark:text-green-400',
                    border: 'border-green-500/20',
                    dot: 'bg-green-500',
                    defaultLabel: status === 'active' ? 'Ativo' : 'Aprovado',
                };
            case 'pending':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-600 dark:text-amber-400',
                    border: 'border-amber-500/20',
                    dot: 'bg-amber-500',
                    defaultLabel: 'Pendente',
                };
            case 'denied':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-600 dark:text-red-400',
                    border: 'border-red-500/20',
                    dot: 'bg-red-500',
                    defaultLabel: 'Negado',
                };
            case 'critical':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-600 dark:text-red-400',
                    border: 'border-red-500/20',
                    dot: 'bg-red-500',
                    defaultLabel: 'Crítico',
                };
            case 'urgent':
                return {
                    bg: 'bg-orange-500/10',
                    text: 'text-orange-600 dark:text-orange-400',
                    border: 'border-orange-500/20',
                    dot: 'bg-orange-500',
                    defaultLabel: 'Urgente',
                };
            case 'normal':
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-600 dark:text-slate-400',
                    border: 'border-slate-500/20',
                    dot: 'bg-slate-500',
                    defaultLabel: 'Normal',
                };
            case 'info':
                return {
                    bg: 'bg-primary/10',
                    text: 'text-primary',
                    border: 'border-primary/20',
                    dot: 'bg-primary',
                    defaultLabel: 'Info',
                };
            case 'security':
                return {
                    bg: 'bg-purple-500/10',
                    text: 'text-purple-600 dark:text-purple-300',
                    border: 'border-purple-500/20',
                    dot: 'bg-purple-400',
                    defaultLabel: 'Segurança',
                };
            case 'medical':
                return {
                    bg: 'bg-blue-500/10',
                    text: 'text-blue-600 dark:text-blue-300',
                    border: 'border-blue-500/20',
                    dot: 'bg-blue-400',
                    defaultLabel: 'Médico',
                };
            default:
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-600 dark:text-slate-400',
                    border: 'border-slate-500/20',
                    dot: 'bg-slate-500',
                    defaultLabel: status,
                };
        }
    };

    const config = getStatusConfig();
    const displayLabel = label || config.defaultLabel;
    const sizeClasses = size === 'sm'
        ? 'px-2 py-1 text-xs'
        : 'px-2.5 py-1 text-xs';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} border ${config.border} ${sizeClasses} ${className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${pulse ? 'animate-pulse' : ''}`}></span>
            {displayLabel}
        </span>
    );
};

export default StatusBadge;
