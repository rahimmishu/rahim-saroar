import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// --- DATA: Moves & Types ---
const moveDB: any = {
    normal: [{ name: "Tackle", type: "normal", pwr: 40, acc: 100 }, { name: "Hyper Beam", type: "normal", pwr: 150, acc: 90 }, { name: "Quick Attack", type: "normal", pwr: 40, acc: 100 }],
    fire: [{ name: "Flamethrower", type: "fire", pwr: 90, acc: 100 }, { name: "Fire Blast", type: "fire", pwr: 110, acc: 85 }, { name: "Ember", type: "fire", pwr: 40, acc: 100 }],
    water: [{ name: "Hydro Pump", type: "water", pwr: 110, acc: 80 }, { name: "Surf", type: "water", pwr: 90, acc: 100 }, { name: "Water Gun", type: "water", pwr: 40, acc: 100 }],
    grass: [{ name: "Solar Beam", type: "grass", pwr: 120, acc: 100 }, { name: "Energy Ball", type: "grass", pwr: 90, acc: 100 }, { name: "Vine Whip", type: "grass", pwr: 45, acc: 100 }],
    electric: [{ name: "Thunder", type: "electric", pwr: 110, acc: 70 }, { name: "Thunderbolt", type: "electric", pwr: 90, acc: 100 }, { name: "Zap Cannon", type: "electric", pwr: 120, acc: 50 }],
    ice: [{ name: "Ice Beam", type: "ice", pwr: 90, acc: 100 }, { name: "Blizzard", type: "ice", pwr: 110, acc: 70 }],
    fighting: [{ name: "Close Combat", type: "fighting", pwr: 120, acc: 100 }, { name: "Brick Break", type: "fighting", pwr: 75, acc: 100 }],
    poison: [{ name: "Sludge Bomb", type: "poison", pwr: 90, acc: 100 }, { name: "Gunk Shot", type: "poison", pwr: 120, acc: 80 }],
    ground: [{ name: "Earthquake", type: "ground", pwr: 100, acc: 100 }, { name: "Dig", type: "ground", pwr: 80, acc: 100 }],
    flying: [{ name: "Brave Bird", type: "flying", pwr: 120, acc: 100 }, { name: "Air Slash", type: "flying", pwr: 75, acc: 95 }],
    psychic: [{ name: "Psychic", type: "psychic", pwr: 90, acc: 100 }, { name: "Future Sight", type: "psychic", pwr: 120, acc: 100 }],
    bug: [{ name: "X-Scissor", type: "bug", pwr: 80, acc: 100 }, { name: "Megahorn", type: "bug", pwr: 120, acc: 85 }],
    rock: [{ name: "Stone Edge", type: "rock", pwr: 100, acc: 80 }, { name: "Rock Slide", type: "rock", pwr: 75, acc: 90 }],
    ghost: [{ name: "Shadow Ball", type: "ghost", pwr: 80, acc: 100 }, { name: "Shadow Claw", type: "ghost", pwr: 70, acc: 100 }],
    dragon: [{ name: "Dragon Claw", type: "dragon", pwr: 80, acc: 100 }, { name: "Outrage", type: "dragon", pwr: 120, acc: 100 }],
    steel: [{ name: "Flash Cannon", type: "steel", pwr: 80, acc: 100 }, { name: "Iron Head", type: "steel", pwr: 80, acc: 100 }],
    dark: [{ name: "Dark Pulse", type: "dark", pwr: 80, acc: 100 }, { name: "Crunch", type: "dark", pwr: 80, acc: 100 }],
    fairy: [{ name: "Moonblast", type: "fairy", pwr: 95, acc: 100 }, { name: "Dazzling Gleam", type: "fairy", pwr: 80, acc: 100 }],
    default: [{ name: "Struggle", type: "normal", pwr: 50, acc: 100 }]
};

const typeChart: any = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, fire: 0.5, rock: 0.5, dragon: 0.5 },
    water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
    grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5 },
    electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, ground: 0 },
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
    bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
    ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
    fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 }
};

interface Pokemon {
    name: string;
    hp: number;
    maxHp: number;
    atk: number;
    img: string;
    types: string[];
    energy: number;
    moves: any[];
}

