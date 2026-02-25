import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Linkedin, Github, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(''); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('');

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });

      // Send email via Resend API
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Let's <span className="text-secondary-glow">Connect</span></h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              I'm always open to discussing new projects, creative ideas or
              opportunities to be part of your vision.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white/80">
                <div className="p-3 bg-white/5 rounded-lg text-primary-glow">
                  <Mail size={20} />
                </div>
                <span>gimhanichathurikakumari1@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="p-3 bg-white/5 rounded-lg text-secondary-glow">
                  <Phone size={20} />
                </div>
                <span>+94 76 422 5736</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="p-3 bg-white/5 rounded-lg text-primary-glow">
                  <MapPin size={20} />
                </div>
                <span>Kuliyapitiya, Sri Lanka</span>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[
                { icon: Github, href: "https://github.com/Gimhani-Kumari", color: "hover:text-white" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/gimhani-chathurika-kumari", color: "hover:text-blue-400" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-white/5 rounded-xl transition-all ${social.color} hover:bg-white/10`}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-2/3"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/50 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/50 ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter Your E-mail Addresss"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-white/50 ml-1">Message</label>
                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors resize-none"
                ></textarea>
              </div>

              {status === 'success' && (
                <div className="md:col-span-2 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-center">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="md:col-span-2 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
                  Failed to send message. Please try again.
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full md:w-fit px-10 py-4 bg-primary hover:bg-primary/80 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Gimhani Kumari. All rights reserved.
            Designed with passion for the digital world.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
