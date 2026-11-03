import { User, Client, Project, LinkItem, AnalyticsSummary } from '../types/index';

const TOKEN_KEY = 'kaizen_token';
const USER_KEY = 'kaizen_user';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao processar solicitação.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await this.request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setSession(data.token, data.user);
    return data;
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Links
  async getLinks(params?: { clientId?: string; projectId?: string; status?: string; search?: string }): Promise<LinkItem[]> {
    const query = new URLSearchParams();
    if (params?.clientId) query.set('clientId', params.clientId);
    if (params?.projectId) query.set('projectId', params.projectId);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return this.request(`/api/links${qs ? `?${qs}` : ''}`);
  },

  async createLink(data: Partial<LinkItem>): Promise<LinkItem> {
    return this.request('/api/links', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateLink(id: string, data: Partial<LinkItem>): Promise<LinkItem> {
    return this.request(`/api/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteLink(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/links/${id}`, {
      method: 'DELETE',
    });
  },

  // Clients
  async getClients(): Promise<Client[]> {
    return this.request('/api/clients');
  },

  async createClient(data: Partial<Client>): Promise<Client> {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    return this.request(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteClient(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  },

  // Projects
  async getProjects(clientId?: string): Promise<Project[]> {
    const query = clientId ? `?clientId=${clientId}` : '';
    return this.request(`/api/projects${query}`);
  },

  async createProject(data: { clientId: string; name: string; description?: string }): Promise<Project> {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Analytics
  async getAnalytics(params?: { clientId?: string; projectId?: string; linkId?: string; periodDays?: number }): Promise<AnalyticsSummary> {
    const query = new URLSearchParams();
    if (params?.clientId) query.set('clientId', params.clientId);
    if (params?.projectId) query.set('projectId', params.projectId);
    if (params?.linkId) query.set('linkId', params.linkId);
    if (params?.periodDays) query.set('periodDays', params.periodDays.toString());
    const qs = query.toString();
    return this.request(`/api/analytics${qs ? `?${qs}` : ''}`);
  },

  // Domain status
  async getDomainStatus(): Promise<{
    officialDomain: string;
    isVerified: boolean;
    currentHost: string;
    dnsStatus: string;
    explanation: string;
    recommendedRecords: { type: string; name: string; value: string; ttl: string }[];
  }> {
    return this.request('/api/domains/status');
  },

  // Import
  async importBackup(data: any): Promise<{ success: boolean; message: string }> {
    return this.request('/api/system/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
