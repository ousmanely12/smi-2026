import { useState, useEffect } from 'react';
import { getProjets, getTaches, createTache, getJalons, createJalon } from '../../api/api';
import { Plus, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const lotOptions = ['terrassement','fondations','gros_oeuvre','charpente','couverture','menuiserie','electricite','plomberie','peinture','carrelage','vrd','espaces_verts','assainissement','climatisation'];

export default function Planning() {
  const [projets, setProjets] = useState([]);
  const [projetId, setProjetId] = useState('');
  const [taches, setTaches] = useState([]);
  const [jalons, setJalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', lot: 'gros_oeuvre', dateDebutPrevue: '', dateFinPrevue: '', dureeJours: '', responsable: '' });

  useEffect(() => { getProjets().then(setProjets); }, []);
  useEffect(() => {
    if (projetId) {
      setLoading(true);
      Promise.all([getTaches(projetId), getJalons(projetId)])
        .then(([t, j]) => { setTaches(t); setJalons(j); })
        .finally(() => setLoading(false));
    }
  }, [projetId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTache(projetId, { ...form, dureeJours: Number(form.dureeJours) || undefined });
    setShowModal(false);
    setForm({ nom: '', lot: 'gros_oeuvre', dateDebutPrevue: '', dateFinPrevue: '', dureeJours: '', responsable: '' });
    const t = await getTaches(projetId);
    setTaches(t);
  };

  const statutIcon = (s) => s === 'terminee' ? <CheckCircle size={16} color="#10b981" /> : s === 'en_cours' ? <Clock size={16} color="#3b82f6" /> : <AlertTriangle size={16} color="#64748b" />;

  return (
    <div>
      <div className="page-header">
        <div><h1>Planning</h1><p className="subtitle">Tâches et jalons par projet</p></div>
        {projetId && <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Nouvelle tâche</button>}
      </div>

      <div className="form-group" style={{ maxWidth: 400 }}>
        <label>Sélectionner un projet</label>
        <select className="form-select" value={projetId} onChange={e => setProjetId(e.target.value)}>
          <option value="">-- Choisir un projet --</option>
          {projets.map(p => <option key={p.id} value={p.id}>{p.reference} — {p.intitule}</option>)}
        </select>
      </div>

      {!projetId && <div className="empty-state"><p>Sélectionnez un projet pour voir son planning</p></div>}
      {loading && <div className="spinner" />}

      {projetId && !loading && (
        <>
          <div className="glass-card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>Tâches ({taches.length})</h3>
            {taches.length > 0 ? (
              <table className="data-table">
                <thead><tr><th></th><th>Tâche</th><th>Lot</th><th>Début</th><th>Fin</th><th>Avancement</th><th>Responsable</th></tr></thead>
                <tbody>
                  {taches.map(t => (
                    <tr key={t.id}>
                      <td>{statutIcon(t.statut)}</td>
                      <td style={{ fontWeight: 600 }}>{t.nom}</td>
                      <td><span className="badge badge-teal">{t.lot}</span></td>
                      <td>{t.dateDebutPrevue}</td>
                      <td>{t.dateFinPrevue}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}><div className={`progress-fill ${t.pourcentageAvancement >= 80 ? 'green' : t.pourcentageAvancement >= 40 ? 'blue' : 'amber'}`} style={{ width: `${t.pourcentageAvancement || 0}%` }} /></div>
                          <span style={{ fontSize: 13 }}>{t.pourcentageAvancement || 0}%</span>
                        </div>
                      </td>
                      <td>{t.responsable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="empty-state"><p>Aucune tâche</p></div>}
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>Jalons ({jalons.length})</h3>
            {jalons.length > 0 ? (
              <table className="data-table">
                <thead><tr><th>Jalon</th><th>Type</th><th>Date prévue</th><th>Statut</th></tr></thead>
                <tbody>
                  {jalons.map(j => (
                    <tr key={j.id}>
                      <td style={{ fontWeight: 600 }}>{j.nom}</td>
                      <td><span className="badge badge-purple">{j.type}</span></td>
                      <td>{j.datePrevu}</td>
                      <td><span className={`badge ${j.atteint ? 'badge-green' : 'badge-amber'}`}>{j.atteint ? 'Atteint' : 'En attente'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="empty-state"><p>Aucun jalon</p></div>}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Nouvelle tâche</h2><button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Nom *</label><input className="form-input" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label>Lot</label><select className="form-select" value={form.lot} onChange={e => setForm({ ...form, lot: e.target.value })}>{lotOptions.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                <div className="form-group"><label>Durée (jours)</label><input className="form-input" type="number" value={form.dureeJours} onChange={e => setForm({ ...form, dureeJours: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Date début</label><input className="form-input" type="date" value={form.dateDebutPrevue} onChange={e => setForm({ ...form, dateDebutPrevue: e.target.value })} /></div>
                <div className="form-group"><label>Date fin</label><input className="form-input" type="date" value={form.dateFinPrevue} onChange={e => setForm({ ...form, dateFinPrevue: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Responsable</label><input className="form-input" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} /></div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button><button type="submit" className="btn btn-primary">Créer</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
