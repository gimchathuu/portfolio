import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    FolderKanban,
    Wrench,
    Award,
    LogOut,
    Image as ImageIcon,
    User
} from 'lucide-react';

const AdminLayout = () => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/experience', label: 'Experience', icon: Briefcase },
        { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
        { path: '/admin/skills', label: 'Skills', icon: Wrench },
        { path: '/admin/certificates', label: 'Certificates', icon: Award },
        { path: '/admin/designs', label: 'Designs', icon: ImageIcon },
        { path: '/admin/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface/50 border-r border-white/5 backdrop-blur-xl hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-white/40 mt-1 truncate">{currentUser?.email}</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-primary/20 text-primary-glow font-medium'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar overlay could go here */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
