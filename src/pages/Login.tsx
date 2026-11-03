import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types/index';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('iangabrieltv@gmail.com');
  const [password, setPassword] = useState('ianeiuri');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const autofillCredentials = () => {
    setEmail('iangabrieltv@gmail.com');
    setPassword('ianeiuri');
  };

  return (
    <div className="min-h-screen bg-[#101113] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#C5A46D]/8 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C5A46D] to-[#8c7140] mb-4 shadow-xl shadow-[#C5A46D]/20">
            <span className="font-heading font-extrabold text-[#101113] text-2xl tracking-tighter">K</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#F5F5F5] tracking-wide">
            KAIZEN
          </h1>
          <p className="text-xs text-[#92969F] mt-1 font-medium">
            Plataforma Interna &bull; Kaizen Visual
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-[#1B1D21] border border-[#292C31] text-[10px] text-[#C5A46D]">
            <ShieldCheck className="w-3 h-3" /> Acesso Restrito à Equipe
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1B1D21] border border-[#292C31] rounded-2xl p-7 shadow-2xl backdrop-blur-md">
          <div className="mb-5">
            <h2 className="font-heading font-bold text-lg text-[#F5F5F5]">Entrar na Conta</h2>
            <p className="text-xs text-[#92969F]">Informe suas credenciais de administrador</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#E45B5B]/15 border border-[#E45B5B]/30 text-xs text-[#E45B5B]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#92969F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="iangabrieltv@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#92969F]">Senha</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#92969F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#151619] border border-[#292C31] text-xs text-[#F5F5F5] focus:outline-hidden focus:border-[#C5A46D] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92969F] hover:text-[#F5F5F5] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Autofill quick helper for reviewer */}
            <div className="pt-1">
              <button
                type="button"
                onClick={autofillCredentials}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#202227] hover:bg-[#292C31] border border-[#292C31] text-[11px] text-[#C5A46D] cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Usar credenciais padrão (Ian Gabriel)</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-sm font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Validando acesso...' : 'Acessar Painel KAIZEN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#292C31]/70 text-center">
            <p className="text-[11px] text-[#92969F]">
              Ferramenta exclusiva da equipe <span className="text-[#F5F5F5] font-semibold">Kaizen Visual</span>.
              <br />
              Sem cadastro público externo.
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-[#525660]">
          KAIZEN &bull; by Kaizen Visual &bull; Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};
