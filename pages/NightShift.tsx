import React, { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  useDraggable
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import { canEditScale } from '../utils/permissions';

// --- Constants & Types ---

const GROUPS = [
  { id: 'Comando', title: 'COMANDO', icon: 'shield_person' },
  { id: 'Supervisor', title: 'SUPERVISOR', icon: 'supervisor_account' },
  { id: 'Operacional Bloco', title: 'OPERACIONAL BLOCO', icon: 'grid_view' },
  { id: 'Vigilância e Sistemas', title: 'VIGILÂNCIA E SISTEMAS', icon: 'videocam' },
  { id: 'Unidade de Reinserção (Semiaberto)', title: 'UNIDADE DE REINSERÇÃO (SEMIABERTO)', icon: 'lock_open' },
  { id: 'Logística e Externo', title: 'LOGÍSTICA E EXTERNO', icon: 'local_shipping' },
  { id: 'Grade de Turnos', title: 'GRADE DE TURNOS (MONITORAMENTO E PORTARIA)', icon: 'schedule' },
] as const;

const EQUIPMENT_OPTIONS = ['556', 'CAL. 12', 'Mão Livre', 'C.C (Câmera Corporal)', 'Chamada'];
const INTERVALS = [
  '20:00h às 22:30h', '22:30h às 01:00h', '01:00h às 03:30h', '03:30h às 06:00h'
];

type GroupType = typeof GROUPS[number]['id'] | 'Outros';

// --- Draggable Post Component ---
interface DraggablePostProps {
  post: Post;
  isOverlay?: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  isDuplicate: boolean;
  isLocked: boolean;
  canEdit: boolean;
}

const DraggablePostItem: React.FC<DraggablePostProps> = ({ post, isOverlay, onEdit, onDelete, isDuplicate, isLocked, canEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id,
    data: post,
    disabled: !canEdit || isLocked
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={classNames(
        "relative flex flex-col md:flex-row md:items-center p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a202c] group transition-colors touch-manipulation",
        {
          "opacity-30": isDragging,
          "shadow-xl ring-2 ring-primary z-50 rounded-lg": isOverlay,
          "hover:bg-slate-50 dark:hover:bg-slate-800": !isOverlay && !isLocked && canEdit,
          "bg-red-50 dark:bg-red-900/10": isDuplicate && !isDragging
        }
      )}
    >
      {/* Warning Indicator */}
      {isDuplicate && (
        <div className="absolute top-1 right-1 md:top-auto md:right-auto md:left-2 text-red-500 animate-pulse" title="Servidor Duplicado na Escala!">
          <span className="material-symbols-outlined text-[18px]">warning</span>
        </div>
      )}

      {/* Post Name (Job Title) */}
      <div className="md:w-[30%] font-bold text-slate-800 dark:text-slate-200 text-sm uppercase md:pl-8">
        {post.name}
      </div>

      {/* Officer Name & Equipment */}
      <div className="md:w-[50%] flex flex-col justify-center">
        <span className={classNames("font-black text-slate-900 dark:text-white uppercase text-base", { "text-red-600 dark:text-red-400": isDuplicate })}>
          {post.officer}
        </span>
        {post.equipment && post.equipment.length > 0 && (
          <div className="flex flex-wrap gap-x-2 text-xs font-bold text-red-600 dark:text-red-400 italic mt-0.5">
            {post.equipment.map((eq, idx) => (
              <span key={idx}>{eq}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isLocked && canEdit && (
        <div className="hidden group-hover:flex md:w-[20%] items-center justify-end gap-2 text-right">
          <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="p-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (window.confirm('Remover este posto?')) onDelete(post.id); }}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- Droppable Zone Component ---
interface DroppableGroupProps {
  group: typeof GROUPS[number];
  posts: Post[];
  onAdd: (groupId: GroupType) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  duplicates: Set<string>;
  isLocked: boolean;
  canEdit: boolean;
}

const DroppableGroup: React.FC<DroppableGroupProps> = ({ group, posts, onAdd, onEdit, onDelete, duplicates, isLocked, canEdit }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: group.id,
    disabled: !canEdit || isLocked
  });

  return (
    <div ref={setNodeRef} className={classNames("border-2 border-slate-900 dark:border-slate-500 mb-[-2px] last:mb-0 transition-colors", { "bg-blue-50/50 dark:bg-blue-900/10 border-blue-500": isOver })}>
      {/* Group Header */}
      <div className="bg-slate-200 dark:bg-slate-700 p-2 flex justify-between items-center border-b border-slate-900 dark:border-slate-500">
        <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-wide flex items-center gap-2">
          {group.title}
        </h3>
        {!isLocked && canEdit && (
          <button onClick={() => onAdd(group.id as GroupType)} className="text-[10px] font-bold bg-slate-900 dark:bg-black text-white px-2 py-1 rounded hover:bg-slate-700 uppercase">
            + Adicionar
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-[#111318] min-h-[3rem]">
        {posts.map(post => (
          <DraggablePostItem
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            isDuplicate={duplicates.has(post.officer)}
            isLocked={isLocked}
            canEdit={canEdit}
          />
        ))}
        {posts.length === 0 && (
          <div className="p-4 text-center text-slate-400 text-xs italic uppercase">
            {canEdit ? 'Vazio - Arraste servidor para cá' : '— Vazio —'}
          </div>
        )}
      </div>
    </div>
  );
};


// --- Main Component ---
const NightShift: React.FC = () => {
  const { nightPosts, addPost, updatePost, deletePost, user } = useApp();
  const [isLocked, setIsLocked] = useState(false);

  const canEdit = canEditScale(user, 'Charlie');

  // DnD State
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Duplicate Detection
  const duplicates = useMemo(() => {
    const counts: Record<string, number> = {};
    const dups = new Set<string>();
    nightPosts.forEach(p => {
      if (p.officer) {
        counts[p.officer] = (counts[p.officer] || 0) + 1;
        if (counts[p.officer] > 1) dups.add(p.officer);
      }
    });
    return dups;
  }, [nightPosts]);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    officer: string;
    group: GroupType;
    equipment: string[];
    status: Post['status'];
  }>({
    name: '',
    officer: '',
    group: 'Comando',
    equipment: [],
    status: 'Ativo',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Handlers ---

  const handleDragStart = (event: DragStartEvent) => {
    if (!isLocked && canEdit) setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (isLocked) return;

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const groupId = over.id as GroupType;
      const post = nightPosts.find(p => p.id === active.id);

      if (post && post.group !== groupId) {
        updatePost('night', post.id, { group: groupId });
      }
    }
  };

  const handleAddClick = (group: GroupType) => {
    setModalMode('add');
    setFormData({
      name: '',
      officer: '',
      group: group,
      equipment: [],
      status: 'Ativo'
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (post: Post) => {
    setModalMode('edit');
    setSelectedPostId(post.id);
    setFormData({
      name: post.name,
      officer: post.officer,
      group: post.group,
      equipment: post.equipment || [],
      status: post.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const postData: Post = {
      id: modalMode === 'edit' && selectedPostId ? selectedPostId : Math.random().toString(36).substr(2, 9),
      name: formData.name.toUpperCase(),
      location: formData.group,
      officer: formData.officer.toUpperCase(),
      officerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.officer)}&background=random`,
      equipment: formData.equipment,
      status: formData.status,
      icon: 'person',
      group: formData.group,
    };

    if (modalMode === 'add') {
      addPost('night', postData);
    } else if (selectedPostId) {
      updatePost('night', selectedPostId, postData);
    }
    setIsModalOpen(false);
  };

  const toggleEquipment = (eq: string) => {
    setFormData(prev => {
      const exists = prev.equipment.includes(eq);
      return {
        ...prev,
        equipment: exists
          ? prev.equipment.filter(e => e !== eq)
          : [...prev.equipment, eq]
      };
    });
  };

  const activePost = activeId ? nightPosts.find(p => p.id === activeId) : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#111318]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-8 lg:px-8 overflow-y-auto pb-24">
          <PageHeader
            title="ESCALA ORDINÁRIA NOTURNA"
            subtitle="UNIDADE DE CUSTÓDIA E REINSERÇÃO"
            badge={{ text: isLocked ? 'FINALIZADA' : 'EDICAO', variant: isLocked ? 'error' : 'success', pulse: !isLocked }}
            actions={
              <div className="flex gap-2 print:hidden">
                <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1 rounded text-sm font-bold uppercase transition-colors">
                  Imprimir
                </button>
                {canEdit && (
                  <button onClick={() => setIsLocked(!isLocked)} className={`px-3 py-1 rounded text-sm font-bold uppercase transition-colors ${isLocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {isLocked ? 'Desbloquear' : 'Bloquear'}
                  </button>
                )}
              </div>
            }
            className="mb-6 border-b-2 border-slate-900 dark:border-white pb-4"
          />

          <div className="flex flex-col border-2 border-slate-900 dark:border-slate-500 bg-white dark:bg-[#111318] shadow-2xl">
            {GROUPS.map(group => (
              <DroppableGroup
                key={group.id}
                group={group}
                posts={nightPosts.filter(p => p.group === group.id)}
                onAdd={handleAddClick}
                onEdit={handleEditClick}
                onDelete={(id) => deletePost('night', id)}
                duplicates={duplicates}
                isLocked={isLocked}
                canEdit={canEdit}
              />
            ))}
          </div>

        </div>

        <DragOverlay>
          {activePost ? (
            <div className="opacity-90 rotate-2 cursor-grabbing">
              <div className="p-3 bg-white dark:bg-slate-800 shadow-2xl rounded-lg border-2 border-primary flex flex-col">
                <span className="font-bold text-sm uppercase text-slate-500">{activePost.name}</span>
                <span className="font-black text-lg uppercase text-slate-900 dark:text-white">{activePost.officer}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'ADICIONAR SERVIDOR' : 'EDITAR POSTO'}
        actions={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors uppercase">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg shadow-primary/20 transition-all uppercase font-bold">
              {modalMode === 'add' ? 'Adicionar' : 'Salvar'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {formData.group === 'Grade de Turnos' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase">Intervalos Noturnos Rápidos:</p>
              <div className="flex flex-wrap gap-2">
                {['MONITORAMENTO', 'PORTARIA EXT.'].map(p => (
                  INTERVALS.map(int => (
                    <button
                      key={`${p}-${int}`}
                      onClick={() => setFormData(prev => ({ ...prev, name: `${p} (${int})` }))}
                      className="text-[10px] bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors uppercase"
                    >
                      {p.split(' ')[0]} - {int.split(' ')[0]}
                    </button>
                  ))
                ))}
              </div>
            </div>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-slate-500">Servidor (Guerra)</span>
            <input
              type="text"
              value={formData.officer}
              onChange={(e) => setFormData(prev => ({ ...prev, officer: e.target.value }))}
              placeholder="EX: SILVA"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-base font-bold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-slate-500">Posto / Função</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="EX: GUARITA G1"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm font-bold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-slate-500">Equipamento</span>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_OPTIONS.map(eq => (
                <label key={eq} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${formData.equipment.includes(eq) ? 'bg-primary/10 border-primary' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input
                    type="checkbox"
                    checked={formData.equipment.includes(eq)}
                    onChange={() => toggleEquipment(eq)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className={`text-sm font-bold uppercase ${formData.equipment.includes(eq) ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{eq}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NightShift;