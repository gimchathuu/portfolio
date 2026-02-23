import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Link, Calendar } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "certificates"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCertificates(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <section id="certificates" className="py-24 bg-surface/50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Certificates & <span className="text-secondary-glow">Learning</span></h2>
                    <p className="text-white/50 text-lg">Continuous growth through specialized courses and workshops.</p>
                </motion.div>

                {loading ? (
                    <div className="text-center text-white/30 py-20">Loading certificates...</div>
                ) : certificates.length === 0 ? (
                    <div className="text-center text-white/30 py-20 bg-surface/50 rounded-3xl border border-dashed border-white/5">
                        No certificates added yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-background border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                                <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit text-primary-glow">
                                    <Award size={24} />
                                </div>

                                <span className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">{cert.date}</span>
                                <h3 className="text-xl font-bold mb-2 text-white/90">{cert.title}</h3>
                                <p className="text-primary-glow font-medium text-sm mb-4">{cert.issuer}</p>
                                <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow">{cert.description}</p>

                                {cert.link && (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors mt-auto"
                                    >
                                        <Link size={14} />
                                        Verify Credential
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
