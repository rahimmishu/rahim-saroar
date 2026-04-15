
// আপনার পাইথন সার্ভার যেহেতু 8000 পোর্টে চলে, তাই এই লিংকটা ফিক্সড করে দিন
const API = 'http://localhost:8000';

let sessionId = null;
let currentMode = 'bolto';
let isStreaming = false;
let isListening = false;
let camStream = null;
let autoListenMode = false;
const SPEECH_ERROR_MAX_RETRIES = 3;
let speechErrorRetryCount = 0;
const SPEECH_SEND_DELAY_MS = 500;
const SPEECH_RESTART_DELAY_MS = 700;
let speechSendTimeout = null;
let pendingSendTranscript = null;
let safariVoiceHintShown = false;
let orb = null;
let recognition = null;
let ttsPlayer = null;
const SETTINGS_KEY = 'boltu_settings';
const DEFAULT_SETTINGS = { autoOpenActivity: true, autoOpenSearchResults: true, thinkingSounds: true, voiceInterrupt: true };
const PRE_STARTER_FILES = ['starter_1', 'starter_2', 'starter_3', 'starter_4', 'starter_5', 'starter_6', 'starter_7', 'starter_8', 'starter_9', 'starter_10'];
let PRE_STARTER_CACHE = {};
let settings = { ...DEFAULT_SETTINGS };
const $ = id => document.getElementById(id);
const chatMessages = $('chat-messages');
const messageInput = $('message-input');
const sendBtn      = $('send-btn');
const micBtn       = $('mic-btn');
const ttsBtn       = $('tts-btn');
const newChatBtn   = $('new-chat-btn');
const charCount    = $('char-count');
const welcomeTitle = $('welcome-title');
const modeSlider   = $('mode-slider');
const btnBoltu    = $('btn-boltu');
const statusDot    = document.querySelector('.status-dot');
const statusText   = document.querySelector('.status-text');
const orbContainer = $('orb-container');
const searchResultsToggle = $('search-results-toggle');
const searchResultsWidget = $('search-results-widget');
const searchResultsClose  = $('search-results-close');
const searchResultsQuery  = $('search-results-query');
const searchResultsAnswer = $('search-results-answer');
const searchResultsList   = $('search-results-list');
const activityPanel       = $('activity-panel');
const activityToggle      = $('activity-toggle');
const activityClose       = $('activity-close');
const activityList        = $('activity-list');
const panelOverlay        = $('panel-overlay');
const speechWidget        = $('speech-widget');
const speechWidgetText    = $('speech-widget-text');
const settingsBtn         = $('settings-btn');
const camBtn              = $('cam-btn');
const camPanel            = $('cam-panel');
const camVideo            = $('cam-video');
const camCanvas           = $('cam-canvas');
const camVisionModeInput  = $('cam-vision-mode');
const camMinimize         = $('cam-minimize');
const camClose            = $('cam-close');
const camPanelHeader      = $('cam-panel-header');
const camPanelResize      = $('cam-panel-resize');
const settingsPanel       = $('settings-panel');
const settingsClose       = $('settings-close');
const toggleAutoActivity  = $('toggle-auto-activity');
const toggleAutoSearch    = $('toggle-auto-search');
const toggleThinkingSounds = $('toggle-thinking-sounds');
const toggleVoiceInterrupt = $('toggle-voice-interrupt');
const toastContainer     = $('toast-container');

class PreStarterPlayer {
    constructor() {
        this.audio = document.createElement('audio');
        this.audio.preload = 'auto';
    }
    play(onComplete) {
        const loaded = PRE_STARTER_FILES.filter(f => PRE_STARTER_CACHE[f]);
        if (loaded.length === 0) {
            if (onComplete) onComplete();
            return;
        }
        const file = loaded[Math.floor(Math.random() * loaded.length)];
        const base64 = PRE_STARTER_CACHE[file];
        if (!base64) {
            if (onComplete) onComplete();
            return;
        }
        this.audio.src = 'data:audio/mp3;base64,' + base64;
        this.audio.currentTime = 0;
        let fired = false;
        const done = () => {
            if (fired) return;
            fired = true;
            this.audio.onended = null;
            this.audio.onerror = null;
            if (onComplete) onComplete();
        };
        this.audio.onended = done;
        this.audio.onerror = done;
        const p = this.audio.play();
        if (p) p.catch(done);
    }
}

let preStarterPlayer = null;

class TTSPlayer {
    constructor() {
        this.queue = [];
        this.playing = false;
        this.enabled = true;
        this.stopped = false;
        this.audio = document.createElement('audio');
        this.audio.preload = 'auto';
    }
    unlock() {
        const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.audio.src = silentWav;
        const p = this.audio.play();
        if (p) p.catch(() => {});
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const g = ctx.createGain();
            g.gain.value = 0;
            const o = ctx.createOscillator();
            o.connect(g);
            g.connect(ctx.destination);
            o.start(0);
            o.stop(ctx.currentTime + 0.001);
            setTimeout(() => ctx.close(), 200);
        } catch (_) {}
    }
    enqueue(base64Audio) {
        if (!this.enabled || this.stopped) return;
        this.queue.push(base64Audio);
        if (!this.playing) this._playLoop();
    }
    stop() {
        this.stopped = true;
        this.audio.pause();
        this.audio.removeAttribute('src');
        this.audio.load();
        this.queue = [];
        this.playing = false;
        if (ttsBtn) ttsBtn.classList.remove('tts-speaking');
        if (orbContainer) orbContainer.classList.remove('speaking');
        if (orb && orb.setAIState) orb.setAIState('idle');
        if (typeof this.onPlaybackComplete === 'function') this.onPlaybackComplete();
    }
    reset() {
        this.stop();
        this.stopped = false;
        this._loopId = (this._loopId || 0) + 1;
    }
    async _playLoop() {
        if (this.playing) return;
        this.playing = true;
        this._loopId = (this._loopId || 0) + 1;
        const myId = this._loopId;
        if (ttsBtn) ttsBtn.classList.add('tts-speaking');
        if (orbContainer) orbContainer.classList.add('speaking');
        if (orb && orb.setAIState) orb.setAIState('speaking');
        // ✅ Optimized: Process queue until stopped or cancelled, no redundant checks
        try {
            while (this.queue.length > 0 && !this.stopped && myId === this._loopId) {
                const b64 = this.queue.shift();
                try {
                    await this._playB64(b64);
                } catch (e) {
                    console.warn('TTS segment error:', e);
                }
            }
        } finally {
            // ✅ Cleanup: Only run if this is the current playback session
            if (myId === this._loopId) {
                this.playing = false;
                if (ttsBtn) ttsBtn.classList.remove('tts-speaking');
                if (orbContainer) orbContainer.classList.remove('speaking');
                if (orb && orb.setAIState) orb.setAIState('idle');
                if (typeof this.onPlaybackComplete === 'function') this.onPlaybackComplete();
            }
        }
    }
    _playB64(b64) {
        return new Promise(resolve => {
            this.audio.src = 'data:audio/mp3;base64,' + b64;
            const done = () => { resolve(); };
            this.audio.onended = done;
            this.audio.onerror = done;
            const p = this.audio.play();
            if (p) p.catch(done);
        });
    }
}

