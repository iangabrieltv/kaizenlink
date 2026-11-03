import React, { useState } from 'react';
import { X, MessageSquare, Sparkles, Check, Globe, Copy, ArrowRight, ExternalLink } from 'lucide-react';
import { Client, Project, LinkItem } from '../types/index';
import { api } from '../services/api';

interface WhatsAppModalProps {
  clients: Client[];
  projects: Project[];
  onClose: () => void;
  onLinkCreated: (link: LinkItem) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  clients,
  projects,
  onClose,
  onLinkCreated,
}) => {
  const [countryCode, setCountryCode] = useState('55');
  const [ddd, setDdd] = useState('82');
  const [phone, setPhone] = useState('99509049');
  const [message, setMessage] = useState('Olá! Vim através do KAIZEN e gostaria de saber mais.');
  const [slug, setSlug] = useState('contato');
  const [title, setTitle] = useState('WhatsApp Comercial');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('Redirecionamento direto para atendimento no WhatsApp.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute destination URL
  const cleanPhone = `${countryCode}${ddd}${phone.replace(/\D/g, '')}`;
  const encodedMsg = encodeURIComponent(message);
  const originalUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const generateRandomSlug = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let res = 'wa-';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSlug(res);
  };

  const filteredProjects = projects.filter((p) => p.clientId === clientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Por favor, informe um número de WhatsApp válido.');
      return;
    }
    if (!slug) {
      setError('Informe um apelido (slug) para o link curto.');
      return;
    }
    if (!clientId) {
      setError('Selecione o cliente responsável por este link.');
      return;
    }

    setLoading(true);
    try {
      const created = await api.createLink({
        title,
        slug: slug.trim().toLowerCase(),
        originalUrl,
        customDomain: 'kaizen.visual',
        clientId,
        projectId: projectId || undefined,
        description,
        status: 'active',
        isWhatsAppLink: true,
        whatsappData: {
          countryCode,
          ddd,
          phone,
          message,
        },
      });
      onLinkCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar link de WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1B1D21] border border-[#292C31] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#292C31]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#43B581]/15 border border-[#43B581]/30 flex items-center justify-center text-[#43B581]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#F5F5F5]">Criar Link de WhatsApp</h3>
              <p className="text-xs text-[#92969F]">Gere um link encurtado com mensagem pré-formatada</p>
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
          {/* Phone Fields */}
          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
              Número de Telefone do WhatsApp
            </label>
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#92969F]">+</span>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="DDI (55)"
                    maxLength={4}
                    className="w-full pl-6 pr-2 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                    required
                  />
                </div>
              </div>
              <div className="col-span-1">
                <input
                  type="text"
                  value={ddd}
                  onChange={(e) => setDdd(e.target.value.replace(/\D/g, ''))}
                  placeholder="DDD"
                  maxLength={3}
                  className="w-full px-2.5 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] text-center"
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Número (Ex: 99509049)"
                  className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                  required
                />
              </div>
            </div>
            <p className="text-[11px] text-[#92969F] mt-1">Exemplo: +55 (82) 99509-049</p>
          </div>

          {/* Automatic Message */}
          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
              Mensagem Pré-preenchida (Opcional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite o texto que o visitante enviará ao abrir o WhatsApp..."
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] resize-none"
            />
          </div>

          {/* Custom Slug with kaizen.visual */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#92969F]">
                Apelido Curto (Slug)
              </label>
              <button
                type="button"
                onClick={generateRandomSlug}
                className="text-[11px] text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Gerar Aleatório
              </button>
            </div>
            <div className="flex rounded-lg bg-[#151619] border border-[#292C31] overflow-hidden focus-within:border-[#C5A46D]">
              <span className="px-3 py-2 text-xs text-[#C5A46D] font-mono bg-[#202227] border-r border-[#292C31] shrink-0 select-none">
                kaizen.visual/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-_]/g, ''))}
                placeholder="contato"
                className="w-full px-3 py-2 text-xs text-[#F5F5F5] font-mono bg-transparent focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Link Title */}
          <div>
            <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
              Nome de Identificação Interna
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: WhatsApp Comercial Kaizen"
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              required
            />
          </div>

          {/* Client & Project Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
                Cliente Associado
              </label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setProjectId('');
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                required
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
                Projeto (Opcional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
              >
                <option value="">Nenhum projeto específico</option>
                {filteredProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Preview Card */}
          <div className="p-3 rounded-xl bg-[#151619] border border-[#292C31] text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#92969F] tracking-wider block">
              URL Gerada do WhatsApp:
            </span>
            <div className="font-mono text-[#43B581] break-all text-[11px] line-clamp-2">
              {originalUrl}
            </div>
          </div>

          {/* Submit */}
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
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#C5A46D] hover:bg-[#d4b680] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Salvar Link WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
