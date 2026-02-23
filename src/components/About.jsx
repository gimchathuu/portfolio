import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 bg-surface/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Turning Ideas into <span className="text-primary-glow">Digital Reality</span>
            </h2>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed">
              <p>
                Motivated IT undergraduate with strong skills in UI/UX design and
                frontend development, passionate about creating user-friendly
                and visually clear digital applications.
              </p>
              <p>
                Experienced in designing responsive interfaces, interactive user flows,
                and engaging web experiences through academic and personal projects.
                Eager to learn, improve skills, and contribute effectively as an intern.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-primary-glow font-bold text-lg mb-1">🎓 Education</h4>
                <p className="text-white/50 text-sm">BSc IT · Rajarata University</p>
                <p className="text-white/40 text-xs mt-1">2021 – Present</p>
              </div>
              <div>
                <h4 className="text-secondary-glow font-bold text-lg mb-1">🌐 Languages</h4>
                <p className="text-white/50 text-sm">English &amp; Sinhala</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 p-2 relative group">
              <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center overflow-hidden border border-white/5 relative">
                <img
                  src="/Gimhani.JPG"
                  alt="Gimhani Kumari"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
