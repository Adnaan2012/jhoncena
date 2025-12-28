import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PLAYER_SIZE = 30;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 40;
const GRAVITY = 0.8;
const JUMP_FORCE = -12;
const SPEED = 5;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

export default function GeometryGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    // Game state refs
    const playerY = useRef(CANVAS_HEIGHT - PLAYER_SIZE - 20);
    const playerVY = useRef(0);
    const obstacles = useRef<{ x: number; height: number }[]>([]);
    const particles = useRef<Particle[]>([]);
    const frameId = useRef<number>(0);
    const bgPhase = useRef(0);

    const resetGame = () => {
        playerY.current = CANVAS_HEIGHT - PLAYER_SIZE - 20;
        playerVY.current = 0;
        obstacles.current = [];
        particles.current = [];
        setScore(0);
        setIsGameOver(false);
        setIsStarted(true);
    };

    const spawnObstacle = () => {
        if (Math.random() < 0.02) {
            const lastObstacle = obstacles.current[obstacles.current.length - 1];
            if (!lastObstacle || CANVAS_WIDTH - lastObstacle.x > 250) {
                obstacles.current.push({
                    x: CANVAS_WIDTH,
                    height: OBSTACLE_HEIGHT + Math.random() * 20
                });
            }
        }
    };

    const spawnParticles = (x: number, y: number, color: string, count: number = 5) => {
        for (let i = 0; i < count; i++) {
            particles.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 1.0,
                color
            });
        }
    };

    const update = () => {
        if (!isStarted || isGameOver) return;

        // Physics
        playerVY.current += GRAVITY;
        playerY.current += playerVY.current;

        // Ground collision
        const groundY = CANVAS_HEIGHT - PLAYER_SIZE - 20;
        if (playerY.current > groundY) {
            playerY.current = groundY;
            playerVY.current = 0;
            // Spawn ground trail particles
            if (Math.random() > 0.5) {
                spawnParticles(50, groundY + PLAYER_SIZE, '#00f2ff', 1);
            }
        }

        // Obstacles
        obstacles.current.forEach(obs => {
            obs.x -= SPEED;

            // Collision Detection
            const playerX = 50;
            if (
                playerX < obs.x + OBSTACLE_WIDTH &&
                playerX + PLAYER_SIZE > obs.x &&
                playerY.current + PLAYER_SIZE > CANVAS_HEIGHT - 20 - obs.height
            ) {
                setIsGameOver(true);
                spawnParticles(playerX + PLAYER_SIZE / 2, playerY.current + PLAYER_SIZE / 2, '#ff0055', 20);
            }
        });

        // Remove offscreen obstacles
        obstacles.current = obstacles.current.filter(obs => obs.x > -50);

        // Particles
        particles.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
        });
        particles.current = particles.current.filter(p => p.life > 0);

        spawnObstacle();
        setScore(s => s + 1);
        bgPhase.current += 0.02;

        draw();
        frameId.current = requestAnimationFrame(update);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        // Clean background with neon bleed
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Grid lines (Animated)
        ctx.strokeStyle = '#1e1e30';
        ctx.lineWidth = 1;
        const offsetX = (bgPhase.current * 50) % 40;

        for (let x = -offsetX; x < CANVAS_WIDTH; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        // Pulse effect
        const pulse = Math.sin(bgPhase.current) * 0.2 + 0.8;

        // Ground
        const grd = ctx.createLinearGradient(0, CANVAS_HEIGHT - 20, 0, CANVAS_HEIGHT);
        grd.addColorStop(0, '#7000ff');
        grd.addColorStop(1, '#000000');
        ctx.fillStyle = grd;
        ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);

        // Ground neon line
        ctx.strokeStyle = `rgba(112, 0, 255, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, CANVAS_HEIGHT - 20);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 20);
        ctx.stroke();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#7000ff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Obstacles
        obstacles.current.forEach(obs => {
            ctx.fillStyle = '#ff0055';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff0055';

            // Triangle shape
            ctx.beginPath();
            ctx.moveTo(obs.x, CANVAS_HEIGHT - 20);
            ctx.lineTo(obs.x + OBSTACLE_WIDTH / 2, CANVAS_HEIGHT - 20 - obs.height);
            ctx.lineTo(obs.x + OBSTACLE_WIDTH, CANVAS_HEIGHT - 20);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Player
        ctx.fillStyle = '#00f2ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f2ff';

        // Inner Glow
        ctx.fillRect(50, playerY.current, PLAYER_SIZE, PLAYER_SIZE);

        // Bevel Effect
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(52, playerY.current + 2, PLAYER_SIZE - 4, PLAYER_SIZE - 4);
        ctx.shadowBlur = 0;

        // Particles
        particles.current.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
        });
        ctx.globalAlpha = 1.0;
    };

    useEffect(() => {
        if (isStarted && !isGameOver) {
            frameId.current = requestAnimationFrame(update);
        } else {
            draw(); // Initial draw or static state
        }
        return () => cancelAnimationFrame(frameId.current);
    }, [isStarted, isGameOver]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!isStarted) {
                    resetGame();
                } else if (isGameOver) {
                    resetGame();
                } else if (playerVY.current === 0) {
                    playerVY.current = JUMP_FORCE;
                    spawnParticles(50 + PLAYER_SIZE / 2, playerY.current + PLAYER_SIZE, '#00f2ff', 10);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isStarted, isGameOver]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#050510] overflow-hidden">
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-black mb-8 italic tracking-tighter"
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    NEON
                </span>
                <span className="text-white ml-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    DASH
                </span>
            </motion.h1>

            <div className="relative rounded-2xl p-1 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="relative rounded-xl overflow-hidden bg-[#0a0a12] border border-white/10">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onClick={() => {
                            if (!isStarted || isGameOver) resetGame();
                            else if (playerVY.current === 0) {
                                playerVY.current = JUMP_FORCE;
                                spawnParticles(50 + PLAYER_SIZE / 2, playerY.current + PLAYER_SIZE, '#00f2ff', 10);
                            }
                        }}
                        className="cursor-pointer"
                    />

                    <AnimatePresence>
                        {(!isStarted || isGameOver) && (
                            <motion.div
                                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40"
                            >
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
                                >
                                    {isGameOver ? (
                                        <>
                                            <h2 className="text-4xl font-bold text-red-500 mb-2">CRASHED!</h2>
                                            <p className="text-slate-400 mb-6">Final Score: {Math.floor(score / 10)}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-4xl font-bold text-white mb-2">READY?</h2>
                                            <p className="text-slate-400 mb-6">Jump over the red spikes</p>
                                        </>
                                    )}
                                    <button
                                        onClick={resetGame}
                                        className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                                    >
                                        {isGameOver ? 'RETRY' : 'PLAY NOW'}
                                    </button>
                                    <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">Press Space or Click to Jump</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-8 flex gap-12 text-center">
                <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Current</p>
                    <p className="text-4xl font-black text-cyan-400 font-mono italic">
                        {Math.floor(score / 10)}
                    </p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Max Level</p>
                    <p className="text-4xl font-black text-purple-400 font-mono italic">
                        {Math.floor(highScore / 10)}
                    </p>
                </div>
            </div>
        </div>
    );
}
