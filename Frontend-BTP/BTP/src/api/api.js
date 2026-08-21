const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('batipme_token');
}

export function setToken(token) {
  localStorage.setItem('batipme_token', token);
}

export function removeToken() {
  localStorage.removeItem('batipme_token');
  localStorage.removeItem('batipme_user');
}

export function getUser() {
  const u = localStorage.getItem('batipme_user');
  return u ? JSON.parse(u) : null;
}

export function setUser(user) {
  localStorage.setItem('batipme_user', JSON.stringify(user));
}

export async function api(path, options = {}) {
  const { method = 'GET', body, noAuth = false } = options;
  const headers = { 'Content-Type': 'application/json' };
  if (!noAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    return null;
  }

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// ─── Raccourcis ───
export const login = (email, motDePasse) =>
  api('/auth/login', { method: 'POST', body: { email, motDePasse }, noAuth: true });

export const getMe = () => api('/auth/me');

export const updateProfil = (data) => api('/auth/profil', { method: 'PATCH', body: data });
export const changerMotDePasse = (ancienMotDePasse, nouveauMotDePasse) =>
  api('/auth/mot-de-passe', { method: 'PATCH', body: { ancienMotDePasse, nouveauMotDePasse } });

// Projets
export const getProjets = () => api('/projets');
export const getProjet = (id) => api(`/projets/${id}`);
export const createProjet = (data) => api('/projets', { method: 'POST', body: data });
export const updateProjet = (id, data) => api(`/projets/${id}`, { method: 'PATCH', body: data });
export const deleteProjet = (id) => api(`/projets/${id}`, { method: 'DELETE' });

// Planning
export const getTaches = (pid) => api(`/projets/${pid}/taches`);
export const createTache = (pid, data) => api(`/projets/${pid}/taches`, { method: 'POST', body: data });
export const updateTache = (id, data) => api(`/taches/${id}`, { method: 'PATCH', body: data });
export const getJalons = (pid) => api(`/projets/${pid}/jalons`);
export const createJalon = (pid, data) => api(`/projets/${pid}/jalons`, { method: 'POST', body: data });

// Budget
export const getDevis = (pid) => api(`/projets/${pid}/devis`);
export const addLigneDevis = (pid, data) => api(`/projets/${pid}/devis`, { method: 'POST', body: data });
export const getDepenses = (pid) => api(`/projets/${pid}/depenses`);
export const addDepense = (pid, data) => api(`/projets/${pid}/depenses`, { method: 'POST', body: data });
export const getAvenants = (pid) => api(`/projets/${pid}/avenants`);
export const addAvenant = (pid, data) => api(`/projets/${pid}/avenants`, { method: 'POST', body: data });
export const getBudgetKpi = (pid) => api(`/projets/${pid}/budget`);

// Ressources
export const getPersonnel = () => api('/personnel');
export const createPersonnel = (data) => api('/personnel', { method: 'POST', body: data });
export const getPointages = (pid) => api(`/projets/${pid}/pointages`);
export const createPointage = (pid, data) => api(`/projets/${pid}/pointages`, { method: 'POST', body: data });
export const getEngins = () => api('/engins');
export const createEngin = (data) => api('/engins', { method: 'POST', body: data });
export const getSousTraitants = () => api('/sous-traitants');
export const createSousTraitant = (data) => api('/sous-traitants', { method: 'POST', body: data });

// Suivi chantier
export const getJournaux = (pid) => api(`/projets/${pid}/journaux`);
export const createJournal = (pid, data) => api(`/projets/${pid}/journaux`, { method: 'POST', body: data });
export const getIncidents = (pid) => api(`/projets/${pid}/incidents`);
export const createIncident = (pid, data) => api(`/projets/${pid}/incidents`, { method: 'POST', body: data });

// Documents
export const getDocuments = (pid) => api(`/projets/${pid}/documents`);
export const createDocument = (pid, data) => api(`/projets/${pid}/documents`, { method: 'POST', body: data });
export const getExpirations = () => api('/documents/expirations');

// Approvisionnement
export const getFournisseurs = () => api('/fournisseurs');
export const createFournisseur = (data) => api('/fournisseurs', { method: 'POST', body: data });
export const getBonsCommande = (pid) => api(`/projets/${pid}/bons-commande`);
export const createBonCommande = (pid, data) => api(`/projets/${pid}/bons-commande`, { method: 'POST', body: data });
export const getStock = (pid) => api(`/projets/${pid}/stock`);
export const createMouvement = (pid, data) => api(`/projets/${pid}/stock`, { method: 'POST', body: data });

// Facturation
export const getSituations = (pid) => api(`/projets/${pid}/situations`);
export const createSituation = (pid, data) => api(`/projets/${pid}/situations`, { method: 'POST', body: data });
export const getRecapitulatif = (pid) => api(`/projets/${pid}/situations/recapitulatif`);

// Dashboard
export const getDashboardGlobal = () => api('/dashboard');
export const getDashboardProjet = (pid) => api(`/dashboard/projets/${pid}`);

// Admin
export const getUtilisateurs = () => api('/admin/utilisateurs');
export const createUtilisateur = (data) => api('/admin/utilisateurs', { method: 'POST', body: data });
export const deleteUtilisateur = (id) => api(`/admin/utilisateurs/${id}`, { method: 'DELETE' });
