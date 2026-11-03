import React from 'react';
import {
  LayoutDashboard,
  Link2,
  PlusCircle,
  MessageSquare,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { User } from '../types/index';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenCreateLink: () => void;
  onOpenWhatsAppModal: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  onLogout,
  onOpenCreateLink,
  onOpenWhatsAppModal,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'links', label: 'Meus Links', icon: Link2 },
    { id: 'whatsapp', label: 'Link WhatsApp', icon: MessageSquare, isAction: true },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configurações & DNS', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#151619] border-r border-[#292C31] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#292C31]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A46D] to-[#927848] flex items-center justify-center shadow-lg shadow-[#C5A46D]/10">
              <span className="font-heading font-extrabold text-[#101113] text-xl tracking-tighter">K</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-[#F5F5F5] text-lg tracking-wider">KAIZEN</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30">PRO</span>
              </div>
              <p className="text-[11px] text-[#92969F] font-medium tracking-wide">by Kaizen Visual</p>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => {
              onOpenCreateLink();
              if (mobileOpen) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] font-semibold text-sm transition-all duration-200 shadow-md shadow-[#C5A46D]/20 active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Criar Novo Link</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'whatsapp') {
                    onOpenWhatsAppModal();
                  } else {
                    onTabChange(item.id);
                  }
                  if (mobileOpen) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#1B1D21] text-[#F5F5F5] border-l-2 border-[#C5A46D] shadow-xs'
                    : 'text-[#92969F] hover:bg-[#1B1D21]/60 hover:text-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#C5A46D]' : 'text-[#92969F]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.id === 'whatsapp' && (
                  <span className="text-[10px] bg-[#43B581]/15 text-[#43B581] px-1.5 py-0.5 rounded font-mono">
                    WA
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Domain Helper notice in sidebar */}
        <div className="px-4 py-3 mx-3 my-2 rounded-lg bg-[#1B1D21] border border-[#292C31]">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-xs font-semibold text-[#F5F5F5]">kaizen.visual</span>
          </div>
          <p className="text-[11px] text-[#92969F] leading-tight">
            Domínio da agência. Redirecionamento e links 100% integrados.
          </p>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#292C31] bg-[#121316]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#202227] border border-[#292C31] flex items-center justify-center text-[#C5A46D] font-bold text-xs shrink-0">
                {currentUser?.name ? currentUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'IG'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#F5F5F5] truncate">{currentUser?.name || 'Ian Gabriel'}</p>
                <p className="text-[11px] text-[#92969F] truncate">{currentUser?.email || 'iangabrieltv@gmail.com'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Encerrar sessão"
              className="p-1.5 rounded text-[#92969F] hover:text-[#E45B5B] hover:bg-[#202227] transition-colors cursor-pointer shrink-0 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-[#292C31]/40 flex items-center justify-between text-[10px] text-[#5e636e]">
            <span>KAIZEN v2.4</span>
            <span className="flex items-center gap-1 text-[#43B581]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43B581] animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
