import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, LogOut, User, Crown } from 'lucide-react';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export const useAuth = () => {
    const [userId] = useState<Id<"users"> | null>(localStorage.getItem("userId") as Id<"users"> | null);
    return userId;
}

export default function Layout() {
    const userId = useAuth();
    const location = useLocation();
    const user = useQuery(api.users.getUser, userId ? { userId } : "skip");
    const createCheckout = useAction(api.stripe.createCheckoutSession);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        if (!userId) return;
        setIsUpgrading(true);
        try {
            const url = await createCheckout({ userId });
            if (url) window.location.href = url;
        } catch (err) {
            console.error(err);
            alert("Failed to start checkout. Check console.");
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
            {/* Perspective Environment */}
            <div className="mesh-container">
                <div className="mesh-gradient" />
            </div>
            <div className="cyber-grid" />

            {/* Glowing Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-16 glass rounded-2xl z-50 flex items-center px-8 justify-between shadow-2xl border-white/5">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <Gamepad2 size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
                        ARCADE.IO
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link to="/" className={`text-xs font-bold tracking-widest transition-all ${location.pathname === '/' ? 'text-cyan-400 text-glow' : 'text-slate-400 hover:text-white'}`}>
                        DASHBOARD
                    </Link>
                    <Link to="/game/tetris" className={`text-xs font-bold tracking-widest transition-all ${location.pathname.includes('game') ? 'text-cyan-400 text-glow' : 'text-slate-400 hover:text-white'}`}>
                        PLAY
                    </Link>

                    {userId ? (
                        <div className="flex items-center gap-4 pl-8 border-l border-white/10 ml-4">
                            {!user?.isPremium && (
                                <button
                                    onClick={handleUpgrade}
                                    disabled={isUpgrading}
                                    className="px-4 py-2 glass rounded-xl text-[10px] font-black text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10 transition-all flex items-center gap-2 animate-pulse"
                                >
                                    <Crown size={12} />
                                    {isUpgrading ? "LOADING..." : "UPGRADE"}
                                </button>
                            )}
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center relative">
                                    <User size={14} />
                                    {user?.isPremium && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#050508] flex items-center justify-center">
                                            <Crown size={6} className="text-black" />
                                        </div>
                                    )}
                                </div>
                                <span className={`${user?.isPremium ? 'text-yellow-500' : ''} hidden md:block uppercase tracking-tighter`}>
                                    {user?.username || localStorage.getItem('username')}
                                </span>
                            </div>
                            <button
                                onClick={() => { localStorage.removeItem("userId"); window.location.reload(); }}
                                className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-white/5 rounded-lg border border-white/5"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/auth"
                            className="px-6 py-2 rounded-full bg-white text-black text-xs font-black hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            LOGIN
                        </Link>
                    )}
                </div>
            </nav>

            <main className="relative pt-32 pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
