import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SwapRequest: React.FC = () => {
  const { addSwap, user } = useApp();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [shift, setShift] = useState('Diurno (08:00 - 20:00)');
  const [substitute, setSubstitute] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!date || !substitute) return;

    addSwap({
      id: Math.random().toString(36).substr(2, 9),
      date,
      requester: user?.name || 'Solicitante Desconhecido',
      requesterAvatar: user?.avatar || 'https://picsum.photos/32/32?random=1',
      substitute: substitute,
      substituteAvatar: 'https://picsum.photos/32/32?random=99', // Mock avatar
      status: 'Pendente',
      time: shift,
      reason
    });

    navigate('/swaps');
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-10 lg:px-40 flex justify-center items-start overflow-y-auto">
      <div className="flex flex-col w-full max-w-[800px]">
        <Link to="/swaps" className="flex items-center gap-2 text-sm text-slate-500 dark:text-text-secondary mb-6 hover:text-primary transition-colors w-fit">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Voltar ao Painel</span>
        </Link>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">Solicitar Permuta</h2>
            <p className="text-slate-500 dark:text-text-secondary text-sm font-normal mt-1">Unidade: Penal de Tucuruí • Preencha os dados da troca de plantão</p>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Data da Troca</p>
                <div className="flex w-full flex-1 items-stretch rounded-lg relative group">
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#12151b] focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-all"
                    type="date"
                  />
                </div>
              </label>
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Turno</p>
                <div className="relative">
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#12151b] focus:border-primary h-12 px-4 text-base font-normal leading-normal appearance-none transition-all"
                  >
                    <option>Diurno (08:00 - 20:00)</option>
                    <option>Noturno (20:00 - 08:00)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Policial Titular (Você)</p>
                <div className="relative">
                  <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-500 dark:text-text-secondary border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#252b36] h-12 px-4 pl-11 text-base font-normal leading-normal cursor-not-allowed" readOnly value={user?.name || ''} />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                </div>
              </label>
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Policial Substituto</p>
                <div className="relative">
                  <input
                    value={substitute}
                    onChange={(e) => setSubstitute(e.target.value)}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#12151b] focus:border-primary h-12 px-4 pl-11 placeholder:text-slate-400 text-base font-normal leading-normal transition-all"
                    placeholder="Digite o nome..."
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                </div>
              </label>
            </div>

            <label className="flex flex-col w-full">
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Justificativa</p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#12151b] focus:border-primary min-h-32 placeholder:text-slate-400 p-4 text-base font-normal leading-normal transition-all"
                placeholder="Descreva o motivo da troca de plantão detalhadamente..."
              ></textarea>
            </label>

            <div className="flex flex-col">
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">Anexar Documentos</p>
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#12151b] px-6 py-10 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-[#282e39] text-slate-500 dark:text-text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-slate-900 dark:text-white text-base font-bold text-center">Clique para enviar ou arraste e solte</p>
                  <p className="text-slate-500 dark:text-text-secondary text-sm font-normal text-center">PDF, JPG ou PNG (max. 5MB)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161b26] flex justify-end gap-3">
            <Link to="/swaps" className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#252b36] text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
              Cancelar
            </Link>
            <button
              onClick={handleSubmit}
              className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-blue-900/20"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span className="truncate">Enviar Solicitação</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequest;
