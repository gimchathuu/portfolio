import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FolderKanban } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ProjectCard = ({ title, description, image, tags, github, live }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col h-full"
  >
    <div className="relative h-56 overflow-hidden bg-white/5">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/20">
          <FolderKanban size={48} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      <div className="absolute top-4 right-4 flex gap-2">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/50 backdrop-blur-md rounded-full text-white hover:text-primary-glow transition-colors">
            <Github size={20} />
          </a>
        )}
        {live && (
          <a href={live} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/50 backdrop-blur-md rounded-full text-white hover:text-secondary-glow transition-colors">
            <ExternalLink size={20} />
          </a>
        )}
      </div>
    </div>

    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary-glow transition-colors">{title}</h3>
      <p className="text-white/60 mb-6 flex-grow">{description}</p>

      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags && tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-white/50">
              {tag}
            </span>
          ))}
        </div>

        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
          >
            View Project Case Study
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="projects" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="text-primary-glow">Projects</span></h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            A selection of my recent work focusing on solving real-world problems
            with modern technology and thoughtful design.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-white/30 py-20">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-white/30 py-20 bg-surface/50 rounded-3xl border border-dashed border-white/5">
            No projects added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
