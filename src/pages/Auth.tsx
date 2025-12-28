import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = useMutation(api.users.login);
    const signup = useMutation(api.users.signup);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const userId = await login({ username, password });
                if (userId) {
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('username', username);
                    navigate('/');
                } else {
                    setError('Invalid username or password');
                }
            } else {
                const userId = await signup({ username, password });
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-10 rounded-[2.5rem] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10" />

                <h2 className="text-4xl font-black text-center mb-2 italic tracking-tighter text-white">
                    {isLogin ? 'RESUME' : 'INITIATE'}
                </h2>
                <p className="text-center text-slate-500 text-xs font-bold tracking-widest uppercase mb-10">
                    {isLogin ? 'Access your mission profile' : 'Create your pilot identity'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                            placeholder="OPERATOR NAME"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                            placeholder="ACCESS CODE"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase text-center tracking-widest"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-cyan-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLogin ? 'AUTHENTICATE' : 'REGISTER PROFILE'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-slate-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        {isLogin ? "New Pilot? Sign up" : "Existing Operator? Login"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
