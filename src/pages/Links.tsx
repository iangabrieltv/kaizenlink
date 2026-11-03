import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Edit2,
  Trash2,
  Power,
  BarChart2,
  ArrowUpDown,
  Sparkles,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { LinkItem, Client, Project } from '../types/index';
import { api } from '../services/api';

interface LinksPageProps {
  links: LinkItem[];
  clients: Client[];
  projects: Project[];
  onOpenCreateLink: () => void;
  onOpenEditLink: (link: LinkItem) => void;
  onOpenQRCode: (link: LinkItem) => void;
  onNavigateToAnalyticsForLink: (linkId: string) => void;
  onRefreshLinks: () => void;
  onRequestDelete: (link: LinkItem) => void;
}

export const Links: React.FC<LinksPageProps> = ({
  links,
  clients,
  projects,
  onOpenCreateLink,
  onOpenEditLink,
  onOpenQRCode,
  onNavigateToAnalyticsForLink,
  onRefreshLinks,
  onRequestDelete,
}) => {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'clicks'>('date');
  const [copiedOfficialId, setCopiedOfficialId] = useState<string | null>(null);
  const [copiedActiveId, setCopiedActiveId] = useState<string | null>(null);

  const activeHost = typeof window !== 'undefined' ? window.location.origin : '';

  const copyOfficialLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(`https://kaizen.visual/${slug}`);
    setCopiedOfficialId(id);
    setTimeout(() => setCopiedOfficialId(null), 2000);
  };

  const copyActiveLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(`${activeHost}/${slug}`);
    setCopiedActiveId(id);
    setTimeout(() => setCopiedActiveId(null), 2000);
  };

  const handleToggleStatus = async (link: LinkItem) => {
    const nextStatus = link.status === 'active' ? 'inactive' : 'active';
    try {
      await api.updateLink(link.id, { status: nextStatus });
      onRefreshLinks();
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  // Filter & sort
  let filtered = links.filter((link) => {
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = link.title.toLowerCase().includes(q);
      const matchSlug = link.slug.toLowerCase().includes(q);
      const matchUrl = link.originalUrl.toLowerCase().includes(q);
      if (!matchTitle && !matchSlug && !matchUrl) return false;
    }
    if (selectedClient && link.clientId !== selectedClient) return false;
    if (selectedProject && link.projectId !== selectedProject) return false;
    if (selectedStatus && link.status !== selectedStatus) return false;
    return true;
  });

  if (sortBy === 'clicks') {
    filtered.sort((a, b) => b.totalClicks - a.totalClicks);
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-tight">
            Meus Links
          </h1>
          <p className="text-xs text-[#92969F] mt-1">
            Gerencie todos os links encurtados, apelidos personalizados e destinos da agência.
          </p>
        </div>

        <button
          onClick={onOpenCreateLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>Criar Novo Link</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#92969F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, apelido (slug) ou URL..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
            />
          </div>

          {/* Client Filter */}
          <div>
            <select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setSelectedProject('');
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
            >
              <option value="">Todos os Clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
            >
              <option value="">Todos os Projetos</option>
              {projects
                .filter((p) => !selectedClient || p.clientId === selectedClient)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
            >
              <option value="">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos / Pausados</option>
            </select>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between pt-2 border-t border-[#292C31]/50 text-xs text-[#92969F]">
          <span>
            Exibindo <strong className="text-[#F5F5F5]">{filtered.length}</strong> links
          </span>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar por:
            </span>
            <button
              onClick={() => setSortBy('date')}
              className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                sortBy === 'date'
                  ? 'bg-[#C5A46D]/20 text-[#C5A46D] border border-[#C5A46D]/40'
                  : 'hover:text-[#F5F5F5]'
              }`}
            >
              Data de Criação
            </button>
            <button
              onClick={() => setSortBy('clicks')}
              className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                sortBy === 'clicks'
                  ? 'bg-[#C5A46D]/20 text-[#C5A46D] border border-[#C5A46D]/40'
                  : 'hover:text-[#F5F5F5]'
              }`}
            >
              Total de Cliques
            </button>
          </div>
        </div>
      </div>

      {/* Links Table Card */}
      <div className="rounded-xl bg-[#1B1D21] border border-[#292C31] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292C31] bg-[#151619] text-[11px] font-bold text-[#92969F] uppercase tracking-wider">
                <th className="py-3 px-4">Identificação & Link Curto</th>
                <th className="py-3 px-4">Destino Original</th>
                <th className="py-3 px-4">Cliente / Projeto</th>
                <th className="py-3 px-4 text-center">Cliques</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292C31] text-xs">
              {filtered.length > 0 ? (
                filtered.map((link) => {
                  return (
                    <tr key={link.id} className="hover:bg-[#202227]/50 transition-colors">
                      {/* Name & Short Link */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#F5F5F5]">{link.title}</span>
                          {link.isWhatsAppLink && (
                            <span className="text-[9px] bg-[#43B581]/15 text-[#43B581] px-1.5 py-0.2 rounded font-mono">
                              WhatsApp
                            </span>
                          )}
                        </div>
                        {/* Working Online URL (Zero DNS error) */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-mono text-[#43B581] text-[11px] font-medium truncate max-w-[200px]" title={`${activeHost}/${link.slug}`}>
                            {activeHost.replace(/^https?:\/\//, '')}/{link.slug}
                          </span>
                          <button
                            onClick={() => copyActiveLink(link.slug, link.id)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#43B581]/15 hover:bg-[#43B581]/25 text-[#43B581] text-[10px] font-medium transition-colors cursor-pointer shrink-0"
                            title="Copiar Link Online (Funciona Agora no Chrome/Safari)"
                          >
                            {copiedActiveId === link.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedActiveId === link.id ? 'Copiado!' : 'Copiar Online'}</span>
                          </button>
                        </div>
                        {/* Official Domain Link */}
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#92969F]">
                          <span className="font-mono text-[#C5A46D] opacity-80">
                            kaizen.visual/{link.slug}
                          </span>
                          <button
                            onClick={() => copyOfficialLink(link.slug, link.id)}
                            className="text-[#92969F] hover:text-[#C5A46D] transition-colors cursor-pointer"
                            title="Copiar formato kaizen.visual (Requer apontar DNS)"
                          >
                            {copiedOfficialId === link.id ? (
                              <Check className="w-3 h-3 text-[#43B581]" />
                            ) : (
                              <span className="underline text-[10px]">Copiar oficial</span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Original URL */}
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <div className="truncate text-[#92969F] font-mono text-[11px]" title={link.originalUrl}>
                          {link.originalUrl}
                        </div>
                        <div className="text-[10px] text-[#5e636e] mt-0.5">
                          Criado em {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>

                      {/* Client / Project */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#F5F5F5] block">{link.clientName}</span>
                        <span className="text-[11px] text-[#92969F]">
                          {link.projectName || 'Geral'}
                        </span>
                      </td>

                      {/* Total Clicks */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-heading font-bold text-sm text-[#F5F5F5] block">
                          {link.totalClicks}
                        </span>
                        <span className="text-[10px] text-[#92969F]">
                          {link.uniqueVisitors} únicos
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(link)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                            link.status === 'active'
                              ? 'bg-[#43B581]/15 text-[#43B581] border border-[#43B581]/30 hover:bg-[#43B581]/25'
                              : 'bg-[#E45B5B]/15 text-[#E45B5B] border border-[#E45B5B]/30 hover:bg-[#E45B5B]/25'
                          }`}
                          title="Clique para alternar status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              link.status === 'active' ? 'bg-[#43B581]' : 'bg-[#E45B5B]'
                            }`}
                          />
                          <span>{link.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Test redirect now button (active URL) */}
                          <a
                            href={`${activeHost}/${link.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#43B581]/15 hover:bg-[#43B581]/25 text-[#43B581] text-xs font-semibold border border-[#43B581]/30 transition-colors cursor-pointer"
                            title="Testar Redirecionamento Imediato no Safari/Chrome"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Testar Agora</span>
                          </a>

                          {/* QR Code */}
                          <button
                            onClick={() => onOpenQRCode(link)}
                            className="p-1.5 rounded-md bg-[#202227] hover:bg-[#292C31] text-[#C5A46D] transition-colors cursor-pointer"
                            title="Gerar QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          {/* Analytics */}
                          <button
                            onClick={() => onNavigateToAnalyticsForLink(link.id)}
                            className="p-1.5 rounded-md bg-[#202227] hover:bg-[#292C31] text-[#92969F] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                            title="Ver estatísticas deste link"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onOpenEditLink(link)}
                            className="p-1.5 rounded-md bg-[#202227] hover:bg-[#292C31] text-[#92969F] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                            title="Editar link"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onRequestDelete(link)}
                            className="p-1.5 rounded-md bg-[#202227] hover:bg-[#E45B5B]/20 text-[#92969F] hover:text-[#E45B5B] transition-colors cursor-pointer"
                            title="Excluir link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#92969F]">
                    Nenhum link encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
