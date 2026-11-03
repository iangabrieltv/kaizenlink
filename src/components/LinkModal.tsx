import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Globe, Copy, ExternalLink, QrCode, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Client, Project, LinkItem } from '../types/index';
import { api } from '../services/api';

interface LinkModalProps {
  clients: Client[];
  projects: Project[];
  editingLink?: LinkItem | null;
  onClose: () => void;
  onLinkSaved: (link: LinkItem) => void;
  onOpenQRCode?: (link: LinkItem) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  clients,
  projects,
  editingLink,
  onClose,
  onLinkSaved,
  onOpenQRCode,
}) => {
  const [originalUrl, setOriginalUrl] = useState(editingLink?.originalUrl || '');
  const [slug, setSlug] = useState(editingLink?.slug || '');
  const [title, setTitle] = useState(editingLink?.title || '');
  const [clientId, setClientId] = useState(editingLink?.clientId || clients[0]?.id || '');
  const [projectId, setProjectId] = useState(editingLink?.projectId || '');
  const [description, setDescription] = useState(editingLink?.description || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(editingLink?.status === 'inactive' ? 'inactive' : 'active');
  const [expiresAt, setExpiresAt] = useState(editingLink?.expiresAt ? editingLink.expiresAt.split('T')[0] : '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSuccess, setCreatedSuccess] = useState<LinkItem | null>(null);
  const [copiedOfficial, setCopiedOfficial] = useState(false);
  const [copiedActive, setCopiedActive] = useState(false);

  const activeHost = typeof window !== 'undefined' ? window.location.origin : '';

  const generateRandomSlug = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSlug(res);
  };

  const filteredProjects = projects.filter((p) => p.clientId === clientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!originalUrl) {
      setError('A URL original é obrigatória.');
      return;
    }
    if (!/^https?:\/\//i.test(originalUrl)) {
      setError('A URL deve começar com http:// ou https://');
      return;
    }
    if (!slug) {
      setError('O apelido (slug) personalizado é obrigatório.');
      return;
    }
    if (!title) {
      setError('O nome de identificação do link é obrigatório.');
      return;
    }
    if (!clientId) {
      setError('Selecione um cliente para vincular o link.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        originalUrl: originalUrl.trim(),
        clientId,
        projectId: projectId || undefined,
        description,
        status,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      };

      let result: LinkItem;
      if (editingLink) {
        result = await api.updateLink(editingLink.id, payload);
        onLinkSaved(result);
        onClose();
      } else {
        result = await api.createLink(payload);
        setCreatedSuccess(result);
        onLinkSaved(result);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar o link.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (text: string, type: 'official' | 'active') => {
    navigator.clipboard.writeText(text);
    if (type === 'official') {
      setCopiedOfficial(true);
      setTimeout(() => setCopiedOfficial(false), 2000);
    } else {
      setCopiedActive(true);
      setTimeout(() => setCopiedActive(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1B1D21] border border-[#292C31] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Success View (Step 7 requirement) */}
        {createdSuccess ? (
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#292C31]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#43B581]/15 border border-[#43B581]/30 flex items-center justify-center text-[#43B581]">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#F5F5F5]">Link Criado com Sucesso!</h3>
                  <p className="text-xs text-[#92969F]">Pronto para uso oficial e teste imediato</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#202227] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Official Link */}
              <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#F5F5F5] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#C5A46D]" /> Link Oficial da Agência:
                  </span>
                  <span className="text-[10px] text-[#C5A46D] font-mono">kaizen.visual</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#101113] border border-[#292C31]">
                  <span className="text-xs font-mono text-[#F5F5F5] truncate">
                    https://kaizen.visual/{createdSuccess.slug}
                  </span>
                  <button
                    onClick={() => copyLink(`https://kaizen.visual/${createdSuccess.slug}`, 'official')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] font-semibold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {copiedOfficial ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOfficial ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Immediate Testing Link */}
              <div className="p-3.5 rounded-xl bg-[#151619] border border-[#43B581]/30">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#43B581] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Teste Imediato (URL deste Servidor):
                  </span>
                  <span className="text-[10px] text-[#92969F]">Sem esperar DNS</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#101113] border border-[#292C31]">
                  <span className="text-xs font-mono text-[#92969F] truncate">
                    {activeHost}/r/{createdSuccess.slug}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyLink(`${activeHost}/r/${createdSuccess.slug}`, 'active')}
                      className="p-1.5 rounded bg-[#202227] hover:bg-[#292C31] text-xs text-[#F5F5F5] border border-[#292C31] cursor-pointer"
                      title="Copiar URL ativa"
                    >
                      {copiedActive ? <Check className="w-3 h-3 text-[#43B581]" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <a
                      href={`${activeHost}/r/${createdSuccess.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#43B581] hover:bg-[#4bc78e] text-[#101113] font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <span>Testar Agora</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-[#92969F] mt-1.5">
                  Este link ativo redireciona instantaneamente no Chrome e Safari e registra o clique no painel!
                </p>
              </div>

              {/* Destination URL */}
              <div className="p-3 rounded-xl bg-[#151619] border border-[#292C31] text-xs">
                <span className="text-[#92969F] block text-[10px] uppercase font-bold tracking-wider mb-1">
                  Destino Original:
                </span>
                <span className="text-[#F5F5F5] font-mono text-[11px] break-all">
                  {createdSuccess.originalUrl}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    if (onOpenQRCode) onOpenQRCode(createdSuccess);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#202227] hover:bg-[#292C31] text-[#F5F5F5] text-xs font-medium border border-[#292C31] transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#C5A46D]" />
                  <span>Gerar QR Code</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Concluir</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#292C31]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#F5F5F5]">
                  {editingLink ? 'Editar Link' : 'Criar Novo Link'}
                </h3>
                <p className="text-xs text-[#92969F]">
                  Encurte, personalize e acompanhe dados de conversão
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#202227] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-[#E45B5B]/15 border border-[#E45B5B]/30 text-xs text-[#E45B5B] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* CAMPO 1: URL ORIGINAL */}
              <div>
                <label className="text-xs font-semibold text-[#F5F5F5] mb-1.5 block">
                  CAMPO 1 &bull; URL Original de Destino <span className="text-[#E45B5B]">*</span>
                </label>
                <input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://suaempresa.com.br/pagina-ou-whatsapp"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] font-mono"
                  required
                />
              </div>

              {/* CAMPO 2: APELIDO PERSONALIZADO (SLUG) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#F5F5F5]">
                    CAMPO 2 &bull; Apelido Personalizado (Slug) <span className="text-[#E45B5B]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomSlug}
                    className="text-[11px] text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Gerar link automaticamente
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
                    placeholder="ex: proposta-2026"
                    className="w-full px-3 py-2 text-xs text-[#F5F5F5] font-mono bg-transparent focus:outline-hidden"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#92969F] mt-1">
                  Exemplos: contato, portfolio, instagram, campanha-outubro
                </p>
              </div>

              {/* CAMPO 3: NOME DO LINK */}
              <div>
                <label className="text-xs font-semibold text-[#F5F5F5] mb-1.5 block">
                  CAMPO 3 &bull; Nome Interno do Link <span className="text-[#E45B5B]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Campanha de Tráfego Pago - Bio"
                  className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                  required
                />
              </div>

              {/* CAMPO 4 & PROJETO: CLIENTE E PROJETO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#F5F5F5] mb-1.5 block">
                    CAMPO 4 &bull; Cliente Responsável <span className="text-[#E45B5B]">*</span>
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
                  <label className="text-xs font-semibold text-[#F5F5F5] mb-1.5 block">
                    Projeto Associado
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                  >
                    <option value="">Geral / Sem projeto</option>
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CAMPO 5: DESCRIÇÃO */}
              <div>
                <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
                  CAMPO 5 &bull; Descrição ou Notas Internas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Observações sobre criativo, anúncio, público ou canal de divulgação..."
                  className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] resize-none"
                />
              </div>

              {/* CAMPO 6 & 7: EXPIRAÇÃO E STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
                    CAMPO 6 &bull; Data de Expiração (Opcional)
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#F5F5F5] mb-1.5 block">
                    CAMPO 7 &bull; Status do Link
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('active')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        status === 'active'
                          ? 'bg-[#43B581]/15 text-[#43B581] border-[#43B581]/40'
                          : 'bg-[#151619] text-[#92969F] border-[#292C31]'
                      }`}
                    >
                      Ativo
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('inactive')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        status === 'inactive'
                          ? 'bg-[#E45B5B]/15 text-[#E45B5B] border-[#E45B5B]/40'
                          : 'bg-[#151619] text-[#92969F] border-[#292C31]'
                      }`}
                    >
                      Inativo
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : editingLink ? 'Atualizar Link' : 'Criar Link'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
