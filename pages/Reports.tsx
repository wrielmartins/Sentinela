import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { Incident } from '../types';

const Reports: React.FC = () => {
  const { incidents, addIncident, deleteIncident } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Incident Form State
  const [newCategory, setNewCategory] = useState<Incident['category']>('Segurança');
  const [newSeverity, setNewSeverity] = useState<Incident['severity']>('Normal');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddIncident = () => {
    if (!newDescription || !newLocation) return;

    const newIncident: Incident = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: newCategory,
      severity: newSeverity,
      description: newDescription,
      location: newLocation,
      officer: 'CB. SILVA', // Current user fallback
      officerAvatar: 'https://picsum.photos/128/128?random=12'
    };

    addIncident(newIncident);
    setIsModalOpen(false);
    // Reset form
    setNewDescription('');
    setNewLocation('');
    setNewCategory('Segurança');
    setNewSeverity('Normal');
  };

  const getSeverityBadge = (severity: string): 'critical' | 'urgent' | 'normal' => {
    switch (severity) {
      case 'Crítico': return 'critical';
      case 'Urgente': return 'urgent';
      default: return 'normal';
    }
  };

  const getCategoryBadge = (category: string): 'medical' | 'security' | 'info' => {
    switch (category) {
      case 'Médico': return 'medical';
      case 'Segurança': return 'security';
      default: return 'info';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <PageHeader
          title="Diário de Ocorrências"
          subtitle="Registro e acompanhamento de eventos do turno"
          actions={
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Nova Ocorrência</span>
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Hoje"
            value={incidents.length}
            icon="today"
            iconColor="text-slate-900 dark:text-white"
            trend={{ value: `${incidents.length > 0 ? '+1' : '0'}`, direction: 'up' }}
          />
          <StatCard
            title="Críticos"
            value={incidents.filter(i => i.severity === 'Crítico').length}
            icon="warning"
            iconColor="text-red-500"
            trend={{ value: 'Prioridade Alta', direction: 'neutral' }}
          />
          <StatCard
            title="Urgentes"
            value={incidents.filter(i => i.severity === 'Urgente').length}
            icon="pending_actions"
            iconColor="text-orange-400"
          />
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-dark/50">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary w-32">Hora</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary w-40">Categoria</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary">Descrição</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary w-32">Gravidade</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary w-48">Oficial</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary w-20 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">Nenhuma ocorrência registrada hoje.</td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident.id} className="group hover:bg-slate-50 dark:hover:bg-surface-dark/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white tabular-nums">{incident.time}</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={getCategoryBadge(incident.category)} label={incident.category} />
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-900 dark:text-white font-medium">{incident.description}</p>
                        <p className="text-slate-500 dark:text-text-secondary text-xs mt-0.5">{incident.location}</p>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={getSeverityBadge(incident.severity)} label={incident.severity} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <img src={incident.officerAvatar} className="size-6 rounded-full" alt="Officer" />
                          <span className="text-slate-900 dark:text-white">{incident.officer}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteIncident(incident.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Excluir Ocorrência"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nova Ocorrência"
        actions={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleAddIncident} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/20 transition-all">Registrar</button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</span>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Incident['category'])}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="Segurança">Segurança</option>
                <option value="Médico">Médico</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Conduta">Conduta</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gravidade</span>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as Incident['severity'])}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
                <option value="Crítico">Crítico</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Local do Evento</span>
            <input
              type="text"
              placeholder="Ex: Bloco A, Pátio, Entrada..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição Detalhada</span>
            <textarea
              rows={4}
              placeholder="Descreva o que aconteceu..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
