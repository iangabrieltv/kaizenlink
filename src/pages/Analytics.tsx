import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Users,
  Smartphone,
  Globe,
  Compass,
  Laptop,
  ShieldCheck,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnalyticsSummary, Client, Project, LinkItem } from '../types/index';
import { api } from '../services/api';

interface AnalyticsProps {
  clients: Client[];
  projects: Project[];
  links: LinkItem[];
  preselectedLinkId?: string;
  preselectedProjectId?: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  clients,
  projects,
  links,
  preselectedLinkId,
  preselectedProjectId,
}) => {
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>(preselectedProjectId || '');
  const [selectedLink, setSelectedLink] = useState<string>(preselectedLinkId || '');

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [periodDays, selectedClient, selectedProject, selectedLink]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics({
        periodDays,
        clientId: selectedClient || undefined,
        projectId: selectedProject || undefined,
        linkId: selectedLink || undefined,
      });
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedClient
    ? projects.filter((p) => p.clientId === selectedClient)
    : projects;

  const filteredLinks = links.filter((l) => {
    if (selectedClient && l.clientId !== selectedClient) return false;
    if (selectedProject && l.projectId !== selectedProject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-tight">
            Analytics & Inteligência
          </h1>
          <p className="text-xs text-[#92969F] mt-1">
            Entenda o desempenho dos seus links e descubra como seu público chega até eles.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          {[
            { label: 'Hoje', days: 1 },
            { label: '7 dias', days: 7 },
            { label: '30 dias', days: 30 },
            { label: '90 dias', days: 90 },
            { label: 'Tudo', days: 0 },
          ].map((item) => (
            <button
              key={item.days}
              onClick={() => setPeriodDays(item.days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                periodDays === item.days
                  ? 'bg-[#C5A46D] text-[#101113] font-bold'
                  : 'text-[#92969F] hover:text-[#F5F5F5]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-[#92969F] mb-1 block">Filtrar por Cliente</label>
            <select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setSelectedProject('');
                setSelectedLink('');
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

          <div>
            <label className="text-[11px] font-semibold text-[#92969F] mb-1 block">Filtrar por Projeto</label>
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedLink('');
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
            >
              <option value="">Todos os Projetos</option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#92969F] mb-1 block">Filtrar por Link Específico</label>
            <select
              value={selectedLink}
              onChange={(e) => setSelectedLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
            >
              <option value="">Todos os Links</option>
              {filteredLinks.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} (/{l.slug})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <span className="text-xs text-[#92969F] block mb-1">Total de Cliques</span>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.totalClicks ?? 0}
          </div>
          <span className="text-[11px] text-[#C5A46D] font-medium mt-1 block">
            Volume bruto
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <span className="text-xs text-[#92969F] block mb-1">Visitantes Únicos</span>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.uniqueVisitors ?? 0}
          </div>
          <span className="text-[11px] text-[#43B581] font-medium mt-1 block">
            IP Hash Diário (LGPD)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <span className="text-xs text-[#92969F] block mb-1">Cliques Hoje</span>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.clicksToday ?? 0}
          </div>
          <span className="text-[11px] text-[#92969F] font-medium mt-1 block">
            Últimas 24 horas
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <span className="text-xs text-[#92969F] block mb-1">Cliques (7 dias)</span>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.clicks7d ?? 0}
          </div>
          <span className="text-[11px] text-[#92969F] font-medium mt-1 block">
            Semana corrente
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] col-span-2 lg:col-span-1">
          <span className="text-xs text-[#92969F] block mb-1">Cliques (30 dias)</span>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.clicks30d ?? 0}
          </div>
          <span className="text-[11px] text-[#92969F] font-medium mt-1 block">
            Mês de referência
          </span>
        </div>
      </div>

      {/* Temporal Chart */}
      <div className="p-5 rounded-xl bg-[#1B1D21] border border-[#292C31]">
        <h2 className="font-heading font-bold text-base text-[#F5F5F5] mb-1">
          Distribuição Temporal dos Acessos
        </h2>
        <p className="text-xs text-[#92969F] mb-6">
          Comparação entre cliques totais e visitantes únicos no período selecionado
        </p>

        <div className="h-64 w-full">
          {analytics && analytics.timeSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A46D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C5A46D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#5e636e" fontSize={11} tickLine={false} axisLine={{ stroke: '#292C31' }} />
                <YAxis stroke="#5e636e" fontSize={11} tickLine={false} axisLine={{ stroke: '#292C31' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1D21',
                    borderColor: '#292C31',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="clicks" name="Cliques Totais" stroke="#C5A46D" strokeWidth={2} fillOpacity={1} fill="url(#goldArea)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#92969F]">
              Sem dados no período.
            </div>
          )}
        </div>
      </div>

      {/* Breakdowns Grid: Devices, OS, Browsers, Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dispositivos */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="font-heading font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
              Dispositivos
            </h3>
          </div>
          <div className="space-y-2">
            {analytics?.devices && analytics.devices.length > 0 ? (
              analytics.devices.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#92969F]">{d.name}</span>
                    <span className="text-[#F5F5F5] font-mono">{d.percentage}% ({d.value})</span>
                  </div>
                  <div className="w-full bg-[#151619] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#C5A46D] h-1.5 rounded-full" style={{ width: `${d.percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#92969F]">Sem dados.</p>
            )}
          </div>
        </div>

        {/* Sistemas Operacionais */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center gap-2 mb-3">
            <Laptop className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="font-heading font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
              Sistemas (OS)
            </h3>
          </div>
          <div className="space-y-2">
            {analytics?.operatingSystems && analytics.operatingSystems.length > 0 ? (
              analytics.operatingSystems.map((o) => (
                <div key={o.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#92969F]">{o.name}</span>
                    <span className="text-[#F5F5F5] font-mono">{o.percentage}% ({o.value})</span>
                  </div>
                  <div className="w-full bg-[#151619] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#43B581] h-1.5 rounded-full" style={{ width: `${o.percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#92969F]">Sem dados.</p>
            )}
          </div>
        </div>

        {/* Navegadores */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="font-heading font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
              Navegadores
            </h3>
          </div>
          <div className="space-y-2">
            {analytics?.browsers && analytics.browsers.length > 0 ? (
              analytics.browsers.map((b) => (
                <div key={b.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#92969F]">{b.name}</span>
                    <span className="text-[#F5F5F5] font-mono">{b.percentage}% ({b.value})</span>
                  </div>
                  <div className="w-full bg-[#151619] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#C5A46D] h-1.5 rounded-full" style={{ width: `${b.percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#92969F]">Sem dados.</p>
            )}
          </div>
        </div>

        {/* Origem / Referrers */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="font-heading font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
              Origem de Tráfego
            </h3>
          </div>
          <div className="space-y-2">
            {analytics?.referrers && analytics.referrers.length > 0 ? (
              analytics.referrers.map((r) => (
                <div key={r.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#92969F] truncate">{r.name}</span>
                    <span className="text-[#F5F5F5] font-mono">{r.percentage}% ({r.value})</span>
                  </div>
                  <div className="w-full bg-[#151619] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#C5A46D] h-1.5 rounded-full" style={{ width: `${r.percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#92969F]">Sem dados.</p>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Policy & Methodology Note (Requirement #10) */}
      <div className="p-4 rounded-xl bg-[#151619] border border-[#292C31] text-xs text-[#92969F] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#43B581] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#F5F5F5] block font-heading">
            Privacidade e Metodologia de Métricas do KAIZEN:
          </strong>
          <p className="leading-relaxed">
            O KAIZEN não armazena endereços IP completos de visitantes nem identifica pessoas nominalmente (em conformidade estrita com LGPD e GDPR).
            A estimativa de <strong>Visitantes Únicos</strong> utiliza um identificador anônimo gerado via hash criptográfico SHA-256 unidirecional com rotação diária (salt).
            Cliques totais contabilizam todos os acessos brutos redirecionados pelo backend.
          </p>
        </div>
      </div>
    </div>
  );
};
