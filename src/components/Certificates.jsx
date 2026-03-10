import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Link, Calendar, Image as ImageIcon } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const CertificateDisplay = ({ image, title }) => {
    const [isPDF, setIsPDF] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Check if it's likely a PDF based on URL
        const likelyPDF = image.includes('/raw/upload/') || image.toLowerCase().endsWith('.pdf');
        if (likelyPDF) {
            setIsPDF(true);
        }
    }, [image]);

    const handleImageError = () => {
        setImageError(true);
        setIsPDF(true);
    };

    if (isPDF) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 transition-all cursor-pointer group/pdf border border-red-500/20 hover:border-red-500/40" onClick={() => window.open(image, '_blank')}>
                <div className="bg-red-500/20 rounded-full p-3 mb-3 group-hover/pdf:bg-red-500/30 transition-colors">
                    <Award size={32} className="text-red-400 group-hover/pdf:text-red-300 transition-colors" />
                </div>
                <span className="text-sm font-medium text-white/70 group-hover/pdf:text-white/90 transition-colors">PDF Certificate</span>
                <span className="text-xs text-white/50 mt-1 group-hover/pdf:text-white/60 transition-colors">Click to view</span>
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
        />
    );
};

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-background border border-white/5 rounded-2xl hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col h-full"
                            >
                                {/* Certificate Image */}
                                <div className="relative h-48 overflow-hidden bg-white/5">
                                    {cert.image ? (
                                        <CertificateDisplay image={cert.image} title={cert.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Award size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

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
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
