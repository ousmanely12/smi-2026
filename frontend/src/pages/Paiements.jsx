import { useState, useEffect } from 'react';
import api from '../api/client';

function Paiements() {
  const [pots, setPots] = useState([]);
  const [selectedPot, setSelectedPot] = useState('');
  const [membres, setMembres] = useState([]);
  const [selectedMembre, setSelectedMembre] = useState('');
  const [mode, setMode] = useState('wave');
  const [montant, setMontant] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/pots').then(res => setPots(res.data));
  }, []);

  const loadMembres = (potId) => {
    setSelectedPot(potId);
    api.get(`/pots/${potId}/membres`).then(res => setMembres(res.data));
  };

  const genererLien = async () => {
    if (!selectedMembre || !montant) return alert('Veuillez remplir tous les champs.');
    try {
      const res = await api.post('/paiements/generer-lien', {
        membre_id: selectedMembre,
        mode_paiement: mode,
        montant: parseFloat(montant),
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--indigo-dark)', marginBottom: 16 }}>Paiements</h2>

      <div style={{ background: 'var(--paper)', padding: 24, borderRadius: 10, border: '1px solid var(--line)', marginBottom: 24 }}>
        <div className="form-grid">
          <div className="field">
            <label>Pot</label>
            <select value={selectedPot} onChange={(e) => loadMembres(Number(e.target.value))} className="input">
              <option value="">Sélectionner un pot</option>
              {pots.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Membre</label>
            <select value={selectedMembre} onChange={(e) => setSelectedMembre(Number(e.target.value))} className="input">
              <option value="">Sélectionner un membre</option>
              {membres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Mode de paiement</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="input">
              <option value="wave">Wave</option>
              <option value="orange_money">Orange Money</option>
              <option value="free_money">Free Money</option>
              <option value="especes">Espèces</option>
            </select>
          </div>
          <div className="field">
            <label>Montant (FCFA)</label>
            <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} className="input" placeholder="Ex: 1000" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={genererLien} style={{ marginTop: 16 }}>Générer le lien</button>
      </div>

      {result && (
        <div style={{ background: 'var(--paper)', padding: 24, borderRadius: 10, border: '1px solid var(--indigo)' }}>
          <h3>Lien de paiement généré</h3>
          <p><strong>Référence :</strong> {result.reference}</p>
          <p><strong>Statut :</strong> {result.statut}</p>
          <a href={result.lien_paiement} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>Payer</a>
          <div style={{ marginTop: 12 }}>
            <img src={result.qr_code} alt="QR Code" style={{ width: 150, height: 150 }} />
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setResult(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
}

export default Paiements;