const PokemonGame: React.FC = () => {
    // Game State
    const [p1, setP1] = useState<Pokemon | null>(null);
    const [p2, setP2] = useState<Pokemon | null>(null);
    const [turn, setTurn] = useState<1 | 2>(1);
    const [gameActive, setGameActive] = useState(false);
    const [log, setLog] = useState("Welcome Trainer. Select your Pokémon to begin.");
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [result, setResult] = useState<{ winner: string; isPlayerWin: boolean } | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Initial Load
    useEffect(() => {
        const savedPokemon = localStorage.getItem('my_pokemon');
        if (savedPokemon) selectPokemon(savedPokemon);
    }, []);

    // --- LOGIC HELPERS ---
    const getMovesForMon = (types: string[]) => {
        let pool: any[] = [];
        types.forEach(t => { if (moveDB[t]) pool = [...pool, ...moveDB[t]]; });
        pool = [...pool, ...moveDB['normal'], ...moveDB['default']];
        pool = pool.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
        return pool.sort(() => 0.5 - Math.random()).slice(0, 4);
    };

    const getPokeData = async (idOrName: string | number) => {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`);
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            const imgUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
            const types = data.types.map((t: any) => t.type.name);

            return {
                name: data.name,
                hp: data.stats[0].base_stat * 3,
                maxHp: data.stats[0].base_stat * 3,
                atk: data.stats[1].base_stat,
                img: imgUrl,
                types: types,
                energy: 0,
                moves: getMovesForMon(types)
            };
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const selectPokemon = async (idOrName: string | number) => {
        setLog("Summoning Pokémon...");
        const chosen = await getPokeData(idOrName);

        if (chosen) {
            setP1(chosen);
            localStorage.setItem('my_pokemon', idOrName.toString());
            setLog(`${chosen.name.toUpperCase()} is ready!`);
            setModalOpen(false);
        } else {
            alert("Pokémon not found!");
        }
    };

    const startGame = async () => {
        if (!p1) return alert("Select your Pokémon first!");
        
        // Reset Logic
        setResult(null);
        setP1(prev => prev ? { ...prev, hp: prev.maxHp, energy: 0 } : null);

        setLog("FINDING OPPONENT...");
        const randomId = Math.floor(Math.random() * 151) + 1;
        const opponent = await getPokeData(randomId);

        if (opponent) {
            setP2(opponent);
            setGameActive(true);
            setTurn(1);
            setLog("Battle Start! Select a move!");
        }
    };

    const performMove = async (move: any, isUlt = false) => {
        if (!p1 || !p2 || isAnimating || !gameActive) return;
        setIsAnimating(true);

        const attacker = turn === 1 ? p1 : p2;
        let defender = turn === 1 ? p2 : p1;
        
        // --- ANIMATIONS ---
        const atkEl = document.getElementById(turn === 1 ? 'p1-img' : 'p2-img');
        const defEl = document.getElementById(turn === 1 ? 'p2-img' : 'p1-img');
        const defArea = document.getElementById(turn === 1 ? 'p2-area' : 'p1-area');

        // Lunge
        if (atkEl) {
            atkEl.classList.add(turn === 1 ? 'lunge-right' : 'lunge-left');
            setTimeout(() => atkEl.classList.remove(turn === 1 ? 'lunge-right' : 'lunge-left'), 400);
        }

        await new Promise(r => setTimeout(r, 200));

        // Damage Calc
        let mult = 1;
        if (typeChart[move.type]) {
            defender.types.forEach((dt: string) => {
                if (typeChart[move.type][dt] !== undefined) mult *= typeChart[move.type][dt];
            });
        }
        
        const stab = attacker.types.includes(move.type) ? 1.5 : 1;
        let baseDmg = (attacker.atk * 0.5) + (move.pwr * 0.5);
        let dmg = Math.floor(baseDmg * (0.85 + Math.random() * 0.3) * mult * stab);

        if (isUlt) {
            dmg = Math.floor(dmg * 2);
            attacker.energy = 0;
        } else {
            attacker.energy = Math.min(100, attacker.energy + 20);
        }

        defender.hp = Math.max(0, defender.hp - dmg);

        // Update State
        if (turn === 1) {
            setP1({ ...attacker });
            setP2({ ...defender });
        } else {
            setP2({ ...attacker });
            setP1({ ...defender });
        }

        // Hit Visuals
        if (defEl) {
            defEl.classList.add('hit-flash');
            setTimeout(() => defEl.classList.remove('hit-flash'), 400);
        }
        if (defArea) {
            defArea.classList.remove('shake');
            void defArea.offsetWidth; // trigger reflow
            defArea.classList.add('shake');
        }

        // Log
        let logMsg = `${attacker.name.toUpperCase()} used ${move.name}!`;
        if (mult > 1) logMsg += " It's super effective!";
        if (mult < 1) logMsg += " It's not very effective...";
        setLog(logMsg);

        if (defender.hp <= 0) {
            setGameActive(false);
            setResult({
                winner: attacker.name,
                isPlayerWin: attacker === p1
            });
            setLog(`WINNER: ${attacker.name.toUpperCase()}`);
        } else {
            endTurn();
        }
        
        setIsAnimating(false);
    };

    const endTurn = () => {
        const nextTurn = turn === 1 ? 2 : 1;
        setTurn(nextTurn);
    };

    // CPU Logic
    useEffect(() => {
        if (turn === 2 && gameActive && p2 && p1) {
            const timer = setTimeout(() => {
                // AI Logic
                if (p2.energy >= 100) {
                    performMove({ name: "ULTIMATE BLAST", type: "normal", pwr: 120, acc: 100 }, true);
                } else if (p2.moves) {
                    const randomMove = p2.moves[Math.floor(Math.random() * p2.moves.length)];
                    performMove(randomMove);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [turn, gameActive, p2, p1]);

    const popularIds = [1, 4, 7, 25, 39, 52, 65, 94, 133, 143, 149, 150, 248, 384, 448, 700];

    return (
        <div className="relative flex items-center justify-center w-full h-full overflow-hidden font-sans text-white pokemon-game-wrapper">
             {/* --- CSS STYLE INJECTION --- */}
            <style>{`
                .pokemon-game-wrapper {
                    /* 🔥 YOUR UPLOADED BACKGROUND IMAGE IS HERE */
                    background: linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)),
                                url('/background.jpg'); 
                    background-size: cover;
                    background-position: center;
                }
                .bar-container { background: rgba(0,0,0,0.6); border-radius: 10px; height: 8px; margin-bottom: 5px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                .hp-fill { height: 100%; transition: width 0.4s; background: #22c55e; }
                .hp-fill.low { background: #ef4444; }
                .energy-fill { height: 100%; transition: width 0.4s; background: linear-gradient(90deg, #0ea5e9, #3b82f6); box-shadow: 0 0 10px #3b82f6; }
                
                @keyframes lunge-right { 0% { transform: translateX(0); } 40% { transform: translateX(40px) rotate(5deg); } 100% { transform: translateX(0); } }
                @keyframes lunge-left { 0% { transform: translateX(0); } 40% { transform: translateX(-40px) rotate(-5deg); } 100% { transform: translateX(0); } }
                .lunge-right { animation: lunge-right 0.3s ease; }
                .lunge-left { animation: lunge-left 0.3s ease; }
                
                @keyframes damage-flash { 0% { filter: brightness(1); } 20% { filter: brightness(3) sepia(1) saturate(5) hue-rotate(-50deg); } 100% { filter: brightness(1); } }
                .hit-flash { animation: damage-flash 0.3s ease-out; }
                
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
                .shake { animation: shake 0.3s ease-in-out; }

                .type-normal { background: #737373; } .type-fire { background: #b91c1c; } .type-water { background: #1d4ed8; }
                .type-grass { background: #15803d; } .type-electric { background: #a16207; } .type-psychic { background: #be185d; }
                
                /* Scrollbar for modal */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
            `}</style>

            <div className="w-[95%] max-w-4xl relative z-10">
                {/* HEADER */}
                <div className="mb-6 text-center">
                    <h1 className="text-4xl italic font-black tracking-tighter drop-shadow-lg">
                        POKÉ<span className="text-red-500">BATTLE</span>
                    </h1>
                    {!gameActive && !result && (
                        <button 
                            onClick={startGame}
                            className="mt-4 px-8 py-2 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        >
                            {p2 ? "PLAY AGAIN" : "FIND OPPONENT"}
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center justify-between gap-8 md:flex-row perspective-1000">
                    
                    {/* PLAYER 1 SIDE */}
                    <div id="p1-area" className={`flex-1 w-full bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl transition-all duration-300 ${turn === 1 && gameActive ? 'border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}`}>
                        <div className="flex justify-between mb-1 text-xs font-bold">
                            <span>HP</span> <span>{p1 ? Math.ceil(p1.hp) : 0}/{p1 ? p1.maxHp : 0}</span>
                        </div>
                        <div className="bar-container">
                            <div className={`hp-fill ${p1 && (p1.hp / p1.maxHp) < 0.2 ? 'low' : ''}`} style={{ width: p1 ? `${(p1.hp / p1.maxHp) * 100}%` : '0%' }}></div>
                        </div>
                        <div className="flex justify-between mb-1 text-xs font-bold">
                            <span>ULTIMATE</span> <span>{p1 ? p1.energy : 0}%</span>
                        </div>
                        <div className="bar-container">
                            <div className="energy-fill" style={{ width: p1 ? `${p1.energy}%` : '0%' }}></div>
                        </div>

                        <div className="relative flex flex-col items-center justify-center h-48 cursor-pointer group" onClick={() => !gameActive && setModalOpen(true)}>
                            {p1 ? (
                                <>
                                    <img id="p1-img" src={p1.img} className="z-10 w-32 h-32 transition-transform drop-shadow-xl group-hover:scale-105" />
                                    <h2 className="mt-2 text-xl font-bold uppercase">{p1.name}</h2>
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{p1.types.join('/')}</span>
                                </>
                            ) : (
                                <div className="flex items-center justify-center w-24 h-24 text-3xl font-black border-2 border-dashed rounded-full border-white/20 text-white/20 animate-pulse">?</div>
                            )}
                            {!gameActive && <div className="absolute inset-0 flex items-center justify-center font-bold transition-opacity opacity-0 bg-black/40 group-hover:opacity-100 rounded-xl">CHANGE</div>}
                        </div>

                        {/* MOVES */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {p1 && p1.moves.map((move: any, i: number) => (
                                <button 
                                    key={i}
                                    disabled={turn !== 1 || !gameActive}
                                    onClick={() => performMove(move)}
                                    className={`p-2 rounded-lg text-left transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 type-${move.type} bg-slate-700`}
                                >
                                    <div className="text-xs font-bold">{move.name}</div>
                                    <div className="text-[9px] opacity-80 uppercase">{move.type} | {move.pwr}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* VS BADGE */}
                    <div className="text-4xl italic font-black rotate-90 opacity-30 md:rotate-0">VS</div>

                    {/* PLAYER 2 SIDE */}
                    <div id="p2-area" className={`flex-1 w-full bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl transition-all duration-300 ${turn === 2 && gameActive ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : ''}`}>
                        <div className="flex justify-between mb-1 text-xs font-bold">
                            <span>HP</span> <span>{p2 ? Math.ceil(p2.hp) : 0}/{p2 ? p2.maxHp : 0}</span>
                        </div>
                        <div className="bar-container">
                            <div className={`hp-fill ${p2 && (p2.hp / p2.maxHp) < 0.2 ? 'low' : ''}`} style={{ width: p2 ? `${(p2.hp / p2.maxHp) * 100}%` : '0%' }}></div>
                        </div>
                        
                        <div className="relative flex flex-col items-center justify-center h-48">
                            {p2 ? (
                                <>
                                    <img id="p2-img" src={p2.img} className="z-10 w-32 h-32 drop-shadow-xl" />
                                    <h2 className="mt-2 text-xl font-bold uppercase">{p2.name}</h2>
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{p2.types.join('/')}</span>
                                </>
                            ) : (
                                <div className="flex items-center justify-center w-24 h-24 text-3xl font-black border-2 border-dashed rounded-full border-white/20 text-white/20">?</div>
                            )}
                        </div>

                        {/* CPU MOVES (Visual Only) */}
                        <div className="grid grid-cols-2 gap-2 mt-4 opacity-50 pointer-events-none">
                            {p2 && p2.moves.map((move: any, i: number) => (
                                <div key={i} className={`p-2 rounded-lg text-left type-${move.type} bg-slate-700`}>
                                    <div className="text-xs font-bold">{move.name}</div>
                                    <div className="text-[9px] opacity-80 uppercase">{move.type} | {move.pwr}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LOG */}
                <div className="p-3 mt-6 font-mono text-sm text-center text-blue-200 border bg-black/60 backdrop-blur-sm border-white/20 rounded-xl">
                    {log}
                </div>
            </div>

            {/* --- SELECTION MODAL --- */}
            {modalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        <h2 className="mb-4 text-xl font-bold text-center">Select Partner</h2>
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                placeholder="Search (e.g. Pikachu)..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm text-white border rounded-lg outline-none bg-slate-900 border-slate-600 focus:border-blue-500"
                            />
                            <button onClick={() => selectPokemon(searchQuery)} className="px-4 font-bold bg-blue-600 rounded-lg"><Search size={16}/></button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pr-2 overflow-y-auto custom-scrollbar">
                            {popularIds.map(id => (
                                <div key={id} onClick={() => selectPokemon(id)} className="flex flex-col items-center p-2 border border-transparent rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 hover:border-blue-500">
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} className="w-12 h-12" />
                                    <span className="text-[10px] text-slate-400">#{id}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setModalOpen(false)} className="mt-4 text-sm underline text-slate-400 hover:text-white">Cancel</button>
                    </div>
                </div>
            )}

            {/* --- RESULT OVERLAY --- */}
            {result && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center duration-500 bg-black/80 animate-in fade-in zoom-in">
                    <h1 className={`text-6xl font-black italic mb-4 ${result.isPlayerWin ? 'text-yellow-400' : 'text-red-500'}`}>
                        {result.isPlayerWin ? 'VICTORY!' : 'DEFEAT'}
                    </h1>
                    <p className="mb-8 text-slate-400">
                        {result.isPlayerWin ? "You are the very best!" : "Better luck next time..."}
                    </p>
                    <button 
                        onClick={() => setResult(null)} 
                        className="px-8 py-3 font-bold text-black transition-transform bg-white rounded-full hover:scale-110"
                    >
                        CONTINUE
                    </button>
                </div>
            )}
        </div>
    );
};

export default PokemonGame;