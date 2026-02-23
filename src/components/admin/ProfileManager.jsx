import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Upload } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const ProfileManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        bio: '',
        resumeLink: '',
        github: '',
        linkedin: '',
        twitter: '',
        avatar: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'settings', 'profile');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data());
            } else {
                // Initialize if not exists
                console.log("No profile settings found, starting fresh.");
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "dvnpwvzs");
        formData.append("folder", "profile");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dv5hthm2t/image/upload",
            { method: "POST", body: formData }
        );

        if (!res.ok) throw new Error("Cloudinary upload failed");
        const data = await res.json();
        return data.secure_url;
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, avatar: url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Avatar upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'profile'), formData, { merge: true });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white/50 text-center py-20">Loading profile settings...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent mb-8">
                Edit Profile & Home Section
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="bg-surface/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-white/5">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition-opacity text-white font-medium text-xs">
                            Change Photo
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-1">Profile Photo</h3>
                        <p className="text-white/50 text-sm mb-4">Displayed in the Home section and navigation.</p>
                        {uploading && <p className="text-primary-glow text-sm animate-pulse">Uploading...</p>}
                    </div>
                </div>

                {/* Main Info */}
                <div className="bg-surface/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">Tagline</label>
                            <input
                                type="text"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                placeholder="e.g. Creative Developer & Designer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60 ml-1">Short Bio / Introduction</label>
                        <textarea
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                            placeholder="Brief introduction for the Home section..."
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-surface/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6">
                    <h3 className="text-xl font-bold mb-2">Social Links & Resume</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">Resume / CV Link</label>
                            <input
                                type="url"
                                value={formData.resumeLink}
                                onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">GitHub URL</label>
                            <input
                                type="url"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">LinkedIn URL</label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60 ml-1">Twitter / X URL</label>
                            <input
                                type="url"
                                value={formData.twitter}
                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                className="w-full bg-surface border border-white/10 rounded-xl p-3 focus:border-primary/50 outline-none"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 font-bold disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManager;
