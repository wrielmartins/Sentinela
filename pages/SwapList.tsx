import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { SwapRequest } from '../types';

const SwapList: React.FC = () => {
  const { swaps, updateSwapStatus } = useApp();
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);

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

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 gap-8 overflow-y-auto">
      <PageHeader
        title="Controle de Permutas"
        subtitle="Gerenciamento de trocas de plantão e histórico operacional"
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Permutas (Recentes)</h3>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-[#1c1f27]">
                <tr>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Horário</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solicitante</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Substituto</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {swaps.map((swap) => (
                  <tr key={swap.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{swap.time}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={swap.requesterAvatar} className="rounded-full size-8 shrink-0" alt="Avatar" />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{swap.requester}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Solicitante</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-3">
                        <img src={swap.substituteAvatar} className="rounded-full size-8 shrink-0" alt="Avatar" />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{swap.substitute}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Substituto</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={getStatusVariant(swap.status) as any} label={swap.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSwap(swap)}
                        className="text-sm text-slate-500 hover:text-primary font-medium"
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

      <Modal
        isOpen={!!selectedSwap}
        onClose={() => setSelectedSwap(null)}
        title="Detalhes da Permuta"
        actions={
          selectedSwap?.status === 'Pendente' ? (
            <>
              <button onClick={() => handleAction('Negado')} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">Negar</button>
              <button onClick={() => handleAction('Aprovado')} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20 transition-all">Aprovar</button>
            </>
          ) : (
            <button onClick={() => setSelectedSwap(null)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Fechar</button>
          )
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Data Solicitada</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedSwap ? new Date(selectedSwap.date).toLocaleDateString() : ''}</p>
            </div>
            <StatusBadge status={getStatusVariant(selectedSwap?.status || '') as any} label={selectedSwap?.status} size="md" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 flex flex-col items-center gap-2 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
              <img src={selectedSwap?.requesterAvatar} className="w-16 h-16 rounded-full" alt="Requester" />
              <p className="font-bold text-center">{selectedSwap?.requester}</p>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Solicitante</span>
            </div>
            <span className="material-symbols-outlined text-3xl text-slate-300">swap_horiz</span>
            <div className="flex-1 flex flex-col items-center gap-2 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
              <img src={selectedSwap?.substituteAvatar} className="w-16 h-16 rounded-full" alt="Substitute" />
              <p className="font-bold text-center">{selectedSwap?.substitute}</p>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Substituto</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Justificativa:</p>
            <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              {selectedSwap?.reason || 'Sem justificativa fornecida.'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SwapList;
