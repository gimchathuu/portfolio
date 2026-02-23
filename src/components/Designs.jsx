import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const categories = [
  "All",
  "Event Flyers",
  "Social Media Designs",
  "Educational Flyers",
  "Creative Posters",
  "Branding Designs"
];

const Designs = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(6);

  useEffect(() => {
    const q = query(collection(db, "designs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDesigns(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching designs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredDesigns = activeCategory === "All"
    ? designs
    : designs.filter(design => design.category === activeCategory);

  const displayedDesigns = filteredDesigns.slice(0, visibleItems);

  return (
    <section id="designs" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Design <span className="text-accent-purple text-glow">Gallery</span></h2>
          <p className="text-white/50 text-lg">Visual storytelling and creative communication through graphic design.</p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === cat
                ? "bg-accent-purple text-white border-accent-purple shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                : "bg-surface text-white/50 border-white/5 hover:border-white/20 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-4">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-xl font-medium">Fetching gallery...</p>
          </div>
        ) : displayedDesigns.length > 0 ? (
          <motion.div
            layout
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedDesigns.map((design, index) => (
                <motion.div
                  key={design.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden"
                  onClick={() => setSelectedImage(design)}
                >
                  <img
                    src={design.imageUrl || design.image}
                    alt={design.title}
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                    <ZoomIn className="text-white mb-2" size={32} />

                    <p className="text-white/70 text-sm">{design.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-white/5">
            <p className="text-white/30 text-lg">No designs found in this category yet.</p>
          </div>
        )}

        {/* See More Button */}
        {!loading && filteredDesigns.length > visibleItems && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleItems(prev => prev + 6)}
              className="px-10 py-4 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all font-bold text-lg"
            >
              See More Designs
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-10 right-10 text-white/50 hover:text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.div
              layoutId={selectedImage.title}
              className="max-w-4xl w-full h-full flex flex-col items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl || selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <div className="mt-4 text-center">

                <p className="text-white/50 text-sm md:text-base">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Designs;
