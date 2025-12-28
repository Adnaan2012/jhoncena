import { Link, Outlet, useLocation } from 'react-router-dom';
// Note: keeping the local useAuth for now as I can't see the file structure fully to know if I made a hook file.
// Wait, I defined useAuth INSIDE Layout.tsx previously. I should probably move it or just keep it there.
// Let's refactor proper.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, LogOut, User } from 'lucide-react';

export const useAuth = () => {
    const [userId] = useState<string | null>(localStorage.getItem("userId"));
    return userId;
}

export default function Layout() {
    const userId = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            <nav className="fixed top-0 left-0 right-0 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Gamepad2 size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            ARCADE.IO
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/game/tetris" className={`text-sm font-bold transition-colors ${location.pathname.includes('tetris') ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>
                            GAMES
                        </Link>

                        {userId ? (
                            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <User size={16} />
                                    {localStorage.getItem('username')}
                                </div>
                                <button
                                    onClick={() => { localStorage.removeItem("userId"); window.location.reload(); }}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-6 py-2.5 rounded-full bg-white text-slate-900 text-sm font-black hover:bg-slate-200 transition-colors transform hover:scale-105 active:scale-95"
                            >
                                LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 pt-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]" />
            </div>
        </div>
    );
}