function init() {
    if (!chatMessages || !messageInput) {
        console.error('[BOLTU] Required DOM elements (chat-messages, message-input) not found.');
        return;
    }
    loadSettings();
    ttsPlayer = new TTSPlayer();
    ttsPlayer.onPlaybackComplete = maybeRestartListening;
    if (ttsBtn) ttsBtn.classList.add('tts-active');
    setGreeting();
    initOrb();
    initSpeech();
    preloadStarterAudio();
    preStarterPlayer = new PreStarterPlayer();
    checkHealth();
    bindEvents();
    setMode(currentMode);
    autoResizeInput();
}

async function preloadStarterAudio() {
    const base = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : '';
    for (const file of PRE_STARTER_FILES) {
        try {
            const r = await fetch(`${base}/app/audio/${file}.mp3`);
            if (!r.ok) continue;
            const blob = await r.blob();
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result || '').split(',')[1] || '');
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            if (base64) PRE_STARTER_CACHE[file] = base64;
        } catch (_) {}
    }
}

function loadSettings() {
    try {
        const s = localStorage.getItem(SETTINGS_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            settings = { ...DEFAULT_SETTINGS, ...parsed };
        }
        if (toggleAutoActivity) toggleAutoActivity.checked = settings.autoOpenActivity;
        if (toggleAutoSearch) toggleAutoSearch.checked = settings.autoOpenSearchResults;
        if (toggleThinkingSounds) toggleThinkingSounds.checked = settings.thinkingSounds;
        if (toggleVoiceInterrupt) toggleVoiceInterrupt.checked = settings.voiceInterrupt;
    } catch (_) {}
}

function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
}


function setGreeting() {
    const h = new Date().getHours();
    let g = 'Good evening.';
    if (h < 12) g = 'Good morning.';
    else if (h < 17) g = 'Good afternoon.';
    else if (h >= 22) g = 'Burning the midnight oil?';
    if (welcomeTitle) welcomeTitle.textContent = g;
}

function initOrb() {
    if (typeof OrbRenderer === 'undefined') return;
    try {
        orb = new OrbRenderer(orbContainer, {
            hue: 0,
            hoverIntensity: 0.3,
            backgroundColor: [0.02, 0.02, 0.06]
        });
    } catch (e) { console.warn('Orb init failed:', e); }
}

function isSafariOrIOS() {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) ||
        (navigator.vendor && navigator.vendor.indexOf('Apple') > -1) ||
        (/Safari/.test(ua) && !/Chrome|Chromium|CriOS/.test(ua));
}

function initSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { micBtn.title = 'Speech not supported in this browser'; return; }
    recognition = new SR();
    const safariMode = isSafariOrIOS();
    recognition.continuous = false;
    recognition.interimResults = !safariMode;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';
    recognition.onresult = e => {
        if (!e.results || e.results.length === 0) return;
        const last = e.results[e.results.length - 1];
        const transcript = (last && last[0]) ? last[0].transcript.trim() : '';
        const isFinal = last && last.isFinal;
        if (speechWidgetText) speechWidgetText.textContent = transcript;
        if (speechWidget) speechWidget.classList.add('visible');
        if (settings.voiceInterrupt && ttsPlayer && ttsPlayer.playing && transcript.length > 0) {
            ttsPlayer.stop();
            ttsPlayer.stopped = false;
        }
        if (isFinal && transcript) {
            pendingSendTranscript = transcript;
            clearTimeout(speechSendTimeout);
            speechSendTimeout = setTimeout(() => {
                if (pendingSendTranscript) {
                    sendMessage(pendingSendTranscript);
                    pendingSendTranscript = null;
                }
                speechSendTimeout = null;
                stopListening();
            }, SPEECH_SEND_DELAY_MS);
        } else if (!isFinal) {
            pendingSendTranscript = null;
            clearTimeout(speechSendTimeout);
            speechSendTimeout = null;
        }
    };

    recognition.onstart = () => { speechErrorRetryCount = 0; };
    recognition.onerror = e => {
        stopListening();
        const msg = (e && e.error) ? String(e.error) : '';
        const isPermissionDenied = /denied|not-allowed|permission/i.test(msg);
        if (isPermissionDenied && micBtn) {
            micBtn.title = 'Microphone access denied. Allow in browser settings.';
            speechErrorRetryCount = SPEECH_ERROR_MAX_RETRIES;
        }
        if (autoListenMode && !isStreaming && speechErrorRetryCount < SPEECH_ERROR_MAX_RETRIES) {
            speechErrorRetryCount++;
            setTimeout(() => maybeRestartListening(), SPEECH_RESTART_DELAY_MS);
        } else if (speechErrorRetryCount >= SPEECH_ERROR_MAX_RETRIES && micBtn) {
            micBtn.title = 'Voice input — click to try again';
        }
    };

    recognition.onend = () => {
        if (pendingSendTranscript) {
            clearTimeout(speechSendTimeout);
            speechSendTimeout = null;
            sendMessage(pendingSendTranscript);
            pendingSendTranscript = null;
        } else {
            clearTimeout(speechSendTimeout);
            speechSendTimeout = null;
        }
        if (isListening) stopListening();
        maybeRestartListening();
    };
}

function startListening() {
    if (!recognition || isStreaming || isListening) return;
    if (isSafariOrIOS() && !safariVoiceHintShown) {
        showToast('Voice works best in Chrome. Safari has limited support.');
        safariVoiceHintShown = true;
    }
    isListening = true;
    pendingSendTranscript = null;
    clearTimeout(speechSendTimeout);
    speechSendTimeout = null;
    if (micBtn) micBtn.classList.add('listening');
    if (speechWidget) speechWidget.classList.add('visible');
    if (speechWidgetText) speechWidgetText.textContent = '';
    try {
        recognition.start();
    } catch (err) {
        isListening = false;
        if (micBtn) micBtn.classList.remove('listening');
        if (speechWidget) speechWidget.classList.remove('visible');
        if (isSafariOrIOS()) showToast('Tap the mic to continue voice input.');
    }
}

function stopListening() {
    clearTimeout(speechSendTimeout);
    speechSendTimeout = null;
    pendingSendTranscript = null;
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (speechWidget) speechWidget.classList.remove('visible');
    if (speechWidgetText) speechWidgetText.textContent = '';
    try { recognition.stop(); } catch (_) {}
}

