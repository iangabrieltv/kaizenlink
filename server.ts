import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, hashPassword } from './server/db.ts';

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS & trust proxy for IP detection
  app.set('trust proxy', true);

  // Authentication Middleware helper
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Acesso não autorizado. Faça login primeiro.' });
    }
    // Basic Bearer check
    const token = authHeader.replace('Bearer ', '');
    if (!token || !token.startsWith('kaizen_sess_')) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }
    next();
  };

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // 1. Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const rawEmail = req.body?.email;
    const rawPassword = req.body?.password;

    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const email = String(rawEmail).trim().toLowerCase();
    const password = String(rawPassword).trim();

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
    }

    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) {
      return res.status(401).json({ error: 'Senha incorreta para a conta da Kaizen Visual.' });
    }

    // Return safe user without password
    const { passwordHash: _, ...safeUser } = user;
    const token = `kaizen_sess_${user.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: safeUser,
    });
  });

  // 2. Auth: Get Current User
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }
    // Use default Ian Gabriel user for active session
    const user = db.getUserByEmail('iangabrieltv@gmail.com');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  });

  // 3. Auth: Update Password
  app.post('/api/auth/password', authMiddleware, (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });
    }
    const user = db.getUserByEmail('iangabrieltv@gmail.com');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    if (user.passwordHash !== hashPassword(currentPassword)) {
      return res.status(400).json({ error: 'A senha atual está incorreta.' });
    }

    db.updatePassword(user.id, newPassword);
    return res.json({ success: true, message: 'Senha atualizada com sucesso.' });
  });

  // 4. Links: List
  app.get('/api/links', (req: Request, res: Response) => {
    const { clientId, projectId, status, search } = req.query as Record<string, string>;
    const links = db.getLinks({ clientId, projectId, status, search });
    return res.json(links);
  });

  // 5. Links: Get by ID
  app.get('/api/links/:id', (req: Request, res: Response) => {
    const link = db.getLinkById(req.params.id);
    if (!link) return res.status(404).json({ error: 'Link não encontrado.' });
    return res.json(link);
  });

  // 6. Links: Create
  app.post('/api/links', (req: Request, res: Response) => {
    const { title, slug, originalUrl, clientId, projectId, description, expiresAt, status, isWhatsAppLink, whatsappData } = req.body;

    if (!title || !slug || !originalUrl || !clientId) {
      return res.status(400).json({ error: 'Campos obrigatórios: Nome, Apelido (Slug), URL Original e Cliente.' });
    }

    // Protocol validation
    if (!/^https?:\/\//i.test(originalUrl)) {
      return res.status(400).json({ error: 'A URL de destino deve começar com http:// ou https://' });
    }

    // Disallow dangerous schemes or local IPs
    if (/javascript:|data:|file:|127\.0\.0\.1|localhost/i.test(originalUrl)) {
      return res.status(400).json({ error: 'URL inválida ou perigosa.' });
    }

    // Slug format validation
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!/^[a-z0-9\-_]{2,60}$/.test(cleanSlug)) {
      return res.status(400).json({
        error: 'O apelido deve ter entre 2 e 60 caracteres e conter apenas letras, números, hífens ou sublinhados.',
      });
    }

    // Reserved slugs check
    const reservedSlugs = [
      'admin',
      'api',
      'dashboard',
      'login',
      'register',
      'settings',
      'analytics',
      'links',
      'clients',
      'projects',
      'r',
      'assets',
      'favicon',
      'robots.txt',
    ];
    if (reservedSlugs.includes(cleanSlug)) {
      return res.status(400).json({ error: `O apelido "${cleanSlug}" é reservado pelo sistema.` });
    }

    try {
      const newLink = db.createLink({
        title,
        slug: cleanSlug,
        originalUrl,
        customDomain: 'kaizen.visual',
        clientId,
        projectId: projectId || undefined,
        description: description || '',
        status: status || 'active',
        expiresAt: expiresAt || null,
        isWhatsAppLink: !!isWhatsAppLink,
        whatsappData: whatsappData || undefined,
      });
      return res.status(201).json(newLink);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao criar link.' });
    }
  });

  // 7. Links: Update
  app.put('/api/links/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateLink(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao atualizar link.' });
    }
  });

  // 8. Links: Delete
  app.delete('/api/links/:id', (req: Request, res: Response) => {
    db.deleteLink(req.params.id);
    return res.json({ success: true, message: 'Link excluído.' });
  });

  // 9. Clients: CRUD
  app.get('/api/clients', (req: Request, res: Response) => {
    return res.json(db.getClients());
  });

  app.post('/api/clients', (req: Request, res: Response) => {
    const { name, company, email, phone, description } = req.body;
    if (!name || !company) {
      return res.status(400).json({ error: 'Nome e Empresa são obrigatórios.' });
    }
    const client = db.createClient({
      name,
      company,
      email: email || '',
      phone: phone || '',
      description: description || '',
    });
    return res.status(201).json(client);
  });

  app.put('/api/clients/:id', (req: Request, res: Response) => {
    const client = db.updateClient(req.params.id, req.body);
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado.' });
    return res.json(client);
  });

  app.delete('/api/clients/:id', (req: Request, res: Response) => {
    db.deleteClient(req.params.id);
    return res.json({ success: true, message: 'Cliente excluído.' });
  });

  // 10. Projects: CRUD
  app.get('/api/projects', (req: Request, res: Response) => {
    const { clientId } = req.query as Record<string, string>;
    return res.json(db.getProjects(clientId));
  });

  app.post('/api/projects', (req: Request, res: Response) => {
    const { clientId, name, description } = req.body;
    if (!clientId || !name) {
      return res.status(400).json({ error: 'Cliente e Nome do Projeto são obrigatórios.' });
    }
    const project = db.createProject({ clientId, name, description });
    return res.status(201).json(project);
  });

  app.delete('/api/projects/:id', (req: Request, res: Response) => {
    db.deleteProject(req.params.id);
    return res.json({ success: true, message: 'Projeto excluído.' });
  });

  // 11. Analytics
  app.get('/api/analytics', (req: Request, res: Response) => {
    const { clientId, projectId, linkId, periodDays } = req.query as Record<string, string>;
    const analytics = db.getAnalytics({
      clientId: clientId || undefined,
      projectId: projectId || undefined,
      linkId: linkId || undefined,
      periodDays: periodDays ? parseInt(periodDays, 10) : 30,
    });
    return res.json(analytics);
  });

  // 12. Domain Diagnostic Status
  app.get('/api/domains/status', (req: Request, res: Response) => {
    const host = req.get('host') || 'localhost:3000';
    return res.json({
      officialDomain: 'kaizen.visual',
      isVerified: false,
      currentHost: host,
      dnsStatus: 'pending',
      explanation:
        'O domínio oficial kaizen.visual requer apontamento de DNS (CNAME ou Registro A) no seu provedor de domínio (Registro.br, GoDaddy, Hostinger) apontando para a sua hospedagem (Vercel ou Cloud Run). Enquanto o DNS propaga, a URL ativa do app e todos os redirecionamentos funcionam instantaneamente!',
      recommendedRecords: [
        { type: 'CNAME', name: '@ ou links', value: 'cname.vercel-dns.com', ttl: '3600' },
        { type: 'A', name: '@', value: '76.76.21.21', ttl: '3600' },
      ],
    });
  });

  // 13. System Export & Import
  app.get('/api/system/export', (req: Request, res: Response) => {
    res.setHeader('Content-Disposition', 'attachment; filename="kaizen_backup.json"');
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(db.getData(), null, 2));
  });

  app.post('/api/system/import', (req: Request, res: Response) => {
    try {
      const imported = req.body;
      if (!imported.links || !imported.clients) {
        return res.status(400).json({ error: 'Arquivo de backup inválido.' });
      }
      db.mutate((data) => {
        Object.assign(data, imported);
      });
      return res.json({ success: true, message: 'Dados restaurados com sucesso!' });
    } catch (e: any) {
      return res.status(500).json({ error: 'Erro ao importar backup.' });
    }
  });

  // ----------------------------------------------------
  // REDIRECTION ENGINE (/r/:slug and top-level /:slug)
  // ----------------------------------------------------
  const handleRedirect = (slug: string, req: Request, res: Response) => {
    const link = db.getLinkBySlug(slug);

    if (!link) {
      // Return beautiful styled 404
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Link Não Encontrado — KAIZEN</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            body { background: #101113; color: #F5F5F5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center; }
            .card { background: #1B1D21; border: 1px solid #292C31; padding: 48px 32px; border-radius: 16px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
            .brand { color: #C5A46D; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; }
            h1 { font-family: 'Manrope', sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 12px; color: #F5F5F5; }
            p { color: #92969F; font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
            .slug-badge { background: #202227; border: 1px solid #292C31; color: #C5A46D; padding: 6px 14px; border-radius: 8px; font-family: monospace; font-size: 14px; display: inline-block; margin-bottom: 24px; }
            .btn { background: #C5A46D; color: #101113; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; transition: all 0.2s; }
            .btn:hover { background: #d4b680; }
            .footer { margin-top: 32px; font-size: 12px; color: #5a5d65; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">KAIZEN VISUAL</div>
            <h1>Link não encontrado</h1>
            <p>O link curto que você tentou acessar não existe ou foi removido do sistema.</p>
            <div class="slug-badge">/${escapeHtml(slug)}</div>
            <div>
              <a href="/" class="btn">Voltar à Plataforma</a>
            </div>
            <div class="footer">KAIZEN &bull; Inteligência & Gestão de Links</div>
          </div>
        </body>
        </html>
      `);
    }

    // Check expiration or inactive status
    const isExpired = link.expiresAt && new Date(link.expiresAt).getTime() < Date.now();
    if (link.status === 'inactive' || isExpired) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Link Inativo ou Expirado — KAIZEN</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            body { background: #101113; color: #F5F5F5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center; }
            .card { background: #1B1D21; border: 1px solid #292C31; padding: 48px 32px; border-radius: 16px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
            .brand { color: #C5A46D; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; }
            h1 { font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #E45B5B; }
            p { color: #92969F; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
            .link-title { font-weight: 600; color: #F5F5F5; margin-bottom: 8px; font-size: 16px; }
            .slug-badge { background: #202227; border: 1px solid #292C31; color: #92969F; padding: 6px 14px; border-radius: 8px; font-family: monospace; font-size: 14px; display: inline-block; margin-bottom: 24px; }
            .btn { background: #202227; border: 1px solid #292C31; color: #F5F5F5; font-weight: 500; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; transition: all 0.2s; }
            .btn:hover { border-color: #C5A46D; color: #C5A46D; }
            .footer { margin-top: 32px; font-size: 12px; color: #5a5d65; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">KAIZEN VISUAL</div>
            <h1>Link Indisponível</h1>
            <div class="link-title">${escapeHtml(link.title)}</div>
            <div class="slug-badge">/${escapeHtml(slug)}</div>
            <p>Este link foi desativado temporariamente pelo administrador ou sua data de validade expirou.</p>
            <div>
              <a href="/" class="btn">Acessar KAIZEN</a>
            </div>
            <div class="footer">KAIZEN &bull; Plataforma de Gestão de Links</div>
          </div>
        </body>
        </html>
      `);
    }

    // Register Click Event Asynchronously
    try {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || '';
      const referer = (req.headers['referer'] || req.headers['referrer'] || '') as string;

      db.recordClick({
        linkId: link.id,
        slug: link.slug,
        clientId: link.clientId,
        projectId: link.projectId,
        ip,
        userAgent,
        referer,
      });
    } catch (e) {
      console.error('Error logging click event:', e);
    }

    // Preserve any incoming query params (e.g. utm or sub-tags)
    let destinationUrl = link.originalUrl;
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length > 0) {
      try {
        const dest = new URL(destinationUrl);
        for (const [k, v] of Object.entries(req.query)) {
          if (typeof v === 'string') dest.searchParams.set(k, v);
        }
        destinationUrl = dest.toString();
      } catch {
        // Fallback if originalUrl has unusual formatting
      }
    }

    // HTTP 307 Temporary Redirect (as required: prevents permanent caching and guarantees analytics)
    return res.redirect(307, destinationUrl);
  };

  // Dedicated prefix redirect: /r/:slug
  app.get('/r/:slug', (req: Request, res: Response) => {
    handleRedirect(req.params.slug, req, res);
  });

  // Clean top-level /:slug redirect for short links
  app.use((req: Request, res: Response, next: NextFunction) => {
    const rawPath = req.path.replace(/^\//, '');
    // Ignore root, subpaths, static assets, APIs, and dev files
    if (
      !rawPath ||
      rawPath.includes('/') ||
      rawPath.includes('.') ||
      ['api', 'src', 'assets', '@vite', '@fs', '@id', 'node_modules', 'favicon.ico', 'index.html'].includes(rawPath)
    ) {
      return next();
    }

    const link = db.getLinkBySlug(rawPath);
    if (link) {
      return handleRedirect(rawPath, req, res);
    }
    return next();
  });

  // ----------------------------------------------------
  // VITE DEV SERVER OR STATIC PRODUCTION
  // ----------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Mount Vite middlewares
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KAIZEN] Servidor rodando na porta ${PORT}`);
    console.log(`[KAIZEN] Login: iangabrieltv@gmail.com | Senha configurada`);
  });
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
