import React, { useState } from 'react';
import { Briefcase, PlusCircle, Link2, MousePointerClick, Trash2, ArrowRight } from 'lucide-react';
import { Project, Client, LinkItem } from '../types/index';

interface ProjectsProps {
  projects: Project[];
  clients: Client[];
  links: LinkItem[];
  onOpenCreateProject: () => void;
  onRequestDeleteProject: (project: Project) => void;
  onFilterLinksByProject: (projectId: string) => void;
  onNavigateToAnalyticsForProject: (projectId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  clients,
  links,
  onOpenCreateProject,
  onRequestDeleteProject,
  onFilterLinksByProject,
  onNavigateToAnalyticsForProject,
}) => {
  const [selectedClientFilter, setSelectedClientFilter] = useState('');

  const filtered = selectedClientFilter
    ? projects.filter((p) => p.clientId === selectedClientFilter)
    : projects;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-tight">
            Projetos & Campanhas
          </h1>
          <p className="text-xs text-[#92969F] mt-1">
            Organize os links por campanhas de tráfego, lançamentos e ações estratégicas.
          </p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Filter by Client */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedClientFilter('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
            selectedClientFilter === ''
              ? 'bg-[#C5A46D] text-[#101113] font-bold'
              : 'bg-[#1B1D21] text-[#92969F] hover:text-[#F5F5F5] border border-[#292C31]'
          }`}
        >
          Todos os Projetos ({projects.length})
        </button>
        {clients.map((c) => {
          const count = projects.filter((p) => p.clientId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedClientFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedClientFilter === c.id
                  ? 'bg-[#C5A46D] text-[#101113] font-bold'
                  : 'bg-[#1B1D21] text-[#92969F] hover:text-[#F5F5F5] border border-[#292C31]'
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((proj) => {
            const projLinks = links.filter((l) => l.projectId === proj.id);
            const projClicks = projLinks.reduce((acc, curr) => acc + curr.totalClicks, 0);

            return (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-[#1B1D21] border border-[#292C31] hover:border-[#C5A46D]/40 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#202227] text-[#C5A46D] border border-[#292C31]">
                      {proj.clientName}
                    </span>
                    <button
                      onClick={() => onRequestDeleteProject(proj)}
                      className="p-1 rounded text-[#92969F] hover:text-[#E45B5B] hover:bg-[#202227] transition-colors cursor-pointer"
                      title="Excluir projeto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#F5F5F5] mb-1.5">
                    {proj.name}
                  </h3>

                  <p className="text-xs text-[#92969F] leading-relaxed line-clamp-2">
                    {proj.description || 'Campanha estratégica gerenciada pela Kaizen Visual.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#292C31] space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-[#151619] border border-[#292C31]">
                      <span className="text-[10px] text-[#92969F] block">Links</span>
                      <strong className="text-sm font-heading font-bold text-[#F5F5F5]">
                        {projLinks.length}
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-[#151619] border border-[#292C31]">
                      <span className="text-[10px] text-[#92969F] block">Cliques</span>
                      <strong className="text-sm font-heading font-bold text-[#C5A46D]">
                        {projClicks}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onFilterLinksByProject(proj.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#202227] hover:bg-[#292C31] text-[11px] font-medium text-[#F5F5F5] border border-[#292C31] text-center transition-colors cursor-pointer"
                    >
                      Ver Links
                    </button>
                    <button
                      onClick={() => onNavigateToAnalyticsForProject(proj.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 text-[11px] font-semibold text-[#C5A46D] border border-[#C5A46D]/30 text-center transition-colors cursor-pointer"
                    >
                      Analytics
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 py-12 text-center text-xs text-[#92969F] bg-[#1B1D21] rounded-xl border border-[#292C31]">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
