import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Helper to get icon component by name
const getIcon = (iconName) => {
    const Icon = LucideIcons[iconName];
    return Icon ? Icon : LucideIcons.Code2; // Default to Code2 if not found
};

const SkillCard = ({ name, iconName, color }) => {
    const Icon = getIcon(iconName);
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-surface border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all group"
        >
            <div className={`mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-white/10 transition-colors ${color}`}>
                <Icon size={28} />
            </div>
            <h3 className="text-white/90 font-medium text-lg">{name}</h3>
        </motion.div>
    );
};

const SkillsTools = () => {
    const [skillsData, setSkillsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Assuming skills have an 'order' field or fallback to createdAt. Using createdAt desc for now or just default.
        const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSkillsData(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const skills = skillsData.filter(item => item.type === 'skill');
    const tools = skillsData.filter(item => item.type === 'tool');

    if (loading) return <div className="py-24 text-center text-white/30">Loading skills...</div>;

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div id="skills" className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional <span className="text-primary-glow">Skills</span></h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </motion.div>

                    {skills.length === 0 ? (
                        <p className="text-white/30">No skills added yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {skills.map((skill) => (
                                <SkillCard key={skill.id} {...skill} />
                            ))}
                        </div>
                    )}
                </div>

                <div id="tools">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Core <span className="text-secondary-glow">Tools</span></h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-secondary to-primary rounded-full" />
                    </motion.div>

                    {tools.length === 0 ? (
                        <p className="text-white/30">No tools added yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {tools.map((tool) => (
                                <SkillCard key={tool.id} {...tool} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SkillsTools;
