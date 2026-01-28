import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  // Use local state to display "editable" fields, seeded from context
  const { user } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '(94) 99123-4567');
  const [email, setEmail] = useState(user?.email || 'silva.pp@tucurui.pa.gov.br');

  const handleSave = () => {
    // In a real app, update context user here
    setIsEditing(false);
    // Assuming context update function existed, we'd call it here
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-background-light dark:bg-background-dark p-4 md:p-8 overflow-y-auto w-full">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="sticky top-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-32 h-32 rounded-full p-1 border-2 border-primary/30">
                <img
                  src={user?.avatar || "https://picsum.photos/200/200?random=1"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-surface-dark opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Matrícula: {user?.badge}</p>

            <div className="w-full flex flex-col gap-3 py-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">badge</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Cargo:</span>
                <span className="ml-auto text-slate-900 dark:text-white font-bold">{user?.role}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">location_on</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Lotação:</span>
                <span className="ml-auto text-slate-900 dark:text-white">Ala C - Bloco 2</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">schedule</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Turno:</span>
                <span className="ml-auto text-slate-900 dark:text-white">Charlie (Noite)</span>
              </div>
            </div>

            <button className="w-full mt-2 py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Histórico Funcional
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Contatos & Acesso</h3>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${isEditing ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'}`}
              >
                {isEditing ? 'SALVAR' : 'EDITAR'}
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">E-mail Institucional</label>
                {isEditing ? (
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary" />
                ) : (
                  <p className="text-sm text-slate-900 dark:text-white truncate">{email}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Telefone / WhatsApp</label>
                {isEditing ? (
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary" />
                ) : (
                  <p className="text-sm text-slate-900 dark:text-white">{phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Board Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]">campaign</span>
            </div>
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 uppercase tracking-wider mb-2 inline-block">Comunicado Oficial</span>
              <h2 className="text-2xl font-bold mb-2">Reunião Geral de Alinhamento</h2>
              <p className="text-blue-100 max-w-xl mb-6">Convocação de todos os inspetores e chefes de equipe para alinhamento de procedimentos de segurança e novos protocolos de revista.</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[18px] text-blue-200">calendar_month</span>
                  <span className="text-sm font-bold">16 Nov, 2023</span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[18px] text-blue-200">schedule</span>
                  <span className="text-sm font-bold">14:00h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              Quadro de Avisos
            </h3>

            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Diretoria de Segurança</span>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Atualização de Procedimento Operacional Padrão #{102 + i}</h4>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{i + 1} dias atrás</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  Foi publicada a nova diretriz referente ao controle de acesso de visitantes no setor administrativo. Todos os agentes devem tomar ciência das alterações até o próximo plantão.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="text-primary text-xs font-bold hover:underline">LER COMPLETO</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
