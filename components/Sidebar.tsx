import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { logout, sidebarOpen, closeSidebar, user } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Mobile overlay wrapper
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-[#111318] flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out
    md:translate-x-0 md:static md:h-screen
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const menuItems = [
    { path: '/', icon: 'dashboard', label: 'Visão Geral' },
    { path: '/day-shift', icon: 'calendar_month', label: 'Escala Diurna' },
    { path: '/night-shift', icon: 'bedtime', label: 'Escala Noturna' },
    { path: '/swaps', icon: 'swap_horiz', label: 'Permutas' },
    { path: '/reports', icon: 'warning', label: 'Ocorrências', badge: 2 },
    { path: '/profile', icon: 'person', label: 'Perfil e Avisos' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/50">
          <div className="bg-center bg-no-repeat bg-cover rounded-lg h-10 w-10 shadow-lg shadow-blue-900/20 bg-slate-700 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">security</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-white text-base font-bold leading-tight tracking-tight truncate">Gestão Policial</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">Tucuruí - PA</p>
          </div>
          <button onClick={closeSidebar} className="ml-auto md:hidden text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 768) closeSidebar() }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group shrink-0 ${isActive(item.path)
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${!isActive(item.path) && 'group-hover:text-primary transition-colors'}`}>
                {item.icon}
              </span>
              <div className="flex flex-1 justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/20">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          <div className="my-2 border-t border-slate-800 mx-2"></div>

          <Link
            to="/request-swap"
            onClick={() => { if (window.innerWidth < 768) closeSidebar() }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group shrink-0 ${isActive('/request-swap') ? 'bg-white/5 text-white' : ''
              }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">edit_calendar</span>
            <span className="text-sm font-medium">Solicitar Permuta</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/reports" onClick={() => { if (window.innerWidth < 768) closeSidebar() }} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-10 bg-[#282e39] hover:bg-[#343b49] text-white text-sm font-bold transition-colors border border-slate-700 mb-4 shrink-0">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Novo Plantão</span>
          </Link>
          <div className="flex items-center gap-3 px-1">
            <img src={user?.avatar || "https://picsum.photos/32/32?random=1"} alt="Avatar" className="rounded-full h-8 w-8 ring-2 ring-slate-700 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user?.name || 'Usuário'}</p>
              <p className="text-slate-500 text-[10px] truncate">{user?.role || 'Visitante'}</p>
            </div>
            <button onClick={logout} className="ml-auto text-slate-500 hover:text-white shrink-0" title="Sair do sistema">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
