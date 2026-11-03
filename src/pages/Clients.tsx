import React, { useState } from 'react';
import { Users, PlusCircle, Building, Mail, Phone, ExternalLink, Link2, MousePointerClick, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { Client, Project, LinkItem } from '../types/index';

interface ClientsProps {
  clients: Client[];
  projects: Project[];
  links: LinkItem[];
  onOpenCreateClient: () => void;
  onOpenEditClient: (client: Client) => void;
  onRequestDeleteClient: (client: Client) => void;
  onFilterLinksByClient: (clientId: string) => void;
  onOpenCreateProjectForClient: (clientId: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({
  clients,
  projects,
  links,
  onOpenCreateClient,
  onOpenEditClient,
  onRequestDeleteClient,
  onFilterLinksByClient,
  onOpenCreateProjectForClient,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);

  const activeClient = selectedClient || clients[0];
  const clientProjects = activeClient ? projects.filter((p) => p.clientId === activeClient.id) : [];
  const clientLinks = activeClient ? links.filter((l) => l.clientId === activeClient.id) : [];
  const clientTotalClicks = clientLinks.reduce((acc, curr) => acc + curr.totalClicks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-tight">
            Clientes & Marcas
          </h1>
          <p className="text-xs text-[#92969F] mt-1">
            Organize os links e campanhas de cada cliente atendido pela Kaizen Visual.
          </p>
        </div>

        <button
          onClick={onOpenCreateClient}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Main Layout: List of Clients on Left, Detailed Client Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Clients List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[#92969F] px-1 uppercase tracking-wider">
            Clientes Cadastrados ({clients.length})
          </div>

          <div className="space-y-2">
            {clients.map((client) => {
              const isSelected = activeClient?.id === client.id;
              const clLinks = links.filter((l) => l.clientId === client.id);
              const clClicks = clLinks.reduce((acc, curr) => acc + curr.totalClicks, 0);

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B1D21] border-[#C5A46D] shadow-md shadow-black/50'
                      : 'bg-[#151619] border-[#292C31] hover:bg-[#1B1D21]/60 hover:border-[#292C31]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">
                      {client.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#202227] text-[#C5A46D] font-mono">
                      {clLinks.length} links
                    </span>
                  </div>

                  <p className="text-xs text-[#92969F] truncate">{client.company}</p>

                  <div className="mt-3 pt-2.5 border-t border-[#292C31]/50 flex items-center justify-between text-[11px] text-[#92969F]">
                    <span>Cliques acumulados:</span>
                    <strong className="text-[#F5F5F5] font-mono">{clClicks}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-2">
          {activeClient ? (
            <div className="rounded-xl bg-[#1B1D21] border border-[#292C31] p-6 space-y-6">
              {/* Client Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#292C31]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-heading font-extrabold text-xl text-[#F5F5F5]">
                      {activeClient.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#C5A46D]/15 text-[#C5A46D] font-medium border border-[#C5A46D]/30">
                      {activeClient.company}
                    </span>
                  </div>
                  {activeClient.description && (
                    <p className="text-xs text-[#92969F] mt-2 leading-relaxed">
                      {activeClient.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#92969F] flex-wrap">
                    {activeClient.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C5A46D]" /> {activeClient.email}
                      </span>
                    )}
                    {activeClient.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#43B581]" /> {activeClient.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => onOpenEditClient(activeClient)}
                    className="p-2 rounded-lg bg-[#202227] hover:bg-[#292C31] text-xs text-[#92969F] hover:text-[#F5F5F5] border border-[#292C31] cursor-pointer"
                    title="Editar informações do cliente"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {activeClient.id !== 'cli_kaizen' && (
                    <button
                      onClick={() => onRequestDeleteClient(activeClient)}
                      className="p-2 rounded-lg bg-[#202227] hover:bg-[#E45B5B]/20 text-xs text-[#92969F] hover:text-[#E45B5B] border border-[#292C31] cursor-pointer"
                      title="Excluir cliente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Client Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31]">
                  <span className="text-[11px] text-[#92969F] block mb-1">Total de Links</span>
                  <span className="font-heading font-bold text-xl text-[#F5F5F5]">
                    {clientLinks.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31]">
                  <span className="text-[11px] text-[#92969F] block mb-1">Projetos Ativos</span>
                  <span className="font-heading font-bold text-xl text-[#F5F5F5]">
                    {clientProjects.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31]">
                  <span className="text-[11px] text-[#92969F] block mb-1">Cliques Totais</span>
                  <span className="font-heading font-bold text-xl text-[#C5A46D]">
                    {clientTotalClicks}
                  </span>
                </div>
              </div>

              {/* Projects Section for this Client */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">
                    Projetos & Campanhas do Cliente
                  </h3>
                  <button
                    onClick={() => onOpenCreateProjectForClient(activeClient.id)}
                    className="text-xs text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Adicionar Projeto
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clientProjects.length > 0 ? (
                    clientProjects.map((p) => {
                      const pLinks = clientLinks.filter((l) => l.projectId === p.id);
                      const pClicks = pLinks.reduce((acc, curr) => acc + curr.totalClicks, 0);

                      return (
                        <div key={p.id} className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31]">
                          <h4 className="font-semibold text-xs text-[#F5F5F5]">{p.name}</h4>
                          <p className="text-[11px] text-[#92969F] mt-1 line-clamp-1">{p.description || 'Sem descrição'}</p>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-[#92969F]">
                            <span>{pLinks.length} links</span>
                            <span className="text-[#C5A46D] font-mono font-medium">{pClicks} cliques</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 p-4 rounded-xl bg-[#151619] border border-[#292C31] text-center text-xs text-[#92969F]">
                      Nenhum projeto específico cadastrado para este cliente.
                    </div>
                  )}
                </div>
              </div>

              {/* Links of this client */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">
                    Links Ativos ({clientLinks.length})
                  </h3>
                  <button
                    onClick={() => onFilterLinksByClient(activeClient.id)}
                    className="text-xs text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir na tabela de links</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {clientLinks.length > 0 ? (
                    clientLinks.map((l) => (
                      <div
                        key={l.id}
                        className="p-3 rounded-xl bg-[#151619] border border-[#292C31] flex items-center justify-between text-xs gap-3"
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-[#F5F5F5] block truncate">{l.title}</span>
                          <span className="font-mono text-[#C5A46D] text-[11px]">kaizen.visual/{l.slug}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs text-[#F5F5F5]">{l.totalClicks} cliques</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              l.status === 'active'
                                ? 'bg-[#43B581]/15 text-[#43B581]'
                                : 'bg-[#E45B5B]/15 text-[#E45B5B]'
                            }`}
                          >
                            {l.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-[#151619] border border-[#292C31] text-center text-xs text-[#92969F]">
                      Nenhum link criado ainda para este cliente.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#92969F]">
              Selecione um cliente para visualizar suas informações.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
