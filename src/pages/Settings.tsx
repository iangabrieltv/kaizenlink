import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Lock,
  Download,
  Upload,
  Check,
  AlertTriangle,
  Server,
  ExternalLink,
  Copy,
  RefreshCw,
  LogOut,
  Shield,
  UserCheck,
} from 'lucide-react';
import { User } from '../types/index';
import { api } from '../services/api';

interface SettingsProps {
  currentUser: User | null;
  onLogout: () => void;
  onUserUpdated: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentUser, onLogout, onUserUpdated }) => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Domain status
  const [domainInfo, setDomainInfo] = useState<any>(null);
  const [checkingDns, setCheckingDns] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  // Backup import
  const [importLoading, setImportLoading] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const activeHost = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    checkDomain();
  }, []);

  const checkDomain = async () => {
    setCheckingDns(true);
    try {
      const info = await api.getDomainStatus();
      setDomainInfo(info);
    } catch (e) {
      console.error('Failed to get domain info:', e);
    } finally {
      setCheckingDns(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'A confirmação de senha não coincide.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'A nova senha deve ter no mínimo 6 caracteres.', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    try {
      await api.updatePassword(currentPassword, newPassword);
      setPasswordMsg({ text: 'Senha alterada com sucesso!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'Erro ao atualizar senha.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportMsg(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.importBackup(parsed);
      setImportMsg('Backup restaurado com sucesso! Recarregando...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setImportMsg(`Erro ao importar: ${err.message || 'Arquivo inválido'}`);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-tight">
          Configurações da Plataforma
        </h1>
        <p className="text-xs text-[#92969F] mt-1">
          Gerenciamento da conta da Kaizen Visual, domínio oficial kaizen.visual, publicação na Vercel e segurança.
        </p>
      </div>

      {/* SECTION 1: VERCEL DEPLOYMENT & DOMAIN GUIDE (Addressing the user's specific prompt issue) */}
      <div className="p-6 rounded-2xl bg-[#1B1D21] border border-[#C5A46D]/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#292C31]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#F5F5F5]">
                Domínio Oficial & Publicação na Vercel
              </h2>
              <p className="text-xs text-[#92969F]">
                Configuração para o link <span className="text-[#C5A46D] font-mono font-semibold">https://kaizen.visual/slug</span> funcionar no Safari e Chrome
              </p>
            </div>
          </div>

          <button
            onClick={checkDomain}
            disabled={checkingDns}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202227] hover:bg-[#292C31] text-xs text-[#F5F5F5] font-medium border border-[#292C31] transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C5A46D] ${checkingDns ? 'animate-spin' : ''}`} />
            <span>Verificar Status DNS</span>
          </button>
        </div>

        {/* Why Safari / Chrome gave error callout */}
        <div className="p-4 rounded-xl bg-[#151619] border border-[#E45B5B]/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E45B5B]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Por que apareceu: &quot;Não é possível acessar esse link... pode estar indisponível ou foi movido&quot;?</span>
          </div>
          <p className="text-xs text-[#92969F] leading-relaxed">
            Esse erro é o código clássico de <strong className="text-[#F5F5F5]">DNS_PROBE_FINISHED_NXDOMAIN</strong>. Ele acontece porque o domínio <strong className="text-[#F5F5F5]">kaizen.visual</strong> ainda não tem o apontamento DNS feito na sua conta de registro (Registro.br, GoDaddy, Cloudflare, etc.) em direção ao servidor ou à Vercel.
          </p>
          <p className="text-xs text-[#92969F] leading-relaxed">
            <strong className="text-[#43B581]">O que já está preparado:</strong> Seu aplicativo KAIZEN já conta com a configuração completa da Vercel (<code className="text-[#C5A46D]">vercel.json</code>) e mecanismo de redirecionamento assíncrono.
          </p>
        </div>

        {/* Step by Step instructions for Vercel */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-xs text-[#F5F5F5] uppercase tracking-wider">
            Passo a Passo para Colocar na Vercel e Ativar kaizen.visual:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31] space-y-2">
              <span className="w-5 h-5 rounded-full bg-[#C5A46D] text-[#101113] font-bold text-[11px] flex items-center justify-center">
                1
              </span>
              <h4 className="font-semibold text-[#F5F5F5]">Publicar na Vercel</h4>
              <p className="text-[#92969F] text-[11px] leading-relaxed">
                Importe seu repositório Git na Vercel. As rotas e o frontend SPA já estão preparados com <code className="text-[#C5A46D]">vercel.json</code>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31] space-y-2">
              <span className="w-5 h-5 rounded-full bg-[#C5A46D] text-[#101113] font-bold text-[11px] flex items-center justify-center">
                2
              </span>
              <h4 className="font-semibold text-[#F5F5F5]">Adicionar Domínio</h4>
              <p className="text-[#92969F] text-[11px] leading-relaxed">
                No painel da Vercel, acesse seu projeto &gt; <strong>Settings &gt; Domains</strong> e digite <strong className="text-[#F5F5F5]">kaizen.visual</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-[#151619] border border-[#292C31] space-y-2">
              <span className="w-5 h-5 rounded-full bg-[#C5A46D] text-[#101113] font-bold text-[11px] flex items-center justify-center">
                3
              </span>
              <h4 className="font-semibold text-[#F5F5F5]">Apontar DNS</h4>
              <p className="text-[#92969F] text-[11px] leading-relaxed">
                No site onde comprou o domínio, adicione os registros da tabela abaixo. O SSL é gerado automaticamente!
              </p>
            </div>
          </div>
        </div>

        {/* DNS Records Table */}
        <div className="p-4 rounded-xl bg-[#151619] border border-[#292C31]">
          <span className="text-xs font-semibold text-[#F5F5F5] block mb-2">
            Registros DNS Recomendados para Vercel:
          </span>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#101113] border border-[#292C31] flex items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-[#202227] text-[#C5A46D] text-[11px] font-bold">Tipo A</span>
                <span className="text-[#92969F]">Nome: @</span>
                <span className="text-[#F5F5F5]">76.76.21.21</span>
              </div>
              <button
                onClick={() => copyText('76.76.21.21', 'rec_a')}
                className="text-[#C5A46D] hover:underline text-[11px] cursor-pointer shrink-0 font-sans"
              >
                {copiedRecord === 'rec_a' ? 'Copiado!' : 'Copiar IP'}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-[#101113] border border-[#292C31] flex items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-[#202227] text-[#43B581] text-[11px] font-bold">CNAME</span>
                <span className="text-[#92969F]">Nome: links (ou www)</span>
                <span className="text-[#F5F5F5]">cname.vercel-dns.com</span>
              </div>
              <button
                onClick={() => copyText('cname.vercel-dns.com', 'rec_cname')}
                className="text-[#C5A46D] hover:underline text-[11px] cursor-pointer shrink-0 font-sans"
              >
                {copiedRecord === 'rec_cname' ? 'Copiado!' : 'Copiar Host'}
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#292C31]/50 flex items-center justify-between text-[11px] text-[#92969F]">
            <span>URL de Teste Imediato deste ambiente:</span>
            <span className="font-mono text-[#43B581] truncate max-w-sm">{activeHost}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN PROFILE & PASSWORD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-[#1B1D21] border border-[#292C31] space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#292C31]">
            <div className="w-9 h-9 rounded-xl bg-[#202227] border border-[#292C31] flex items-center justify-center text-[#C5A46D]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">Perfil do Administrador</h3>
              <p className="text-[11px] text-[#92969F]">Kaizen Visual &bull; Acesso Master</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#92969F] block mb-1">Nome do Gestor</span>
              <input
                type="text"
                value={currentUser?.name || 'Ian Gabriel'}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <span className="text-[#92969F] block mb-1">E-mail Cadastrado</span>
              <input
                type="email"
                value={currentUser?.email || 'iangabrieltv@gmail.com'}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <span className="text-[#92969F] block mb-1">Nível de Acesso</span>
              <span className="inline-block px-2.5 py-1 rounded bg-[#C5A46D]/15 text-[#C5A46D] font-medium border border-[#C5A46D]/30">
                {currentUser?.role || 'Administrador Kaizen Visual'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E45B5B]/15 hover:bg-[#E45B5B]/25 text-[#E45B5B] text-xs font-semibold border border-[#E45B5B]/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-2xl bg-[#1B1D21] border border-[#292C31] space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#292C31]">
            <div className="w-9 h-9 rounded-xl bg-[#202227] border border-[#292C31] flex items-center justify-center text-[#C5A46D]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">Alterar Senha</h3>
              <p className="text-[11px] text-[#92969F]">Atualize suas credenciais de segurança</p>
            </div>
          </div>

          {passwordMsg && (
            <div
              className={`p-3 rounded-lg text-xs ${
                passwordMsg.type === 'success'
                  ? 'bg-[#43B581]/15 border border-[#43B581]/30 text-[#43B581]'
                  : 'bg-[#E45B5B]/15 border border-[#E45B5B]/30 text-[#E45B5B]'
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div>
              <span className="text-[#92969F] block mb-1">Senha Atual</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Senha atual (padrão: ianeiuri)"
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                required
              />
            </div>

            <div>
              <span className="text-[#92969F] block mb-1">Nova Senha</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                required
              />
            </div>

            <div>
              <span className="text-[#92969F] block mb-1">Confirmar Nova Senha</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full px-3 py-2 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2 px-4 rounded-lg bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/15 cursor-pointer disabled:opacity-50"
            >
              {passwordLoading ? 'Atualizando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>
      </div>

      {/* SECTION 3: BACKUP, EXPORT & RESTORE */}
      <div className="p-6 rounded-2xl bg-[#1B1D21] border border-[#292C31] space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#292C31]">
          <div className="w-9 h-9 rounded-xl bg-[#202227] border border-[#292C31] flex items-center justify-center text-[#C5A46D]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-[#F5F5F5]">
              Backup & Migração de Dados
            </h3>
            <p className="text-[11px] text-[#92969F]">
              Exporte todos os links, clientes, projetos e eventos em formato JSON para publicar na Vercel ou salvar cópias
            </p>
          </div>
        </div>

        {importMsg && (
          <div className="p-3 rounded-lg bg-[#C5A46D]/15 border border-[#C5A46D]/30 text-xs text-[#C5A46D]">
            {importMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#151619] border border-[#292C31] flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-xs text-[#F5F5F5] mb-1">Exportar Base Completa</h4>
              <p className="text-[11px] text-[#92969F]">
                Baixe um arquivo JSON com todos os links, contadores e históricos da Kaizen Visual.
              </p>
            </div>
            <a
              href="/api/system/export"
              download="kaizen_backup.json"
              className="mt-3 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#202227] hover:bg-[#292C31] text-xs font-medium text-[#F5F5F5] border border-[#292C31] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Baixar Backup JSON</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#151619] border border-[#292C31] flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-xs text-[#F5F5F5] mb-1">Restaurar / Importar Backup</h4>
              <p className="text-[11px] text-[#92969F]">
                Envie um arquivo JSON previamente exportado para restaurar todos os dados na nuvem.
              </p>
            </div>
            <label className="mt-3 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#C5A46D] hover:bg-[#d5b57d] text-xs font-bold text-[#101113] transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{importLoading ? 'Importando...' : 'Selecionar Arquivo JSON'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                disabled={importLoading}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