function maybeRestartListening() {
    if (!autoListenMode || !recognition) return;
    if (isStreaming) return;

    const ttsActive = ttsPlayer && (ttsPlayer.playing || ttsPlayer.queue.length > 0);
    if (ttsActive && !settings.voiceInterrupt) return;

    const delay = ttsActive ? 150 : SPEECH_RESTART_DELAY_MS;
    setTimeout(() => {
        if (autoListenMode && !isStreaming && !isListening && recognition) {
            startListening();
        }
    }, delay);
}

const CAM_BYPASS_TOKEN = 'TTCAMTOKENTT';
const CAMERA_QUERY_PATTERNS = [
    /what\s+(can|do)\s+you\s+see/i,
    /can\s+you\s+see/i,
    /describe\s+(what\s+you\s+see|this|the\s+image)/i,
    /what('s|s)\sss+in\sss+(this\sss+)?(picture|image)/i,
    /what\s+do\s+i\s+look\s+like/i,
    /what\s+(am\s+i\s+)?holding/i,
    /show\s+me\s+what\s+you\s+see/i,
];
function isCameraQuery(text) {
    if (!text || typeof text !== 'string') return false;
    const t = text.trim().toLowerCase();
    return CAMERA_QUERY_PATTERNS.some(r => r.test(t)) ||
        (t.includes('see') && (t.includes('what') || t.includes('describe')));
}

function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Camera not supported in this browser.');
        return Promise.reject(new Error('Camera not supported'));
    }
    if (camStream) return Promise.resolve();
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(stream => {
            camStream = stream;
            if (camVideo) camVideo.srcObject = stream;
            if (camPanel) { camPanel.classList.add('visible'); camPanel.setAttribute('aria-hidden', 'false'); }
            if (camBtn) {
                camBtn.classList.add('cam-active');
                camBtn.title = 'Camera on — click to turn off';
                const icon = camBtn.querySelector('.cam-icon');
                const iconActive = camBtn.querySelector('.cam-icon-active');
                if (icon) icon.style.display = 'none';
                if (iconActive) iconActive.style.display = '';
            }
        })
        .catch(err => {
            showToast('Camera access denied. ' + (err.message || ''));
            throw err;
        });
}

function stopCamera() {
    if (camStream) {
        camStream.getTracks().forEach(t => t.stop());
        camStream = null;
    }
    if (camVideo) camVideo.srcObject = null;
    if (camPanel) { camPanel.classList.remove('visible'); camPanel.setAttribute('aria-hidden', 'true'); }
    if (camVisionModeInput) camVisionModeInput.checked = false;
    if (camBtn) {
        camBtn.classList.remove('cam-active');
        camBtn.title = 'Camera — capture and send for vision';
        const icon = camBtn.querySelector('.cam-icon');
        const iconActive = camBtn.querySelector('.cam-icon-active');
        if (icon) icon.style.display = '';
        if (iconActive) iconActive.style.display = 'none';
    }
}

function initCameraPanel() {
    if (!camPanel) return;
    let dragStart = { x: 0, y: 0, left: 0, top: 0 };
    let resizeStart = { x: 0, y: 0, w: 0, h: 0 };
    if (camClose) camClose.addEventListener('click', () => stopCamera());
    if (camMinimize) camMinimize.addEventListener('click', () => {
        camPanel.classList.toggle('minimized');
    });
    if (camPanelHeader) {
        camPanelHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.cam-panel-btn, .cam-panel-vision-mode')) return;
            e.preventDefault();
            const r = camPanel.getBoundingClientRect();
            dragStart = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
            const onMove = (ev) => {
                const dx = ev.clientX - dragStart.x;
                const dy = ev.clientY - dragStart.y;
                camPanel.style.left = (dragStart.left + dx) + 'px';
                camPanel.style.top = (dragStart.top + dy) + 'px';
                camPanel.style.right = 'auto';
                camPanel.style.bottom = 'auto';
            };
            const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }
    if (camPanelResize) {
        camPanelResize.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const r = camPanel.getBoundingClientRect();
            resizeStart = { x: e.clientX, y: e.clientY, w: r.width, h: r.height };
            const onMove = (ev) => {
                const dw = ev.clientX - resizeStart.x;
                const dh = ev.clientY - resizeStart.y;
                const nw = Math.max(200, Math.min(window.innerWidth, resizeStart.w + dw));
                const nh = Math.max(150, Math.min(window.innerHeight * 0.7, resizeStart.h + dh));
                camPanel.style.width = nw + 'px';
                camPanel.style.height = nh + 'px';
            };
            const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }
    camPanel.addEventListener('dblclick', (e) => {
        if (e.target.closest('.cam-panel-header') && !e.target.closest('.cam-panel-btn, .cam-panel-vision-mode')) {
            camPanel.classList.toggle('minimized');
        }
    });
    camPanel.querySelector('.cam-panel-body')?.addEventListener('click', (e) => {
        if (camPanel.classList.contains('minimized')) camPanel.classList.remove('minimized');
    });
}

function handleActions(actions, contentEl) {
    if (!actions) return;
    if (!contentEl) return;
    const safeOpen = url => {
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            try {
                const w = window.open(url, '_blank', 'noopener');
                if (!w) showToast('Pop-up blocked. Please allow pop-ups or copy the URL.');
            } catch (_) {
                showToast('Could not open link. Please try again.');
            }
        }
    };
    (actions.wopens || []).forEach(safeOpen);
    (actions.plays || []).forEach(safeOpen);
    (actions.googlesearches || []).forEach(safeOpen);
    (actions.youtubesearches || []).forEach(safeOpen);
    if (actions.images && actions.images.length > 0) {
        const wrap = document.createElement('div');
        wrap.className = 'msg-actions-images';
        actions.images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Generated image';
            img.className = 'msg-action-image';
            img.loading = 'lazy';
            img.onerror = () => {
                img.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'msg-action-image-fallback';
                fallback.textContent = 'Image failed to load.';
                wrap.appendChild(fallback);
            };
            wrap.appendChild(img);
        });
        contentEl.appendChild(wrap);
    }
    if (actions.contents && actions.contents.length > 0) {
        const wrap = document.createElement('div');
        wrap.className = 'msg-actions-contents';
        actions.contents.forEach(t => {
            const p = document.createElement('div');
            p.className = 'msg-action-content';
            p.textContent = t;
            wrap.appendChild(p);
        });
        contentEl.appendChild(wrap);
    }
    if (actions.cam) {
        if (actions.cam.action === 'open') {
            startCamera();
        } else if (actions.cam.action === 'close') {
            stopCamera();
        } else if (actions.cam.action === 'open_and_capture') {
            const resendMsg = actions.cam.resend_message || 'What do you see?';
            (async () => {
                try {
                    await startCamera();
                    await new Promise((resolve) => {
                        if (!camVideo) { resolve(); return; }
                        if (camVideo.readyState >= 2 && camVideo.videoWidth > 0) {
                            setTimeout(resolve, 500);
                            return;
                        }
                        const onReady = () => {
                            camVideo.removeEventListener('loadeddata', onReady);
                            clearTimeout(t);
                            setTimeout(resolve, 600);
                        };
                        const t = setTimeout(() => {
                            camVideo.removeEventListener('loadeddata', onReady);
                            resolve();
                        }, 4000);
                        camVideo.addEventListener('loadeddata', onReady);
                    });
                    const frame = await captureFrameAsBase64Safe();
                    if (frame) {
                        sendMessageWithImage(resendMsg, frame);
                    } else {
                        showToast('Could not capture camera frame. Please try again.');
                    }
                } catch (err) {
                    showToast('Camera access denied.');
                }
            })();
        }
    }
}

