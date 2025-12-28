import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // O
    '#0DFF72', // S
    '#F538FF', // Z
    '#FF8E0D', // J
    '#FFE138', // L
    '#3877FF', // I
];

const SHAPES = [
    [],
    [[1, 1, 1], [0, 1, 0]], // T
    [[2, 2], [2, 2]],       // O
    [[0, 3, 3], [3, 3, 0]], // S
    [[4, 4, 0], [0, 4, 4]], // Z
    [[5, 0, 0], [5, 5, 5]], // J
    [[0, 0, 6], [6, 6, 6]], // L
    [[0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0]], // I
];

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const saveScore = useMutation(api.scores.saveScore);
    const topScores = useQuery(api.scores.getTopScores, { game: 'tetris' });

    useEffect(() => {
        if (gameOver && score > 0) {
            const username = localStorage.getItem('username');
            if (username) {
                saveScore({ game: 'tetris', score, username });
            }
        }
    }, [gameOver, score, saveScore]);

    // Game State Refs (for animation loop)
    const boardRef = useRef(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    const pieceRef = useRef<{ x: number; y: number; shape: number[][]; color: number } | null>(null);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const dropCounterRef = useRef<number>(0);
    const dropIntervalRef = useRef<number>(1000);

    const resetGame = () => {
        boardRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        spawnPiece();
        dropIntervalRef.current = 1000;
    };

    const spawnPiece = () => {
        const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
        const shape = SHAPES[typeId];
        pieceRef.current = {
            x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
            y: 0,
            shape: shape,
            color: typeId
        };

        if (collide(boardRef.current, pieceRef.current)) {
            setGameOver(true);
            setIsPlaying(false);
        }
    };

    const collide = (board: number[][], piece: { x: number, y: number, shape: number[][] }) => {
        const { x, y, shape } = piece;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0) {
                    const newX = x + c;
                    const newY = y + r;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const merge = () => {
        if (!pieceRef.current) return;
        const { x, y, shape, color } = pieceRef.current;

        shape.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value !== 0) {
                    // Prevent out of bounds
                    if (y + r >= 0 && y + r < ROWS && x + c >= 0 && x + c < COLS) {
                        boardRef.current[y + r][x + c] = color;
                    }
                }
            });
        });
    };

    const rotate = (matrix: number[][]) => {
        // Transpose + Reverse rows = 90 deg rotation
        // Simple approach: create new matrix
        const result = matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
        return result;
    };

    const playerRotate = () => {
        if (!pieceRef.current || gameOver) return;
        const cloned = JSON.parse(JSON.stringify(pieceRef.current));
        cloned.shape = rotate(cloned.shape);
        // Wall kick (basic)
        if (collide(boardRef.current, cloned)) {
            if (cloned.x < 0) cloned.x = 0;
            if (cloned.x + cloned.shape[0].length > COLS) cloned.x = COLS - cloned.shape[0].length;
            if (collide(boardRef.current, cloned)) return; // Fail
        }
        pieceRef.current = cloned;
    };

    const move = (dir: number) => {
        if (!pieceRef.current || gameOver) return;
        pieceRef.current.x += dir;
        if (collide(boardRef.current, pieceRef.current)) {
            pieceRef.current.x -= dir;
        }
    };

    const drop = () => {
        if (!pieceRef.current || gameOver) return;
        pieceRef.current.y++;
        if (collide(boardRef.current, pieceRef.current)) {
            pieceRef.current.y--;
            merge();
            sweep();
            spawnPiece();
        }
        dropCounterRef.current = 0;
    };

    const sweep = () => {
        let rowCount = 0;
        outer: for (let r = ROWS - 1; r >= 0; r--) {
            for (let c = 0; c < COLS; c++) {
                if (boardRef.current[r][c] === 0) {
                    continue outer;
                }
            }
            const row = boardRef.current.splice(r, 1)[0].fill(0);
            boardRef.current.unshift(row);
            rowCount++;
            r++; // Check same row again as rows shifted down
        }
        if (rowCount > 0) {
            setScore(s => s + rowCount * 100);
            // Speed up
            dropIntervalRef.current *= 0.95;
        }
    };

    const update = (time: number = 0) => {
        if (!isPlaying || gameOver) return;

        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;
        dropCounterRef.current += deltaTime;

        if (dropCounterRef.current > dropIntervalRef.current) {
            drop();
        }

        draw();
        requestRef.current = requestAnimationFrame(update);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // bg
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Board
        boardRef.current.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = COLORS[value] || '#fff';
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            });
        });

        // Piece
        if (pieceRef.current) {
            pieceRef.current.shape.forEach((row, r) => {
                row.forEach((value, c) => {
                    if (value !== 0) {
                        ctx.fillStyle = COLORS[pieceRef.current!.color] || '#fff';
                        ctx.fillRect((pieceRef.current!.x + c) * BLOCK_SIZE, (pieceRef.current!.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                    }
                });
            });
        }
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isPlaying || gameOver) return;
            if (e.key === 'ArrowLeft') move(-1);
            if (e.key === 'ArrowRight') move(1);
            if (e.key === 'ArrowDown') drop();
            if (e.key === 'ArrowUp') playerRotate();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isPlaying, gameOver]);

    // Start loop
    useEffect(() => {
        if (isPlaying && !gameOver) {
            requestRef.current = requestAnimationFrame(update);
        } else {
            cancelAnimationFrame(requestRef.current!);
        }
        return () => cancelAnimationFrame(requestRef.current!);
    }, [isPlaying, gameOver]);

    // Initial Draw
    useEffect(() => {
        draw();
    }, []);

    return (
        <div className="flex flex-col items-center gap-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent transform hover:scale-110 transition-transform cursor-default">
                NEON TETRIS
            </h1>

            <div className="relative group">
                <canvas
                    ref={canvasRef}
                    width={COLS * BLOCK_SIZE}
                    height={ROWS * BLOCK_SIZE}
                    className="border-none rounded-lg shadow-2xl bg-black/80 backdrop-blur-sm"
                    style={{
                        boxShadow: '0 0 20px rgba(124, 58, 237, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)'
                    }}
                />

                {(!isPlaying || gameOver) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
                        {gameOver && <h2 className="text-3xl font-bold text-red-500 mb-4 animate-bounce">GAME OVER</h2>}
                        <button
                            onClick={resetGame}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/20 transform hover:scale-105 transition-all text-xl"
                        >
                            {gameOver ? 'TRY AGAIN' : 'START GAME'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-12">
                <div className="text-center">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Score</p>
                    <p className="text-3xl font-mono font-bold text-white">{score}</p>
                </div>
                <div className="text-center">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Next</p>
                    <div className="h-9 w-9 bg-slate-800 rounded flex items-center justify-center text-slate-600">?</div>
                </div>
            </div>

            <div className="text-slate-500 text-sm max-w-xs text-center mb-8">
                Use <kbd className="bg-slate-800 px-1 rounded">Arrows</kbd> to move and rotate. <br />
                <kbd className="bg-slate-800 px-1 rounded">Down</kbd> to accelerate.
            </div>

            {topScores && topScores.length > 0 && (
                <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700">
                    <h3 className="text-xl font-bold text-center mb-4 text-purple-400">HIGH SCORES</h3>
                    <div className="space-y-2">
                        {topScores.map((s, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-slate-300 font-medium">
                                    <span className="text-slate-500 mr-3">#{i + 1}</span>
                                    {s.username}
                                </span>
                                <span className="font-mono text-cyan-400">{s.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
