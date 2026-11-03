import React, { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
import { Client, Project } from '../types/index';
import { api } from '../services/api';

interface ProjectModalProps {
  clients: Client[];
  initialClientId?: string;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  clients,
  initialClientId,
  onClose,
  onProjectCreated,
}) => {
  const [clientId, setClientId] = useState(initialClientId || clients[0]?.id || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name) {
      setError('Selecione um cliente e defina o nome do projeto.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await api.createProject({ clientId, name, description });
      onProjectCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar projeto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1B1D21] border border-[#292C31] rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#292C31]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#F5F5F5]">Novo Projeto</h3>
              <p className="text-xs text-[#92969F]">Agrupe links por campanha ou finalidade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#202227] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#E45B5B]/15 border border-[#E45B5B]/30 text-xs text-[#E45B5B]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Cliente</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              required
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Nome do Projeto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tráfego Pago Instagram Ads"
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Descrição (Opcional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objetivos do projeto, datas ou canais..."
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#292C31]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#202227] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