function handleBackgroundTasks(tasks, contentEl) {
    if (!tasks || !tasks.length || !contentEl) return;
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'bg-task-card';
        card.dataset.taskId = task.task_id;
        const label = task.type === 'generate image' ? 'Image Generation' : task.type === 'content' ? 'Content Writing' : task.type;
        const promptText = task.label ? `"${task.label}"` : '';
        card.innerHTML =
            '<div class="bg-task-header">' +
                '<div class="bg-task-spinner"></div>' +
                '<span class="bg-task-label">' + label + '</span>' +
                '<span class="bg-task-status">Working...</span>' +
            '</div>' +
            (promptText ? '<div class="bg-task-prompt">' + promptText + '</div>' : '');
        contentEl.appendChild(card);
        scrollToBottom();
        pollBackgroundTask(task.task_id, card);
    });
}

function pollBackgroundTask(taskId, cardEl) {
    let pollCount = 0;
    const maxPolls = 120;
    const interval = setInterval(() => {
        pollCount++;
        if (pollCount > maxPolls) {
            clearInterval(interval);
            updateTaskCard(cardEl, 'failed', 'Timed out');
            return;
        }
        fetch(`${API}/tasks/${encodeURIComponent(taskId)}`)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                if (data.status === 'completed') {
                    clearInterval(interval);
                    updateTaskCard(cardEl, 'completed', data);
                } else if (data.status === 'failed') {
                    clearInterval(interval);
                    updateTaskCard(cardEl, 'failed', data.error || 'Task failed');
                }
            })
            .catch(() => {  });
    }, 1500);
}

function updateTaskCard(cardEl, status, data) {
    if (!cardEl) return;
    const spinner = cardEl.querySelector('.bg-task-spinner');
    const statusEl = cardEl.querySelector('.bg-task-status');
    if (status === 'completed') {
        if (spinner) spinner.className = 'bg-task-done-icon';
        if (statusEl) statusEl.textContent = 'Ready!';
        cardEl.classList.add('bg-task-done');
        const viewBtn = document.createElement('button');
        viewBtn.className = 'bg-task-view-btn';
        viewBtn.textContent = 'Open in new tab';
        viewBtn.addEventListener('click', () => {
            const taskId = cardEl.dataset.taskId;
            window.open(`${window.location.origin}/app/viewer.html?task_id=${taskId}`, '_blank');
        });
        cardEl.appendChild(viewBtn);
        try {
            const taskId = cardEl.dataset.taskId;
            const w = window.open(`${window.location.origin}/app/viewer.html?task_id=${taskId}`, '_blank');
            if (!w) {
                showToast('Result ready! Click "Open in new tab" to view.');
            }
        } catch (_) {  }
    } else if (status === 'failed') {
        if (spinner) spinner.className = 'bg-task-fail-icon';
        if (statusEl) statusEl.textContent = typeof data === 'string' ? data : 'Failed';
        cardEl.classList.add('bg-task-failed');
    }
    scrollToBottom();
}

function captureFrameAsBase64() {
    if (!camVideo || !camStream || camVideo.readyState < 2) return null;
    if (!camCanvas) return null;
    const w = camVideo.videoWidth;
    const h = camVideo.videoHeight;
    if (!w || !h || w < 64 || h < 64) return null;
    camCanvas.width = w;
    camCanvas.height = h;
    const ctx = camCanvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(camVideo, 0, 0, w, h);
    try {
        return camCanvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    } catch (_) {
        return null;
    }
}

async function captureFrameAsBase64Safe() {
    if (!camVideo || !camStream || !camCanvas) return null;
    return new Promise((resolve) => {
        const doCapture = () => {
            const w = camVideo.videoWidth;
            const h = camVideo.videoHeight;
            if (!w || !h || w < 64 || h < 64) {
                resolve(null);
                return;
            }
            camCanvas.width = w;
            camCanvas.height = h;
            const ctx = camCanvas.getContext('2d');
            if (!ctx) { resolve(null); return; }
            ctx.drawImage(camVideo, 0, 0, w, h);
            try {
                const b64 = camCanvas.toDataURL('image/jpeg', 0.9).split(',')[1];
                resolve(b64);
            } catch (_) {
                resolve(null);
            }
        };
        if (camVideo.readyState < 2) {
            const onReady = () => { camVideo.removeEventListener('loadeddata', onReady); doCapture(); };
            camVideo.addEventListener('loadeddata', onReady);
            setTimeout(() => { camVideo.removeEventListener('loadeddata', onReady); doCapture(); }, 3000);
            return;
        }
        const w = camVideo.videoWidth;
        const h = camVideo.videoHeight;
        if (w && h && w >= 64 && h >= 64) {
            if (typeof camVideo.requestVideoFrameCallback === 'function') {
                camVideo.requestVideoFrameCallback(() => { doCapture(); });
            } else {
                setTimeout(doCapture, 150);
            }
        } else {
            setTimeout(() => {
                const w2 = camVideo.videoWidth || 0;
                const h2 = camVideo.videoHeight || 0;
                if (w2 && h2 && w2 >= 64 && h2 >= 64) doCapture();
                else resolve(null);
            }, 300);
        }
    });
}

