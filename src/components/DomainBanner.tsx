import React, { useState } from 'react';
import {
  Globe,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
} from 'lucide-react';

interface DomainBannerProps {
  onOpenSettings: () => void;
  domainMode: 'active' | 'official';
  onDomainModeChange: (mode: 'active' | 'official') => void;
}

export const DomainBanner: React.FC<DomainBannerProps> = ({
  onOpenSettings,
  domainMode,
  onDomainModeChange,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : '';

  const copyVercelA = () => {
    navigator.clipboard.writeText('76.76.21.21');
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const copyVercelCname = () => {
    navigator.clipboard.writeText('cname.vercel-dns.com');
    setCopiedHost(true);
    setTimeout(() => setCopiedHost(false), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl bg-[#1B1D21] border border-[#C5A46D]/40 p-5 shadow-xl shadow-black/50 space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#292C31]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center shrink-0 text-[#C5A46D]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-bold text-sm sm:text-base text-[#F5F5F5]">
                Configuração de Domínio & Redirecionamento
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#43B581]/15 text-[#43B581] border border-[#43B581]/30 font-medium">
                Redirecionamento Ativo
              </span>
            </div>
            <p className="text-xs text-[#92969F] mt-0.5">
              Escolha qual formato de link você quer usar como padrão ao copiar e compartilhar:
            </p>
          </div>
        </div>

        {/* Domain Mode Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#151619] border border-[#292C31] self-start lg:self-center">
          <button
            type="button"
            onClick={() => onDomainModeChange('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              domainMode === 'active'
                ? 'bg-[#43B581] text-[#101113] shadow-md shadow-[#43B581]/20'
                : 'text-[#92969F] hover:text-[#F5F5F5]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#101113] animate-pulse"></span>
            <span>URL Online (Sem Erro de DNS)</span>
          </button>

          <button
            type="button"
            onClick={() => onDomainModeChange('official')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              domainMode === 'official'
                ? 'bg-[#C5A46D] text-[#101113] shadow-md shadow-[#C5A46D]/20'
                : 'text-[#92969F] hover:text-[#F5F5F5]'
            }`}
          >
            <span>kaizen.visual (Requer DNS)</span>
          </button>
        </div>
      </div>

      {/* Explanatory callout for DNS_PROBE_FINISHED_NXDOMAIN */}
      <div className="p-4 rounded-xl bg-[#151619] border border-[#E45B5B]/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E45B5B]">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#E45B5B]" />
            <span>Entendendo o erro: DNS_PROBE_FINISHED_NXDOMAIN</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#92969F] hover:text-[#F5F5F5] flex items-center gap-1 cursor-pointer"
          >
            <span>{expanded ? 'Ocultar detalhes' : 'Ver como resolver'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-[#92969F] leading-relaxed">
          <strong className="text-[#F5F5F5]">NXDOMAIN</strong> significa <em className="text-[#E45B5B]">&quot;Non-Existent Domain&quot;</em> (Domínio Inexistente na Internet). Quando você tentou abrir o link com <code className="text-[#C5A46D]">kaizen.visual</code>, o Windows/Safari/Chrome tentou localizar onde esse domínio está hospedado. Como o domínio ainda não possui o apontamento de DNS feito no seu provedor para a Vercel, o navegador avisa que o site não foi encontrado.
        </p>

        {expanded && (
          <div className="pt-2 border-t border-[#292C31] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Immediate Solution */}
            <div className="space-y-2 bg-[#1B1D21] p-3 rounded-xl border border-[#43B581]/30">
              <h4 className="font-heading font-bold text-[#43B581] text-xs flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Como testar agora mesmo (Zero Erros):
              </h4>
              <p className="text-[#92969F] leading-relaxed">
                Utilize os botões <strong className="text-[#F5F5F5]">&quot;Testar Agora&quot;</strong> ou copie a <strong className="text-[#F5F5F5]">&quot;URL Online&quot;</strong>. Ela usa o endereço real onde esta aplicação está rodando ({currentHost}), redireciona em milissegundos para o WhatsApp/destino e computa o clique imediatamente!
              </p>
              <div className="pt-1">
                <a
                  href={`${currentHost}/contato`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#43B581] hover:bg-[#3aa373] text-[#101113] text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>Testar Link /contato Agora</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* How to configure on Vercel */}
            <div className="space-y-2 bg-[#1B1D21] p-3 rounded-xl border border-[#C5A46D]/30">
              <h4 className="font-heading font-bold text-[#C5A46D] text-xs flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                Passo a passo quando colocar na Vercel:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-[#92969F] leading-relaxed">
                <li>Suba o projeto para a sua conta na <strong className="text-[#F5F5F5]">Vercel</strong>.</li>
                <li>Na Vercel, vá em <strong className="text-[#F5F5F5]">Settings &rarr; Domains</strong> e adicione <code className="text-[#C5A46D]">kaizen.visual</code>.</li>
                <li>
                  No site onde registrou o domínio (Registro.br, GoDaddy, Cloudflare), adicione o registro DNS:
                  <div className="mt-1 flex items-center justify-between bg-[#101113] p-1.5 rounded border border-[#292C31] font-mono text-[11px] text-[#F5F5F5]">
                    <span>Tipo A &bull; Host: @ &bull; Valor: 76.76.21.21</span>
                    <button
                      onClick={copyVercelA}
                      className="text-[#C5A46D] hover:underline text-[10px] cursor-pointer ml-2"
                    >
                      {copiedIp ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
