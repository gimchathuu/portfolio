import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderKanban, Globe, Github, Trash2, Edit2, Image as ImageIcon, X } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/projectService';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const initialFormState = {
        title: '',
        description: '',
        image: '',
        tags: '',
        github: '',
        live: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "dvnpwvzs"); // Reusing existing preset
        formData.append("folder", "projects");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dv5hthm2t/image/upload",
            { method: "POST", body: formData }
        );

        if (!res.ok) throw new Error("Cloudinary upload failed");
        const data = await res.json();
        return data.secure_url;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, image: url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Process tags from string to array if needed, or keep as array in state
            const projectData = {
                ...formData,
                tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
            };

            if (currentId) {
                await updateProject(currentId, projectData);
            } else {
                await addProject(projectData);
            }
            setIsEditing(false);
            setFormData(initialFormState);
            setCurrentId(null);
            loadProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description,
            image: project.image,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
            github: project.github,
            live: project.live
        });
        setCurrentId(project.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            try {
                await deleteProject(id);
                loadProjects();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                    Manage Projects
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
                                    <label className="text-sm font-medium text-white/60 ml-1">Project Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="e.g. E-Commerce Platform"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                        placeholder="React, Node.js, Tailwind"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">GitHub URL</label>
                                    <div className="flex items-center bg-surface border border-white/10 rounded-xl px-3 focus-within:border-primary/50">
                                        <Github size={18} className="text-white/40 mr-2" />
                                        <input
                                            type="url"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            className="w-full bg-transparent border-none py-3 outline-none"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Live Demo URL</label>
                                    <div className="flex items-center bg-surface border border-white/10 rounded-xl px-3 focus-within:border-primary/50">
                                        <Globe size={18} className="text-white/40 mr-2" />
                                        <input
                                            type="url"
                                            value={formData.live}
                                            onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                                            className="w-full bg-transparent border-none py-3 outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">Cover Image</label>
                                <div className="flex items-center gap-4">
                                    {formData.image && (
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="project-image-upload"
                                        />
                                        <label
                                            htmlFor="project-image-upload"
                                            className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed border-white/20 cursor-pointer hover:bg-white/5 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <ImageIcon size={18} className="text-white/60" />
                                            <span className="text-white/60">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                        </label>
                                    </div>
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
                                    placeholder="Project details..."
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
                                    disabled={uploading}
                                    className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/80 transition-colors font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {currentId ? 'Update Project' : 'Save Project'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)
                ) : projects.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/5">
                        <p className="text-white/30">No projects found. Add your first project!</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-white/5 rounded-2xl overflow-hidden group"
                        >
                            <div className="relative h-48 overflow-hidden bg-white/5">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <FolderKanban size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white backdrop-blur-md"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg text-white backdrop-blur-md"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-2 truncate">{project.title}</h3>
                                <p className="text-white/60 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-md text-white/50">{tag}</span>
                                    ))}
                                    {Array.isArray(project.tags) && project.tags.length > 3 && (
                                        <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-white/50">+{project.tags.length - 3}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/40">
                                    {project.github && <Github size={16} />}
                                    {project.live && <Globe size={16} />}
                                    {!project.github && !project.live && <span>No links</span>}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectManager;