async function sendMessageWithImage(text, imgBase64) {
    if (!text || !imgBase64 || isStreaming) return;
    const messageToSend = text + ' ' + CAM_BYPASS_TOKEN;
    addMessage('user', text);
    addTypingIndicator();
    isStreaming = true;
    if (sendBtn) sendBtn.disabled = true;
    if (messageInput) messageInput.disabled = true;
    if (orbContainer) orbContainer.classList.add('active');
    if (ttsPlayer) { ttsPlayer.reset(); ttsPlayer.unlock(); }
    let timeoutId = null;
    const controller = new AbortController();
    try {
        timeoutId = setTimeout(() => controller.abort(), 300000);
        const res = await fetch(`${API}/chat/jarvis/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: messageToSend,
                session_id: sessionId,
                tts: !!(ttsPlayer && ttsPlayer.enabled),
                imgbase64: imgBase64,
            }),
            signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        removeTypingIndicator();
        const contentEl = addMessage('assistant', '');
        contentEl.innerHTML = '<span class="msg-stream-text">...</span>';
        scrollToBottom();
        if (!res.body) throw new Error('No response body');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let sseBuffer = '';
        let fullResponse = '';
        let cursorEl = null;
        // ✅ Optimized: Simplified stream processing without redundant flag
        while (true) {
            const { done, value } = await reader.read();
            if (done) break; // Exit on reader EOF
            
            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split('\n\n');
            sseBuffer = lines.pop();
            
            // Process each SSE line
            let shouldStop = false;
            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.session_id) sessionId = data.session_id;
                    if (data.activity) {
                        appendActivity(data.activity);
                        if (activityToggle) activityToggle.style.display = '';
                        if (activityPanel && settings.autoOpenActivity) { activityPanel.classList.add('open'); updatePanelOverlay(); }
                    }
                    if (data.actions) handleActions(data.actions, contentEl);
                    if (data.background_tasks) handleBackgroundTasks(data.background_tasks, contentEl);
                    if ('chunk' in data) {
                        const chunkText = data.chunk || '';
                        fullResponse += chunkText;
                        const textSpan = contentEl.querySelector('.msg-stream-text');
                        if (textSpan) {
                            textSpan.textContent = fullResponse;
                            textSpan.classList.remove('stream-placeholder');
                        }
                        if (!cursorEl) {
                            cursorEl = document.createElement('span');
                            cursorEl.className = 'stream-cursor';
                            cursorEl.textContent = '|';
                            contentEl.appendChild(cursorEl);
                        }
                        scrollToBottom();
                    }
                    if (data.audio && ttsPlayer) ttsPlayer.enqueue(data.audio);
                    if (data.error) throw new Error(data.error);
                    // ✅ Set flag to exit outer loop when stream completes
                    if (data.done) { shouldStop = true; break; }
                } catch (parseErr) {
                    if (parseErr.message && !parseErr.message.includes('JSON')) throw parseErr;
                }
            }
            // ✅ Exit outer loop if stream signaled completion
            if (shouldStop) break;
        }
        if (cursorEl) cursorEl.remove();
        const textSpan = contentEl.querySelector('.msg-stream-text');
        if (textSpan && !fullResponse) textSpan.textContent = '(No response)';
    } catch (err) {
        clearTimeout(timeoutId);
        removeTypingIndicator();
        addMessage('assistant', 'Something went wrong analyzing the image. Please try again.');
    } finally {
        clearTimeout(timeoutId);
        isStreaming = false;
        if (sendBtn) sendBtn.disabled = false;
        if (messageInput) messageInput.disabled = false;
        if (orbContainer) orbContainer.classList.remove('active');
    }
}

async function checkHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const r = await fetch(`${API}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const d = await r.json().catch(() => null);
        const ok = d && (d.status === 'healthy' || d.status === 'degraded');
        if (statusDot) statusDot.classList.toggle('offline', !ok);
        if (statusText) statusText.textContent = ok ? 'Online' : 'Offline';
    } catch (e) {
        if (statusDot) statusDot.classList.add('offline');
        if (statusText) statusText.textContent = 'Offline';
        if (typeof console !== 'undefined' && console.warn) console.warn('[Health] Check failed:', e);
    }
}

function showToast(msg, durationMs = 5000) {
    if (!toastContainer || !msg) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toastContainer.appendChild(el);
    el.offsetHeight;
    el.classList.add('toast-visible');
    const t = setTimeout(() => {
        el.classList.remove('toast-visible');
        setTimeout(() => el.remove(), 300);
    }, durationMs);
    el.addEventListener('click', () => { clearTimeout(t); el.classList.remove('toast-visible'); setTimeout(() => el.remove(), 300); });
}

function bindEvents() {
    if (sendBtn) sendBtn.addEventListener('click', () => { if (!isStreaming) sendMessage(); });
    if (messageInput) messageInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!isStreaming) sendMessage(); }
    });
    if (messageInput) messageInput.addEventListener('input', () => {
        autoResizeInput();
        const len = messageInput.value.length;
        if (charCount) charCount.textContent = len > 100 ? `${len.toLocaleString()} / 32,000` : '';
    });
    if (camBtn) camBtn.addEventListener('click', () => {
        if (camStream) stopCamera();
        else startCamera();
    });
    initCameraPanel();
    if (micBtn) micBtn.addEventListener('click', () => {
        if (isListening) {
            autoListenMode = false;
            stopListening();
            if (micBtn) micBtn.classList.remove('auto-listen');
        } else {
            autoListenMode = true;
            speechErrorRetryCount = 0;
            if (micBtn) {
                micBtn.classList.add('auto-listen');
                micBtn.title = 'Voice input — click to stop auto-listen';
            }
            startListening();
        }
    });
    if (ttsBtn) ttsBtn.addEventListener('click', () => {
        if (ttsPlayer) ttsPlayer.enabled = !ttsPlayer.enabled;
        ttsBtn.classList.toggle('tts-active', ttsPlayer && ttsPlayer.enabled);
        if (ttsPlayer && !ttsPlayer.enabled) ttsPlayer.stop();
    });
    if (newChatBtn) newChatBtn.addEventListener('click', newChat);
    if (btnBoltu) btnBoltu.addEventListener('click', () => setMode('bolto'));
    document.querySelectorAll('.chip').forEach(c => {
        c.addEventListener('click', () => { if (!isStreaming) sendMessage(c.dataset.msg); });
    });
    if (searchResultsToggle) {
        searchResultsToggle.addEventListener('click', () => {
            if (searchResultsWidget) { searchResultsWidget.classList.toggle('open'); updatePanelOverlay(); }
        });
    }
    if (searchResultsClose && searchResultsWidget) {
        searchResultsClose.addEventListener('click', () => { searchResultsWidget.classList.remove('open'); updatePanelOverlay(); });
    }
    if (activityToggle) {
        activityToggle.addEventListener('click', () => {
            if (activityPanel) { activityPanel.classList.toggle('open'); updatePanelOverlay(); }
        });
    }
    if (activityClose && activityPanel) {
        activityClose.addEventListener('click', () => { activityPanel.classList.remove('open'); updatePanelOverlay(); });
    }
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('open');
            updatePanelOverlay();
        });
    }
    if (settingsClose && settingsPanel) {
        settingsClose.addEventListener('click', () => {
            settingsPanel.classList.remove('open');
            updatePanelOverlay();
        });
    }
    if (toggleAutoActivity) {
        toggleAutoActivity.addEventListener('change', () => {
            settings.autoOpenActivity = toggleAutoActivity.checked;
            saveSettings();
        });
    }
    if (toggleAutoSearch) {
        toggleAutoSearch.addEventListener('change', () => {
            settings.autoOpenSearchResults = toggleAutoSearch.checked;
            saveSettings();
        });
    }
    if (toggleThinkingSounds) {
        toggleThinkingSounds.addEventListener('change', () => {
            settings.thinkingSounds = toggleThinkingSounds.checked;
            saveSettings();
        });
    }
    if (toggleVoiceInterrupt) {
        toggleVoiceInterrupt.addEventListener('change', () => {
            settings.voiceInterrupt = toggleVoiceInterrupt.checked;
            saveSettings();
        });
    }
}

