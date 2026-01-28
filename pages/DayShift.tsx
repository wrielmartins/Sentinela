import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { Post } from '../types';

const DayShift: React.FC = () => {
  const { dayPosts, updatePost } = useApp();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Edit Form State
  const [editOfficerName, setEditOfficerName] = useState('');
  const [editStatus, setEditStatus] = useState<Post['status']>('Ativo');

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setEditOfficerName(post.officer);
    setEditStatus(post.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedPost) {
      updatePost('day', selectedPost.id, {
        officer: editOfficerName,
        status: editStatus
      });
      setIsEditModalOpen(false);
      setSelectedPost(null);
    }
  };

  const handlePrint = () => window.print();
  const toggleLock = () => setIsLocked(!isLocked);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ativo': return 'active';
      case 'Em Pausa': return 'pending';
      case 'Em Trânsito': return 'urgent';
      case 'Descanso': return 'normal';
      default: return 'normal';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 py-8 lg:px-8 overflow-y-auto">
        <PageHeader
          title="Escala Diurna"
          subtitle="Gestão Operacional de Plantão - Complexo Penitenciário"
          badge={{ text: isLocked ? 'BLOQUEADO' : 'EM ANDAMENTO', variant: isLocked ? 'error' : 'success', pulse: !isLocked }}
          actions={
            <>
              <button onClick={handlePrint} className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-surface-dark transition-all">
                <span className="material-symbols-outlined text-[20px]">print</span>
                <span>Imprimir</span>
              </button>
              <button
                onClick={toggleLock}
                className={`flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold border transition-all ${isLocked ? 'bg-red-500 text-white border-red-500' : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{isLocked ? 'lock_open' : 'lock'}</span>
                <span>{isLocked ? 'Desbloquear' : 'Bloquear'}</span>
              </button>
              <button className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 text-white text-sm font-bold transition-all">
                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                <span>Modificar Escala</span>
              </button>
            </>
          }
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard title="Data Atual" value="04 Out 2023" icon="calendar_today" subtitle="Quarta-feira" />
          <StatCard title="Plantão Ativo" value="Equipe Charlie" icon="groups" subtitle="Turno A" accentRight />
          <StatCard title="Responsável" value="Insp. Silva" icon="shield_person" subtitle="Matrícula: 8492-B" />
          <StatCard title="Efetivo Total" value="42 Agentes" icon="badge" progress={95} progressColor="bg-green-500" />
        </div>

        <div className="flex flex-col gap-4 mb-10">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-primary block"></span>
              Unidade Principal
            </h3>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{dayPosts.length} postos alocados</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#15181e] border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[25%]">Posto de Serviço</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[25%]">Armamento</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[30%]">Agente Responsável</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[10%]">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[10%]">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {dayPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-lg">{post.icon}</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{post.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {post.weapon}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={post.officerAvatar} alt="Avatar" className="rounded-full size-8 bg-slate-200" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{post.officer}</p>
                            <p className="text-xs text-slate-500">Posto Fixo</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={getStatusVariant(post.status) as any} label={post.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEditClick(post)}
                          disabled={isLocked}
                          className={`text-slate-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Editar ${selectedPost?.name}`}
        actions={
          <>
            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/20 transition-all">Salvar Alterações</button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Agente Responsável</span>
            <input
              type="text"
              value={editOfficerName}
              onChange={(e) => setEditOfficerName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status Operacional</span>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="Ativo">Ativo</option>
              <option value="Em Pausa">Em Pausa</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Descanso">Descanso</option>
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default DayShift;
