import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Calendar, Award, ChevronDown } from 'lucide-react';

const educationData = [
    {
        id: 1,
        institution: 'Rajarata University of Sri Lanka',
        degree: 'Bachelor of Science — BSc, Information Technology',
        period: 'Sep 2022 – Present',
        grade: null,
        isCurrent: true,
        description: null,
        activities: null,
    },
    {
        id: 2,
        institution: 'Wayamba University of Sri Lanka',
        degree: 'Diploma of Education, Information Technology',
        period: 'Jan 2019 – Dec 2019',
        grade: 'Merit Pass',
        isCurrent: false,
        description:
            'Completed a Diploma in Information Technology at Wayamba University of Sri Lanka, gaining comprehensive knowledge and skills in various IT disciplines. As part of my coursework, I undertook a web development project for the LK Flower website — a fully functional, user-friendly platform for showcasing and selling floral products.',
        activities:
            'Actively participated in the university\'s IT club, collaborating on tech-related projects and events. Attended workshops and seminars to stay updated with the latest industry trends.',
    },
    {
        id: 3,
        institution: 'Central College Kuliyapitiya',
        degree: 'Advanced Level — Physical Science Stream',
        period: 'Jan 2011 – Dec 2019',
        grade: 'Physical Science Stream',
        isCurrent: false,
        description: null,
        activities: null,
    },
    {
        id: 4,
        institution: 'Bibiladeniya Central College',
        degree: 'Primary Education, General Studies',
        period: 'Jan 2006 – Dec 2010',
        grade: null,
        isCurrent: false,
        description: null,
        activities:
            'Active member of the Cub Scouts, developing leadership and teamwork skills. Served as a Junior Prefect, enhancing organisational abilities and responsibility.',
    },
];

const EducationCard = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);
    const hasExtra = item.description || item.activities;

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-10"
        >
            {/* Timeline dot */}
            <span className="absolute left-0 top-6 w-4 h-4 rounded-full bg-primary border-2 border-primary/50 shadow-[0_0_10px] shadow-primary/40" />
            {/* Timeline line */}
            {index < educationData.length - 1 && (
                <span className="absolute left-[7px] top-10 bottom-[-2rem] w-px bg-white/10" />
            )}

            <div
                className={`bg-surface/30 border border-white/5 rounded-2xl p-6 hover:border-white/20 hover:bg-surface/50 transition-all group ${hasExtra ? 'cursor-pointer' : ''}`}
                onClick={() => hasExtra && setExpanded(prev => !prev)}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary-glow transition-colors">
                            {item.institution}
                        </h3>
                        <p className="text-white/70 font-medium mt-0.5">{item.degree}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        <span className="flex items-center gap-1.5 text-sm text-primary-glow bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                            <Calendar size={13} />
                            {item.period}
                        </span>
                        {item.grade && (
                            <span className="flex items-center gap-1.5 text-xs text-secondary-glow bg-secondary/10 px-3 py-1 rounded-full whitespace-nowrap">
                                <Award size={12} />
                                {item.grade}
                            </span>
                        )}
                        {item.isCurrent && (
                            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">
                                Current
                            </span>
                        )}
                    </div>
                </div>

                {/* Expandable details */}
                {hasExtra && (
                    <>
                        <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                            />
                            {expanded ? 'Show less' : 'Show more'}
                        </div>
                        <AnimatePresence>
                            {expanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden mt-4 space-y-4"
                                >
                                    {item.description && (
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                    {item.activities && (
                                        <div className="border-l-2 border-primary/30 pl-4">
                                            <p className="text-xs font-semibold text-primary-glow mb-1 uppercase tracking-wider">
                                                Activities &amp; Societies
                                            </p>
                                            <p className="text-white/55 text-sm leading-relaxed">
                                                {item.activities}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </motion.div>
    );
};

const Education = () => (
    <section id="education" className="py-24 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary-glow">
                        <GraduationCap size={28} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold">
                        My <span className="text-primary-glow">Education</span>
                    </h2>
                </div>
                <p className="text-white/40 text-lg max-w-xl mx-auto">
                    Academic journey that shaped my skills and perspective.
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6" />
            </motion.div>

            {/* Timeline */}
            <div className="space-y-8">
                {educationData.map((item, i) => (
                    <EducationCard key={item.id} item={item} index={i} />
                ))}
            </div>
        </div>
    </section>
);

export default Education;