function autoResizeInput() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

function updatePanelOverlay() {
    if (!panelOverlay) return;
    const anyOpen = (activityPanel && activityPanel.classList.contains('open')) ||
        (searchResultsWidget && searchResultsWidget.classList.contains('open')) ||
        (settingsPanel && settingsPanel.classList.contains('open'));
    panelOverlay.classList.toggle('visible', !!anyOpen);
}

function setMode(mode) {
    currentMode = mode || 'bolto';
    if (btnBoltu) btnBoltu.classList.add('active');
    if (modeSlider) modeSlider.classList.remove('center', 'right');
    if (activityToggle) activityToggle.style.display = '';
}

function newChat() {
    if (ttsPlayer) ttsPlayer.stop();
    if (camStream) stopCamera();
    sessionId = null;
    if (chatMessages) chatMessages.innerHTML = '';
    chatMessages.appendChild(createWelcome());
    messageInput.value = '';
    autoResizeInput();
    setGreeting();
    if (searchResultsWidget) searchResultsWidget.classList.remove('open');
    if (searchResultsToggle) searchResultsToggle.style.display = 'none';
    if (activityPanel) activityPanel.classList.remove('open');
    if (settingsPanel) settingsPanel.classList.remove('open');
    if (activityToggle) activityToggle.style.display = 'none';
    if (activityList) {
        activityList.innerHTML = '<div class="activity-empty" id="activity-empty">Send a message to see the flow here.</div>';
    }
    updatePanelOverlay();
}

function createWelcome() {
    const h = new Date().getHours();
    let g = 'Good evening.';
    if (h < 12) g = 'Good morning.';
    else if (h < 17) g = 'Good afternoon.';
    else if (h >= 22) g = 'Burning the midnight oil?';
    const div = document.createElement('div');
    div.className = 'welcome-screen';
    div.id = 'welcome-screen';
    div.innerHTML = `
        <div class="welcome-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <h2 class="welcome-title">${g}</h2>
        <p class="welcome-sub">How may I assist you today?</p>
        <div class="welcome-chips">
            <button class="chip" data-msg="What can you do?">What can you do?</button>
            <button class="chip" data-msg="Open YouTube for me">Open YouTube</button>
            <button class="chip" data-msg="Tell me a fun fact">Fun fact</button>
            <button class="chip" data-msg="Play some music">Play music</button>
        </div>`;
    div.querySelectorAll('.chip').forEach(c => {
        c.addEventListener('click', () => { if (!isStreaming) sendMessage(c.dataset.msg); });
    });
    return div;
}

