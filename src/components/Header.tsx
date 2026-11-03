import React from 'react';
import { Menu, PlusCircle, MessageSquare, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { User } from '../types/index';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCreateLink: () => void;
  onOpenWhatsAppModal: () => void;
  currentUser: User | null;
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenCreateLink,
  onOpenWhatsAppModal,
  currentUser,
  currentTab,
}) => {
  const tabTitles: Record<string, string> = {
    overview: 'Visão Geral',
    links: 'Meus Links',
    clients: 'Clientes & Marcas',
    projects: 'Projetos & Campanhas',
    analytics: 'Analytics & Inteligência',
    settings: 'Configurações & Domínio',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#101113]/90 backdrop-blur-md border-b border-[#292C31] px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#1B1D21] transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="font-heading font-bold text-sm sm:text-base text-[#F5F5F5]">
            {tabTitles[currentTab] || 'KAIZEN'}
          </span>
          <span className="hidden sm:inline-block ml-3 text-[11px] text-[#92969F] font-mono">
            &bull; Kaizen Visual
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Domain pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B1D21] border border-[#292C31] text-xs">
          <Globe className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span className="text-[#92969F]">Domínio:</span>
          <span className="font-mono font-medium text-[#C5A46D]">kaizen.visual</span>
        </div>

        {/* Quick WhatsApp button */}
        <button
          onClick={onOpenWhatsAppModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202227] hover:bg-[#292C31] text-xs text-[#43B581] font-semibold border border-[#292C31] transition-colors cursor-pointer"
          title="Criar link curto para WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

        {/* Quick Create Link */}
        <button
          onClick={onOpenCreateLink}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C5A46D] hover:bg-[#d5b57d] text-[#101113] text-xs font-bold transition-all shadow-md shadow-[#C5A46D]/20 cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="hidden sm:inline">Novo Link</span>
        </button>
      </div>
    </header>
  );
};
