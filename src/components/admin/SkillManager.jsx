import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wrench, Code2, Trash2, Edit2, Palette, X } from 'lucide-react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../services/skillService';

const SkillManager = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const initialFormState = {
        name: '',
        type: 'skill', // 'skill' or 'tool'
        color: 'text-white',
        iconName: 'Code2'
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        setLoading(true);
        try {
            const data = await getSkills();
            setSkills(data);
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
                await updateSkill(currentId, formData);
            } else {
                await addSkill(formData);
            }
            setIsEditing(false);
            setFormData(initialFormState);
            setCurrentId(null);
            loadSkills();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (skill) => {
        setFormData({
            name: skill.name,
            type: skill.type || 'skill',
            color: skill.color,
            iconName: skill.iconName || 'Code2'
        });
        setCurrentId(skill.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this skill?')) {
            try {
                await deleteSkill(id);
                loadSkills();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                    Manage Skills & Tools
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
                                    <label className="text-sm font-medium text-white/60 ml-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="React, Figma, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                    >
                                        <option value="skill">Technical Skill</option>
                                        <option value="tool">Tool / Software</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Color Class (Tailwind)</label>
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="text-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Icon Name (Lucide)</label>
                                    <input
                                        type="text"
                                        value={formData.iconName}
                                        onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="Code2, Palette, etc."
                                    />
                                </div>
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
                                    {currentId ? 'Update Skill' : 'Save Skill'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills Column */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Code2 className="text-primary-glow" />
                        Technical Skills
                    </h2>
                    {loading ? (
                        <div className="animate-pulse bg-white/5 h-20 rounded-xl" />
                    ) : skills.filter(s => s.type === 'skill').length === 0 ? (
                        <p className="text-white/30 text-sm">No skills added yet.</p>
                    ) : (
                        skills.filter(s => s.type === 'skill').map(skill => (
                            <SkillsListItem
                                key={skill.id}
                                item={skill}
                                onEdit={() => handleEdit(skill)}
                                onDelete={() => handleDelete(skill.id)}
                            />
                        ))
                    )}
                </div>

                {/* Tools Column */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Wrench className="text-secondary-glow" />
                        Tools & Software
                    </h2>
                    {loading ? (
                        <div className="animate-pulse bg-white/5 h-20 rounded-xl" />
                    ) : skills.filter(s => s.type === 'tool').length === 0 ? (
                        <p className="text-white/30 text-sm">No tools added yet.</p>
                    ) : (
                        skills.filter(s => s.type === 'tool').map(tool => (
                            <SkillsListItem
                                key={tool.id}
                                item={tool}
                                onEdit={() => handleEdit(tool)}
                                onDelete={() => handleDelete(tool.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const SkillsListItem = ({ item, onEdit, onDelete }) => (
    <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-surface/30 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:bg-surface/50 transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 bg-white/5 rounded-lg ${item.color}`}>
                {/* Fallback icon if dynamic loading isn't implemented here yet, showing generic */}
                <span className="font-bold text-lg">{item.name[0]}</span>
            </div>
            <div>
                <h3 className="font-medium text-white">{item.name}</h3>
                <p className="text-xs text-white/40">{item.iconName}</p>
            </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">
                <Edit2 size={16} />
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500 hover:text-red-400">
                <Trash2 size={16} />
            </button>
        </div>
    </motion.div>
);

export default SkillManager;
