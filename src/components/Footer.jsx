import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 text-center">
      <h3 className="text-xl font-bold mb-4">Connect with me</h3>
      <div className="flex justify-center gap-6 mb-4">
        <a href="https://www.linkedin.com/in/gimhani-chathurika-kumari" className="text-blue-600 hover:text-blue-400 transition" target="_blank" rel="noopener noreferrer"><FaLinkedin size={30} /></a>
        <a href="https://github.com/gimchathuu" className="text-gray-300 hover:text-gray-100 transition" target="_blank" rel="noopener noreferrer"><FaGithub size={30} /></a>
        <a href="mailto:gimhanichathurikakumari@gmail.com" className="text-red-500 hover:text-red-400 transition"><FaEnvelope size={30} /></a>
      </div>
      <p className="text-gray-400 mb-2">© 2026 Gimhani Kumari. All rights reserved.</p>
      <Link to="/login" className="text-white/10 hover:text-white/30 text-xs transition-colors">Admin Login</Link>
    </footer>
  );
}
