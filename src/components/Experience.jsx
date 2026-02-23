import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Calendar, Building2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import clsx from 'clsx';

const ExperienceCard = ({ role, organization, startDate, endDate, description, type, isCurrent }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative pl-8 md:pl-0"
    >
        {/* Timeline line for mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 md:hidden" />
        <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-primary md:hidden" />

        <div className="bg-surface/30 border border-white/5 p-6 rounded-2xl hover:bg-surface/50 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-glow transition-colors">{role}</h3>
                    <div className="flex items-center gap-2 text-white/60 mt-1">
                        <Building2 size={16} />
                        <span className="font-medium">{organization}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-glow bg-primary/10 px-3 py-1 rounded-full w-fit">
                    <Calendar size={14} />
                    <span>{startDate} - {isCurrent ? 'Present' : endDate}</span>
                </div>
            </div>
            <p className="text-white/60 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {description}
            </p>
        </div>
    </motion.div>
);

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('work'); // 'work' or 'volunteering'

    useEffect(() => {
        const q = query(collection(db, "experience"), orderBy("startDate", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExperiences(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredExperiences = experiences.filter(exp => exp.type === activeTab);

    return (
        <section id="experience" className="py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">My <span className="text-primary-glow">Journey</span></h2>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setActiveTab('work')}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all",
                                activeTab === 'work'
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-surface border border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Briefcase size={18} />
                            Work Experience
                        </button>
                        <button
                            onClick={() => setActiveTab('volunteering')}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all",
                                activeTab === 'volunteering'
                                    ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                                    : "bg-surface border border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Heart size={18} />
                            Volunteering
                        </button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="text-center text-white/30 py-20">Loading experience...</div>
                ) : filteredExperiences.length === 0 ? (
                    <div className="text-center text-white/30 py-20 bg-surface/50 rounded-3xl border border-dashed border-white/5">
                        No {activeTab} experience added yet.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredExperiences.map((exp) => (
                            <ExperienceCard key={exp.id} {...exp} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;
