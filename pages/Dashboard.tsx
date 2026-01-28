import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';
import { Post } from '../types';

const Dashboard: React.FC = () => {
  const { dayPosts } = useApp();
  const [filter, setFilter] = useState<'all' | 'external' | 'internal'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrint = () => {
    window.print();
  };

  const filteredPosts = dayPosts.filter(post => {
    if (filter === 'all') return true;
    const isExternal = post.location.toLowerCase().includes('externo') || post.name.toLowerCase().includes('guarita');
    return filter === 'external' ? isExternal : !isExternal;
  });

  // Calculate stats dynamically
  const totalAgents = 42;
  const activePostsCount = dayPosts.filter(p => p.status === 'Ativo').length;
  const capacity = Math.round((activePostsCount / 20) * 100); // Assuming 20 total posts

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative h-full">
      <header className="flex-shrink-0 bg-[#111318]/95 backdrop-blur-sm border-b border-slate-800 z-10 sticky top-0">
        <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Painel de Comando</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-slate-400 text-sm font-normal">Sistema Operacional • Atualizado às {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden md:flex flex-col items-end mr-2">
              <p className="text-white text-sm font-bold">{currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-slate-400 text-xs capitalize">{currentDate.toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">description</span>
              Gerar Relatório
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Equipe no Plantão"
              value="Equipe Bravo"
              icon="shield_person"
              iconColor="text-primary"
              subtitle="Início 08:00 - Término 08:00 (24h)"
              trend={{ value: 'ATIVO', direction: 'neutral' }}
            />
            <div className="rounded-xl p-5 bg-[#1A202C] border border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[64px] text-white">groups</span>
              </div>
              <div className="flex flex-col gap-1 relative z-10">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Efetivo Presente</p>
                <h3 className="text-white text-2xl font-bold">{totalAgents} Agentes</h3>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${capacity}%` }}></div>
                </div>
                <p className="text-slate-500 text-sm mt-1 flex justify-between">
                  <span>{activePostsCount} Postos Cobertos</span>
                  <span className="text-green-500 font-medium">{capacity}% Cap.</span>
                </p>
              </div>
            </div>
            <StatCard
              title="Status da Unidade"
              value="Atenção Normal"
              icon="warning"
              iconColor="text-yellow-500"
              subtitle="Sem ocorrências críticas em aberto"
              trend={{ value: 'Operacional', direction: 'up' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">share_location</span>
                  Distribuição de Postos Ativos
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded border transition-colors ${filter === 'all' ? 'bg-primary text-white border-primary' : 'bg-[#1A202C] text-slate-400 border-slate-700 hover:text-white'}`}>Todos</button>
                  <button onClick={() => setFilter('external')} className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded border transition-colors ${filter === 'external' ? 'bg-primary text-white border-primary' : 'bg-[#1A202C] text-slate-400 border-slate-700 hover:text-white'}`}>Externo</button>
                  <button onClick={() => setFilter('internal')} className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded border transition-colors ${filter === 'internal' ? 'bg-primary text-white border-primary' : 'bg-[#1A202C] text-slate-400 border-slate-700 hover:text-white'}`}>Interno</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map(post => (
                  <div key={post.id} className="bg-[#1A202C] rounded-xl p-4 border border-slate-800 hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-700 p-2 rounded-lg text-white">
                          <span className="material-symbols-outlined">{post.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">{post.name}</h4>
                          <p className="text-slate-400 text-xs">{post.location}</p>
                        </div>
                      </div>
                      <span className="flex h-3 w-3 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${post.status === 'Ativo' ? 'bg-green-400' : 'bg-slate-500'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${post.status === 'Ativo' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-[#111318] p-2 rounded-lg border border-slate-800/50">
                        <img src={post.officerAvatar} alt={post.officer} className="rounded-full h-8 w-8 ring-1 ring-slate-600" />
                        <div className="flex flex-col">
                          <p className="text-white text-sm font-medium">{post.officer}</p>
                          <p className="text-slate-500 text-[10px]">{post.weapon}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  Escala de Serviço
                </h3>
                <button className="text-primary hover:text-blue-400 text-xs font-bold">VER COMPLETO</button>
              </div>
              <div className="bg-[#1A202C] rounded-xl p-4 border border-slate-800 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <p className="text-white text-base font-bold">Novembro 2023</p>
                  <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <span key={i} className="text-slate-500 text-[10px] text-center font-bold">{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2 gap-x-1 flex-1 content-start">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className="relative flex flex-col items-center">
                      <button className={`text-sm py-1 rounded w-8 h-8 flex items-center justify-center ${day === 14 ? 'bg-primary text-white font-bold shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-700'}`}>
                        {day}
                      </button>
                      {day === 14 && <span className="absolute -bottom-1 w-1 h-1 bg-green-400 rounded-full"></span>}
                    </div>
                  ))}
                </div>
                {/* Fixed content area to prevent layout jump */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2 min-h-[100px]">
                  <p className="text-slate-400 text-xs font-semibold mb-1">PRÓXIMOS PLANTÕES</p>
                  <div className="flex items-center justify-between p-2 bg-[#111318] rounded border border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-8 bg-yellow-500 rounded-sm"></div>
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-bold">15 Nov (Qua)</span>
                        <span className="text-slate-500 text-[10px]">Equipe Charlie</span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[10px]">08:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
