import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';
import { getTeamForDate, isSameDay } from '../utils/rotation';

const Dashboard: React.FC = () => {
  const { dayPosts, nightPosts, swaps, unitStatus } = useApp();
  const [activeShift, setActiveShift] = useState<'day' | 'night'>('day');
  const [viewDate, setViewDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  // Real-time date update every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const selectedTeam = `Equipe ${getTeamForDate(viewDate)}`;

  // Currently we use mock data for posts, so filteredPosts will just show current posts
  // In a real app, this would fetch data for viewDate
  const currentPosts = activeShift === 'day' ? dayPosts : nightPosts;

  // Calculate stats dynamically based on currentPosts (assuming they represent viewDate for now)
  const effectivePresent = new Set(currentPosts.filter(p => p.status === 'Ativo' && p.officer).map(p => p.officer)).size;
  const totalSwaps = swaps.filter(s => s.status === 'Aprovado' && s.date === viewDate.toISOString().split('T')[0]).length;
  const totalAbsences = viewDate.getDate() % 3 === 0 ? 1 : 0; // Simulated logic

  // Calendar rendering helpers
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleDayClick = (date: Date) => {
    setViewDate(date);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative h-full bg-[#0A0C10]">
      <header className="flex-shrink-0 bg-[#111318]/95 backdrop-blur-sm border-b border-slate-800 z-10 sticky top-0">
        <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-black leading-tight tracking-tight uppercase">Painel de Comando</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">Status: Operacional • {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden md:flex flex-col items-end mr-2">
              <p className="text-white text-sm font-black uppercase">{viewDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{viewDate.toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">print</span>
              Relatório
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Equipe no Plantão"
              value={selectedTeam}
              icon="groups"
              iconColor="text-primary"
              subtitle="Escala Ordinária (24h)"
              trend={{ value: 'ATIVO', direction: 'neutral' }}
            />
            <div className="rounded-xl p-5 bg-[#111318] border border-slate-800 shadow-xl relative overflow-hidden group border-l-4 border-l-emerald-500">
              <div className="flex flex-col gap-1 relative z-10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Efetivo Presente</p>
                <h3 className="text-white text-3xl font-black uppercase mb-2">{effectivePresent} Servidores</h3>

                <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/50 mt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1.5 text-red-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span>Faltas: {totalAbsences}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      <span>Permutas: {totalSwaps}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StatCard
              title="Status da Unidade"
              value={unitStatus}
              icon="security"
              iconColor={unitStatus === 'Atenção Normal' ? 'text-emerald-500' : 'text-red-500'}
              subtitle="Protocolo de Segurança Ativo"
              trend={{ value: 'ESTÁVEL', direction: 'neutral' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    postos ativos
                  </h3>
                  <div className="flex bg-[#111318] rounded-full p-1 border border-slate-800">
                    <button
                      onClick={() => setActiveShift('day')}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all ${activeShift === 'day' ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}
                    >Diurno</button>
                    <button
                      onClick={() => setActiveShift('night')}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all ${activeShift === 'night' ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}
                    >Noturno</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPosts.filter(p => p.officer).map(post => (
                  <div key={post.id} className="bg-[#111318] rounded-xl p-4 border border-slate-800 hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-800/50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-800/50 p-2 rounded-lg text-primary group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[20px]">{post.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-black text-xs uppercase tracking-tight">{post.name}</h4>
                          <p className="text-slate-500 text-[10px] font-bold uppercase">{post.location}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${post.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-[#0A0C10] p-2.5 rounded-lg border border-slate-800/50">
                        <img src={post.officerAvatar} alt={post.officer} className="rounded-full h-9 w-9 ring-2 ring-slate-800 group-hover:ring-primary/50 transition-all" />
                        <div className="flex flex-col">
                          <p className="text-white text-sm font-black uppercase leading-tight">{post.officer}</p>
                          <p className="text-red-500 text-[9px] font-bold italic mt-0.5 uppercase tracking-wide">
                            {post.equipment?.join(' / ') || post.weapon || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {currentPosts.filter(p => p.officer).length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-[#111318]/50">
                    <span className="material-symbols-outlined text-slate-700 text-[48px] mb-2">event_busy</span>
                    <p className="text-slate-500 text-xs font-bold uppercase">Nenhum posto preenchido nesta escala</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  Escala de Serviço
                </h3>
              </div>
              <div className="bg-[#111318] rounded-xl p-4 border border-slate-800 h-full flex flex-col shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <p className="text-white text-sm font-black uppercase tracking-widest px-4 text-center">
                    {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-4">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <span key={i} className="text-slate-600 text-[10px] text-center font-black">{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 flex-1 content-start">
                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`prev-${i}`} className="h-10 opacity-20 flex items-center justify-center text-[10px] text-slate-700 font-bold">
                      {prevMonthLastDay - startingDayOfWeek + i + 1}
                    </div>
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                    const team = getTeamForDate(date);
                    const today = new Date();
                    const isItToday = isSameDay(date, today);
                    const isSelected = isSameDay(date, viewDate);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(date)}
                        className={`relative flex flex-col items-center justify-center h-10 rounded-lg transition-all group ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                            isItToday ? 'border border-primary/50 text-white' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                      >
                        <span className={`text-[11px] font-black ${isSelected ? 'text-white' : isItToday ? 'text-primary' : ''}`}>
                          {day}
                        </span>
                        <span className={`text-[8px] font-black uppercase mt-0.5 ${isSelected ? 'text-white/70' :
                            team === 'A' ? 'text-emerald-500' :
                              team === 'B' ? 'text-blue-500' :
                                team === 'C' ? 'text-yellow-500' : 'text-purple-500'
                          }`}>
                          {team}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col gap-3">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Equipe do Dia Selecionado</p>
                  <div className="flex items-center justify-between p-3 bg-[#0A0C10] rounded-xl border border-slate-800 group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-primary font-black text-xl">
                        {getTeamForDate(viewDate)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-black uppercase tracking-tight">{selectedTeam}</span>
                        <span className="text-slate-500 text-[9px] font-bold uppercase">Plantão Ordinário 24h</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-[20px]">arrow_forward</span>
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
