import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';

const categories = [
    "Event Flyers",
    "Social Media Designs",
    "Educational Flyers",
    "Creative Posters",
    "Branding Designs"
];

const DesignsManager = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [category, setCategory] = useState(categories[0]);
    const [files, setFiles] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "designs"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDesigns(data);
        } catch (error) {
            console.error("Error fetching designs:", error);
        } finally {
            setLoading(false);
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "dvnpwvzs");
        formData.append("folder", "designs");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dv5hthm2t/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        if (!res.ok) throw new Error("Cloudinary upload failed");
        const data = await res.json();
        return data.secure_url;
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);

        const uploadPromises = files.map(async (file) => {
            try {
                setProgress(prev => ({ ...prev, [file.name]: 50 }));

                const imageUrl = await uploadToCloudinary(file);

                await addDoc(collection(db, "designs"), {
                    title: file.name.split('.')[0],
                    category: category,
                    imageUrl: imageUrl,
                    createdAt: serverTimestamp()
                });

                setProgress(prev => ({ ...prev, [file.name]: 100 }));
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
            }
        });

        try {
            await Promise.all(uploadPromises);
            setFiles([]);
            setProgress({});
            fetchDesigns();
            alert("Upload successful");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Some uploads failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (design) => {
        if (!window.confirm("Delete this flyer?")) return;
        try {
            await deleteDoc(doc(db, "designs", design.id));
            fetchDesigns();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent mb-8">
                Manage Designs
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Upload Section */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-surface/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Upload className="text-primary-glow" />
                            Quick Upload
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-white/50 mb-3 ml-1">Select Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-surface border border-white/10 rounded-2xl p-4 focus:border-primary/50 outline-none appearance-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-white/50 mb-3 ml-1">Flyer Files (supports multiple)</label>
                                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/30 transition-all cursor-pointer group">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="text-primary-glow" />
                                        </div>
                                        <span className="text-sm font-medium">Click or drag to select</span>
                                        <span className="text-xs text-white/30">{files.length} files selected</span>
                                    </div>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-3">
                                    {files.map((file) => (
                                        <div key={file.name} className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs px-1">
                                                <span className="truncate max-w-[150px]">{file.name}</span>
                                                <span>{progress[file.name] ? `${Math.round(progress[file.name])}%` : 'Ready'}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress[file.name] || 0}%` }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={uploading || files.length === 0}
                                className="w-full bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                            >
                                {uploading ? 'Uploading...' : `Upload ${files.length} Flyers`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Management Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <ImageIcon className="text-secondary-glow" />
                        Manage Existing Flyers
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {designs.map((design) => (
                                    <motion.div
                                        key={design.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-surface"
                                    >
                                        <img
                                            src={design.imageUrl}
                                            alt={design.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                            <p className="text-xs text-secondary-glow font-bold uppercase tracking-wider mb-1">{design.category}</p>
                                            <h4 className="text-sm font-semibold truncate mb-3">{design.title}</h4>
                                            <button
                                                onClick={() => handleDelete(design)}
                                                className="w-full bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold border border-red-500/30"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && designs.length === 0 && (
                        <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/5">
                            <p className="text-white/30">No designs uploaded yet. Start by uploading some flyers!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesignsManager;
