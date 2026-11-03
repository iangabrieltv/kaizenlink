import React, { useState, useEffect } from 'react';
import { User, LinkItem, Client, Project } from './types/index';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Links } from './pages/Links';
import { Clients } from './pages/Clients';
import { Projects } from './pages/Projects';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { LinkModal } from './components/LinkModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { QRCodeModal } from './components/QRCodeModal';
import { ClientModal } from './components/ClientModal';
import { ProjectModal } from './components/ProjectModal';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return api.getCurrentUser();
  });

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global domain mode: 'active' (zero DNS errors, instant working URL) vs 'official' (kaizen.visual)
  const [domainMode, setDomainMode] = useState<'active' | 'official'>(() => {
    return (localStorage.getItem('kaizen_domain_mode') as 'active' | 'official') || 'active';
  });

  const handleDomainModeChange = (mode: 'active' | 'official') => {
    setDomainMode(mode);
    localStorage.setItem('kaizen_domain_mode', mode);
  };

  // App data
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Modal states
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const [qrCodeModalOpen, setQRCodeModalOpen] = useState(false);
  const [selectedLinkForQR, setSelectedLinkForQR] = useState<LinkItem | null>(null);

  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectModalClientId, setProjectModalClientId] = useState<string | undefined>();

  // Analytics navigation context
  const [analyticsLinkId, setAnalyticsLinkId] = useState<string | undefined>();
  const [analyticsProjectId, setAnalyticsProjectId] = useState<string | undefined>();

  // Confirmation modal state
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Initial load
  useEffect(() => {
    // If not logged in, attempt to check with token or show login
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [fetchedLinks, fetchedClients, fetchedProjects] = await Promise.all([
        api.getLinks(),
        api.getClients(),
        api.getProjects(),
      ]);
      setLinks(fetchedLinks);
      setClients(fetchedClients);
      setProjects(fetchedProjects);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    loadAllData();
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Link Handlers
  const openCreateLink = () => {
    setEditingLink(null);
    setLinkModalOpen(true);
  };

  const openEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setLinkModalOpen(true);
  };

  const openQRCode = (link: LinkItem) => {
    setSelectedLinkForQR(link);
    setQRCodeModalOpen(true);
  };

  const handleLinkSaved = (_saved: LinkItem) => {
    loadAllData();
  };

  const requestDeleteLink = (link: LinkItem) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Excluir Link',
      message: `Tem certeza de que deseja excluir o link "${link.title}" (kaizen.visual/${link.slug})? O link deixará de redirecionar imediatamente.`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await api.deleteLink(link.id);
          setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
          loadAllData();
        } catch (e) {
          console.error(e);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  // Client Handlers
  const openCreateClient = () => {
    setEditingClient(null);
    setClientModalOpen(true);
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setClientModalOpen(true);
  };

  const requestDeleteClient = (client: Client) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Excluir Cliente',
      message: `Tem certeza de que deseja excluir o cliente "${client.name}"? Todos os projetos e links vinculados continuarão armazenados.`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await api.deleteClient(client.id);
          setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
          loadAllData();
        } catch (e) {
          console.error(e);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  // Project Handlers
  const openCreateProject = (clientId?: string) => {
    setProjectModalClientId(clientId);
    setProjectModalOpen(true);
  };

  const requestDeleteProject = (project: Project) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Excluir Projeto',
      message: `Tem certeza de que deseja excluir o projeto "${project.name}"?`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await api.deleteProject(project.id);
          setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
          loadAllData();
        } catch (e) {
          console.error(e);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  // Navigation shortcuts
  const navigateToAnalyticsForLink = (linkId: string) => {
    setAnalyticsLinkId(linkId);
    setAnalyticsProjectId(undefined);
    setCurrentTab('analytics');
  };

  const navigateToAnalyticsForProject = (projectId: string) => {
    setAnalyticsProjectId(projectId);
    setAnalyticsLinkId(undefined);
    setCurrentTab('analytics');
  };

  // If not authenticated, render Login
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#101113] text-[#F5F5F5] flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'analytics') {
            setAnalyticsLinkId(undefined);
            setAnalyticsProjectId(undefined);
          }
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCreateLink={openCreateLink}
        onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateLink={openCreateLink}
          onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)}
          currentUser={currentUser}
          currentTab={currentTab}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <Overview
              onOpenCreateLink={openCreateLink}
              onOpenQRCode={openQRCode}
              onNavigateToTab={setCurrentTab}
              links={links}
              onRefreshLinks={loadAllData}
              domainMode={domainMode}
              onDomainModeChange={handleDomainModeChange}
            />
          )}

          {currentTab === 'links' && (
            <Links
              links={links}
              clients={clients}
              projects={projects}
              onOpenCreateLink={openCreateLink}
              onOpenEditLink={openEditLink}
              onOpenQRCode={openQRCode}
              onNavigateToAnalyticsForLink={navigateToAnalyticsForLink}
              onRefreshLinks={loadAllData}
              onRequestDelete={requestDeleteLink}
            />
          )}

          {currentTab === 'clients' && (
            <Clients
              clients={clients}
              projects={projects}
              links={links}
              onOpenCreateClient={openCreateClient}
              onOpenEditClient={openEditClient}
              onRequestDeleteClient={requestDeleteClient}
              onFilterLinksByClient={(clientId) => {
                setCurrentTab('links');
              }}
              onOpenCreateProjectForClient={(clientId) => openCreateProject(clientId)}
            />
          )}

          {currentTab === 'projects' && (
            <Projects
              projects={projects}
              clients={clients}
              links={links}
              onOpenCreateProject={() => openCreateProject()}
              onRequestDeleteProject={requestDeleteProject}
              onFilterLinksByProject={(projId) => {
                setCurrentTab('links');
              }}
              onNavigateToAnalyticsForProject={navigateToAnalyticsForProject}
            />
          )}

          {currentTab === 'analytics' && (
            <Analytics
              clients={clients}
              projects={projects}
              links={links}
              preselectedLinkId={analyticsLinkId}
              preselectedProjectId={analyticsProjectId}
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              currentUser={currentUser}
              onLogout={handleLogout}
              onUserUpdated={loadAllData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {linkModalOpen && (
        <LinkModal
          clients={clients}
          projects={projects}
          editingLink={editingLink}
          onClose={() => {
            setLinkModalOpen(false);
            setEditingLink(null);
          }}
          onLinkSaved={handleLinkSaved}
          onOpenQRCode={openQRCode}
        />
      )}

      {whatsAppModalOpen && (
        <WhatsAppModal
          clients={clients}
          projects={projects}
          onClose={() => setWhatsAppModalOpen(false)}
          onLinkCreated={(newLink) => {
            handleLinkSaved(newLink);
            openQRCode(newLink);
          }}
        />
      )}

      {qrCodeModalOpen && (
        <QRCodeModal
          link={selectedLinkForQR}
          onClose={() => {
            setQRCodeModalOpen(false);
            setSelectedLinkForQR(null);
          }}
        />
      )}

      {clientModalOpen && (
        <ClientModal
          editingClient={editingClient}
          onClose={() => {
            setClientModalOpen(false);
            setEditingClient(null);
          }}
          onClientSaved={() => loadAllData()}
        />
      )}

      {projectModalOpen && (
        <ProjectModal
          clients={clients}
          initialClientId={projectModalClientId}
          onClose={() => {
            setProjectModalOpen(false);
            setProjectModalClientId(undefined);
          }}
          onProjectCreated={() => loadAllData()}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        loading={confirmLoading}
      />
    </div>
  );
}
