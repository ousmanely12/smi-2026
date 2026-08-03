import { useEffect, useState } from 'react';
import api from '../api/client';

function Membres() {
  const [membres, setMembres] = useState([]);
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPotId, setSelectedPotId] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    adresse: '',
    photo: null,
    consentement: false,
  });
  const [documents, setDocuments] = useState({ recto: null, verso: null });

  // Charger les pots et les membres
  useEffect(() => {
    Promise.all([
      api.get('/pots'),
      // On récupère les membres du premier pot par défaut
      api.get('/pots').then(res => {
        const firstPot = res.data[0];
        if (firstPot) {
          setSelectedPotId(firstPot.id);
          return api.get(`/pots/${firstPot.id}/membres`);
        }
        return Promise.resolve({ data: [] });
      })
    ])
      .then(([potsRes, membresRes]) => {
        setPots(potsRes.data);
        setMembres(membresRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Charger les membres quand le pot change
  const loadMembres = (potId) => {
    setSelectedPotId(potId);
    api.get(`/pots/${potId}/membres`)
      .then(res => setMembres(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPotId) {
      alert('Veuillez sélectionner un pot.');
      return;
    }
    try {
      const form = new FormData();
      form.append('pot_id', selectedPotId);
      form.append('nom', formData.nom);
      form.append('telephone', formData.telephone);
      form.append('adresse', formData.adresse || '');
      if (formData.photo) form.append('photo', formData.photo);
      form.append('consentement', formData.consentement);

      const res = await api.post('/membres', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Ajouter les CNI si présentes
      if (documents.recto) {
        const rectoForm = new FormData();
        rectoForm.append('type', 'cni_recto');
        rectoForm.append('fichier', documents.recto);
        await api.post(`/membres/${res.data.id}/documents`, rectoForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (documents.verso) {
        const versoForm = new FormData();
        versoForm.append('type', 'cni_verso');
        versoForm.append('fichier', documents.verso);
        await api.post(`/membres/${res.data.id}/documents`, versoForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setMembres([...membres, res.data]);
      setShowForm(false);
      setFormData({ nom: '', telephone: '', adresse: '', photo: null, consentement: false });
      setDocuments({ recto: null, verso: null });
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--indigo-dark)' }}>Membres</h2>
        <button className="btn btn-gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Ajouter un membre'}
        </button>
      </div>

      {/* Sélecteur de pot */}
      {pots.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ marginRight: '8px', fontWeight: 500 }}>Pot :</label>
          <select
            value={selectedPotId}
            onChange={(e) => loadMembres(Number(e.target.value))}
            className="input"
            style={{ width: 'auto', minHeight: '48px', padding: '8px 16px' }}
          >
            {pots.map(pot => (
              <option key={pot.id} value={pot.id}>{pot.nom}</option>
            ))}
          </select>
        </div>
      )}

      {/* Formulaire d’ajout */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--paper)', padding: '24px', borderRadius: '10px', border: '1px solid var(--line)', marginBottom: '24px' }}>
          <div className="form-grid">
            <div className="field">
              <label>Nom complet</label>
              <input
                type="text"
                className="input"
                placeholder="Ex. Fatou Diop"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Téléphone</label>
              <input
                type="text"
                className="input"
                placeholder="+221 77 000 00 00"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Adresse</label>
              <input
                type="text"
                className="input"
                placeholder="Ex. HLM Grand Yoff, villa 12"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                className="input"
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Pièce d'identité — Recto</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDocuments({ ...documents, recto: e.target.files[0] })}
                className="input"
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Pièce d'identité — Verso</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDocuments({ ...documents, verso: e.target.files[0] })}
                className="input"
              />
            </div>
            <div className="consent" style={{ gridColumn: '1 / -1' }}>
              <div className="checkbox"></div>
              <label>
                J'ai obtenu le consentement du membre pour conserver sa pièce d'identité (recto et verso), conformément au CDP.
              </label>
              <input
                type="checkbox"
                checked={formData.consentement}
                onChange={(e) => setFormData({ ...formData, consentement: e.target.checked })}
                style={{ marginLeft: '8px' }}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Enregistrer
          </button>
        </form>
      )}

      {/* Liste des membres */}
      {membres.length === 0 ? (
        <p>Aucun membre dans ce pot.</p>
      ) : (
        membres.map(m => (
          <div key={m.id} className="member-row">
            <div className="avatar">{m.nom.charAt(0)}</div>
            <div>
              <div className="member-name">{m.nom}</div>
              <div className="member-phone">📱 {m.telephone}</div>
            </div>
            <div className="spacer"></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" style={{ minHeight: '36px' }}>Voir CNI</button>
              <button className="btn btn-ghost btn-sm" style={{ minHeight: '36px', color: 'var(--brick)' }}>Supprimer</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Membres;