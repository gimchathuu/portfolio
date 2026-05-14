import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, FolderKanban, FileText, X, ArrowLeft, ZoomIn, Download, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/* ─────────────────────────────────────────────
   PDF Viewer Modal
───────────────────────────────────────────── */
const PdfViewer = ({ project, onClose }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Google Docs viewer handles large PDFs from any URL reliably
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(project.pdf)}&embedded=true`;

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: 'rgba(6,6,15,0.98)', backdropFilter: 'blur(12px)' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-white/80 hover:text-white group flex-shrink-0"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="h-5 w-px bg-white/10 flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={18} className="text-primary-glow flex-shrink-0" />
              <span className="text-white font-semibold truncate">{project.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {/* Download / open original */}
            <a
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-white/70 hover:text-white text-sm"
              title="Download PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF area */}
        <div className="flex-1 overflow-hidden p-4 relative">
          {/* Loading overlay */}
          {!iframeLoaded && (
            <div className="absolute inset-4 flex flex-col items-center justify-center gap-4 z-10 rounded-2xl bg-surface/80 border border-white/10">
              <Loader2 size={40} className="text-primary-glow animate-spin" />
              <div className="text-center">
                <p className="text-white font-medium mb-1">Loading PDF…</p>
                <p className="text-white/40 text-sm">Large files may take a moment</p>
              </div>
              <a
                href={project.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary-glow text-sm font-medium transition-all"
              >
                <ExternalLink size={15} />
                Open PDF in new tab
              </a>
            </div>
          )}

          <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              key={googleDocsUrl}
              src={googleDocsUrl}
              title={project.title}
              className="w-full h-full"
              style={{ border: 'none', background: '#1a1a2e' }}
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Project Detail Modal (gallery lightbox)
───────────────────────────────────────────── */
const ProjectDetail = ({ project, onClose, onViewPdf }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: 'rgba(6,6,15,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/70 transition-all"
          >
            <X size={18} />
          </button>

          {/* Cover image */}
          <div className="relative h-56 flex-shrink-0 bg-white/5 overflow-hidden">
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <FolderKanban size={64} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold mb-3 text-white">{project.title}</h2>
            <p className="text-white/60 leading-relaxed mb-6">{project.description}</p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.pdf && (
                <button
                  onClick={onViewPdf}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary-glow text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                >
                  <FileText size={18} />
                  View PDF
                </button>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/80 hover:text-white"
                >
                  <Github size={18} />
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/80 hover:text-white"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Project Gallery Card
───────────────────────────────────────────── */
const ProjectCard = ({ project, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -6 }}
    transition={{ duration: 0.3 }}
    onClick={() => onSelect(project)}
    className="group cursor-pointer bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col h-full shadow-lg hover:shadow-primary/10"
  >
    {/* Image area */}
    <div className="relative h-52 overflow-hidden bg-white/5 flex-shrink-0">
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/20">
          <FolderKanban size={48} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />

      {/* PDF badge */}
      {project.pdf && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-primary/80 backdrop-blur-md rounded-lg text-xs text-white font-medium">
          <FileText size={12} />
          PDF
        </div>
      )}

      {/* Hover overlay – zoom icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-3 bg-black/50 backdrop-blur-md rounded-full">
          <ZoomIn size={22} className="text-white" />
        </div>
      </div>
    </div>

    {/* Card body */}
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary-glow transition-colors line-clamp-1">{project.title}</h3>
      <p className="text-white/55 text-sm flex-grow mb-4 line-clamp-2">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags && project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-full text-xs text-white/45">
            {tag}
          </span>
        ))}
        {project.tags && project.tags.length > 3 && (
          <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-full text-xs text-white/45">
            +{project.tags.length - 3}
          </span>
        )}
      </div>

      {/* Icon row */}
      <div className="flex items-center gap-3 mt-auto text-white/30">
        {project.github && <Github size={15} />}
        {project.live && <ExternalLink size={15} />}
        {project.pdf && <FileText size={15} className="text-primary-glow/60" />}
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Main Projects Section
───────────────────────────────────────────── */
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pdfProject, setPdfProject] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSelect = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleOpenPdf = useCallback(() => {
    if (selectedProject) {
      setPdfProject(selectedProject);
      setSelectedProject(null);
    }
  }, [selectedProject]);

  const handleClosePdf = useCallback(() => {
    setPdfProject(null);
  }, []);

  return (
    <>
      <section id="projects" className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-primary-glow">Projects</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              A selection of my recent work focusing on solving real-world problems
              with modern technology and thoughtful design.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center text-white/30 py-20 bg-surface/50 rounded-3xl border border-dashed border-white/5">
              No projects added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project detail modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={handleCloseDetail}
          onViewPdf={handleOpenPdf}
        />
      )}

      {/* Full-screen PDF viewer */}
      {pdfProject && (
        <PdfViewer
          project={pdfProject}
          onClose={handleClosePdf}
        />
      )}
    </>
  );
};

export default Projects;
