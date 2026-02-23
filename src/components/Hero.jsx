import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';



const Home = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "profile"), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <h2 className="text-xl md:text-2xl font-medium text-primary-glow mb-4">
            Hi, I'm
          </h2>
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight">
            {profile.name || 'Gimhani Chathurika Kumari'}
          </h1>

          <div className="text-2xl md:text-4xl font-semibold text-white/80 mb-8 h-12">
            {profile.tagline ? (
              <span>{profile.tagline}</span>
            ) : (
              <TypeAnimation
                sequence={[
                  'Graphic Designer',
                  2000,
                  'UI/UX Designer',
                  2000,
                  'Frontend Developer',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            )}
          </div>

          <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 leading-relaxed">
            {profile.bio || "A creative problem-solver passionate about building beautiful, user-centric digital experiences."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-8 py-3 bg-primary hover:bg-primary/80 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Contact Me
            </a>
            {profile.resumeLink && (
              <a
                href={profile.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-secondary/20 hover:bg-secondary/30 text-white border border-secondary/50 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                Resume
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white/40 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
