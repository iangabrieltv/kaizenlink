import React, { useState } from 'react';
import { X, Users, Building, Mail, Phone, FileText } from 'lucide-react';
import { Client } from '../types/index';
import { api } from '../services/api';

interface ClientModalProps {
  editingClient?: Client | null;
  onClose: () => void;
  onClientSaved: (client: Client) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  editingClient,
  onClose,
  onClientSaved,
}) => {
  const [name, setName] = useState(editingClient?.name || '');
  const [company, setCompany] = useState(editingClient?.company || '');
  const [email, setEmail] = useState(editingClient?.email || '');
  const [phone, setPhone] = useState(editingClient?.phone || '');
  const [description, setDescription] = useState(editingClient?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) {
      setError('Nome do contato e Nome da Empresa são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let saved: Client;
      if (editingClient) {
        saved = await api.updateClient(editingClient.id, {
          name,
          company,
          email,
          phone,
          description,
        });
      } else {
        saved = await api.createClient({
          name,
          company,
          email,
          phone,
          description,
        });
      }
      onClientSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar cliente.');
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#F5F5F5]">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <p className="text-xs text-[#92969F]">Gerencie marcas atendidas pela Kaizen Visual</p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Nome do Responsável / Contato</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Dr. Rodrigo Ramos"
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Nome da Empresa / Marca</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Clínica Ramos de Estética"
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Telefone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 82 99999-9999"
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">Descrição / Observações</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escopo de serviços, público ou campanhas..."
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
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
