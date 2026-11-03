import React, { useState, useEffect } from 'react';
import {
  Link2,
  MousePointerClick,
  Users,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Globe,
  Sparkles,
  Smartphone,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnalyticsSummary, LinkItem } from '../types/index';
import { api } from '../services/api';
import { DomainBanner } from '../components/DomainBanner';

interface OverviewProps {
  onOpenCreateLink: () => void;
  onOpenQRCode: (link: LinkItem) => void;
  onNavigateToTab: (tab: string) => void;
  links: LinkItem[];
  onRefreshLinks: () => void;
  domainMode: 'active' | 'official';
  onDomainModeChange: (mode: 'active' | 'official') => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onOpenCreateLink,
  onOpenQRCode,
  onNavigateToTab,
  links,
  onRefreshLinks,
  domainMode,
  onDomainModeChange,
}) => {
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeHost = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    loadAnalytics();
  }, [periodDays]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics({ periodDays });
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filterPeriods = [
    { label: 'Hoje', days: 1 },
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Últimos 90 dias', days: 90 },
    { label: 'Todo o Período', days: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-tight">
            Visão Geral
          </h1>
          <p className="text-xs text-[#92969F] mt-1">
            Acompanhe seus links, monitore acessos e tenha uma visão clara do desempenho da Kaizen Visual.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCreateLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Criar Novo Link</span>
          </button>
        </div>
      </div>

      {/* Domain Assistance Banner */}
      <DomainBanner
        onOpenSettings={() => onNavigateToTab('settings')}
        domainMode={domainMode}
        onDomainModeChange={onDomainModeChange}
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Links */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs">
          <div className="flex items-center justify-between text-[#92969F] mb-2">
            <span className="text-xs font-medium">Total de Links</span>
            <Link2 className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.totalLinks ?? links.length}
          </div>
          <span className="text-[11px] text-[#43B581] font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Gerenciados
          </span>
        </div>

        {/* Total Clicks */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs">
          <div className="flex items-center justify-between text-[#92969F] mb-2">
            <span className="text-xs font-medium">Total de Cliques</span>
            <MousePointerClick className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.totalClicks.toLocaleString('pt-BR') ?? '0'}
          </div>
          <span className="text-[11px] text-[#C5A46D] font-medium flex items-center gap-1 mt-1">
            <span>+{analytics?.clicksToday ?? 0} hoje</span>
          </span>
        </div>

        {/* Unique Visitors */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs">
          <div className="flex items-center justify-between text-[#92969F] mb-2">
            <span className="text-xs font-medium">Visitantes Únicos</span>
            <Users className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F5F5]">
            {analytics?.uniqueVisitors.toLocaleString('pt-BR') ?? '0'}
          </div>
          <span className="text-[11px] text-[#92969F] font-medium mt-1 block">
            Estimados (IP hash)
          </span>
        </div>

        {/* Active Links */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs">
          <div className="flex items-center justify-between text-[#92969F] mb-2">
            <span className="text-xs font-medium">Links Ativos</span>
            <CheckCircle2 className="w-4 h-4 text-[#43B581]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#43B581]">
            {analytics?.activeLinks ?? 0}
          </div>
          <span className="text-[11px] text-[#92969F] font-medium mt-1 block">
            Redirecionando 100%
          </span>
        </div>

        {/* Inactive / Expired */}
        <div className="p-4 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#92969F] mb-2">
            <span className="text-xs font-medium">Inativos / Pausados</span>
            <AlertCircle className="w-4 h-4 text-[#92969F]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#92969F]">
            {analytics?.inactiveLinks ?? 0}
          </div>
          <span className="text-[11px] text-[#92969F] font-medium mt-1 block">
            Pausados pelo admin
          </span>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="p-5 rounded-xl bg-[#1B1D21] border border-[#292C31] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-heading font-bold text-base text-[#F5F5F5]">
              Evolução dos Acessos ao Longo do Tempo
            </h2>
            <p className="text-xs text-[#92969F]">
              Histórico consolidado de cliques e visitantes únicos em todos os links
            </p>
          </div>

          {/* Period Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#151619] border border-[#292C31] overflow-x-auto">
            {filterPeriods.map((p) => (
              <button
                key={p.days}
                onClick={() => setPeriodDays(p.days)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  periodDays === p.days
                    ? 'bg-[#C5A46D] text-[#101113] font-semibold'
                    : 'text-[#92969F] hover:text-[#F5F5F5]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          {analytics && analytics.timeSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A46D" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C5A46D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#43B581" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#43B581" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#5e636e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#292C31' }}
                />
                <YAxis
                  stroke="#5e636e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#292C31' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1D21',
                    borderColor: '#292C31',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F5F5F5',
                  }}
                  itemStyle={{ color: '#C5A46D' }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  name="Cliques Totais"
                  stroke="#C5A46D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="uniques"
                  name="Visitantes Únicos"
                  stroke="#43B581"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#greenGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#92969F]">
              Carregando dados estatísticos...
            </div>
          )}
        </div>
      </div>

      {/* Grid: Top 5 Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Links Mais Acessados */}
        <div className="p-5 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">
                Links Mais Acessados
              </h3>
              <p className="text-xs text-[#92969F]">Top 5 links com maior volume de conversão</p>
            </div>
            <button
              onClick={() => onNavigateToTab('links')}
              className="text-xs text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {analytics?.topLinks && analytics.topLinks.length > 0 ? (
              analytics.topLinks.map((item, idx) => {
                const fullLink = links.find((l) => l.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-[#151619] border border-[#292C31] flex items-center justify-between gap-3 hover:border-[#C5A46D]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#202227] text-[#C5A46D] font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-[#F5F5F5] truncate">{item.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#202227] text-[#92969F]">
                            {item.clientName}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#C5A46D] truncate mt-0.5">
                          kaizen.visual/{item.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#F5F5F5] block">
                          {item.clicks} cliques
                        </span>
                        <span className="text-[10px] text-[#43B581] font-medium">
                          +{item.growth}% var.
                        </span>
                      </div>

                      {fullLink && (
                        <div className="flex items-center gap-1">
                          <a
                            href={`${activeHost}/r/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-[#202227] hover:bg-[#292C31] text-[#43B581] text-xs transition-colors cursor-pointer"
                            title="Testar Redirecionamento Imediato"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => onOpenQRCode(fullLink)}
                            className="p-1.5 rounded bg-[#202227] hover:bg-[#292C31] text-[#C5A46D] text-xs transition-colors cursor-pointer"
                            title="Gerar QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-xs text-[#92969F]">
                Nenhum clique registrado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="p-5 rounded-xl bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">
                Atividade Recente de Cliques
              </h3>
              <p className="text-xs text-[#92969F]">Últimos eventos capturados pelo sistema</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#43B581]/15 text-[#43B581] font-mono">
              Tempo Real
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.slice(0, 7).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-[#151619] border border-[#292C31] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#C5A46D] shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#F5F5F5] truncate">
                        {ev.linkTitle} <span className="text-[#92969F] font-mono text-[10px]">/{ev.slug}</span>
                      </p>
                      <p className="text-[10px] text-[#92969F] mt-0.5 truncate">
                        {ev.referrer} &bull; {ev.deviceType} &bull; {ev.browser} &bull; {ev.location}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#5e636e] shrink-0 ml-2 font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#92969F]">
                Nenhuma atividade recente registrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