function isUrlLike(str) {
    if (!str || typeof str !== 'string') return false;
    const s = str.trim();
    return s.length > 40 && (/^https?:\/\//i.test(s));
}

function friendlyUrlLabel(url) {
    if (!url || typeof url !== 'string') return 'View source';
    try {
        const u = new URL(url.startsWith('http') ? url : 'https://' + url);
        const host = u.hostname.replace(/^www\./, '');
        const path = u.pathname !== '/' ? u.pathname.slice(0, 20) + (u.pathname.length > 20 ? '…' : '') : '';
        return path ? host + path : host;
    } catch (_) {
        return url.length > 40 ? url.slice(0, 37) + '…' : url;
    }
}

function truncateSnippet(text, maxLen) {
    if (!text || typeof text !== 'string') return '';
    const t = text.trim();
    if (t.length <= maxLen) return t;
    return t.slice(0, maxLen).trim() + '…';
}

function renderSearchResults(payload) {
    if (!payload) return;
    if (searchResultsQuery) searchResultsQuery.textContent = (payload.query || '').trim() || 'Search';
    if (searchResultsAnswer) searchResultsAnswer.textContent = (payload.answer || '').trim() || '';
    if (!searchResultsList) return;
    searchResultsList.innerHTML = '';
    const results = payload.results || [];
    const maxContentLen = 220;
    for (const r of results) {
        let title = (r.title || '').trim();
        let content = (r.content || '').trim();
        const url = (r.url || '').trim();
        if (isUrlLike(title)) title = friendlyUrlLabel(url) || 'Source';
        if (!title) title = friendlyUrlLabel(url) || 'Source';
        if (isUrlLike(content)) content = '';
        content = truncateSnippet(content, maxContentLen);
        const score = r.score != null ? Math.round((r.score || 0) * 100) : null;
        const card = document.createElement('div');
        card.className = 'search-result-card';
        const urlDisplay = url ? escapeHtml(friendlyUrlLabel(url)) : '';
        const hrefSafe = safeUrlForHref(url);
        const urlMarkup = urlDisplay
            ? (hrefSafe ? `<a href="${hrefSafe}" target="_blank" rel="noopener" class="card-url" title="${escapeAttr(url)}">${urlDisplay}</a>` : `<span class="card-url">${urlDisplay}</span>`)
            : '';
        card.innerHTML = `
            <div class="card-title">${escapeHtml(title)}</div>
            ${content ? `<div class="card-content">${escapeHtml(content)}</div>` : ''}
            ${urlMarkup}
            ${score != null ? `<div class="card-score">Relevance: ${escapeHtml(String(score))}%</div>` : ''}`;
        searchResultsList.appendChild(card);
    }
}

function safeUrlForHref(url) {
    if (!url || typeof url !== 'string') return '';
    const u = url.trim();
    if (u.startsWith('https://') || u.startsWith('http://')) return escapeAttr(u);
    return '';
}

function escapeAttr(str) {
    if (typeof str !== 'string') return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

const ACTIVITY_STEPS = {
    query_detected:      { step: 1, label: 'Query detected' },
    decision:            { step: 2, label: 'Primary Brain' },
    intent_classified:   { step: 3, label: 'Task Brain' },
    routing:             { step: 4, label: 'Route selected' },
    tasks_executing:     { step: 0, label: 'Executing tasks' },
    tasks_completed:     { step: 0, label: 'Tasks completed' },
    actions_emitted:     { step: 0, label: 'Actions sent' },
    vision_analyzing:    { step: 0, label: 'Analyzing image' },
    streaming_started:   { step: 5, label: 'Streaming response' },
    extracting_query:    { step: 0, label: 'Extracting query' },
    searching_web:       { step: 0, label: 'Searching web' },
    search_completed:    { step: 0, label: 'Search completed' },
    context_retrieved:   { step: 0, label: 'Context retrieved' },
    background_dispatched: { step: 0, label: 'Background tasks' },
    first_chunk:         { step: 6, label: 'Core responded' },
};

function appendActivity(activity) {
    if (!activityList || !activity) return;
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.setAttribute('data-event', activity.event || '');
    const stepInfo = ACTIVITY_STEPS[activity.event] || { step: 0, label: activity.event || 'Activity', icon: 'dot' };
    let detail = '';
    const addRouteClass = (route) => {
        if (route === 'general') item.classList.add('route-general');
        else if (route === 'realtime') item.classList.add('route-realtime');
        else if (route === 'vision' || route === 'camera') item.classList.add('route-vision');
        else if (route === 'task') item.classList.add('route-task');
        else if (route === 'mixed') item.classList.add('route-task');
        else if (route === 'chat') item.classList.add('route-chat');
    };
    if (activity.event === 'query_detected') {
        detail = activity.message || '';
    } else if (activity.event === 'decision') {
        const ms = activity.elapsed_ms;
        const timing = ms != null ? ` (${ms < 1000 ? ms + ' ms' : (ms / 1000).toFixed(2) + ' s'})` : '';
        const cat = (activity.query_type || '?').charAt(0).toUpperCase() + (activity.query_type || '').slice(1);
        detail = `${cat} — ${activity.reasoning || ''}${timing}`;
        addRouteClass(activity.query_type);
    } else if (activity.event === 'intent_classified') {
        detail = (activity.intent || '?').charAt(0).toUpperCase() + (activity.intent || '').slice(1);
        item.classList.add('activity-sub', 'route-task');
    } else if (activity.event === 'routing') {
        detail = `→ ${(activity.route || '?').charAt(0).toUpperCase() + (activity.route || '').slice(1)}`;
        addRouteClass(activity.route);
    } else if (activity.event === 'tasks_executing') {
        detail = activity.message || 'Running tasks...';
        item.classList.add('activity-sub', 'route-task');
    } else if (activity.event === 'tasks_completed') {
        detail = activity.message || 'Completed';
        item.classList.add('activity-sub', 'route-task');
    } else if (activity.event === 'actions_emitted') {
        detail = activity.message || 'Actions sent';
        item.classList.add('activity-sub');
    } else if (activity.event === 'vision_analyzing') {
        detail = activity.message || 'Analyzing image...';
        item.classList.add('activity-sub', 'route-vision');
    } else if (activity.event === 'streaming_started') {
        detail = `Generating via ${(activity.route || '?').charAt(0).toUpperCase() + (activity.route || '').slice(1)}`;
        addRouteClass(activity.route);
    } else if (activity.event === 'first_chunk') {
        const ms = activity.elapsed_ms;
        detail = ms != null ? `Core responded in ${ms < 1000 ? ms + ' ms' : (ms / 1000).toFixed(2) + ' s'}` : 'Response started';
        addRouteClass(activity.route);
    } else if (activity.event === 'extracting_query') {
        detail = activity.message || 'Parsing your question for search...';
        item.classList.add('activity-sub');
    } else if (activity.event === 'searching_web') {
        detail = activity.message || (activity.query ? `Query: "${activity.query}"` : 'Scanning Pulse...');
        item.classList.add('activity-sub', 'route-realtime');
    } else if (activity.event === 'search_completed') {
        detail = activity.message || 'Search completed';
        item.classList.add('activity-sub', 'route-realtime');
    } else if (activity.event === 'context_retrieved') {
        detail = activity.message || 'Knowledge base ready';
        item.classList.add('activity-sub', 'route-general');
    } else {
        detail = activity.message || (typeof activity === 'object' ? JSON.stringify(activity) : String(activity));
    }
    const stepNum = stepInfo.step ? `<span class="activity-step">${stepInfo.step}</span>` : '';
    item.innerHTML = `
        <div class="activity-event">${stepNum}${escapeHtml(stepInfo.label)}</div>
        <div class="activity-detail">${escapeHtml(detail || '')}</div>`;
    const emptyEl = activityList.querySelector('.activity-empty');
    if (emptyEl) emptyEl.style.display = 'none';
    activityList.appendChild(item);
    activityList.scrollTop = activityList.scrollHeight;
}

function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function hideWelcome() {
    const w = document.getElementById('welcome-screen');
    if (w) w.remove();
}

const AVATAR_ICON_USER = '<svg class="msg-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
const AVATAR_ICON_ASSISTANT = '<svg class="msg-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/></svg>';

function addMessage(role, text) {
    hideWelcome();
    const msg = document.createElement('div');
    msg.className = `message ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = role === 'assistant' ? AVATAR_ICON_ASSISTANT : AVATAR_ICON_USER;
    const body = document.createElement('div');
    body.className = 'msg-body';
    const label = document.createElement('div');
    label.className = 'msg-label';
    label.textContent = role === 'assistant'
        ? `B.O.L.T.O.  (${currentMode === 'bolto' ? 'B.O.L.T.O.' : currentMode === 'realtime' ? 'Realtime' : 'General'})`
        : 'You';
    const content = document.createElement('div');
    content.className = 'msg-content';
    content.textContent = text;
    body.appendChild(label);
    body.appendChild(content);
    msg.appendChild(avatar);
    msg.appendChild(body);
    chatMessages.appendChild(msg);
    scrollToBottom();
    return content;
}

function addTypingIndicator() {
    hideWelcome();
    const msg = document.createElement('div');
    msg.className = 'message assistant';
    msg.id = 'typing-msg';
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = AVATAR_ICON_ASSISTANT;
    const body = document.createElement('div');
    body.className = 'msg-body';
    const label = document.createElement('div');
    label.className = 'msg-label';
    label.textContent = `B.O.L.T.O.  (${currentMode === 'bolto' ? 'B.O.L.T.O.' : currentMode === 'realtime' ? 'Realtime' : 'General'})`;
    const content = document.createElement('div');
    content.className = 'msg-content';
    content.innerHTML = '<span class="msg-stream-text">...</span>';
    body.appendChild(label);
    body.appendChild(content);
    msg.appendChild(avatar);
    msg.appendChild(body);
    chatMessages.appendChild(msg);
    scrollToBottom();
    return content;
}

function removeTypingIndicator() {
    const t = document.getElementById('typing-msg');
    if (t) t.remove();
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

async function sendMessage(textOverride) {
    let text = (textOverride || messageInput.value).trim();
    const visionModeOn = camVisionModeInput && camVisionModeInput.checked;
    const wantsCamera = visionModeOn || isCameraQuery(text) || (camStream && text);
    if (wantsCamera && !text) text = 'What do you see?';
    if (!text || isStreaming) return;
    if (isListening) {
        pendingSendTranscript = null;
        clearTimeout(speechSendTimeout);
        speechSendTimeout = null;
        stopListening();
    }
    if ((isCameraQuery(text) || visionModeOn) && !camStream) {
        try {
            await startCamera();
            await new Promise((resolve) => {
                if (!camVideo) { resolve(); return; }
                if (camVideo.readyState >= 2 && camVideo.videoWidth > 0) { resolve(); return; }
                const onReady = () => { camVideo.removeEventListener('loadeddata', onReady); clearTimeout(t); resolve(); };
                const t = setTimeout(() => { camVideo.removeEventListener('loadeddata', onReady); resolve(); }, 3000);
                camVideo.addEventListener('loadeddata', onReady);
            });
        } catch (_) {
        }
    }
    let imgBase64 = null;
    if (camStream && wantsCamera) {
        imgBase64 = await captureFrameAsBase64Safe();
        if (!imgBase64) showToast('Camera frame not ready. Please try again.');
    }
    messageInput.value = '';
    autoResizeInput();
    charCount.textContent = '';
    addMessage('user', text);
    addTypingIndicator();
    isStreaming = true;
    if (sendBtn) sendBtn.disabled = true;
    if (messageInput) messageInput.disabled = true;
    if (orbContainer) orbContainer.classList.add('active');
    if (orb && orb.setAIState) orb.setAIState('thinking');
    if (ttsPlayer) { ttsPlayer.reset(); ttsPlayer.unlock(); }
    const messageToSend = imgBase64 ? (text + ' ' + CAM_BYPASS_TOKEN) : text;
    const endpoint = '/chat/jarvis/stream';
    if (activityList) {
        activityList.innerHTML = '<div class="activity-empty" id="activity-empty">Processing...</div>';
        if (activityToggle) activityToggle.style.display = '';
        if (activityPanel && settings.autoOpenActivity) { activityPanel.classList.add('open'); updatePanelOverlay(); }
    }
    let firstChunkReceived = false;
    let timeoutId = null;
    const controller = new AbortController();
    try {
        if (ttsPlayer?.enabled && settings.thinkingSounds && preStarterPlayer) {
            preStarterPlayer.play(() => {});
        }
        timeoutId = setTimeout(() => controller.abort(), 300000);
        const res = await fetch(`${API}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: messageToSend,
                session_id: sessionId,
                tts: !!(ttsPlayer && ttsPlayer.enabled),
                imgbase64: imgBase64 || null
            }),
            signal: controller.signal,
        });
        if (!res.ok) {
            let errMsg = `HTTP ${res.status}`;
            try {
                const err = await res.json();
                errMsg = err.detail || (Array.isArray(err.detail) ? err.detail.map(d => d.msg || d.loc?.join('.')).join('; ') : err.message) || errMsg;
            } catch (_) {}
            throw new Error(errMsg);
        }
        removeTypingIndicator();
        const contentEl = addMessage('assistant', '');
        contentEl.innerHTML = '<span class="msg-stream-text">...</span>';
        scrollToBottom();
        if (!res.body) throw new Error('No response body');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let sseBuffer = '';
        let fullResponse = '';
        let cursorEl = null;
        // ✅ Optimized: Simplified stream processing without redundant flag
        while (true) {
            const { done, value } = await reader.read();
            if (done) break; // Exit on reader EOF
            
            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split('\n\n');
            sseBuffer = lines.pop();
            
            // Process each SSE line
            let shouldStop = false;
            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.session_id) sessionId = data.session_id;
                    if (data.activity) {
                        appendActivity(data.activity);
                        if (activityToggle) activityToggle.style.display = '';
                        if (activityPanel && settings.autoOpenActivity) { activityPanel.classList.add('open'); updatePanelOverlay(); }
                    }
                    if (data.search_results) {
                        renderSearchResults(data.search_results);
                        if (searchResultsToggle) searchResultsToggle.style.display = '';
                        if (searchResultsWidget && settings.autoOpenSearchResults) { searchResultsWidget.classList.add('open'); updatePanelOverlay(); }
                    }
                    if (data.actions) {
                        handleActions(data.actions, contentEl);
                    }
                    if (data.background_tasks) {
                        handleBackgroundTasks(data.background_tasks, contentEl);
                    }
                    if ('chunk' in data) {
                        const chunkText = data.chunk || '';
                        // ✅ Handle first chunk received state
                        if (chunkText && !firstChunkReceived) {
                            firstChunkReceived = true;
                            if (ttsPlayer) ttsPlayer.reset();
                            if (orb && orb.setAIState) orb.setAIState('speaking');
                        }
                        fullResponse += chunkText;
                        const textSpan = contentEl.querySelector('.msg-stream-text');
                        if (textSpan) {
                            textSpan.textContent = fullResponse;
                            textSpan.classList.remove('stream-placeholder');
                        }
                        if (!cursorEl) {
                            cursorEl = document.createElement('span');
                            cursorEl.className = 'stream-cursor';
                            cursorEl.textContent = '|';
                            contentEl.appendChild(cursorEl);
                        }
                        scrollToBottom();
                    }
                    if (data.audio && ttsPlayer) {
                        ttsPlayer.enqueue(data.audio);
                    }
                    if (data.error) throw new Error(data.error);
                    // ✅ Set flag to exit outer loop when stream completes
                    if (data.done) { shouldStop = true; break; }
                } catch (parseErr) {
                    if (parseErr.message && !parseErr.message.includes('JSON'))
                        throw parseErr;
                }
            }
            // ✅ Exit outer loop if stream signaled completion
            if (shouldStop) break;
        }
        if (cursorEl) cursorEl.remove();
        const textSpan = contentEl.querySelector('.msg-stream-text');
        if (textSpan && !fullResponse) textSpan.textContent = '(No response)';
    } catch (err) {
        clearTimeout(timeoutId);
        removeTypingIndicator();
        let msg = 'Something went wrong. Please try again.';
        if (err.name === 'AbortError') {
            msg = 'Request timed out. Please try again.';
        } else if (err.message && err.message.includes('503')) {
            msg = 'Service temporarily unavailable. Please try again in a moment.';
        } else if (err.message && err.message.includes('429')) {
            msg = 'Rate limit reached. Please wait a moment before trying again.';
        } else if (err.message && err.message.length > 0) {
            msg = err.message.length > 100 ? err.message.slice(0, 97) + '...' : err.message;
        }
        addMessage('assistant', msg);
        showToast(msg, 6000);
    } finally {
        clearTimeout(timeoutId);
        // নতুন কোড:
    isStreaming = false;
    if (sendBtn) sendBtn.disabled = false;
    if (messageInput) messageInput.disabled = false;
    if (orbContainer) orbContainer.classList.remove('active');
    if (orb && orb.setAIState) orb.setAIState('idle'); // নতুন লাইন
    maybeRestartListening();
    }
}

document.addEventListener('DOMContentLoaded', init);

