import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfil, setUser } from '../../api/api';
import { User, Save, CheckCircle2 } from 'lucide-react';

const roleLabels = {
    directeur_general: 'Directeur Général',
    directeur_technique: 'Directeur Technique',
    chef_projet: 'Chef de Projet',
    conducteur_travaux: 'Conducteur de Travaux',
    responsable_admin_fin: 'Resp. Admin & Finance',
    magasinier: 'Magasinier',
    maitre_ouvrage_externe: "Maître d'Ouvrage",
};

export default function Profil() {
    const { user, setUser: setAuthUser } = useAuth();
    const [form, setForm] = useState({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        telephone: user?.telephone || '',
        poste: user?.poste || '',
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            const updated = await updateProfil(form);
            const merged = { ...user, ...updated };
            setUser(merged);
            if (setAuthUser) setAuthUser(merged);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Erreur lors de la mise à jour du profil');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Mon Profil</h1>
                    <p className="subtitle">Gérer vos informations personnelles</p>
                </div>
            </div>

            <div className="glass-card" style={{ maxWidth: 560, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                        {user?.prenom?.[0]}{user?.nom?.[0]}
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{user?.prenom} {user?.nom}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</div>
                        <span className="badge badge-blue" style={{ marginTop: 4, display: 'inline-block' }}>{roleLabels[user?.role] || user?.role}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="badge badge-red" style={{ display: 'block', marginBottom: 12, padding: 10 }}>{error}</div>}
                    {success && (
                        <div className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 10 }}>
                            <CheckCircle2 size={14} /> Profil mis à jour avec succès
                        </div>
                    )}
                    <div className="form-row">
                        <div className="form-group"><label>Nom *</label><input className="form-input" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></div>
                        <div className="form-group"><label>Prénom *</label><input className="form-input" required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} /></div>
                    </div>
                    <div className="form-group"><label>Email</label><input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} /></div>
                    <div className="form-row">
                        <div className="form-group"><label>Téléphone</label><input className="form-input" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
                        <div className="form-group"><label>Poste</label><input className="form-input" value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} /></div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </form>
            </div>
        </div>
    );
}