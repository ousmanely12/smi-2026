import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjets, getJournaux, createJournal, getIncidents, createIncident } from '../../api/api';
import { Plus, X, CloudSun, AlertTriangle } from 'lucide-react';

const emptyJournal = {
    date: '', meteo: 'ensoleille', temperature: '', nombreOuvriers: '',
    travauxRealises: '', materiaux_receptionnes: '', visitesDuJour: '', observations: '', redige_par: '',
};
const emptyIncident = {
    date: '', type: 'securite', gravite: 'faible', description: '', actionsCorrectives: '', declareCss: false, declarePar: '',
};

const meteoLabels = { ensoleille: 'Ensoleillé', nuageux: 'Nuageux', pluie: 'Pluie', harmattan: 'Harmattan', orage: 'Orage' };
const typeLabels = { securite: 'Sécurité', qualite: 'Qualité', materiel: 'Matériel', approvisionnement: 'Approvisionnement', autre: 'Autre' };
const graviteBadge = { faible: 'badge-gray', moyen: 'badge-amber', grave: 'badge-blue', critique: 'badge-red' };

export default function SuiviChantier() {
    const [projets, setProjets] = useState([]);
    const [projetId, setProjetId] = useState('');
    const [journaux, setJournaux] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('journal');
    const [showModal, setShowModal] = useState(false);
    const [formJournal, setFormJournal] = useState(emptyJournal);
    const [formIncident, setFormIncident] = useState(emptyIncident);
    const navigate = useNavigate();

    useEffect(() => {
        getProjets().then(list => {
            setProjets(list);
            if (list.length > 0) setProjetId(list[0].id);
            else setLoading(false);
        });
    }, []);

    const loadProjetData = (pid) => {
        setLoading(true);
        Promise.all([getJournaux(pid), getIncidents(pid)])
            .then(([j, i]) => { setJournaux(j); setIncidents(i); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { if (projetId) loadProjetData(projetId); }, [projetId]);

    const handleAddJournal = async (e) => {
        e.preventDefault();
        await createJournal(projetId, {
            ...formJournal,
            temperature: formJournal.temperature ? Number(formJournal.temperature) : undefined,
            nombreOuvriers: Number(formJournal.nombreOuvriers) || 0,
        });
        setShowModal(false);
        setFormJournal(emptyJournal);
        loadProjetData(projetId);
    };

    const handleAddIncident = async (e) => {
        e.preventDefault();
        await createIncident(projetId, formIncident);
        setShowModal(false);
        setFormIncident(emptyIncident);
        loadProjetData(projetId);
    };

    if (projets.length === 0 && !loading) {
        return (
            <div>
                <div className="page-header"><div><h1>Suivi Chantier</h1></div></div>
                <div className="empty-state">
                    <p>Aucun projet trouvé. Crée d'abord un projet pour suivre son chantier.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/projets')}>Aller aux projets</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Suivi Chantier</h1>
                    <p className="subtitle">Journal de chantier et incidents par projet</p>
                </div>
                <select className="form-select" style={{ maxWidth: 320 }} value={projetId} onChange={e => setProjetId(e.target.value)}>
                    {projets.map(p => <option key={p.id} value={p.id}>{p.reference} — {p.intitule}</option>)}
                </select>
            </div>

            {loading ? <div className="spinner" /> : (
                <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        <button className={`btn btn-sm ${tab === 'journal' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('journal')}>
                            Journal de chantier ({journaux.length})
                        </button>
                        <button className={`btn btn-sm ${tab === 'incidents' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('incidents')}>
                            Incidents ({incidents.length})
                        </button>
                    </div>

                    <div className="page-header" style={{ marginBottom: 12 }}>
                        <div />
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={18} /> {tab === 'journal' ? 'Rapport journalier' : 'Incident'}
                        </button>
                    </div>

                    {tab === 'journal' ? (
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="data-table">
                                <thead>
                                    <tr><th>Date</th><th>Météo</th><th>Ouvriers</th><th>Travaux réalisés</th><th>Rédigé par</th></tr>
                                </thead>
                                <tbody>
                                    {journaux.map(j => (
                                        <tr key={j.id}>
                                            <td>{new Date(j.date).toLocaleDateString('fr-FR')}</td>
                                            <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CloudSun size={14} />{meteoLabels[j.meteo] || '—'}</span></td>
                                            <td>{j.nombreOuvriers}</td>
                                            <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.travauxRealises || '—'}</td>
                                            <td>{j.redige_par || '—'}</td>
                                        </tr>
                                    ))}
                                    {journaux.length === 0 && (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Aucun rapport journalier</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="data-table">
                                <thead>
                                    <tr><th>Date</th><th>Type</th><th>Gravité</th><th>Description</th><th>CSS déclaré</th></tr>
                                </thead>
                                <tbody>
                                    {incidents.map(i => (
                                        <tr key={i.id}>
                                            <td>{new Date(i.date).toLocaleDateString('fr-FR')}</td>
                                            <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14} />{typeLabels[i.type] || i.type}</span></td>
                                            <td><span className={`badge ${graviteBadge[i.gravite] || 'badge-gray'}`}>{i.gravite}</span></td>
                                            <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.description}</td>
                                            <td>{i.declareCss ? 'Oui' : 'Non'}</td>
                                        </tr>
                                    ))}
                                    {incidents.length === 0 && (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Aucun incident enregistré</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {showModal && tab === 'journal' && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nouveau rapport journalier</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddJournal}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input className="form-input" type="date" required value={formJournal.date} onChange={e => setFormJournal({ ...formJournal, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Météo</label>
                                    <select className="form-select" value={formJournal.meteo} onChange={e => setFormJournal({ ...formJournal, meteo: e.target.value })}>
                                        {Object.entries(meteoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Température (°C)</label>
                                    <input className="form-input" type="number" value={formJournal.temperature} onChange={e => setFormJournal({ ...formJournal, temperature: e.target.value })} placeholder="32" />
                                </div>
                                <div className="form-group">
                                    <label>Nombre d'ouvriers *</label>
                                    <input className="form-input" type="number" required value={formJournal.nombreOuvriers} onChange={e => setFormJournal({ ...formJournal, nombreOuvriers: e.target.value })} placeholder="15" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Travaux réalisés</label>
                                <textarea className="form-input" rows="3" value={formJournal.travauxRealises} onChange={e => setFormJournal({ ...formJournal, travauxRealises: e.target.value })} placeholder="Coulage dalle RDC, pose coffrage..." />
                            </div>
                            <div className="form-group">
                                <label>Matériaux réceptionnés</label>
                                <textarea className="form-input" rows="2" value={formJournal.materiaux_receptionnes} onChange={e => setFormJournal({ ...formJournal, materiaux_receptionnes: e.target.value })} placeholder="50 sacs de ciment, 10 tonnes de fer..." />
                            </div>
                            <div className="form-group">
                                <label>Visites du jour</label>
                                <input className="form-input" value={formJournal.visitesDuJour} onChange={e => setFormJournal({ ...formJournal, visitesDuJour: e.target.value })} placeholder="Maître d'œuvre, client..." />
                            </div>
                            <div className="form-group">
                                <label>Observations</label>
                                <textarea className="form-input" rows="2" value={formJournal.observations} onChange={e => setFormJournal({ ...formJournal, observations: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Rédigé par</label>
                                <input className="form-input" value={formJournal.redige_par} onChange={e => setFormJournal({ ...formJournal, redige_par: e.target.value })} placeholder="Nom du conducteur de travaux" />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary"><Plus size={16} /> Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showModal && tab === 'incidents' && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Déclarer un incident</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddIncident}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input className="form-input" type="date" required value={formIncident.date} onChange={e => setFormIncident({ ...formIncident, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select className="form-select" value={formIncident.type} onChange={e => setFormIncident({ ...formIncident, type: e.target.value })}>
                                        {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Gravité *</label>
                                <select className="form-select" value={formIncident.gravite} onChange={e => setFormIncident({ ...formIncident, gravite: e.target.value })}>
                                    <option value="faible">Faible</option>
                                    <option value="moyen">Moyen</option>
                                    <option value="grave">Grave</option>
                                    <option value="critique">Critique</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea className="form-input" rows="3" required value={formIncident.description} onChange={e => setFormIncident({ ...formIncident, description: e.target.value })} placeholder="Chute d'un ouvrier depuis un échafaudage..." />
                            </div>
                            <div className="form-group">
                                <label>Actions correctives</label>
                                <textarea className="form-input" rows="2" value={formIncident.actionsCorrectives} onChange={e => setFormIncident({ ...formIncident, actionsCorrectives: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                                    <input type="checkbox" id="declareCss" checked={formIncident.declareCss} onChange={e => setFormIncident({ ...formIncident, declareCss: e.target.checked })} />
                                    <label htmlFor="declareCss" style={{ margin: 0 }}>Déclaré à la CSS</label>
                                </div>
                                <div className="form-group">
                                    <label>Déclaré par</label>
                                    <input className="form-input" value={formIncident.declarePar} onChange={e => setFormIncident({ ...formIncident, declarePar: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary"><Plus size={16} /> Déclarer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}