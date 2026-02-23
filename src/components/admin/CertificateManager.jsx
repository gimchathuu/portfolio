import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Award, Calendar, Trash2, Edit2, Link, X } from 'lucide-react';
import { getCertificates, addCertificate, updateCertificate, deleteCertificate } from '../../services/certificateService';

const CertificateManager = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const initialFormState = {
        title: '',
        issuer: '',
        date: '',
        description: '',
        link: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        setLoading(true);
        try {
            const data = await getCertificates();
            setCertificates(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentId) {
                await updateCertificate(currentId, formData);
            } else {
                await addCertificate(formData);
            }
            setIsEditing(false);
            setFormData(initialFormState);
            setCurrentId(null);
            loadCertificates();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (cert) => {
        setFormData({
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            description: cert.description,
            link: cert.link || ''
        });
        setCurrentId(cert.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this certificate?')) {
            try {
                await deleteCertificate(id);
                loadCertificates();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                    Manage Certificates
                </h1>
                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setFormData(initialFormState);
                        setCurrentId(null);
                    }}
                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                    {isEditing ? <X size={18} /> : <Plus size={18} />}
                    {isEditing ? 'Cancel' : 'Add New'}
                </button>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="bg-surface/50 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Certificate Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="e.g. Advanced React Patterns"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Issuing Organization</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.issuer}
                                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="e.g. Frontend Masters"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Date / Year</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Verification Link (optional)</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                    placeholder="Brief details about what was learned..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(initialFormState);
                                        setCurrentId(null);
                                    }}
                                    className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/80 transition-colors font-medium shadow-lg shadow-primary/20"
                                >
                                    {currentId ? 'Update Certificate' : 'Save Certificate'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)
                ) : certificates.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/5">
                        <p className="text-white/30">No certificates added yet.</p>
                    </div>
                ) : (
                    certificates.map((cert) => (
                        <motion.div
                            key={cert.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-white/5 p-6 rounded-2xl flex flex-col group hover:border-white/20 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-primary-glow">
                                    <Award size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(cert)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(cert.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">{cert.date}</span>
                            <h3 className="text-xl font-bold mb-1 text-white/90">{cert.title}</h3>
                            <p className="text-primary-glow font-medium text-sm mb-3">{cert.issuer}</p>
                            <p className="text-white/50 text-sm leading-relaxed mb-4 flex-grow">{cert.description}</p>

                            {cert.link && (
                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors"
                                >
                                    <Link size={14} />
                                    Verify Credential
                                </a>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CertificateManager;
