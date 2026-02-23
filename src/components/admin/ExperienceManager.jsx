import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, Calendar, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '../../services/experienceService';

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const initialFormState = {
        type: 'work',
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        setLoading(true);
        try {
            const data = await getExperiences();
            setExperiences(data);
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
                await updateExperience(currentId, formData);
            } else {
                await addExperience(formData);
            }
            setIsEditing(false);
            setFormData(initialFormState);
            setCurrentId(null);
            loadExperiences();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (exp) => {
        setFormData({
            type: exp.type,
            organization: exp.organization,
            role: exp.role,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.isCurrent,
            description: exp.description
        });
        setCurrentId(exp.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await deleteExperience(id);
                loadExperiences();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                    Manage Experience
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
                                    <label className="text-sm font-medium text-white/60 ml-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                    >
                                        <option value="work">Work Experience</option>
                                        <option value="volunteer">Volunteering</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Role / Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="e.g. Senior Developer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Organization</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="e.g. Tech Corp"
                                    />
                                </div>
                                <div className="space-y-2 flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                                        <input
                                            type="checkbox"
                                            checked={formData.isCurrent}
                                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/10 bg-surface checked:bg-primary accent-primary"
                                        />
                                        <span className="text-sm font-medium text-white/80">Currently working here</span>
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none placeholder-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">End Date</label>
                                    <input
                                        type="date"
                                        disabled={formData.isCurrent}
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                    placeholder="Describe your responsibilities and achievements..."
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
                                    {currentId ? 'Update Experience' : 'Save Experience'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-white/30">Loading experiences...</div>
                ) : experiences.length === 0 ? (
                    <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/5">
                        <p className="text-white/30">No experience entries found.</p>
                    </div>
                ) : (
                    experiences.map((exp) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                            className="bg-surface/30 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:bg-surface/50 transition-colors group"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${exp.type === 'work'
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>
                                        {exp.type}
                                    </span>
                                    {exp.isCurrent && (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-glow border border-primary/20">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="text-white/60 font-medium mb-4 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {exp.organization}
                                    <span className="mx-2 text-white/20">|</span>
                                    <Calendar size={16} />
                                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                </div>
                                <p className="text-white/70 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                            <div className="flex md:flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                <button
                                    onClick={() => handleEdit(exp)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExperienceManager;
