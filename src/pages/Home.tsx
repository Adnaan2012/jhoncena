import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Flame, Users, Zap, Star } from 'lucide-react';
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
        <div className="flex flex-col gap-24 px-6 md:px-12 max-w-7xl mx-auto">
            {/* Cinematic Hero */}
            <motion.section
                initial="hidden"
                animate="show"
                variants={stagger}
                className="relative pt-20 pb-12 flex flex-col items-center text-center overflow-hidden"
            >
                <motion.div variants={fadeIn} className="relative z-10 flex flex-col items-center">
                    <div className="mb-6 px-4 py-1 glass rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Live Global Tournament</span>
                    </div>

                    <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none mb-4 italic select-none">
                        <span className="relative inline-block text-white">
                            NEXT
                            <span className="absolute -inset-2 bg-white/5 blur-3xl rounded-full -z-10" />
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            LEVEL
                        </span>
                    </h1>

                    <p className="max-w-xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                        Escape reality in our immersive arcade metaverse. Compete for glory, earn rewards, and dominate the leaderboard.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/game/tetris">
                            <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group overflow-hidden relative">
                                <span className="relative z-10">START MISSION</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>
                        </Link>
                        <button className="px-10 py-5 glass rounded-2xl font-black text-white hover:bg-white/10 transition-all flex items-center gap-3">
                            <Trophy size={18} className="text-yellow-500" />
                            HALL OF FAME
                        </button>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
            </motion.section>

            {/* Hyper-Interactive Game Grid */}
            <section>
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                            <Flame className="text-orange-500" size={24} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Trending Missions</h2>
                    </div>
                </div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                    {/* Featured Game: Tetris */}
                    <Link to="/game/tetris" className="md:col-span-8 group">
                        <motion.div
                            variants={fadeIn}
                            className="relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900 shadow-2xl transition-all group-hover:border-purple-500/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-slate-900 to-slate-900" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                            <div className="absolute -right-20 -bottom-20 opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-700">
                                <Gamepad2 size={400} className="text-purple-500 rotate-12" />
                            </div>

                            <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-4 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-widest leading-none">Featured Title</span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                            <Users size={12} /> 2.4K ACTIVE
                                        </span>
                                    </div>
                                    <h3 className="text-6xl font-black italic mb-4 tracking-tighter leading-none">NEON<br /><span className="text-white/20 group-hover:text-purple-400 transition-colors">TETRIS</span></h3>
                                    <p className="max-w-md text-slate-400 font-medium">Experience the classic block stacker with high-end physics and immersive cyber-visuals.</p>
                                </div>

                                <button className="self-start px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center gap-2 transition-all">
                                    LAUNCH NOW <Zap size={16} className="text-purple-400" />
                                </button>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Secondary Games Column */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <Link to="/game/geometry" className="flex-1 group">
                            <motion.div
                                variants={fadeIn}
                                className="h-full relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900 shadow-xl transition-all group-hover:border-cyan-500/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-slate-900" />
                                <div className="relative z-10 p-8">
                                    <h3 className="text-3xl font-black italic mb-2 tracking-tighter">NEON DASH</h3>
                                    <div className="w-12 h-1 bg-cyan-500 mb-6 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">Master the rhythm in this high-speed obstacle course.</p>
                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Interactive Demo</span>
                                </div>
                                <Zap size={120} className="absolute -right-4 -bottom-4 text-cyan-500 opacity-10 group-hover:opacity-20 transition-opacity" />
                            </motion.div>
                        </Link>

                        <motion.div
                            variants={fadeIn}
                            className="flex-1 relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-sm p-8 group"
                        >
                            <div className="absolute right-8 top-8 w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                <Star size={24} className="text-orange-500 opacity-50" />
                            </div>
                            <h3 className="text-2xl font-black italic text-slate-500">MORE COMING</h3>
                            <p className="text-xs text-slate-600 mt-2">New world unlocking in 4 days</p>
                            <div className="mt-8 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Live Data Strip */}
            <section className="pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active Souls", val: "12,403", color: "from-cyan-500 to-blue-600" },
                        { label: "Missions Run", val: "84,921", color: "from-purple-500 to-pink-600" },
                        { label: "Apex Score", val: "999,999", color: "from-yellow-500 to-orange-600" },
                        { label: "Status", val: "OPERATIONAL", color: "from-green-500 to-emerald-600" },
                    ].map((stat, i) => (
                        <div key={i} className="glass rounded-3xl p-6 relative overflow-hidden group hover:scale-105 transition-transform cursor-default">
                            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-30`} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black tracking-tighter italic">{stat.val}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
