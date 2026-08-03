import { useState, useEffect } from 'react';
import api from '../api/client';

function Attestations() {
  const [membres, setMembres] = useState([]);
  const [selectedMembre, setSelectedMembre] = useState('');
  const [periode, setPeriode] = useState('');

  useEffect(() => {
    api.get('/pots').then(res => {
      const firstPot = res.data[0];
      if (firstPot) {
        api.get(`/pots/${firstPot.id}/membres`).then(res2 => setMembres(res2.data));
      }
    });
  }, []);

  const genererAttestation = async () => {
    if (!selectedMembre || !periode) return alert('Veuillez remplir tous les champs.');
    try {
      const response = await api.post('/pdf/attestation', {
        membre_id: selectedMembre,
        periode: periode,
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attestation_${selectedMembre}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Erreur lors de la génération');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--indigo-dark)', marginBottom: 16 }}>Attestations</h2>

      <div style={{ background: 'var(--paper)', padding: 24, borderRadius: 10, border: '1px solid var(--line)', marginBottom: 24 }}>
        <div className="form-grid">
          <div className="field">
            <label>Membre</label>
            <select value={selectedMembre} onChange={(e) => setSelectedMembre(Number(e.target.value))} className="input">
              <option value="">Sélectionner un membre</option>
              {membres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Période</label>
            <input type="text" className="input" placeholder="Ex: 01/07/2026 – 31/07/2026" value={periode} onChange={(e) => setPeriode(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={genererAttestation} style={{ marginTop: 16 }}>Générer l'attestation PDF</button>
      </div>

      <div className="attestation-wrap">
        <div className="attestation-pdf">
          <div style={{ fontWeight: 600, fontSize: 13 }}>Attestation de participation</div>
          <div style={{ color: 'var(--ink-soft)', marginTop: 2 }}>Pot des vendeuses — HLM</div>
          <hr />
          <div>Membre : <strong>Fatou Diop</strong></div>
          <div>Période : 01/07/2026 – 31/07/2026 (Heure locale Dakar)</div>
          <div>Total cotisé : <strong>31 000 FCFA</strong></div>
          <div>Aucun défaut de paiement.</div>
          <div className="stamp">✓ Registre vérifié · Réf. OP-039 à OP-041</div>
          <div style={{ fontSize: 9, color: 'var(--ink-soft)', marginTop: 8 }}>Document scellé (SHA-256).</div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', maxWidth: 320 }}>
          Document généré à partir du registre inaltérable. Présentable en banque ou aux autorités.
        </div>
      </div>
    </div>
  );
}

export default Attestations;