import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import * as LucideIcons from 'lucide-react';

const CircularSkills = () => {
    const [skillsData, setSkillsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('skill'); // 'skill' or 'tool'
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "skills"), orderBy("createdAt", "asc")); // asc to show older first or use a 'order' field
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSkillsData(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Filter skills by the active category (skill or tool)
    const filteredSkills = skillsData.filter(item => item.type === activeCategory);

    // Reset active index when category changes
    useEffect(() => {
        if (filteredSkills.length > 0) {
            setActiveIndex(0);
        }
    }, [activeCategory, skillsData]);

    if (loading) return <div className="py-24 text-center text-white/30">Loading skills...</div>;
    if (skillsData.length === 0) return null;

    const activeSkill = filteredSkills[activeIndex] || filteredSkills[0];

    // Helper to get skill icon URL (for tech logos)
    const getTechIconUrl = (name) => {
        const lowName = name.toLowerCase().replace(/\s+/g, '');

        // Priority for local icons
        if (lowName === 'canva') return '/canva.png';
        if (lowName === 'microsoftoffice') return '/microsoftoffice.png';

        const mapping = {
            'c#': 'cs', 'c++': 'cpp', 'nodejs': 'nodejs', 'javascript': 'js', 'typescript': 'ts',
            'mongodb': 'mongodb', 'tailwind': 'tailwind', 'html5': 'html', 'css3': 'css',
            'reactjs': 'react', 'nextjs': 'nextjs', 'figma': 'figma',
            'adobephotoshop': 'ps', 'adobeillustrator': 'ai', 'html': 'html', 'css': 'css',
            'tailwindcss': 'tailwind', 'git': 'git', 'github': 'github', 'notion': 'notion',
            'bootstrap': 'bootstrap'
        };
        const slug = mapping[lowName] || lowName.replace(/[.#]/g, (m) => m === '#' ? 'sharp' : 'plus');
        return `https://skillicons.dev/icons?i=${slug}`;
    };

    // Helper to render icon (Tech Logo or Lucide)
    const renderIcon = (skill, size = 10) => {
        const isTool = skill.type === 'tool';

        // Always try tech icon for tools
        if (isTool) {
            return (
                <img
                    src={getTechIconUrl(skill.name)}
                    alt={skill.name}
                    className={`w-${size} h-${size} object-contain`}
                />
            );
        }

        // For skills, check if Lucide icon exists
        const LucideIcon = LucideIcons[skill.iconName];
        if (LucideIcon) {
            return <LucideIcon className={`w-${size} h-${size} ${skill.color || 'text-primary-glow'}`} />;
        }

        // Fallback to name's first letter
        return <span className="font-bold text-xl">{skill.name[0]}</span>;
    };

    return (
        <section className="py-24 relative overflow-hidden bg-background min-h-[850px] flex flex-col items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Header - Centered and Cleaned up */}
            <div className="max-w-4xl w-full px-6 mb-16 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">My <span className="text-primary-glow">Skills</span></h2>

                    {/* Category Switcher */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setActiveCategory('skill')}
                            className={`px-8 py-2.5 rounded-full font-medium transition-all ${activeCategory === 'skill'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface/50 text-white/40 hover:text-white border border-white/5'
                                }`}
                        >
                            Professional Skills
                        </button>
                        <button
                            onClick={() => setActiveCategory('tool')}
                            className={`px-8 py-2.5 rounded-full font-medium transition-all ${activeCategory === 'tool'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface/50 text-white/40 hover:text-white border border-white/5'
                                }`}
                        >
                            Core Tools
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Circular Interface */}
            <div className="relative w-full max-w-[1000px] h-[400px] mt-auto">
                {/* Arc Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] aspect-[2/1] border-t border-white/10 rounded-t-[100%] h-[300px]" />

                {/* Icons along the arc */}
                <AnimatePresence mode="popLayout">
                    {filteredSkills.map((skill, index) => {
                        const total = filteredSkills.length;
                        // Adjust angle step and spacing to fit up to 15 icons comfortably
                        const angleStep = total > 1 ? 160 / (total - 1) : 0;
                        const startAngle = 170;
                        const angle = startAngle - (index * angleStep);
                        const radian = (angle * Math.PI) / 180;

                        // Slightly larger radius for more items
                        const radiusX = 460;
                        const radiusY = 260;

                        const x = Math.cos(radian) * radiusX;
                        const y = -Math.sin(radian) * radiusY;

                        const isActive = index === activeIndex;

                        return (
                            <motion.div
                                key={skill.id}
                                className="absolute left-1/2 bottom-0 cursor-pointer group z-20"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    x: `calc(-50% + ${x}px)`,
                                    y: `${y}px`,
                                    scale: isActive ? 1.5 : 1,
                                    opacity: isActive ? 1 : 0.6,
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                whileHover={{ scale: isActive ? 1.6 : 1.2, opacity: 1 }}
                                onClick={() => setActiveIndex(index)}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className={`
                                    p-3 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 transition-all flex items-center justify-center
                                    ${isActive ? 'border-primary shadow-lg shadow-primary/30' : 'hover:border-white/30'}
                                `}>
                                    {renderIcon(skill, 10)}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Central Highlight Area */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center pb-12 w-full">
                    <AnimatePresence mode="wait">
                        {activeSkill && (
                            <motion.div
                                key={`${activeCategory}-${activeSkill.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
                            >
                                {/* Large Icon with Hexagonal Glow Rendering */}
                                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                                    <div className="relative z-10 w-full h-full p-6 md:p-8 bg-surface border-2 border-primary/50 rounded-[30%] rotate-45 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                                        <div className="-rotate-45 w-full h-full flex items-center justify-center scale-125">
                                            {renderIcon(activeSkill, 20)}
                                        </div>
                                    </div>
                                </div>

                                {/* Skill Description */}
                                <div className="max-w-xs text-center md:text-left">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeSkill.name}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {activeSkill.description || `${activeSkill.name} is one of my core tools for building powerful digital experiences.`}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default CircularSkills;
