import { useEffect, useState } from 'react';
import api from '../api/client';

function Dashboard() {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPot, setNewPot] = useState({
    nom: '',
    montant: '',
    periode: 'quotidienne',
    date_debut: new Date().toISOString().split('T')[0],
    regle_sortie: '',
  });

  useEffect(() => {
    api.get('/pots')
      .then(res => {
        setPots(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/pots', {
        ...newPot,
        montant: parseInt(newPot.montant),
      });
      setPots([...pots, res.data]);
      setShowForm(false);
      setNewPot({
        nom: '',
        montant: '',
        periode: 'quotidienne',
        date_debut: new Date().toISOString().split('T')[0],
        regle_sortie: '',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div>
      {/* En‑tête avec bienvenue et widget coût */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '19px' }}>Bonjour, Aïda</h3>
        <div className="cost-widget">📊 Coût des notifications ce mois‑ci : <strong>~1 200 FCFA</strong> (WhatsApp + SMS)</div>
        <button className="btn btn-primary" style={{ minHeight: '48px' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Créer un pot'}
        </button>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>
        🔹 <strong>Aucune installation</strong> pour les membres : ils reçoivent tout par WhatsApp.
      </div>

      {/* Formulaire de création (affiché si showForm est true) */}
      {showForm && (
        <div style={{ background: 'var(--paper)', padding: '24px', borderRadius: '10px', border: '1px solid var(--line)', marginTop: '20px', marginBottom: '24px' }}>
          <div className="app-title">Nouveau pot — paramètres</div>
          <div className="step-indicator">
            <span className="step-dot active">Étape 1/3 : Infos générales</span>
            <span className="step-dot">Étape 2/3 : Règles</span>
            <span className="step-dot">Étape 3/3 : Membres</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Nom du pot</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex. Pot des vendeuses — HLM"
                  value={newPot.nom}
                  onChange={(e) => setNewPot({ ...newPot, nom: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Montant de la cotisation</label>
                <input
                  type="number"
                  className="input"
                  placeholder="1 000 FCFA"
                  value={newPot.montant}
                  onChange={(e) => setNewPot({ ...newPot, montant: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Périodicité</label>
                <select
                  className="input"
                  value={newPot.periode}
                  onChange={(e) => setNewPot({ ...newPot, periode: e.target.value })}
                >
                  <option value="quotidienne">Quotidienne</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuelle">Mensuelle</option>
                </select>
              </div>
              <div className="field">
                <label>Date de début</label>
                <input
                  type="date"
                  className="input"
                  value={newPot.date_debut}
                  onChange={(e) => setNewPot({ ...newPot, date_debut: e.target.value })}
                  required
                />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Règle de sortie</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Un membre qui a déjà retiré son tour doit continuer à cotiser jusqu'à la fin du cycle."
                  value={newPot.regle_sortie}
                  onChange={(e) => setNewPot({ ...newPot, regle_sortie: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Enregistrer
            </button>
          </form>
        </div>
      )}

      {/* Liste des pots */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="tontine-grid">
          {pots.length === 0 ? (
            <p>Aucun pot pour le moment.</p>
          ) : (
            pots.map(pot => (
              <div key={pot.id} className="tontine-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span className="name">{pot.nom}</span>
                  <span className={`status-pill ${pot.archive ? 'status-ok' : 'status-ok'}`}>
                    {pot.archive ? 'archivé' : 'à jour'}
                  </span>
                </div>
                <div className="meta">
                  {pot.montant} FCFA / {pot.periode} · 0 membres · prochain tour : —
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: pot.archive ? '100%' : '50%' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-sm" style={{ minHeight: '36px' }}>Modifier</button>
                  <button className="btn btn-ghost btn-sm" style={{ minHeight: '36px' }}>Archiver</button>
                  <button className="btn btn-ghost btn-sm" style={{ minHeight: '36px', background: 'var(--indigo-tint)' }}>📅 Ordre des tours</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;