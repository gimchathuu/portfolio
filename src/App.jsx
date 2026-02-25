import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import About from './components/About';
import Education from './components/Education';
import CircularSkills from './components/CircularSkills';
import Projects from './components/Projects';
import Designs from './components/Designs';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Login from './components/Login';

// Admin Components
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './components/admin/DashboardHome';
import ExperienceManager from './components/admin/ExperienceManager';
import ProjectManager from './components/admin/ProjectManager';
import SkillManager from './components/admin/SkillManager';
import CertificateManager from './components/admin/CertificateManager';
import DesignsManager from './components/admin/DesignsManager';
import ProfileManager from './components/admin/ProfileManager';

const Portfolio = () => (
  <>
    <Navbar />
    <Hero />
    <Experience />
    <About />
    <Education />
    <CircularSkills />
    <Projects />
    <Designs />
    <Certificates />
    <Contact />
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <main className="relative min-h-screen bg-background selection:bg-primary/30 text-white">
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="projects" element={<ProjectManager />} />
                <Route path="skills" element={<SkillManager />} />
                <Route path="certificates" element={<CertificateManager />} />
                <Route path="designs" element={<DesignsManager />} />
                <Route path="profile" element={<ProfileManager />} />
              </Route>
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
