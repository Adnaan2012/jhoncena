import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Users, Zap, Star, Flame, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
    return (
        <div className="flex flex-col gap-16 pb-20">
            {/* Animated Background Element */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="perspective-grid" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate="show"
                variants={stagger}
                className="relative flex flex-col items-center justify-center py-20 text-center"
            >
                <motion.div variants={fadeIn} className="relative inline-block mb-4">
                    <span className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-pink-500 to-cyan-500 opacity-75 animate-pulse"></span>
                    <span className="relative px-4 py-1.5 rounded-full bg-black border border-white/10 text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                        Season 1 Live
                    </span>
                </motion.div>

                <motion.h1 variants={fadeIn} className="text-7xl md:text-9xl font-black mb-6 tracking-tighter mix-blend-overlay">
                    <span className="bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        ARCADE
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ml-2">.IO</span>
                </motion.h1>

                <motion.p variants={fadeIn} className="text-slate-400 text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto mb-10">
                    Compete globally. Dominate the leaderboards. Experience the next evolution of retro gaming.
                </motion.p>

                <motion.div variants={fadeIn} className="flex gap-6">
                    <button className="px-8 py-4 bg-white text-black font-black hover:bg-cyan-400 transition-colors transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-sm clip-path-polygon">
                        START PLAYING
                    </button>
                    <button className="px-8 py-4 border border-white/20 hover:border-white hover:bg-white/5 transition-all font-bold tracking-widest rounded-sm">
                        VIEW RANKINGS
                    </button>
                </motion.div>
            </motion.section>

            {/* Featured Games Grid */}
            <section className="px-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Flame className="text-orange-500 animate-bounce" size={28} />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Trending Now</h2>
                </div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Tetris Card */}
                    <Link to="/game/tetris" className="md:col-span-2 group">
                        <motion.div
                            variants={fadeIn}
                            whileHover={{ scale: 1.02 }}
                            className="h-full bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 p-8 rounded-3xl relative overflow-hidden backdrop-blur-md group-hover:border-purple-400/60 transition-colors"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-80 transition-opacity">
                                <Gamepad2 size={180} className="text-purple-500 rotate-12" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full mb-4 inline-block shadow-[0_0_15px_rgba(168,85,247,0.5)]">FEATURED</span>
                                    <h3 className="text-4xl font-black mb-2 italic">NEON TETRIS</h3>
                                    <p className="text-purple-200/60 max-w-md text-lg">Master the matrix in this neon-soaked reimagining of the classic block stacker.</p>
                                </div>

                                <div className="flex items-center gap-4 mt-8">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-purple-900 flex items-center justify-center text-[10px] text-white font-bold">
                                                U{i}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-purple-300 font-bold">+2.4k playing</span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Coming Soon / Secondary Cards */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            variants={fadeIn}
                            whileHover={{ scale: 1.02 }}
                            className="flex-1 bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-500/20 p-6 rounded-3xl relative overflow-hidden hover:border-green-500/40 transition-colors"
                        >
                            <div className="absolute -right-4 -bottom-4 opacity-20">
                                <Zap size={100} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-400 mb-1">CYBER SNAKE</h3>
                            <p className="text-xs text-green-200/50 mb-4">COMING SOON</p>
                            <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <p className="text-right text-[10px] text-green-400 mt-1">75% COMPLETE</p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            whileHover={{ scale: 1.02 }}
                            className="flex-1 bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 p-6 rounded-3xl relative overflow-hidden hover:border-blue-500/40 transition-colors"
                        >
                            <div className="absolute -right-4 -bottom-4 opacity-20">
                                <Star size={100} className="text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-400 mb-1">DATA DEFENSE</h3>
                            <p className="text-xs text-blue-200/50 mb-4">EARLY ACCESS</p>
                            <button className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-lg text-xs font-bold w-full hover:bg-blue-500 hover:text-white transition-all">
                                JOIN WAITLIST
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Live Sidebar / Stats Strip */}
            <section className="px-4 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "TOTAL PLAYERS", val: "12,403", icon: Users, color: "text-pink-500" },
                        { label: "GAMES PLAYED", val: "84,921", icon: Gamepad2, color: "text-purple-500" },
                        { label: "HIGH SCORE", val: "999,999", icon: Trophy, color: "text-yellow-500" },
                        { label: "SERVER STATUS", val: "ONLINE", icon: Clock, color: "text-green-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color} font-mono mt-1`}>{stat.val}</p>
                            </div>
                            <stat.icon size={24} className={`${stat.color} opacity-50`} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
