import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: {
        text: string;
        variant: 'success' | 'warning' | 'error' | 'info' | 'active';
        pulse?: boolean;
    };
    actions?: React.ReactNode;
    rightContent?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    badge,
    actions,
    rightContent,
    className = '',
}) => {
    const getBadgeClasses = () => {
        if (!badge) return '';
        const baseClasses = 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ring-1 ring-inset';
        switch (badge.variant) {
            case 'success':
            case 'active':
                return `${baseClasses} bg-green-500/10 text-green-500 ring-green-500/20`;
            case 'warning':
                return `${baseClasses} bg-amber-500/10 text-amber-500 ring-amber-500/20`;
            case 'error':
                return `${baseClasses} bg-red-500/10 text-red-500 ring-red-500/20`;
            case 'info':
                return `${baseClasses} bg-primary/10 text-primary ring-primary/20`;
            default:
                return `${baseClasses} bg-slate-500/10 text-slate-500 ring-slate-500/20`;
        }
    };

    return (
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 ${className}`}>
            <div className="flex flex-col gap-2">
                {badge && (
                    <div className="flex items-center gap-3">
                        <span className={getBadgeClasses()}>
                            {badge.pulse && (
                                <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                </span>
                            )}
                            {badge.text}
                        </span>
                    </div>
                )}
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-500 dark:text-text-secondary text-base md:text-lg">
                        {subtitle}
                    </p>
                )}
            </div>
            {(actions || rightContent) && (
                <div className="flex flex-wrap gap-3">
                    {actions}
                    {rightContent}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
