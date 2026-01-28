import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { SwapRequest } from '../types';

const SwapList: React.FC = () => {
  const { swaps, updateSwapStatus, addSwap, user } = useApp();
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    shift: 'Diurno (08:00 - 20:00)',
    substitute: '',
    reason: ''
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'approved';
      case 'Pendente': return 'pending';
      case 'Negado': return 'denied';
      default: return 'normal';
    }
  };

  const handleAction = (status: SwapRequest['status']) => {
    if (selectedSwap) {
      updateSwapStatus(selectedSwap.id, status);
      setSelectedSwap(null);
    }
  };

  const handleRequestSubmit = () => {
    if (!formData.date || !formData.substitute) return;

    addSwap({
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      requester: user?.name || 'Solicitante Desconhecido',
      requesterAvatar: user?.avatar || 'https://picsum.photos/32/32?random=1',
      substitute: formData.substitute,
      substituteAvatar: 'https://picsum.photos/32/32?random=99',
      status: 'Pendente',
      time: formData.shift,
      reason: formData.reason
    });

    setIsRequestModalOpen(false);
    setFormData({ date: '', shift: 'Diurno (08:00 - 20:00)', substitute: '', reason: '' });
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 gap-8 overflow-y-auto bg-white dark:bg-[#111318]">
      <PageHeader
        title="Controle de Permutas"
        subtitle="Gerenciamento de trocas de plantão e histórico operacional"
        actions={
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Solicitar Permuta
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Aprovadas Hoje"
          value={swaps.filter(s => s.status === 'Aprovado').length}
          icon="check_circle"
          iconColor="text-emerald-500"
          trend={{ value: '+12% vs ontem', direction: 'up' }}
        />
        <StatCard
          title="Pendentes"
          value={swaps.filter(s => s.status === 'Pendente').length}
          icon="hourglass_top"
          iconColor="text-amber-500"
          subtitle="Requer atenção da diretoria"
        />
        <StatCard
          title="Negadas"
          value={swaps.filter(s => s.status === 'Negado').length}
          icon="cancel"
          iconColor="text-red-500"
          subtitle="Motivo: Falta de interstício"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary">today</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Histórico de Permutas</h3>
        </div>
        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-[#1c1f27]">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Horário</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solicitante</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Substituto</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {swaps.map((swap) => (
                  <tr key={swap.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white uppercase">{swap.time}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={swap.requesterAvatar} className="rounded-full size-8 shrink-0 ring-1 ring-slate-200" alt="Avatar" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{swap.requester}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">Solicitante</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-3">
                        <img src={swap.substituteAvatar} className="rounded-full size-8 shrink-0 ring-1 ring-slate-200" alt="Avatar" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{swap.substitute}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">Substituto</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={getStatusVariant(swap.status) as any} label={swap.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSwap(swap)}
                        className="text-xs text-primary hover:text-blue-400 font-black uppercase tracking-widest"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Detalhes da Permuta */}
      <Modal
        isOpen={!!selectedSwap}
        onClose={() => setSelectedSwap(null)}
        title="DETALHES DA PERMUTA"
        actions={
          selectedSwap?.status === 'Pendente' ? (
            <>
              <button onClick={() => handleAction('Negado')} className="px-4 py-2 text-xs font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors uppercase">Negar</button>
              <button onClick={() => handleAction('Aprovado')} className="px-4 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20 transition-all uppercase">Aprovar</button>
            </>
          ) : (
            <button onClick={() => setSelectedSwap(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg uppercase">Fechar</button>
          )
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Data Solicitada</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{selectedSwap ? new Date(selectedSwap.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</p>
            </div>
            <StatusBadge status={getStatusVariant(selectedSwap?.status || '') as any} label={selectedSwap?.status} size="md" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src={selectedSwap?.requesterAvatar} className="w-16 h-16 rounded-full ring-4 ring-slate-100 dark:ring-slate-800" alt="Requester" />
              <p className="font-black text-slate-900 dark:text-white uppercase text-sm mt-2">{selectedSwap?.requester}</p>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">Solicitante</span>
            </div>
            <div className="flex flex-col items-center text-slate-300">
              <span className="material-symbols-outlined text-4xl animate-pulse">swap_horiz</span>
              <span className="text-[10px] uppercase font-black tracking-widest mt-1">{selectedSwap?.time.split(' ')[0]}</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src={selectedSwap?.substituteAvatar} className="w-16 h-16 rounded-full ring-4 ring-slate-100 dark:ring-slate-800" alt="Substitute" />
              <p className="font-black text-slate-900 dark:text-white uppercase text-sm mt-2">{selectedSwap?.substitute}</p>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">Substituto</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Justificativa Operacional</p>
            <p className="text-sm text-slate-900 dark:text-white leading-relaxed italic">
              "{selectedSwap?.reason || 'Sem justificativa fornecida.'}"
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal: Nova Solicitação de Permuta */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="SOLICITAR PERMUTA"
        actions={
          <>
            <button onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 uppercase hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
            <button
              onClick={handleRequestSubmit}
              className="px-6 py-2 text-xs font-bold text-white bg-primary hover:bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20 uppercase"
            >
              Enviar Solicitação
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data da Troca</span>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Turno</span>
              <select
                value={formData.shift}
                onChange={(e) => setFormData(p => ({ ...p, shift: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Diurno (08:00 - 20:00)</option>
                <option>Noturno (20:00 - 08:00)</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Policial Substituto</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="DIGITE O NOME DO SUBSTITUTO..."
                value={formData.substitute}
                onChange={(e) => setFormData(p => ({ ...p, substitute: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 pl-10 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Justificativa</span>
            <textarea
              placeholder="DESCREVA O MOTIVO DETALHADAMENTE..."
              value={formData.reason}
              onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default SwapList;
