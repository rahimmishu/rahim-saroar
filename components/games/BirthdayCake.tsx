import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import confetti from 'canvas-confetti';
import { X, Mic } from 'lucide-react';
import './BirthdayCake.css';

interface BirthdayCakeProps {
  onClose: () => void;
}

const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState('');
  const [candleLit, setCandleLit] = useState(true);
  const [listening, setListening] = useState(false);
  
  // Audio Context Ref to close it later
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // THREE.js objects refs to access them inside loops
  const sceneRef = useRef<THREE.Scene | null>(null);
  const flameRef = useRef<THREE.Mesh | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const smokeParticlesRef = useRef<THREE.Mesh[]>([]);
  const balloonGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff0f5);
    scene.fog = new THREE.Fog(0xfff0f5, 40, 150);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    // Responsive Camera
    if (width < 600) {
        camera.position.set(20, 20, 35);
    } else {
        camera.position.set(20, 15, 25);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // --- LIGHTS ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // --- BALLOONS ---
    const balloonGroup = new THREE.Group();
    scene.add(balloonGroup);
    balloonGroupRef.current = balloonGroup;

    const balloonColors = [0xff595e, 0xffca3a, 0x8ac926, 0x1982c4, 0x6a4c93, 0xff924c];
    const balloonGeo = new THREE.SphereGeometry(1.2, 16, 16);
    balloonGeo.scale(1, 1.15, 1);
    const stringGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -1.1, 0), new THREE.Vector3(0, -3.5, 0)]);
    const stringMat = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 });

    for (let i = 0; i < 30; i++) {
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const mat = new THREE.MeshLambertMaterial({ color: color });
        const balloon = new THREE.Mesh(balloonGeo, mat);
        balloon.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 80 - 20,
            (Math.random() - 0.5) * 100 - 20
        );
        balloon.add(new THREE.Line(stringGeo, stringMat));
        balloon.userData = { speed: 0.02 + Math.random() * 0.05, driftOffset: Math.random() * Math.PI * 2 };
        balloonGroup.add(balloon);
    }

    // --- CAKE ---
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);
    
    // Materials
    const matPlate = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const matBottom = new THREE.MeshStandardMaterial({ color: 0xa2d2ff, roughness: 0.3 });
    const matTop = new THREE.MeshStandardMaterial({ color: 0xffafcc, roughness: 0.3 });
    const matCream = new THREE.MeshStandardMaterial({ color: 0xfffff0, roughness: 0.4 });
    const matCherry = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.1 });

    // Plate
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(12, 11, 0.5, 64), matPlate);
    plate.position.y = -0.25; plate.receiveShadow = true; cakeGroup.add(plate);

    // Tiers
    const bottomTier = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 5, 64), matBottom);
    bottomTier.position.y = 2.5; bottomTier.castShadow = true; cakeGroup.add(bottomTier);

    const topTier = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 4, 64), matTop);
    topTier.position.y = 7; topTier.castShadow = true; cakeGroup.add(topTier);

    // Sprinkles Function
    const addSprinkles = (tier: any, count: number, radius: number, height: number, yOff: number) => {
        const geo = new THREE.CapsuleGeometry(0.08, 0.3, 4, 8);
        const cols = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        for (let i = 0; i < count; i++) {
            const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: cols[Math.floor(Math.random() * cols.length)] }));
            const a = Math.random() * Math.PI * 2; 
            const r = radius + 0.05;
            m.position.set(Math.cos(a) * r, (Math.random() * height) - (height / 2) + yOff, Math.sin(a) * r);
            m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            cakeGroup.add(m);
        }
    };
    addSprinkles(bottomTier, 100, 7, 4.5, 2.5);
    addSprinkles(topTier, 60, 4.5, 3.5, 7);

    // Piping
    const addPiping = (rad: number, y: number, count: number, s: number) => {
        const g = new THREE.SphereGeometry(s, 16, 16);
        for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2; 
            const m = new THREE.Mesh(g, matCream);
            m.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad); 
            m.scale.y = 0.8; m.castShadow = true; 
            cakeGroup.add(m);
        }
    };
    addPiping(7.2, 0.4, 28, 0.4); 
    addPiping(7, 5.1, 28, 0.3); 
    addPiping(4.7, 5.3, 20, 0.35);

    // Cherries
    const cherryGeo = new THREE.SphereGeometry(0.35, 32, 32);
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2; 
        const c = new THREE.Mesh(cherryGeo, matCherry);
        c.position.set(Math.cos(a) * 3.5, 9.3, Math.sin(a) * 3.5); 
        c.castShadow = true; 
        cakeGroup.add(c);
    }

    // --- CANDLE ---
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.5, 32), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    candle.position.y = 10.25; candle.castShadow = true; cakeGroup.add(candle);
    candle.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), new THREE.MeshBasicMaterial({ color: 0x000000 })).translateY(1.4));

    // Flame
    const flameGeo = new THREE.ConeGeometry(0.25, 0.8, 16);
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 4 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 1.8;
    candle.add(flame);
    flameRef.current = flame;

    const flameLight = new THREE.PointLight(0xffaa00, 2, 10);
    flameLight.position.y = 2;
    candle.add(flameLight);
    flameLightRef.current = flameLight;

    // --- ANIMATION LOOP ---
    let animationId: number;
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        const time = Date.now();
        controls.update();

        // Animate Balloons
        balloonGroup.children.forEach(b => {
            b.position.y += b.userData.speed;
            b.position.x += Math.sin(time * 0.001 + b.userData.driftOffset) * 0.02;
            if (b.position.y > 60) {
                b.position.y = -40;
                b.position.x = (Math.random() - 0.5) * 100;
                b.position.z = (Math.random() - 0.5) * 100 - 20;
            }
        });

        // Flame Animation
        if (flameRef.current && flameRef.current.visible) {
            const t = time * 0.005;
            flameRef.current.scale.setScalar(0.9 + Math.sin(t * 15) * 0.1 + Math.random() * 0.1);
            flameRef.current.rotation.z = Math.sin(t * 5) * 0.1;
            if (flameLightRef.current) {
                flameLightRef.current.intensity = 2 + Math.sin(t * 20) + Math.random() * 0.5;
            }
        }

        // Smoke Animation
        for (let i = smokeParticlesRef.current.length - 1; i >= 0; i--) {
            const p = smokeParticlesRef.current[i];
            p.position.y += p.userData.vy;
            p.position.x += p.userData.vx;
            p.position.z += p.userData.vz;
            p.userData.life -= 0.01;
            // @ts-ignore
            p.material.opacity = p.userData.life * 0.5;
            p.scale.setScalar(1 + (1 - p.userData.life));
            
            if (p.userData.life <= 0) {
                scene.remove(p);
                smokeParticlesRef.current.splice(i, 1);
            }
        }

        renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
        cancelAnimationFrame(animationId);
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
        // Dispose geometries to prevent memory leaks
        renderer.dispose();
        // Stop Mic Stream if active
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    };
  }, []);

  // --- AUDIO & BLOW LOGIC ---
  const initAudio = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;
        
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        // Monitoring loop
        const checkBlow = () => {
            if (!candleLit) return;
            
            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i];
            const average = sum / data.length;

            if (average > 40) { // Threshold for "blowing"
                blowOutCandle();
            } else {
                requestAnimationFrame(checkBlow);
            }
        };
        checkBlow();

    } catch (err) {
        console.error("Mic access denied", err);
        alert("Microphone access is needed to blow out the candle! (Or just tap the screen)");
    }
  };

  const spawnSmoke = () => {
    if (!sceneRef.current || !flameRef.current) return;
    const smokeGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
    
    for (let i = 0; i < 10; i++) {
        const p = new THREE.Mesh(smokeGeo, smokeMat);
        p.position.set(
            0 + (Math.random() - 0.5) * 0.5,
            11.5, // Candle top Y approx
            0 + (Math.random() - 0.5) * 0.5
        );
        p.userData = { 
            vy: 0.05 + Math.random() * 0.05, 
            vx: (Math.random() - 0.5) * 0.02, 
            vz: (Math.random() - 0.5) * 0.02, 
            life: 1.0 
        };
        sceneRef.current.add(p);
        smokeParticlesRef.current.push(p);
    }
  };

  const blowOutCandle = () => {
    if (!candleLit) return;
    setCandleLit(false);
    setListening(false);

    if (flameRef.current) flameRef.current.visible = false;
    if (flameLightRef.current) flameLightRef.current.intensity = 0;

    spawnSmoke();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    
    // Stop audio
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Spin faster
    if (controlsRef.current) {
        controlsRef.current.autoRotateSpeed = 5.0;
    }
  };

  const handleStart = () => {
    if (!name.trim()) {
        alert("Please enter a name!");
        return;
    }
    setStarted(true);
    setListening(true);
    initAudio();
  };

  return (
    <div className="cake-wrapper animate-in zoom-in duration-300">
      <button onClick={onClose} className="cake-close-btn">
        <X size={24} />
      </button>

      {/* THREE.JS MOUNT POINT */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} onClick={() => listening && blowOutCandle()} />

      {/* UI OVERLAY */}
      <div className="cake-ui-layer">
        
        {/* INPUT CARD */}
        <div className={`cake-input-card ${started ? 'hidden' : ''}`}>
            <h1 className="cake-title">Let's Celebrate!</h1>
            <p className="cake-text">Who is this special cake for?</p>
            <input 
                type="text" 
                className="cake-input" 
                placeholder="Enter Name..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <button className="cake-btn" onClick={handleStart}>Make a Wish</button>
        </div>

        {/* WISH TEXT */}
        <div className={`cake-wish-text ${!candleLit ? 'visible' : ''}`}>
            <h2 className="cake-greeting">Happy Birthday {name}!</h2>
            <p className="cake-subtext">May all your wishes come true ✨</p>
        </div>

        {/* INSTRUCTION */}
        <div className={`cake-instruction ${started && candleLit ? 'visible' : ''}`}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                <Mic size={20} />
                <span>Blow into mic (or tap) to make a wish!</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BirthdayCake;