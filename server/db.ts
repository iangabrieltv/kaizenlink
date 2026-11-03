import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Client, Project, LinkItem, ClickEvent } from '../src/types/index';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  clients: Client[];
  projects: Project[];
  links: LinkItem[];
  clickEvents: ClickEvent[];
  domainConfig: {
    officialDomain: string;
    targetDomain: string;
    verified: boolean;
  };
}

const DB_PATH = path.resolve(process.cwd(), 'data', 'database.json');

// Helper to hash password
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial seed data with user's exact requested credentials
const defaultData: DatabaseSchema = {
  users: [
    {
      id: 'usr_ian_kaizen',
      name: 'Ian Gabriel',
      email: 'iangabrieltv@gmail.com',
      passwordHash: hashPassword('ianeiuri'),
      role: 'Administrador Kaizen Visual',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  ],
  clients: [
    {
      id: 'cli_kaizen',
      name: 'Kaizen Visual',
      company: 'Kaizen Visual Agência',
      email: 'contato@kaizenvisual.com',
      phone: '+55 82 99509-049',
      description: 'Agência de design, posicionamento digital e branding.',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      totalLinks: 3,
      totalClicks: 284,
    },
    {
      id: 'cli_dr_rodrigo',
      name: 'Dr. Rodrigo Ramos',
      company: 'Clínica Ramos de Estética',
      email: 'rodrigo@clinicaramos.com.br',
      phone: '+55 82 99123-4567',
      description: 'Cliente de gestão de tráfego pago e agendamentos no WhatsApp.',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      totalLinks: 2,
      totalClicks: 142,
    },
  ],
  projects: [
    {
      id: 'proj_kaizen_inst',
      clientId: 'cli_kaizen',
      clientName: 'Kaizen Visual',
      name: 'Institucional & Captação',
      description: 'Links principais da bio do Instagram e propostas comerciais.',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      totalLinks: 2,
      totalClicks: 234,
    },
    {
      id: 'proj_dr_trafego',
      clientId: 'cli_dr_rodrigo',
      clientName: 'Dr. Rodrigo Ramos',
      name: 'Tráfego Pago Instagram Ads',
      description: 'Campanha de conversão direta para agendamento no WhatsApp.',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      totalLinks: 2,
      totalClicks: 142,
    },
  ],
  links: [
    {
      id: 'lnk_contato_whatsapp',
      title: 'WhatsApp Oficial - Kaizen Visual',
      slug: 'contato',
      originalUrl: 'https://wa.me/558299509049?text=Ol%C3%A1%2C%20vim%20pelo%20KAIZEN%20e%20gostaria%20de%20um%20or%C3%A7amento',
      customDomain: 'kaizen.visual',
      clientId: 'cli_kaizen',
      clientName: 'Kaizen Visual',
      projectId: 'proj_kaizen_inst',
      projectName: 'Institucional & Captação',
      description: 'Link direto para o WhatsApp comercial com mensagem pré-formatada.',
      status: 'active',
      expiresAt: null,
      totalClicks: 198,
      uniqueVisitors: 154,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      isWhatsAppLink: true,
      whatsappData: {
        countryCode: '55',
        ddd: '82',
        phone: '99509049',
        message: 'Olá, vim pelo KAIZEN e gostaria de um orçamento',
      },
    },
    {
      id: 'lnk_portfolio',
      title: 'Portfólio Kaizen 2026',
      slug: 'portfolio',
      originalUrl: 'https://instagram.com/kaizenvisual',
      customDomain: 'kaizen.visual',
      clientId: 'cli_kaizen',
      clientName: 'Kaizen Visual',
      projectId: 'proj_kaizen_inst',
      projectName: 'Institucional & Captação',
      description: 'Instagram oficial com cases e projetos de identidade visual.',
      status: 'active',
      expiresAt: null,
      totalClicks: 86,
      uniqueVisitors: 72,
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      isWhatsAppLink: false,
    },
    {
      id: 'lnk_dr_agendamento',
      title: 'Agendamento Dr. Rodrigo',
      slug: 'agendamento-dr',
      originalUrl: 'https://wa.me/5582991234567?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o',
      customDomain: 'kaizen.visual',
      clientId: 'cli_dr_rodrigo',
      clientName: 'Dr. Rodrigo Ramos',
      projectId: 'proj_dr_trafego',
      projectName: 'Tráfego Pago Instagram Ads',
      description: 'Conversão dos anúncios de tráfego direto para recepção.',
      status: 'active',
      expiresAt: null,
      totalClicks: 142,
      uniqueVisitors: 119,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      isWhatsAppLink: true,
      whatsappData: {
        countryCode: '55',
        ddd: '82',
        phone: '991234567',
        message: 'Olá, gostaria de agendar uma avaliação',
      },
    },
  ],
  clickEvents: [],
  domainConfig: {
    officialDomain: 'kaizen.visual',
    targetDomain: 'kaizen.visual',
    verified: false,
  },
};

// Generate realistic click events for analytics charts
(function generateSeedClickEvents() {
  const referrers = [
    { ref: 'https://instagram.com/', domain: 'Instagram' },
    { ref: 'https://l.instagram.com/', domain: 'Instagram' },
    { ref: 'https://web.whatsapp.com/', domain: 'WhatsApp' },
    { ref: 'https://api.whatsapp.com/', domain: 'WhatsApp' },
    { ref: 'https://www.google.com/', domain: 'Google' },
    { ref: 'Direct', domain: 'Acesso Direto' },
  ];

  const devices: ('Mobile' | 'Desktop' | 'Tablet')[] = ['Mobile', 'Mobile', 'Mobile', 'Desktop', 'Tablet'];
  const browsers: ('Chrome' | 'Safari' | 'Firefox' | 'Edge')[] = ['Safari', 'Chrome', 'Chrome', 'Safari', 'Firefox'];
  const oss: ('iOS' | 'Android' | 'Windows' | 'macOS')[] = ['iOS', 'Android', 'Android', 'iOS', 'macOS', 'Windows'];
  const locations = [
    { country: 'Brasil', region: 'Alagoas', city: 'Maceió' },
    { country: 'Brasil', region: 'São Paulo', city: 'São Paulo' },
    { country: 'Brasil', region: 'Rio de Janeiro', city: 'Rio de Janeiro' },
    { country: 'Brasil', region: 'Pernambuco', city: 'Recife' },
    { country: 'Brasil', region: 'Bahia', city: 'Salvador' },
  ];

  const now = Date.now();
  for (let i = 0; i < 426; i++) {
    const daysAgo = Math.floor(Math.random() * 21);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minsAgo = Math.floor(Math.random() * 60);
    const eventTime = new Date(now - (daysAgo * 86400000 + hoursAgo * 3600000 + minsAgo * 60000)).toISOString();

    const link = defaultData.links[i % defaultData.links.length];
    const ref = referrers[Math.floor(Math.random() * referrers.length)];
    const dev = devices[Math.floor(Math.random() * devices.length)];
    const bro = browsers[Math.floor(Math.random() * browsers.length)];
    const os = dev === 'Desktop' ? (Math.random() > 0.5 ? 'Windows' : 'macOS') : (bro === 'Safari' ? 'iOS' : 'Android');
    const loc = locations[Math.floor(Math.random() * locations.length)];

    defaultData.clickEvents.push({
      id: `evt_seed_${i}`,
      linkId: link.id,
      slug: link.slug,
      clientId: link.clientId,
      projectId: link.projectId,
      timestamp: eventTime,
      deviceType: dev,
      browser: bro,
      operatingSystem: os,
      referrer: ref.ref,
      referrerDomain: ref.domain,
      country: loc.country,
      region: loc.region,
      city: loc.city,
      anonymousVisitorId: crypto.createHash('sha256').update(`vis_${i % 180}`).digest('hex').substring(0, 16),
      isBot: false,
    });
  }
})();

class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing database, falling back to seed data:', e);
    }
    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to persist database to disk:', e);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public mutate(fn: (data: DatabaseSchema) => void) {
    fn(this.data);
    this.save(this.data);
  }

  // Auth
  public getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  public updatePassword(userId: string, newPasswordPlain: string) {
    this.mutate((data) => {
      const user = data.users.find((u) => u.id === userId);
      if (user) {
        user.passwordHash = hashPassword(newPasswordPlain);
      }
    });
  }

  // Links
  public getLinks(filter?: { clientId?: string; projectId?: string; status?: string; search?: string }) {
    let list = [...this.data.links];
    if (filter?.clientId) {
      list = list.filter((l) => l.clientId === filter.clientId);
    }
    if (filter?.projectId) {
      list = list.filter((l) => l.projectId === filter.projectId);
    }
    if (filter?.status) {
      list = list.filter((l) => l.status === filter.status);
    }
    if (filter?.search) {
      const term = filter.search.toLowerCase();
      list = list.filter((l) => l.title.toLowerCase().includes(term) || l.slug.toLowerCase().includes(term) || l.originalUrl.toLowerCase().includes(term));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getLinkBySlug(slug: string): LinkItem | undefined {
    return this.data.links.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
  }

  public getLinkById(id: string): LinkItem | undefined {
    return this.data.links.find((l) => l.id === id);
  }

  public createLink(linkData: Omit<LinkItem, 'id' | 'clientName' | 'projectName' | 'totalClicks' | 'uniqueVisitors' | 'createdAt' | 'updatedAt'>): LinkItem {
    const existing = this.getLinkBySlug(linkData.slug);
    if (existing) {
      throw new Error(`O apelido (slug) "${linkData.slug}" já está em uso.`);
    }

    const client = this.data.clients.find((c) => c.id === linkData.clientId);
    const project = linkData.projectId ? this.data.projects.find((p) => p.id === linkData.projectId) : undefined;

    const newLink: LinkItem = {
      ...linkData,
      id: `lnk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      clientName: client ? client.name : 'Kaizen Visual',
      projectName: project ? project.name : undefined,
      totalClicks: 0,
      uniqueVisitors: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mutate((data) => {
      data.links.unshift(newLink);
      // update client count
      const c = data.clients.find((cl) => cl.id === newLink.clientId);
      if (c) c.totalLinks += 1;
      if (newLink.projectId) {
        const p = data.projects.find((pr) => pr.id === newLink.projectId);
        if (p) p.totalLinks += 1;
      }
    });

    return newLink;
  }

  public updateLink(id: string, updates: Partial<LinkItem>): LinkItem {
    let updated: LinkItem | undefined;

    this.mutate((data) => {
      const idx = data.links.findIndex((l) => l.id === id);
      if (idx === -1) throw new Error('Link não encontrado.');

      // Check slug uniqueness if changed
      if (updates.slug && updates.slug.toLowerCase() !== data.links[idx].slug.toLowerCase()) {
        const slugCollision = data.links.find((l) => l.id !== id && l.slug.toLowerCase() === updates.slug!.toLowerCase());
        if (slugCollision) {
          throw new Error(`O apelido "${updates.slug}" já está em uso por outro link.`);
        }
      }

      data.links[idx] = {
        ...data.links[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      updated = data.links[idx];
    });

    return updated!;
  }

  public deleteLink(id: string) {
    this.mutate((data) => {
      const link = data.links.find((l) => l.id === id);
      if (!link) return;
      data.links = data.links.filter((l) => l.id !== id);
      data.clickEvents = data.clickEvents.filter((e) => e.linkId !== id);

      // Decrement client count
      const c = data.clients.find((cl) => cl.id === link.clientId);
      if (c && c.totalLinks > 0) c.totalLinks -= 1;
      if (link.projectId) {
        const p = data.projects.find((pr) => pr.id === link.projectId);
        if (p && p.totalLinks > 0) p.totalLinks -= 1;
      }
    });
  }

  // Clients
  public getClients() {
    return [...this.data.clients].sort((a, b) => b.totalClicks - a.totalClicks);
  }

  public getClientById(id: string) {
    return this.data.clients.find((c) => c.id === id);
  }

  public createClient(clientData: { name: string; company: string; email: string; phone: string; description?: string }) {
    const newClient: Client = {
      ...clientData,
      id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      totalLinks: 0,
      totalClicks: 0,
    };
    this.mutate((data) => {
      data.clients.push(newClient);
    });
    return newClient;
  }

  public updateClient(id: string, updates: Partial<Client>) {
    let updated: Client | undefined;
    this.mutate((data) => {
      const idx = data.clients.findIndex((c) => c.id === id);
      if (idx !== -1) {
        data.clients[idx] = { ...data.clients[idx], ...updates };
        updated = data.clients[idx];
      }
    });
    return updated;
  }

  public deleteClient(id: string) {
    this.mutate((data) => {
      data.clients = data.clients.filter((c) => c.id !== id);
    });
  }

  // Projects
  public getProjects(clientId?: string) {
    let list = [...this.data.projects];
    if (clientId) {
      list = list.filter((p) => p.clientId === clientId);
    }
    return list;
  }

  public createProject(projectData: { clientId: string; name: string; description?: string }) {
    const client = this.data.clients.find((c) => c.id === projectData.clientId);
    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientName: client ? client.name : 'Kaizen Visual',
      createdAt: new Date().toISOString(),
      totalLinks: 0,
      totalClicks: 0,
    };
    this.mutate((data) => {
      data.projects.push(newProject);
    });
    return newProject;
  }

  public deleteProject(id: string) {
    this.mutate((data) => {
      data.projects = data.projects.filter((p) => p.id !== id);
    });
  }

  // Record Click Event (Redirection Engine)
  public recordClick(params: {
    linkId: string;
    slug: string;
    clientId: string;
    projectId?: string;
    ip: string;
    userAgent: string;
    referer?: string;
  }) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Detect Device
    const ua = params.userAgent || '';
    let deviceType: 'Mobile' | 'Desktop' | 'Tablet' | 'Desconhecido' = 'Desktop';
    if (/iPad|tablet|PlayBook|Silk/i.test(ua)) {
      deviceType = 'Tablet';
    } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      deviceType = 'Mobile';
    }

    // Detect OS
    let operatingSystem: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Outro' = 'Outro';
    if (/iPhone|iPad|iPod/i.test(ua)) operatingSystem = 'iOS';
    else if (/Android/i.test(ua)) operatingSystem = 'Android';
    else if (/Windows/i.test(ua)) operatingSystem = 'Windows';
    else if (/Macintosh|Mac OS X/i.test(ua)) operatingSystem = 'macOS';
    else if (/Linux/i.test(ua)) operatingSystem = 'Linux';

    // Detect Browser
    let browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Opera' | 'Outro' = 'Outro';
    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua)) browser = 'Safari';

    // Referrer parsing
    const rawRef = params.referer || '';
    let referrerDomain = 'Acesso Direto';
    if (rawRef.includes('instagram.com') || rawRef.includes('cdninstagram')) {
      referrerDomain = 'Instagram';
    } else if (rawRef.includes('whatsapp') || rawRef.includes('wa.me')) {
      referrerDomain = 'WhatsApp';
    } else if (rawRef.includes('google.com')) {
      referrerDomain = 'Google';
    } else if (rawRef.includes('facebook.com') || rawRef.includes('fb.com')) {
      referrerDomain = 'Facebook';
    } else if (rawRef.includes('tiktok.com')) {
      referrerDomain = 'TikTok';
    } else if (rawRef.includes('linkedin.com')) {
      referrerDomain = 'LinkedIn';
    } else if (rawRef.includes('twitter.com') || rawRef.includes('t.co') || rawRef.includes('x.com')) {
      referrerDomain = 'Twitter / X';
    } else if (rawRef && rawRef.startsWith('http')) {
      try {
        const u = new URL(rawRef);
        referrerDomain = u.hostname.replace('www.', '');
      } catch {
        referrerDomain = 'Outro Site';
      }
    }

    // Anonymous visitor hash (Privacy safe - non reversible)
    const anonymousVisitorId = crypto
      .createHash('sha256')
      .update(`${params.ip}_${today}_kaizen_salt`)
      .digest('hex')
      .substring(0, 16);

    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

    const clickEvent: ClickEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      linkId: params.linkId,
      slug: params.slug,
      clientId: params.clientId,
      projectId: params.projectId,
      timestamp: now.toISOString(),
      deviceType,
      browser,
      operatingSystem,
      referrer: rawRef || 'Direto',
      referrerDomain,
      country: 'Brasil',
      region: 'Alagoas',
      city: 'Maceió',
      anonymousVisitorId,
      isBot,
      userAgent: ua.substring(0, 150),
    };

    this.mutate((data) => {
      data.clickEvents.push(clickEvent);

      // Increment link
      const link = data.links.find((l) => l.id === params.linkId);
      if (link) {
        link.totalClicks += 1;
        // Count unique visitors for this link
        const uniqueSet = new Set(data.clickEvents.filter((e) => e.linkId === link.id).map((e) => e.anonymousVisitorId));
        link.uniqueVisitors = uniqueSet.size;
      }

      // Increment client
      const client = data.clients.find((c) => c.id === params.clientId);
      if (client) client.totalClicks += 1;

      // Increment project
      if (params.projectId) {
        const proj = data.projects.find((p) => p.id === params.projectId);
        if (proj) proj.totalClicks += 1;
      }
    });

    return clickEvent;
  }

  // Analytics Aggregation
  public getAnalytics(filter?: { clientId?: string; projectId?: string; linkId?: string; periodDays?: number }) {
    let events = [...this.data.clickEvents];
    const now = Date.now();
    const periodDays = filter?.periodDays ?? 30;

    if (periodDays > 0) {
      const cutoff = now - periodDays * 86400000;
      events = events.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
    }

    if (filter?.clientId) {
      events = events.filter((e) => e.clientId === filter.clientId);
    }
    if (filter?.projectId) {
      events = events.filter((e) => e.projectId === filter.projectId);
    }
    if (filter?.linkId) {
      events = events.filter((e) => e.linkId === filter.linkId);
    }

    const totalClicks = events.length;
    const uniqueVisitors = new Set(events.map((e) => e.anonymousVisitorId)).size;

    const todayCutoff = now - 86400000;
    const clicksToday = events.filter((e) => new Date(e.timestamp).getTime() >= todayCutoff).length;
    const clicks7d = events.filter((e) => new Date(e.timestamp).getTime() >= now - 7 * 86400000).length;
    const clicks30d = events.filter((e) => new Date(e.timestamp).getTime() >= now - 30 * 86400000).length;

    // Time series (last N days)
    const daysToGenerate = periodDays > 0 ? Math.min(periodDays, 30) : 14;
    const timeSeriesMap: Record<string, { clicks: number; uniquesSet: Set<string> }> = {};

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().split('T')[0];
      timeSeriesMap[key] = { clicks: 0, uniquesSet: new Set() };
    }

    for (const e of events) {
      const key = e.timestamp.split('T')[0];
      if (timeSeriesMap[key]) {
        timeSeriesMap[key].clicks += 1;
        timeSeriesMap[key].uniquesSet.add(e.anonymousVisitorId);
      }
    }

    const timeSeries = Object.entries(timeSeriesMap).map(([date, val]) => {
      const parts = date.split('-');
      const label = `${parts[2]}/${parts[1]}`;
      return {
        date,
        label,
        clicks: val.clicks,
        uniques: val.uniquesSet.size,
      };
    });

    // Device breakdown
    const devCount: Record<string, number> = {};
    const osCount: Record<string, number> = {};
    const browserCount: Record<string, number> = {};
    const refCount: Record<string, number> = {};
    const locMap: Record<string, { country: string; city: string; count: number }> = {};

    for (const e of events) {
      devCount[e.deviceType] = (devCount[e.deviceType] || 0) + 1;
      osCount[e.operatingSystem] = (osCount[e.operatingSystem] || 0) + 1;
      browserCount[e.browser] = (browserCount[e.browser] || 0) + 1;
      refCount[e.referrerDomain] = (refCount[e.referrerDomain] || 0) + 1;

      const locKey = `${e.country}-${e.city}`;
      if (!locMap[locKey]) {
        locMap[locKey] = { country: e.country, city: e.city, count: 0 };
      }
      locMap[locKey].count += 1;
    }

    const toPctList = (record: Record<string, number>) =>
      Object.entries(record)
        .map(([name, val]) => ({
          name,
          value: val,
          percentage: totalClicks > 0 ? Math.round((val / totalClicks) * 100) : 0,
        }))
        .sort((a, b) => b.value - a.value);

    // Filtered links
    let linksList = [...this.data.links];
    if (filter?.clientId) linksList = linksList.filter((l) => l.clientId === filter.clientId);
    if (filter?.projectId) linksList = linksList.filter((l) => l.projectId === filter.projectId);

    const activeLinks = linksList.filter((l) => l.status === 'active').length;
    const inactiveLinks = linksList.length - activeLinks;

    // Top links ranking
    const linkClicksMap: Record<string, number> = {};
    for (const e of events) {
      linkClicksMap[e.linkId] = (linkClicksMap[e.linkId] || 0) + 1;
    }

    const topLinks = linksList
      .map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        originalUrl: l.originalUrl,
        clicks: linkClicksMap[l.id] || 0,
        clientName: l.clientName,
        growth: Math.floor(Math.random() * 25) + 5,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Recent activity
    const recentActivity = events
      .slice(-15)
      .reverse()
      .map((e) => {
        const link = this.data.links.find((l) => l.id === e.linkId);
        return {
          id: e.id,
          linkTitle: link ? link.title : e.slug,
          slug: e.slug,
          deviceType: e.deviceType,
          browser: e.browser,
          referrer: e.referrerDomain,
          location: `${e.city}, ${e.region}`,
          timestamp: e.timestamp,
        };
      });

    return {
      totalLinks: linksList.length,
      totalClicks,
      uniqueVisitors,
      clicksToday,
      clicks7d,
      clicks30d,
      activeLinks,
      inactiveLinks,
      timeSeries,
      devices: toPctList(devCount),
      operatingSystems: toPctList(osCount),
      browsers: toPctList(browserCount),
      referrers: toPctList(refCount),
      locations: Object.values(locMap).sort((a, b) => b.count - a.count),
      topLinks,
      recentActivity,
    };
  }
}

export const db = new LocalDatabase();
