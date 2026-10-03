// ==UserScript==
// @name             hvhm – Krunker.IO Cheat
// @name:tr          hvhm – Krunker.IO Hilesi
// @name:ja          hvhm – Krunker.IO チート
// @name:az          hvhm – Krunker.IO Hilesi
// @namespace        https://github.com/hvhm/hvhm
// @version          1.10.34
// @description      Krunker.io Cheat 2026: Anime Aimbot, ESP/Wallhack, Free Skins, Bhop Script. Working & updated mod menu.
// @description:tr   Krunker.io Hile 2026: Anime Aimbot, ESP/Wallhack, Bedava Skinler, Bhop Script. Çalışan güncel mod menü.
// @description:ja   Krunker.io チート 2026: アニメエイムボット、ESP/ウォールハック、無料スキン、Bhopスクリプト。動作中の最新MODメニュー。
// @description:az   Krunker.io Hilesi 2026: Anime Aimbot, ESP/Wallhack, Pulsuz Skinlər, Bhop Skript. İşlək ve güncəl mod menyu.
// @author           hvhm
// @match            *://krunker.io/*
// @match            *://*.browserfps.com/*
// @exclude          *://krunker.io/social*
// @exclude          *://krunker.io/editor*
// @exclude          *://krunker.io/viewer*
// @grant            none
// @supportURL       https://github.com/levifrsn63/krunker-loader/issues
// @homepage         https://github.com/levifrsn63/krunker-loader
// @run-at           document-start
// @tag              games
// @license          MIT
// @noframes
// ==/UserScript==

(function(){
  var p=null,buf=[],shown=false;
  function flush(){ if(!p)return; p.textContent=buf.join('\n'); }
  function log(m){ buf.push(m); if(buf.length>400)buf.shift(); flush(); }
  function stackOf(err){ try { var s=(err&&err.stack)||''; return s?s.split('\n').slice(0,7).join(' <- '):''; } catch(e){ return ''; } }
  window.addEventListener('error',function(e){ log('PAGE ERROR: '+(e&&e.message)+((e&&e.filename)?' @'+e.filename+':'+e.lineno:'')+' '+stackOf(e&&e.error)); });
  window.addEventListener('unhandledrejection',function(e){ log('REJECT: '+(e&&e.reason&&(e.reason.message||e.reason))+' '+stackOf(e&&e.reason)); });
  var _cl=console.log.bind(console); console.log=function(){ try{var s=Array.prototype.map.call(arguments,function(x){try{return typeof x==='string'?x:JSON.stringify(x);}catch(e){return ''+x;}}).join(' '); log(s);}catch(e){} return _cl.apply(console,arguments); };
  window.addEventListener('DOMContentLoaded',function(){
    p=document.createElement('div'); p.id='khvh-debug';
    p.style.cssText='display:none;position:fixed;bottom:8px;right:8px;z-index:2147483647;max-width:46vw;max-height:60vh;overflow:auto;background:rgba(0,0,0,.92);color:#fff;font:11px/1.35 monospace;padding:8px 10px;border:1px solid rgba(255,255,255,.35);white-space:pre-wrap;';
    (document.body||document.documentElement).appendChild(p); p.style.display=shown?'block':'none'; flush();
  });
  window.addEventListener('keydown',function(e){
    if(e.code!=='Backquote'||e.repeat)return;
    shown=!shown;
    if(p)p.style.display=shown?'block':'none';
  });
  console.log('[KrunkerHVH] loader active — game mirror 10.0.0 + live capture (build-agnostic)');
  window['__xVb92__']='aB7k2m9Pq';
  window.OffCliV = true;
  // Stash hook for deobf pipeline: the loader saves the downloaded game
  // source to window.__hvhmGameSource + IndexedDB after patching.
  // window.Function stays 100% native (Quirify parity).
})();

(function(uniqueId, CRC2d) {

    class hvhm {
        constructor() {
            console.log("hvhm: Initializing...");
            window.quirifyInstance = this;

            this.GUI = {};
            this.game = null;
            this.me = null;
            this.renderer = null;
            this.controls = null;
            this.overlay = null;
            this.ctx = null;
            this.socket = null;
            this.skinCache = {};
            this.playerMaps = [];
            this.scale = 1;
            this.three = null;
            this.vars = {};
            this.exports = null;
            this.gameVersion = '';
            this.gameJS = '';
            this.liveBuildHash = '';
            this.notifyContainer = null;
            this.legitTarget = null;
            this.lastTargetChangeTime = 0;
            this.aimOffset = { x: 0, y: 0 };
            this.antiAimAngle = 0;
            this._aeroAirStartedAt = 0;
            this._aeroWasAirborne = false;
            this._tracers = [];
            this._hitmarker = 0;
            this._lastShoot = false;
            this._origFirerate = undefined;
            this._baseSpeedLmt = undefined;
            this._chamsActive = false;
            this._chamsEntities = [];
            this._chamsLODState = null;
            this._esp3DBoxes = new Map();
            this._origFov = undefined;
            this._baseFov = undefined;
            this._fovCameraLocks = new Map();
            this._rgbHue = 0;
            this._lastKillCount = null;
            this._lastDeathCount = null;
            this._lastKillStreak = null;
            this._soundContext = null;
            this.scriptId = localStorage.getItem('hvhm_sid') || (() => { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 8; i++) s += c[Math.floor(Math.random() * c.length)]; localStorage.setItem('hvhm_sid', s); return s; })();
            this.scriptUsers = new Map();
            this._scriptObserver = null;
            this._lastHvhmBeacon = 0;
            this.scriptVersion = '1.10.19';
            this.lobbyCheatUsers = new Map();
            this.lobbyHeartbeatInterval = null;
            this.lobbyFetchInterval = null;
            this.sendLobbyHeartbeat = null;
            this.myRole = null;
            this.heartbeatFailCount = 0;
            this._teamWithCheatersLastEnabled = 0;
            this._teamWithCheatersToggledOnTime = 0;
            this._lastTeamWithCheatersState = false;
            this.featureStatuses = {};
            this.featureStatusLastFetch = 0;
            this.currentPreset = null;

            this.lastWireframeState = null;

            this.PLAYER_HEIGHT = 11;
            this.PLAYER_WIDTH = 4;
            this.CROUCH_FACTOR = 3;
            this.BOT_CROUCH_FACTOR = 2;
            this.CAMERA_HEIGHT = 1.5;

            this.tempVector = null;
            this.cameraPos = null;

            this.isProxy = Symbol('isProxy');
            this.rightMouseDown = false;
            this.isBindingHotkey = false;
            this.currentBindingSetting = null;
            this.pressedKeys = new Set();
            this._aeroSpinOverrideHeld = false;
            this._boneNodeCache = new WeakMap();
            this._limbEndpointCache = new WeakMap();
            this._mergedArmPointCache = new WeakMap();

            this.defaultSettings = {
                aimbotEnabled: true,
                aimbotOnAimKey: false,
                aimbotFovCheck: true,
                aimbotWallCheck: true,
                aimbotWallBangs: false,
                aimbotTeamCheck: true,
                aimbotBotCheck: true,
                superSilentEnabled: false,
                autoFireEnabled: false,
                triggerbotEnabled: false,
                fovSize: 90,
                aimOffset: 0,
                aimTarget: 'head',
                drawFovCircle: false,
                espLines: true,
            espBoxMode: "3d",
            espBoxColor: "#ffffff",
            espNameTags: true,
            espWeapon: true,
            espLevel: true,
                espTeamCheck: true,
                espBotCheck: true,
                wireframeEnabled: false,
                unlockSkins: true,
                bhopEnabled: false,
                antiAimEnabled: false,
                antiAimSpinEnabled: false,
                scriptNetEnabled: true,
                spectatorAlertEnabled: true,
                captureSafeOverlay: false,
            espColor: "#ffffff",
            boxColor: "#ffffff",
            esp3DBoxColor: "#ffffff",
            esp2DBoxColor: "#ffffff",
            espLineColor: "#ffffff",
            espLineVisibleColor: "#ffffff",
            espNameColor: "#ffffff",
            espNameVisibleColor: "#ffffff",
            espWeaponColor: "#ffffff",
            espWeaponVisibleColor: "#ffffff",
            espWeaponIcon: true,
            espLevelColor: "#ffffff",
            espLevelVisibleColor: "#ffffff",
            espDistanceColor: "#ffffff",
            espDistanceVisibleColor: "#ffffff",
            espBoxVisibleColor: "#ffffff",
            espDistance: true,
            skeletonESP: false,
            skeletonColor: "#ffffff",
            skeletonVisibleColor: "#ffffff",
            selfESP: false,
            selfSkeletonESP: false,
            selfESPView: "third",
            espLineOrigin: "bottom",
            espScale: 1,
            espNameOffsetX: 0,
            espNameOffsetY: 0,
            espLevelOffsetX: 0,
            espLevelOffsetY: 0,
            espWeaponOffsetX: 0,
            espWeaponOffsetY: 0,
            espWeaponIconOffsetX: 0,
            espWeaponIconOffsetY: 0,
            espDistanceOffsetX: 0,
            espDistanceOffsetY: 0,
            botColor: "#00ff80",
                autoNuke: false,
                antikick: true,
                autoReload: true,
                legitAimbot: true,
                flickSpeed: 25,
                adsTremorReduction: 50,
                aimRandomness: 1.5,
                aimTremor: 0.2,
                thirdPersonEnabled: false,
                alwaysTrail: false,
            fovChanger: 0,
            chamsEnabled: false,
            chamsMode: "static",
            chamsColor: "#ff0000",
            chamsVisibleColor: "#ffffff",
            chamsOpacity: 1.0,
            chamsSelf: false,
            chamsTeammates: false,
                antiAimSpinSpeed: 300,
                noRecoil: false,
                bulletTracers: false,
                hitmarkers: false,
                customSoundPack: 'off',
                onlineSoundPackUrl: '',
                legitAiAim: false,
                espSquare: true,
                espHealth: true,
                espInfoBackground: true,
                rainbowEsp: false,
                weaponZoom: 1,
                unlockPremium: true,
                middleMouseMenu: false,
                hideMenuButton: false,
                showWelcome: true,
                showCheaterRadar: true,
                hideFromRadar: false,
                cheaterTagColor: '#ff0000',
                teamWithCheaters: false,
                showFeatureStatus: true,
            };
            this.defaultHotkeys = {
                toggleMenu: 'Insert',
                aimbotEnabled: 'F2',
                aimKey: 'Mouse2',
                bhopEnabled: 'F4',
                autoFireEnabled: 'F5',
                superSilentEnabled: 'F6',
                antiAimEnabled: 'F7',
                aeroSpinOverride: null,
                wireframeEnabled: 'F8',
                unlockSkins: 'F9',
                chamsEnabled: 'F10',
                aimbotTeamCheck: 'Numpad1',
                espTeamCheck: 'Numpad2',
                aimbotBotCheck: 'Numpad3',
                espBotCheck: 'Numpad4',
                aimbotWallCheck: 'Numpad5',
                aimbotWallBangs: 'Numpad6',
                espLines: 'Numpad7',
                espNameTags: 'Numpad8',
                espSquare: 'F3',
                panicKey: null,
            };
            this.settings = {};
            this.hotkeys = {};

            try {
                this.loadSettings();
                this.initializeNotifierContainer();
                this.initializeLoader();
                this.initializeGameHooks();
                this.waitFor(() => window.windows).then(() => {
                    this.initGameGUI();
                });
                this.addEventListeners();
                try { this.startLobbyHeartbeat(); } catch (e) {}
                try { this.fetchFeatureStatuses(); } catch (e) {}
                try { this.checkForUpdates(); } catch (e) {}
                if (this.settings.showWelcome) {
                    try { this.notify({ title: 'Welcome', message: 'hvhm cheat loaded — press Insert for menu', timeout: 5000 }); } catch (e) {}
                }

            console.log("hvhm: Successfully Initialized! build 1.10.34-tightfire-10.0.0");
            } catch (error) {
                console.error('hvhm: FATAL ERROR during initialization.', error);
            }
        }

        loadSettings() {
            let loadedSettings = {}, loadedHotkeys = {};
            try {
                loadedSettings = JSON.parse(window.localStorage.getItem('hvhm_settings'));
                loadedHotkeys = JSON.parse(window.localStorage.getItem('hvhm_hotkeys'));
            } catch (e) {
                console.warn("hvhm: Could not parse settings, using defaults.");
            }
            this.settings = { ...this.defaultSettings, ...loadedSettings };
            if (loadedSettings && !Object.prototype.hasOwnProperty.call(loadedSettings, 'aimbotOnAimKey') && Object.prototype.hasOwnProperty.call(loadedSettings, 'aimbotOnRightMouse')) {
                this.settings.aimbotOnAimKey = Boolean(loadedSettings.aimbotOnRightMouse);
            }
            if (!loadedSettings || !loadedSettings.espBoxMode) {
                this.settings.espBoxMode = loadedSettings && loadedSettings.esp3DBoxes ? '3d' : (loadedSettings && loadedSettings.espSquare ? '2d' : 'off');
            }
            if (!loadedSettings || !loadedSettings.espBoxColor) this.settings.espBoxColor = (loadedSettings && (loadedSettings.esp3DBoxColor || loadedSettings.esp2DBoxColor)) || '#ffffff';
            if ((!loadedSettings || !loadedSettings.aimTarget) && loadedSettings && loadedSettings.aimBone) {
                const aimMap = { head: 'head', neck: 'head', chest: 'torso', pelvis: 'legs' };
                this.settings.aimTarget = aimMap[loadedSettings.aimBone] || 'head';
            }
            if (!loadedSettings || !loadedSettings.chamsMode) this.settings.chamsMode = loadedSettings && loadedSettings.rgbChams ? 'rgb' : 'static';
            if (!loadedSettings || !loadedSettings.chamsColor) this.settings.chamsColor = (loadedSettings && loadedSettings.chamsEnemyColor) || '#ff0000';
            this.hotkeys = { ...this.defaultHotkeys, ...loadedHotkeys };
        }

        saveSettings(key, value) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error("hvhm: Could not save settings.", e);
            }
        }

        initializeNotifierContainer() {
            let container = document.getElementById('hvhm-notify-wrap');
            if (!container) { container = document.createElement('div'); container.id = 'hvhm-notify-wrap'; document.documentElement.appendChild(container); }
            this.notifyContainer = container;
        }

        notify({ title = 'Notification', message = '', actionText, onAction, timeout = 6000 } = {}) {
            if (!this.notifyContainer) { console.error("hvhm: Notifier container not initialized."); return; }
            const card = document.createElement('div'); card.className = 'hvhm-notify-card';
            setTimeout(() => card.classList.add('visible'), 10);
            const content = document.createElement('div'); content.className = 'hvhm-notify-content';
            const logo = document.createElement('div'); logo.className = 'hvhm-notify-logo';
            const texts = document.createElement('div'); texts.className = 'hvhm-notify-texts';
            const titleEl = document.createElement('label'); titleEl.className = 'hvhm-notify-title'; titleEl.textContent = title;
            const messageEl = document.createElement('div'); messageEl.className = 'hvhm-notify-message'; messageEl.textContent = message;
            texts.append(titleEl, messageEl); content.append(logo, texts);
            const controls = document.createElement('div'); controls.className = 'hvhm-notify-controls';
            if (actionText && typeof onAction === 'function') {
                const btn = document.createElement('div'); btn.className = 'hvhm-notify-action-btn'; btn.textContent = actionText;
                btn.addEventListener('click', (e) => { e.stopPropagation(); onAction(); dismiss(); }); controls.appendChild(btn);
            }
            card.append(content, controls); this.notifyContainer.appendChild(card);
            let hideTimer; if (timeout > 0) hideTimer = setTimeout(dismiss, timeout);
            function dismiss() { clearTimeout(hideTimer); card.classList.remove('visible'); setTimeout(() => card.remove(), 350); }
            return { dismiss };
        }

        exportSettingsCode() {
            const payload = { v: 1, settings: this.settings, hotkeys: this.hotkeys };
            const json = JSON.stringify(payload);
            return btoa(unescape(encodeURIComponent(json)));
        }

        importSettingsCode(code) {
            try {
                const raw = decodeURIComponent(escape(atob(String(code || '').trim())));
                const payload = JSON.parse(raw);
                if (!payload || payload.v !== 1 || !payload.settings || typeof payload.settings !== 'object') throw new Error('Invalid settings code');
                this.settings = { ...this.defaultSettings, ...payload.settings };
                if (payload.hotkeys && typeof payload.hotkeys === 'object') this.hotkeys = { ...this.defaultHotkeys, ...payload.hotkeys };
                this.saveSettings('hvhm_settings', this.settings);
                this.saveSettings('hvhm_hotkeys', this.hotkeys);
                this.notify({ title: 'Settings', message: 'Settings imported. Reloading the menu.' });
                setTimeout(() => window.location.reload(), 350);
            } catch (error) {
                this.notify({ title: 'Settings', message: `Could not import code: ${error.message}` });
            }
        }

        getNamedConfigs() {
            try {
                const parsed = JSON.parse(localStorage.getItem('hvhm_named_configs') || '{}');
                return parsed && typeof parsed === 'object' ? parsed : {};
            } catch (e) { return {}; }
        }

        saveNamedConfig(name) {
            const cleanName = String(name || '').trim().slice(0, 32);
            if (!cleanName) return false;
            const configs = this.getNamedConfigs();
            configs[cleanName] = { code: this.exportSettingsCode(), updated: Date.now() };
            localStorage.setItem('hvhm_named_configs', JSON.stringify(configs));
            return true;
        }

        loadNamedConfig(name) {
            const entry = this.getNamedConfigs()[String(name || '')];
            if (!entry || !entry.code) return false;
            this.importSettingsCode(entry.code);
            return true;
        }

        deleteNamedConfig(name) {
            const configs = this.getNamedConfigs();
            if (!configs[name]) return false;
            delete configs[name];
            localStorage.setItem('hvhm_named_configs', JSON.stringify(configs));
            return true;
        }

        updateCustomSoundPack() {
            const kills = Number(this.me && this.me.kills);
            const deaths = Number(this.me && this.me.deaths);
            const streak = Number(this.me && this.me.killStreak);
            if (Number.isFinite(kills)) {
                if (this._lastKillCount === null || kills < this._lastKillCount) this._lastKillCount = kills;
                else if (kills > this._lastKillCount) {
                    const gained = Math.min(3, kills - this._lastKillCount);
                    this._lastKillCount = kills;
                    for (let i = 0; i < gained; i++) setTimeout(() => this.playSoundEvent('kill'), i * 70);
                }
            }
            if (Number.isFinite(deaths)) {
                if (this._lastDeathCount === null || deaths < this._lastDeathCount) this._lastDeathCount = deaths;
                else if (deaths > this._lastDeathCount) { this._lastDeathCount = deaths; this.playSoundEvent('death'); }
            }
            if (Number.isFinite(streak)) {
                if (this._lastKillStreak === null || streak < this._lastKillStreak) this._lastKillStreak = streak;
                else if (streak > this._lastKillStreak) { this._lastKillStreak = streak; this.playSoundEvent('streak'); }
            }
        }

        getOnlineSoundPack() {
            try { return JSON.parse(localStorage.getItem('hvhm_online_sound_pack') || 'null'); } catch (e) { return null; }
        }

        playSoundEvent(eventName, testOnly = false) {
            const pack = this.settings.customSoundPack || 'off';
            if (pack === 'online') {
                const manifest = this.getOnlineSoundPack();
                const url = manifest && manifest.sounds && manifest.sounds[eventName];
                if (url) {
                    const audio = new Audio(url);
                    audio.volume = testOnly ? 0.75 : 0.65;
                    audio.play().catch(() => {});
                }
                return;
            }
            if (eventName === 'kill') this.playCustomKillSound(testOnly);
        }

        async loadOnlineSoundPack() {
            const url = String(this.settings.onlineSoundPackUrl || '').trim();
            if (!/^https:\/\/[^\s]+$/i.test(url)) {
                this.notify({ title: 'Sound Pack', message: 'Use an HTTPS URL to a JSON sound-pack manifest.' });
                return;
            }
            try {
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const manifest = await response.json();
                const sounds = manifest && manifest.sounds;
                if (!sounds || typeof sounds !== 'object') throw new Error('Missing sounds object');
                const clean = {};
                for (const eventName of ['kill', 'death', 'streak', 'headshot']) {
                    if (sounds[eventName] && /^https:\/\/[^\s]+$/i.test(String(sounds[eventName]))) clean[eventName] = String(sounds[eventName]);
                }
                if (!Object.keys(clean).length) throw new Error('No valid HTTPS sound URLs');
                const stored = { name: String(manifest.name || 'Online pack').slice(0, 80), sounds: clean };
                localStorage.setItem('hvhm_online_sound_pack', JSON.stringify(stored));
                this.settings.customSoundPack = 'online';
                this.saveSettings('hvhm_settings', this.settings);
                this.notify({ title: 'Sound Pack', message: `${stored.name} loaded.` });
            } catch (error) {
                this.notify({ title: 'Sound Pack', message: `Could not load pack: ${error.message}` });
            }
        }

        playCustomKillSound(testOnly = false) {
            const pack = this.settings.customSoundPack || 'off';
            if (pack === 'off') return;
            if (pack === 'custom') {
                let dataUrl = null;
                try { dataUrl = localStorage.getItem('hvhm_custom_kill_sound'); } catch (e) {}
                if (!dataUrl) return;
                const audio = new Audio(dataUrl);
                audio.volume = 0.75;
                audio.play().catch(() => {});
                return;
            }
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            if (!this._soundContext) {
                try { this._soundContext = new AudioContextClass(); } catch (e) { return; }
            }
            const context = this._soundContext;
            if (context.state === 'suspended') context.resume().catch(() => {});
            const now = context.currentTime;
            const master = context.createGain();
            master.gain.setValueAtTime(testOnly ? 0.12 : 0.09, now);
            master.gain.exponentialRampToValueAtTime(0.001, now + (pack === 'arcade' ? 0.34 : 0.28));
            master.connect(context.destination);
            const notes = pack === 'arcade'
                ? [[523.25, 0, 0.08], [659.25, 0.08, 0.08], [783.99, 0.16, 0.14]]
                : [[660, 0, 0.07], [990, 0.055, 0.08], [1320, 0.11, 0.13]];
            for (const [frequency, offset, duration] of notes) {
                const oscillator = context.createOscillator();
                const gain = context.createGain();
                oscillator.type = pack === 'arcade' ? 'square' : 'triangle';
                oscillator.frequency.setValueAtTime(frequency, now + offset);
                gain.gain.setValueAtTime(0.0001, now + offset);
                gain.gain.exponentialRampToValueAtTime(0.45, now + offset + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
                oscillator.connect(gain); gain.connect(master);
                oscillator.start(now + offset); oscillator.stop(now + offset + duration + 0.02);
            }
        }

        storeCustomKillSound(file) {
            if (!file || !file.type || !file.type.startsWith('audio/')) return;
            if (file.size > 8 * 1024 * 1024) {
                this.notify({ title: 'Sound Pack', message: 'Choose an audio file smaller than 8 MB.' });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    localStorage.setItem('hvhm_custom_kill_sound', reader.result);
                    this.settings.customSoundPack = 'custom';
                    this.saveSettings('hvhm_settings', this.settings);
                    this.notify({ title: 'Sound Pack', message: 'Custom kill sound loaded.' });
                } catch (e) {
                    this.notify({ title: 'Sound Pack', message: 'The browser could not store that audio file.' });
                }
            };
            reader.readAsDataURL(file);
        }

        clearCustomKillSound() {
            try { localStorage.removeItem('hvhm_custom_kill_sound'); } catch (e) {}
            if (this.settings.customSoundPack === 'custom') this.settings.customSoundPack = 'off';
            this.saveSettings('hvhm_settings', this.settings);
        }

        initializeLoader() {
            console.log("hvhm: Initializing Game Loader & Captcha Bypass...");
            let tokenResolve;
            const tokenPromise = new Promise((resolve) => (tokenResolve = resolve));
            try {
                const ifr = document.createElement('iframe');
                ifr.src = location.origin + '/' + (window.location.search ? window.location.search : '');
                ifr.style.display = 'none';
                document.documentElement.append(ifr);
                ifr.contentWindow.fetch = new Proxy(ifr.contentWindow.fetch, {
                    apply(target, thisArg, [u, ...rest]) {
                        if (typeof u === 'string' && u.includes('/seek-game')) {
                            let v;
                            try { v = JSON.parse(new URL(u, location.origin).searchParams.get('dataQuery'))?.v; } catch (e) {}
                            try { ifr.remove(); } catch (e) {}
                            tokenResolve({ u, v });
                            return;
                        }
                        return Reflect.apply(target, thisArg, [u, ...rest]);
                    }
                });
            } catch (e) { console.warn('hvhm: iframe captcha token intercept error:', e); }
            window.fetch = new Proxy(window.fetch, {
                apply: async (target, thisArg, [u, ...rest]) => {
                    if (typeof u === 'string' && u.includes('/seek-game')) {
                        const tok = await tokenPromise.catch(() => ({}));
                        if (tok && tok.v) {
                            try {
                                const url = new URL(u, location.origin);
                                const q = JSON.parse(url.searchParams.get('dataQuery'));
                                if (q) { q.v = tok.v; url.searchParams.set('dataQuery', JSON.stringify(q)); u = url.toString(); }
                            } catch (e) { u = tok.u || u; }
                        } else if (tok && tok.u) { u = tok.u; }
                    }
                    return Reflect.apply(target, thisArg, [u, ...rest]);
                }
            });
            const downloadGame = async (url) => {
                try {
                    const req = new XMLHttpRequest();
                    req.open('GET', url, false);
                    req.send();
                    if (req.status === 200 && req.response) return req.response;
                } catch (e) {}
                try {
                    const res = await fetch(url);
                    if (res.ok) return await res.text();
                } catch (e) { console.error('hvhm: Network error fetching game script:', e); }
                return null;
            };
            const gameSources = () => {
                const list = [];
                try { const custom = localStorage.getItem('hvhm_game_source_url'); if (custom) list.push(custom); } catch (e) {}
                list.push(
                    'https://hvhm-game.vercel.app/game.js',
                    'https://raw.githubusercontent.com/levifrsn63/krunker-loader/main/game.js',
                    'https://cdn.jsdelivr.net/gh/levifrsn63/krunker-loader@main/game.js',
                    'https://raw.githubusercontent.com/Quirify1/Krunker-Server-data/refs/heads/main/game_3_0.js?t=' + Date.now(),
                    'https://cdn.jsdelivr.net/gh/Quirify1/Krunker-Server-data@main/game_3_0.js'
                );
                return list;
            };
            const injectGame = async () => {
                if (window.__hvhmInjected) return;
                window.__hvhmInjected = true;
                console.log('hvhm: Downloading and patching game client...');
                let gameJS = null;
                let patchedScript = null;
                for (const src of gameSources()) {
                    try {
                        const js = await downloadGame(src);
                        if (!js || js.length <= 1000) continue;
                        const verMatch = /(?:let|var)\s+[^\s=,]+\s*,\s*[^\s=,]+\s*,\s*[^\s=,]+\s*,\s*[^\s=,]+\s*=\s*['"]([0-9]+\.[0-9]+\.[0-9]+)['"]/s.exec(js) || /['"]([0-9]+\.[0-9]+\.[0-9]+)['"]\s*,\s*[^\s=,]+\s*=\s*[^\s=,]+\s*\+\s*['"]r1['"]/.exec(js);
                        if (verMatch && !/^10\./.test(verMatch[1])) { console.warn('hvhm: stale client ' + verMatch[1] + ' — skipping ' + src); continue; }
                        const p = this.patchGameScript(js);
                        if (!p) { console.warn('hvhm: mirror source hooks missing — skipping ' + src); continue; }
                        try { new Function(p); } catch (e) { console.warn('hvhm: mirror failed to compile — skipping ' + src); continue; }
                        gameJS = js;
                        patchedScript = p;
                        break;
                    } catch (e) { console.warn('hvhm: game source fetch failed for ' + src, e); }
                }
                if (!gameJS) { console.error('hvhm: FATAL - Failed to download game client'); return; }
                try {
                    const m = /(?:let|var)\s+[^\s=,]+\s*,\s*[^\s=,]+\s*,\s*[^\s=,]+\s*,\s*[^\s=,]+\s*=\s*['"]([0-9]+\.[0-9]+\.[0-9]+)['"]/s.exec(gameJS) || /['"]([0-9]+\.[0-9]+\.[0-9]+)['"]\s*,\s*[^\s=,]+\s*=\s*[^\s=,]+\s*\+\s*['"]r1['"]/.exec(gameJS) || /(?:let|var)\s+[^\s=]+\s*=\s*['"]([0-9]+\.[0-9]+\.[0-9]+)['"]\s*;\s*(?:let|var)\s+[^\s=]+\s*=\s*[^\s=]+\s*\+\s*['"][^'"]+['"]\s*;\s*(?:let|var)\s+[^\s=]+\s*=\s*process\.env\.CUSTOM_VERSION/s.exec(gameJS);
                    if (m) this.gameVersion = m[1];
                } catch (e) {}
                this.gameJS = gameJS;
                try {
                    window.__hvhmGameSource = gameJS;
                    const r = indexedDB.open('hvhm_gamecache', 1);
                    r.onupgradeneeded = () => { const db = r.result; if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv'); };
                    r.onsuccess = () => { try { r.result.transaction('kv', 'readwrite').objectStore('kv').put({ data: gameJS }, 'hvhm_live_capture'); } catch (e) {} };
                } catch (e) {}
                window.__xVb92__ = 'aB7k2m9Pq';
                // Loader-scope timer alias the decrypted client closes over
                // (the official index bundle defines it; we removed that script).
                window.JfCzGzvGIQB8rrJX = window.setTimeout;
                window.JfCzGzvGIQB8rrJX.isProxy = true;
                console.log('hvhm: Executing patched game client (' + this.gameVersion + ')...');
                if (document.readyState === 'complete') Function(patchedScript)();
                else window.addEventListener('load', () => { Function(patchedScript)(); });
            };
            const isGameScript = (src) => {
                if (!src || typeof src !== 'string') return false;
                return src.includes('/static/index-') || src.includes('/static/index.') || src.includes('/pkg/index') || src.includes('game.js') || src.includes('/js/game.');
            };
            let obs = null;
            const onScriptNode = (node) => {
                if (node && node.tagName === 'SCRIPT' && isGameScript(node.src)) {
                    console.log('hvhm: Intercepted official script:', node.src);
                    node.remove();
                    if (obs) obs.disconnect();
                    injectGame();
                    return true;
                }
                return false;
            };
            let preHit = false;
            try {
                const existing = document.querySelectorAll('script[src]');
                for (const node of existing) {
                    if (onScriptNode(node)) { preHit = true; break; }
                }
            } catch (e) {}
            if (!preHit) {
                obs = new MutationObserver((muts) => {
                    for (const m of muts) {
                        for (const n of m.addedNodes) {
                            if (onScriptNode(n)) return;
                        }
                    }
                });
                obs.observe(document, { childList: true, subtree: true });
            }
        }

    patchGameScript(script) {
      script = script.replace(/Object\.defineProperty\s*\(\s*navigator\s*,\s*["']webdriver["']\s*,[\s\S]*?\}\);?/g, "/* webdriver defineProperty bypass */");
      script = script.replace(/writable\s*:\s*false/g, "writable: true");
      script = script.replace(/configurable\s*:\s*false/g, "configurable: true");
      script = script.replace(/_dispatchEvent:\s*function\s*\(([^\s,)]+),\s*([^\s,)]+)\)\s*\{/u, "_dispatchEvent: function ($1, $2) { try { if (window.quirifyInstance) window.quirifyInstance.onNetDispatch(this, $1, $2); } catch(e){} ");
      let sendHookRe = /(send:\s*function\s*\([^\s,)]+\)\s*\{[\s\n]*if\s*\(typeof\s+window\s*==\s*["']undefined["'][\s\S]*?arguments\[[^\s\]]+\];\s*\})/u;
      script = script.replace(sendHookRe, "$1 try { if (window.quirifyInstance) window.quirifyInstance.onNetSend(this, arguments[0], Array.prototype.slice.call(arguments, 1)); } catch(e){} ");
      let playersAddRe = /(var\s+([^\s=]+)\s*=\s*([^\s=]+)\[([^\s=]+)\]\s*==\s*([^\s=]+)\.socketId;[\s\n]*\([^\s=]+\s*=\s*[^\s=.]+\.players\.add\()/u;
      script = script.replace(playersAddRe, (playersAddSrc, varDecl, isYouVar, playerArr, playerIdx, socketObj) => {
        return "var " + isYouVar + " = " + playerArr + "[" + playerIdx + "] == " + socketObj + ".socketId;\ntry {\n    var _q = window.quirifyInstance;\n    var _isYou = " + isYouVar + " || (_q && _q.me && " + playerArr + "[" + playerIdx + " + 5] === _q.me.name);\n    if (_isYou && _q && _q.settings && _q.settings.unlockSkins) {\n        var _sc = _q.getEffectiveSkinCache ? _q.getEffectiveSkinCache() : _q.skinCache;\n        if (_sc) {\n            if (_sc.main !== undefined && _sc.main !== -1) {\n                " + playerArr + "[" + playerIdx + " + 12] = [_sc.main, (_sc.secondary !== undefined && _sc.secondary !== -1) ? _sc.secondary : -1];\n            }\n            if (_sc.hat !== undefined && _sc.hat !== -1) " + playerArr + "[" + playerIdx + " + 13] = _sc.hat;\n            if (_sc.body !== undefined && _sc.body !== -1) " + playerArr + "[" + playerIdx + " + 14] = _sc.body;\n            if (_sc.knife !== undefined && _sc.knife !== -1) " + playerArr + "[" + playerIdx + " + 19] = _sc.knife;\n            if (_sc.dye !== undefined && _sc.dye !== -1) " + playerArr + "[" + playerIdx + " + 24] = _sc.dye;\n            if (_sc.waist !== undefined && _sc.waist !== -1) " + playerArr + "[" + playerIdx + " + 30] = _sc.waist;\n            if (_sc.back !== undefined && _sc.back !== -1) " + playerArr + "[" + playerIdx + " + 41] = _sc.back;\n            if (_sc.playerCard !== undefined && _sc.playerCard !== -1) " + playerArr + "[" + playerIdx + " + 43] = _sc.playerCard;\n        }\n    }\n} catch(e) {}\n" + playersAddSrc.substring(playersAddSrc.indexOf("("));
      });
      let skinsRe = /(\.skins\s*=\s*)([^\s=]+)(\s*\|\|\s*\[-1,\s*-1\]);/u;
      script = script.replace(skinsRe, "$1 ((window.quirifyInstance && window.quirifyInstance.settings && window.quirifyInstance.settings.unlockSkins && window.quirifyInstance.getSkinForPlayer) ? window.quirifyInstance.getSkinForPlayer(this, $2) : ($2 $3));");
      let meleeRe = /(\.meleeIndex\s*=\s*)([^\s=;]+);/u;
      script = script.replace(meleeRe, "$1 ((this.isYou && window.quirifyInstance && window.quirifyInstance.settings && window.quirifyInstance.settings.unlockSkins && window.quirifyInstance.getMeleeForPlayer) ? window.quirifyInstance.getMeleeForPlayer(this, $2) : $2);");
      let inViewName = null;
      let scanPos = 0;
      while ((scanPos = script.indexOf(".latestData", scanPos)) !== -1) {
        const scanWindow = script.substring(Math.max(0, scanPos - 300), scanPos + 15);
        const inViewMatch = /\.([a-zA-Z0-9_$]+)\s*=\s*\([^;]+;\s*if\s*\([a-zA-Z0-9_$]+\.latestData/.exec(scanWindow) || /([^\s=.]+)\.([^\s=]+)\s*=\s*\([^;]+;\s*if\s*\(\1\.latestData\)/.exec(scanWindow);
        if (inViewMatch) {
          inViewName = inViewMatch[2] || inViewMatch[1];
          break;
        }
        scanPos += 11;
      }
      this.vars.inView = inViewName || "cnSeen";
      const isYouMatch = /(?:this\.active\s*=\s*true;)\s*this\.(\w+)\s*=\s*[^;]+;(?:\s*this\.\w+\s*=\s*[^;]+;){5}\s*this\.\w+\s*=\s*null;/s.exec(script);
      this.vars.isYou = isYouMatch ? isYouMatch[1] : "isYou";
      const pchObjcMatch = /this\.([^\s=]+)\s*=\s*new\s+[^\s]+\.Object3D\(\)/u.exec(script) || /['"]pchObjc['"]/.exec(script);
      this.vars.pchObjc = pchObjcMatch ? pchObjcMatch[1] || "pchObjc" : "pchObjc";
      const procInputsMatch = /this\[['"]([a-zA-Z0-9_$]+)['"]\]\s*\(\s*this\[['"]inputs['"]\]/.exec(script) || /for\s*\(\s*var\s+[^\s=]+\s*=\s*0;\s*[^\s<]+\s*<\s*this\.inputs\.length;\s*\+\+[^\s)]+\s*\)\s*\{[^}]*this\.([^\s(]+)\(/s.exec(script);
      this.vars.procInputs = procInputsMatch ? procInputsMatch[1] || procInputsMatch[2] : "procInputs";
      const weaponIndexMatch = /this\[['"]ammos['"]\]\[this\[['"]([a-zA-Z0-9_$]+)['"]\]\]/.exec(script) || /this\[['"]ammos['"]\]\[this\.([a-zA-Z0-9_$]+)\]/.exec(script) || /\}\s*else\s*\{\s*this\.[^\s=\[]+\[this\.([^\s=\]]+)\]\s*=\s*[^;]+;\s*\}\s*[^.\s]+\.updatePlayerAmmo\(this\);/s.exec(script);
      this.vars.weaponIndex = weaponIndexMatch ? weaponIndexMatch[1] : "loadoutIndex";
      console.log("👑 hvhm: Fast Variable Hook Extracted:", this.vars);
      return script;
    }
        initializeGameHooks() {
            const cheatInstance = this;
            const originalSkinsSymbol = Symbol('origSkins');
            const localSkinsSymbol = Symbol('localSkins');

            let khvhCleaned = false;
            const khvhCleanup = () => {
                if (khvhCleaned) return; khvhCleaned = true;
                try { if (cheatInstance.overlay) Object.defineProperty(cheatInstance.overlay, 'canvas', { value: cheatInstance.overlay['_canvas'], configurable: true, writable: true }); } catch (e) {}
                try { if (cheatInstance.threeOwner) Object.defineProperty(cheatInstance.threeOwner, 'THREE', { value: cheatInstance.three, configurable: true, writable: true }); } catch (e) {}
                ['premiumT', 'idleTimer', 'kickTimer', 'thirdPerson', 'trail'].forEach(p => { try { delete Object.prototype[p]; } catch (e) {} });
                console.log('[KrunkerHVH] stealth: Object.prototype pollution removed');
            };
            Object.defineProperties(Object.prototype, {
                canvas: {
                    set(canvasValue) {
                        this['_canvas'] = canvasValue;
                        if (canvasValue && canvasValue.id === 'game-overlay') {
                            cheatInstance.overlay = this; cheatInstance.ctx = canvasValue.getContext('2d');
                            Object.defineProperty(this, 'render', {
                                set(originalRender) {
                                    const _origRender = originalRender;
                                    this['_render'] = function () {
                                        ['scale', 'game', 'controls', 'renderer', 'me'].forEach((prop, i) => { cheatInstance[prop] = arguments[i]; });
                                        const _r = _origRender.apply(this, arguments);
                                        if (cheatInstance.me && cheatInstance.ctx) { try { cheatInstance.onRenderFrame(); } catch (e) { console.error('hvhm: onRenderFrame error', e); } if (cheatInstance.game && cheatInstance.me && cheatInstance.three) { try { khvhCleanup(); } catch (e) {} } }
                                        return _r;
                                    };
                                    try { this['_render'][cheatInstance.isProxy] = true; } catch (e) {}
                                },
                                get() { return this['_render']; },
                            });
                        }
                    },
                    get() { return this['_canvas']; },
                },
                THREE: {
                    configurable: true,
                    set(value) {
                        if (cheatInstance.three == null) { cheatInstance.threeOwner = this; cheatInstance.three = value; cheatInstance.tempVector = new value.Vector3(); cheatInstance.cameraPos = new value.Vector3(); cheatInstance.rayC = new value.Raycaster(); cheatInstance.vec2 = new value.Vector2(0, 0); }
                        this['_value'] = value;
                    },
                    get() { return this['_value']; },
                },
                skins: {
                    set(skinsArray) { this[originalSkinsSymbol] = skinsArray; if (!this[localSkinsSymbol]) { this[localSkinsSymbol] = Array.apply(null, Array(25000)).map((_, i) => { return { ind: i, cnt: 1, } }); } return skinsArray; },
                    get() {
                        const isInventoryOwner = !!this.stats && !Array.isArray(this.loadout) && !this.objInstances;
                        return cheatInstance.settings.unlockSkins && isInventoryOwner ? this[localSkinsSymbol] : this[originalSkinsSymbol];
                    },
                },
                events: {
                    configurable: true,
                    set(eventEmitter) {
                        this['_events'] = eventEmitter;
                        if (this.ahNum === 0) {
                            cheatInstance.socket = this; cheatInstance.wsEvent = this._dispatchEvent.bind(this); cheatInstance.wsSend = this.send.bind(this);
                            const _origSend = this.send;
                            this.send = function (type, ...message) {
                                if (type == "ah2") return; let data = message[0];
                                if (type === 'en' && data) { cheatInstance.skinCache = { main: data[2][0], secondary: data[2][1], hat: data[3], body: data[4], knife: data[9], dye: data[14], waist: data[17], playerCard: data[32] }; }
                                if (cheatInstance.settings.unlockSkins && type === '0' && Array.isArray(message[0])) cheatInstance.patchLocalCosmeticPacket(message[0]);
                                if (cheatInstance.settings.unlockSkins && type === 'spry' && data && data !== 4577) { cheatInstance.skinCache.spray = data; }
                                return _origSend.apply(this, [type, ...message]);
                            };
                            try { this.send[cheatInstance.isProxy] = true; } catch (e) {}
                            const _origDispatch = this._dispatchEvent;
                            this._dispatchEvent = function (eventName, ...eventData) {
                                if (eventName === 'ct' || eventName === 'chat') {
                                    const scan = value => {
                                        if (typeof value === 'string' && value.indexOf('HVHM|') !== -1) cheatInstance.handleHvhmText(value);
                                        else if (Array.isArray(value)) value.forEach(scan);
                                        else if (value && typeof value === 'object') ['text','message','msg','chat','content'].forEach(k => scan(value[k]));
                                    };
                                    eventData.forEach(scan);
                                }
                                if (eventName === 'error' && eventData[0][0].includes('Connection Banned')) { localStorage.removeItem('krunker_token'); cheatInstance.notify({ title: 'Banned', message: 'Due to a ban, you have been signed out.\nPlease connect to the game with a VPN.', timeout: 5000 }); }
                                if (cheatInstance.settings.unlockSkins && eventName === '0') cheatInstance.patchLocalCosmeticPacket(eventData[0][0]);
                                if (cheatInstance.settings.unlockSkins && eventName === 'sp') { eventData[0][1] = cheatInstance.skinCache.spray; }
                                return _origDispatch.apply(this, [eventName, ...eventData]);
                            };
                            try { this._dispatchEvent[cheatInstance.isProxy] = true; } catch (e) {}
                        }
                    },
                    get() { return this['_events']; },
                },
                premiumT: { set(value) { return value; }, get() { return cheatInstance.settings.unlockSkins || cheatInstance.settings.unlockPremium; } },
                idleTimer: { enumerable: false, get() { return cheatInstance.settings.antikick ? 0 : this['_idleTimer']; }, set(value) { this['_idleTimer'] = value; } },
                kickTimer: { enumerable: false, get() { return cheatInstance.settings.antikick ? Infinity : this['_kickTimer']; }, set(value) { this['_kickTimer'] = value; } },
                cnSeen: {
                    set(value) { this._hvhmCnSeen = value; },
                    get() {
                        const isEnemy = !this.team || (cheatInstance.me && this.team !== cheatInstance.me.team);
                        const base = this._hvhmCnSeen !== undefined ? this._hvhmCnSeen : false;
                        return isEnemy && (cheatInstance.settings.espBoxMode !== 'off' || cheatInstance.settings.espSquare || cheatInstance.settings.espNameTags) ? false : base;
                    }
                },
                cnBSeen: { set(value) { this.cnSeen = value; }, get() { return this.cnSeen; } },
                canBSeen: {
                    set(value) { this._hvhmCanBSeen = value; },
                    get() {
                        const isEnemy = !this.team || (cheatInstance.me && this.team !== cheatInstance.me.team);
                        const base = this._hvhmCanBSeen !== undefined ? this._hvhmCanBSeen : false;
                        return isEnemy && (cheatInstance.settings.espBoxMode !== 'off' || cheatInstance.settings.espSquare || cheatInstance.settings.espNameTags) ? false : base;
                    }
                },
                thirdPerson: { set(value) { this['_thirdPerson'] = value; }, get() { return cheatInstance.settings.thirdPersonEnabled ? true : (this['_thirdPerson'] !== undefined ? this['_thirdPerson'] : false); } },
                trail: { set(value) { this['_trail'] = value; }, get() { return cheatInstance.settings.alwaysTrail ? true : this['_trail']; } },
            });

        }

        onRenderFrame() {
            if (!this.three || !this.renderer?.camera || !this.me) return;
            this.applyLocalCosmetics();
            this.updateCustomSoundPack();
            this.updateFOV();
            if (this.settings.chamsEnabled || this._chamsActive) { this.applyChams(); }
            this.update3DESP();
            this.applyRage();
            this.updateHvhmDetection(performance.now());
            if (this.settings.weaponZoom !== 1 && this.me.aimVal < 1) {
                if (this.renderer.camera) this.renderer.camera.zoom = this.settings.weaponZoom;
            } else if (this.renderer.camera && this.renderer.camera.zoom !== 1) {
                this.renderer.camera.zoom = 1;
            }
            // Browser userscripts cannot reliably detect every OS-level
            // capture API. This manual mode suppresses all custom overlay
            // drawing while leaving the game render untouched.
            if (this.settings.captureSafeOverlay) return;
            if (this.me.procInputs && !this.me.procInputs[this.isProxy]) {
                const originalProcInputs = this.me.procInputs;
                const self = this;
                this.me.procInputs = new Proxy(originalProcInputs, {
                    apply(target, thisArg, args) {
                        if (thisArg) self.onProcessInputs(args[0], thisArg);
                        return Reflect.apply(target, thisArg, args);
                    },
                    get(target, prop) {
                        if (prop === self.isProxy) return true;
                        return Reflect.get(target, prop);
                    }
                });
            }

            if (this.lastWireframeState !== this.settings.wireframeEnabled) {
                this.lastWireframeState = this.settings.wireframeEnabled;
                if (this.renderer.scene) {
                    this.renderer.scene.traverse(child => {
                        if (child.material && child.type == 'Mesh' && child.name != '' && child.isObject3D && !child.isModel && child.isMesh){
                            if (Array.isArray(child.material)) { for (const material of child.material) material.wireframe = this.settings.wireframeEnabled; }
                            else child.material.wireframe = this.settings.wireframeEnabled;
                        }
                    });
                }
            }

            const original_strokeStyle = this.ctx.strokeStyle; const original_lineWidth = this.ctx.lineWidth;
            const original_font = this.ctx.font; const original_fillStyle = this.ctx.fillStyle;
            CRC2d.save.apply(this.ctx, []);
            if (this.settings.fovSize > 0 && this.settings.drawFovCircle && this.settings.aimbotFovCheck) {
                const centerX = this.overlay.canvas.width / 2; const centerY = this.overlay.canvas.height / 2;
                this.ctx.beginPath(); this.ctx.arc(centerX, centerY, this.settings.fovSize, 0, 2 * Math.PI, false);
                this.ctx.lineWidth = 2; this.ctx.strokeStyle = 'rgba(255,255,255,0.7)';
                this.ctx.shadowColor = 'rgba(255,255,255,1)'; this.ctx.shadowBlur = 10; this.ctx.stroke(); this.ctx.shadowBlur = 0;
            }
            if (this.game?.players?.list) {
                for (const player of this.game.players.list) {
                    if (!player.active || !player.objInstances) continue;
                    if (player.isYou) {
                        if (this.shouldShowSelfESP() && (this.settings.selfESP || this.settings.selfSkeletonESP)) this.drawCanvasESP(player, false, true);
                        continue;
                    }
                    this.drawCanvasESP(player, false, false);
                    this.drawHvhmUserTag(player);
                    try { this.drawCheaterTag(player); } catch (e) {}
                }
            }
            if (this.settings.espBotCheck && this.game?.AI?.ais) { for (const bot of this.game.AI.ais) { if (!bot.mesh || !bot.mesh.visible || bot.health <= 0) continue; this.drawCanvasESP(bot, true); } }
            CRC2d.restore.apply(this.ctx, []);
            this.ctx.strokeStyle = original_strokeStyle; this.ctx.lineWidth = original_lineWidth;
            this.ctx.font = original_font; this.ctx.fillStyle = original_fillStyle;
            this.drawRageVisuals();
            this.updateSpectatorAlert();
        }

        getSpectators() {
            const result = [];
            const lists = [
                this.game && this.game.spectators,
                this.game && this.game.spectatorList,
                this.game && this.game.players && this.game.players.spectators,
                this.game && this.game.players && this.game.players.list
            ];
            for (const list of lists) {
                if (!Array.isArray(list)) continue;
                for (const p of list) {
                    if (!p || p.isYou) continue;
                    const isSpectator = p.isSpectator === true || p.spectator === true || p.spectating === true ||
                        p.isSpectating === true || p.mode === 'spectator' || p.state === 'spectating' ||
                        p.spectateTarget != null || p.spectatingId != null;
                    if (isSpectator && !result.includes(p)) result.push(p);
                }
            }
            return result;
        }

        updateSpectatorAlert() {
            if (!this.settings.spectatorAlertEnabled || !this.overlay || !this.ctx) return;
            const spectators = this.getSpectators();
            if (!spectators.length) return;
            const names = spectators.slice(0, 3).map(p => String(p.name || p.username || 'Spectator'));
            const suffix = spectators.length > 3 ? ` +${spectators.length - 3}` : '';
            const text = `SPECTATING YOU: ${names.join(', ')}${suffix}`;
            const ctx = this.ctx;
            const x = this.overlay.canvas.width / 2;
            const y = 34;
            ctx.save();
            ctx.font = '600 13px Arial, sans-serif';
            ctx.textAlign = 'center';
            const width = ctx.measureText(text).width + 24;
            ctx.fillStyle = 'rgba(20,20,20,0.88)';
            ctx.fillRect(x - width / 2, y - 18, width, 24);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - width / 2, y - 18, width, 24);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, x, y - 2);
            ctx.restore();
        }

        handleHvhmText(value) {
            const text = String(value || '');
            const match = text.match(/HVHM\|net\|([a-z0-9]+)(?:\|([^\s|]+))?/i);
            if (!match || match[1].toLowerCase() === this.scriptId.toLowerCase()) return;
            const scriptId = match[1].toLowerCase();
            const playerId = match[2] ? String(match[2]) : scriptId;
            this.scriptUsers.set(playerId, { scriptId, lastSeen: performance.now() });
        }

        _hvhmPlayerId(player) {
            if (!player) return '';
            return String(player.id ?? player.socketId ?? player.sid ?? '');
        }

        drawHvhmUserTag(player) {
            if (!this.settings.scriptNetEnabled || !player || player.isYou || !player.active || player.health <= 0) return;
            const playerId = this._hvhmPlayerId(player);
            if (!playerId || !this.scriptUsers.has(playerId)) return;
            const height = (player.height || this.PLAYER_HEIGHT) - ((player.crouchVal || 0) * this.CROUCH_FACTOR);
            const half = this.PLAYER_WIDTH / 2;
            const points = [
                {x: player.x-half, y: player.y, z: player.z-half},
                {x: player.x+half, y: player.y, z: player.z+half},
                {x: player.x-half, y: player.y+height, z: player.z-half},
                {x: player.x+half, y: player.y+height, z: player.z+half}
            ].map(p => this.world2Screen(p)).filter(Boolean);
            if (points.length < 2) return;
            const xs = points.map(p => p.x), ys = points.map(p => p.y);
            const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
            const ctx = this.ctx;
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);
            ctx.font = '600 11px Arial, sans-serif';
            ctx.textAlign = 'center';
            const label = 'HVHM USER';
            const labelY = Math.max(12, ymin - 5);
            const w = ctx.measureText(label).width + 8;
            ctx.fillStyle = 'rgba(0,0,0,0.78)';
            ctx.fillRect((xmin + xmax - w) / 2, labelY - 11, w, 14);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, (xmin + xmax) / 2, labelY);
            ctx.restore();
        }

        updateHvhmDetection(now) {
            if (!this.settings.scriptNetEnabled) return;
            if (!this._scriptObserver && typeof MutationObserver !== 'undefined' && document.body) {
                this._scriptObserver = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
                    const text = n && n.textContent;
                    if (text && text.indexOf('HVHM|') !== -1) this.handleHvhmText(text);
                })));
                this._scriptObserver.observe(document.body, { childList: true, subtree: true });
            }
            if (this.wsSend && now - this._lastHvhmBeacon > 4000 && this.me && this.game && this.game.gameState !== 4 && this.game.gameState !== 5) {
                const playerId = this._hvhmPlayerId(this.me);
                try { this.wsSend('ct', 0, 'HVHM|net|' + this.scriptId + '|' + playerId); } catch (e) {}
                this._lastHvhmBeacon = now;
            }
            const cutoff = now - 15000;
            for (const [id, entry] of this.scriptUsers) if (entry.lastSeen < cutoff) this.scriptUsers.delete(id);
        }

        isThirdPersonView() {
            return Boolean(this.settings.thirdPersonEnabled || this.me?._thirdPerson || this.renderer?.thirdPerson);
        }

        shouldShowSelfESP() {
            const mode = this.settings.selfESPView || 'third';
            const thirdPerson = this.isThirdPersonView();
            return mode === 'both' || (mode === 'third' ? thirdPerson : !thirdPerson);
        }

        patchLocalCosmeticPacket(playerData) {
            if (!Array.isArray(playerData) || playerData.length % 51 !== 0) return;
            const readSaved = key => {
                let raw = null;
                try { raw = typeof window.getSavedVal === 'function' ? window.getSavedVal(key) : localStorage.getItem(key); } catch (e) {}
                if (raw == null || raw === '') return undefined;
                if (raw === '-2') return -1;
                const numeric = Number(raw);
                return Number.isFinite(numeric) ? numeric : raw;
            };
            const packetFields = {
                13: 'hatIndex', 14: 'bodyIndex', 19: 'meleeIndex', 20: 'skinColIndex',
                22: 'attachIndex', 23: 'pcStatIndex', 24: 'dyeIndex', 29: 'shoeIndex',
                30: 'waistIndex', 32: 'hairCol', 33: 'faceIndex', 34: 'petIndex',
                36: 'wristIndex', 41: 'backIndex', 42: 'headIndex', 43: 'playerCardIndex'
            };
            const socketId = this.socket && this.socket.socketId;
            for (let i = 0; i < playerData.length; i += 51) {
                const isLocal = playerData[i] === socketId || (this.me && (playerData[i] === this.me.id || playerData[i + 1] === this.me.sid));
                if (!isLocal) continue;
                for (const [packetOffset, storageKey] of Object.entries(packetFields)) {
                    const selected = readSaved(storageKey);
                    if (selected !== undefined) playerData[i + Number(packetOffset)] = selected;
                }
                try {
                    const savedCharms = JSON.parse((typeof window.getSavedVal === 'function' ? window.getSavedVal('charms') : localStorage.getItem('charms')) || '[]');
                    if (Array.isArray(savedCharms)) playerData[i + 39] = savedCharms;
                } catch (e) {}
                if (this.me && Array.isArray(this.me.loadout)) {
                    try {
                        const savedSkins = JSON.parse((typeof window.getSavedVal === 'function' ? window.getSavedVal('skins') : localStorage.getItem('skins')) || '{}');
                        playerData[i + 12] = this.me.loadout.slice(0, 2).map(weaponId => savedSkins[weaponId] == null || savedSkins[weaponId] === -2 ? -1 : savedSkins[weaponId]);
                    } catch (e) {}
                }
                break;
            }
        }

        applyLocalCosmetics() {
            if (!this.settings.unlockSkins || !this.me) return;
            const readSaved = key => {
                let raw = null;
                try { raw = typeof window.getSavedVal === 'function' ? window.getSavedVal(key) : localStorage.getItem(key); } catch (e) {}
                if (raw == null || raw === '') return undefined;
                if (raw === '-2') return -1;
                const numeric = Number(raw);
                return Number.isFinite(numeric) ? numeric : raw;
            };
            const fields = {
                faceIndex: 'faceIndex',
                shoeIndex: 'shoeIndex',
                hatIndex: 'hatIndex',
                headIndex: 'headIndex',
                bodyIndex: 'bodyIndex',
                backIndex: 'backIndex',
                waistIndex: 'waistIndex',
                meleeIndex: 'meleeIndex',
                skinColIndex: 'skinColIndex',
                hairCol: 'hairCol',
                dyeIndex: 'dyeIndex',
                pcStatIndex: 'pcStatIndex',
                attachIndex: 'attachIndex',
                petIndex: 'petIndex',
                wristIndex: 'wristIndex',
                playerCardIndex: 'playerCardIndex'
            };
            if (!this.me._hvhmCosmeticWrapped) {
                const _origUpdateItems = this.me.updateItems;
                const self = this;
                if (typeof _origUpdateItems === 'function') {
                    this.me.updateItems = function (...args) {
                        if (self.settings.unlockSkins) {
                            for (const [field, storageKey] of Object.entries(fields)) {
                                const sel = readSaved(storageKey);
                                if (sel !== undefined) this[field] = sel;
                            }
                        }
                        return _origUpdateItems.apply(this, args);
                    };
                    this.me._hvhmCosmeticWrapped = true;
                }
            }
            let changed = false;
            for (const [field, storageKey] of Object.entries(fields)) {
                const selected = readSaved(storageKey);
                if (selected === undefined || String(this.me[field]) === String(selected)) continue;
                this.me[field] = selected;
                changed = true;
            }

            try {
                const savedSkins = JSON.parse((typeof window.getSavedVal === 'function' ? window.getSavedVal('skins') : localStorage.getItem('skins')) || '{}');
                if (savedSkins && Array.isArray(this.me.loadout)) {
                    const equipped = this.me.loadout.slice(0, 2).map(weaponId => {
                        const selected = savedSkins[weaponId];
                        return selected == null || selected === -2 ? -1 : selected;
                    });
                    const current = Array.isArray(this.me.skins) ? this.me.skins.slice(0, 2) : [];
                    if (JSON.stringify(current) !== JSON.stringify(equipped)) {
                        this.me.skins = equipped;
                        changed = true;
                    }
                }
            } catch (e) {}

            try {
                const savedCharms = JSON.parse((typeof window.getSavedVal === 'function' ? window.getSavedVal('charms') : localStorage.getItem('charms')) || '[]');
                if (Array.isArray(savedCharms) && JSON.stringify(this.me.charms || []) !== JSON.stringify(savedCharms)) {
                    this.me.charms = savedCharms;
                    changed = true;
                }
            } catch (e) {}

            if (changed) this.me.needsRender = true;
        }

        applyRage() {
            const s = this.settings;
            const me = this.me;
            if (!me) return;
            if (me.noRecoil !== undefined) me.noRecoil = !!s.noRecoil;
            if (me.weapon) {
                if (s.alwaysTrail) {
                    me.weapon.trail = true;
                    me.trail = true;
                }
            }
        }

        spawnTracer() {
            const cam = this.renderer && this.renderer.fpsCamera;
            if (!cam) return;
            const start = cam.getWorldPosition(new this.three.Vector3());
            const dir = new this.three.Vector3();
            cam.getWorldDirection(dir);
            const end = start.clone().add(dir.multiplyScalar(400));
            const s = this.world2Screen({ x: start.x, y: start.y, z: start.z });
            const e = this.world2Screen({ x: end.x, y: end.y, z: end.z });
            if (s && e) this._tracers.push({ x1: s.x, y1: s.y, x2: e.x, y2: e.y, t: performance.now() });
        }

        checkHitmarker() {
            if (!this.rayC || !this.renderer || !this.renderer.fpsCamera || !this.game || !this.game.players) return;
            this.rayC.setFromCamera(this.vec2, this.renderer.fpsCamera);
            this.playerMaps.length = 0;
            this.playerMaps = this.game.players.list.map(p => p.objInstances).filter(Boolean);
            if (this.containsPoint) {
                const hit = this.rayC.intersectObjects(this.playerMaps, true);
                if (hit && hit.length) this._hitmarker = performance.now();
            }
        }

        drawRageVisuals() {
            const now = performance.now();
            const ctx = this.ctx;
            if (this._tracers.length) {
                CRC2d.save.apply(ctx, []);
                for (let i = this._tracers.length - 1; i >= 0; i--) {
                    const t = this._tracers[i];
                    const age = now - t.t;
                    if (age > 120) { this._tracers.splice(i, 1); continue; }
                    const a = 1 - age / 120;
                    ctx.strokeStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
                    ctx.lineWidth = 1.5;
                    CRC2d.beginPath.apply(ctx, []);
                    CRC2d.moveTo.apply(ctx, [t.x1, t.y1]);
                    CRC2d.lineTo.apply(ctx, [t.x2, t.y2]);
                    CRC2d.stroke.apply(ctx, []);
                }
                CRC2d.restore.apply(ctx, []);
            }
            if (this._hitmarker && now - this._hitmarker < 120) {
                const cx = this.overlay.canvas.width / 2;
                const cy = this.overlay.canvas.height / 2;
                const sz = 8;
                const a = 1 - (now - this._hitmarker) / 120;
                ctx.strokeStyle = 'rgba(255,80,80,' + a.toFixed(3) + ')';
                ctx.lineWidth = 2;
                CRC2d.save.apply(ctx, []);
                CRC2d.beginPath.apply(ctx, []);
                CRC2d.moveTo.apply(ctx, [cx - sz, cy - sz]); CRC2d.lineTo.apply(ctx, [cx - sz + 4, cy - sz + 4]);
                CRC2d.moveTo.apply(ctx, [cx + sz, cy - sz]); CRC2d.lineTo.apply(ctx, [cx + sz - 4, cy - sz + 4]);
                CRC2d.moveTo.apply(ctx, [cx - sz, cy + sz]); CRC2d.lineTo.apply(ctx, [cx - sz + 4, cy + sz - 4]);
                CRC2d.moveTo.apply(ctx, [cx + sz, cy + sz]); CRC2d.lineTo.apply(ctx, [cx + sz - 4, cy + sz - 4]);
                CRC2d.stroke.apply(ctx, []);
                CRC2d.restore.apply(ctx, []);
            }
        }

        applyChams() {
            const s = this.settings;
            const enabled = s.chamsEnabled;
            const current = new Set();
            this._setChamsDistanceCulling(enabled);
            if (enabled) {
                const { entities, local } = this.getPlayerEntities();
                const teammateEntities = new Set(((this.game && this.game.players && this.game.players.list) || [])
                    .filter(p => p && !p.isYou && this.isTeam(p))
                    .map(p => p.objInstances || p.mesh).filter(Boolean));
                for (const entity of entities) {
                    if (!entity || (!s.chamsTeammates && teammateEntities.has(entity))) continue;
                    current.add(entity); this._forceChamsEntityRenderable(entity); this._applyChamsToEntity(entity, false, s);
                }
                if (s.chamsSelf && local && this.isThirdPersonView()) {
                    current.add(local);
                    this._applyChamsToEntity(local, true, s);
                }
                if (s.espBotCheck && this.game.AI && this.game.AI.ais) {
                    for (const b of this.game.AI.ais) { if (b && b.mesh) { current.add(b.mesh); this._forceChamsEntityRenderable(b.mesh); this._applyChamsToEntity(b.mesh, true, s); } }
                }
            }
            for (let i = this._chamsEntities.length - 1; i >= 0; i--) {
                const e = this._chamsEntities[i];
                if (!current.has(e)) this._removeChamsFromEntity(e);
            }
            this._chamsActive = enabled;
        }

        _setChamsDistanceCulling(enabled) {
            const game = this.game;
            if (!game) return;
            if (enabled) {
                if (!this._chamsLODState) this._chamsLODState = { useLOD: game.useLOD };
                game.useLOD = false;
                // 10.0.0 batches player parts into BatchedMeshes, which ignore
                // per-mesh material swaps. Stub the batches so players build with
                // individual meshes that chams can recolor (takes effect as players
                // respawn). Every batch call site is truthiness-guarded except the
                // per-frame cosmeticBatch.update(), which the stub provides.
                // The batch owner may be the renderer or game.render depending on
                // build, so stub whichever object actually carries it.
                const batchOwners = [this.renderer, this.game && this.game.render, this.game]
                    .filter((o, i, arr) => o && typeof o === 'object' && arr.indexOf(o) === i);
                for (const owner of batchOwners) {
                    if (owner.playerBatch && !owner.__hvhmBatchStub) {
                        console.log('hvhm: stubbing player batches for chams (takes effect on respawn)');
                        owner.__hvhmBatchStub = {
                            playerBatch: owner.playerBatch,
                            cosmeticBatch: owner.cosmeticBatch
                        };
                        owner.playerBatch = {
                            setPart: (player, part, mesh) => mesh,
                            release: () => {},
                            update: () => {}
                        };
                        owner.cosmeticBatch = {
                            add: () => {},
                            release: () => {},
                            update: () => {}
                        };
                    }
                }
                return;
            }
            if (this._chamsLODState) {
                game.useLOD = this._chamsLODState.useLOD;
                this._chamsLODState = null;
            }
            const renderer = this.renderer;
            const stubOwners = [this.renderer, this.game && this.game.render, this.game]
                .filter((o, i, arr) => o && typeof o === 'object' && arr.indexOf(o) === i);
            for (const owner of stubOwners) {
                const stub = owner.__hvhmBatchStub;
                if (stub) {
                    owner.playerBatch = stub.playerBatch;
                    owner.cosmeticBatch = stub.cosmeticBatch;
                    delete owner.__hvhmBatchStub;
                }
            }
        }

        _forceChamsEntityRenderable(entity) {
            if (!entity) return;
            entity.visible = true;
            entity.frustumCulled = false;
            entity.traverse(child => {
                if (child.isMesh) child.frustumCulled = false;
            });
            const players = (this.game && this.game.players && this.game.players.list) || [];
            for (const player of players) {
                if (player && (player.objInstances === entity || player.mesh === entity)) {
                    player.lodActive = false;
                    break;
                }
            }
        }

        getPlayerEntities() {
            const result = { entities: [], local: null };
            const scene = this.renderer && this.renderer.scene;
            const me = this.me;
            const meObj = me ? (me.objInstances || me.mesh) : null;
            const players = (this.game && this.game.players && this.game.players.list) || [];
            const playerPositions = [];
            for (const p of players) {
                if (!p || !p.active) continue;
                const o = p.objInstances || p.mesh;
                if (o && o.position) playerPositions.push(o.position);
            }
            const seen = new Set();
            const add = (e) => { if (e && !seen.has(e)) { seen.add(e); result.entities.push(e); } };
            for (const p of players) {
                if (!p || !p.active || p.isYou) continue;
                add(p.objInstances || p.mesh);
            }
            if (scene) {
                for (const entity of scene.children) {
                    if (entity.type !== 'Object3D') continue;
                    let isLocal = false;
                    try {
                        const camChild = entity.children && entity.children[0] && entity.children[0].children && entity.children[0].children[0];
                        if (camChild && camChild.type === 'PerspectiveCamera') isLocal = true;
                    } catch (e) {}
                    if (isLocal) { if (!result.local) result.local = entity; continue; }
                    for (const pos of playerPositions) {
                        if (entity.position && pos && Math.abs(entity.position.x - pos.x) < 2 && Math.abs(entity.position.z - pos.z) < 2 && Math.abs(entity.position.y - pos.y) < 6) {
                            add(entity); break;
                        }
                    }
                }
            }
            if (meObj) {
                const idx = result.entities.indexOf(meObj);
                if (idx !== -1) result.entities.splice(idx, 1);
                result.local = meObj;
            }
            return result;
        }

        _resolveChamsColor(entity, isLocal, s) {
            if (s.chamsMode === 'rgb') return this._rgbChamsColor();
            const visible = this._isChamsEntityVisible(entity, isLocal);
            return new this.three.Color(visible ? (s.chamsVisibleColor || s.chamsColor || '#ff0000') : (s.chamsColor || '#ff0000'));
        }

        _isChamsEntityVisible(entity, isLocal) {
            if (isLocal) return true;
            const position = entity && entity.position;
            if (!position || !this.game || !this.me) return false;
            const players = (this.game.players && this.game.players.list) || [];
            const player = players.find(p => p && Math.abs(Number(p.x) - position.x) < 2 && Math.abs(Number(p.z) - position.z) < 2 && Math.abs(Number(p.y) - position.y) < 6);
            return player ? this.getCanSee(player) : false;
        }

        _createChamsMaterial(s, entity, isLocal) {
            const mat = new this.three.MeshBasicMaterial({
                color: this._resolveChamsColor(entity, isLocal, s),
                depthTest: false,
                depthWrite: false,
                transparent: true,
                opacity: s.chamsOpacity,
                side: this.three.DoubleSide
            });
            mat.__isChams = true;
            mat.__isChamsMaterial = true;
            return mat;
        }

        _applyChamsToEntity(entity, isLocal, s) {
            if (!entity) return;
            if (entity.__chamsApplied) { this._updateChamsMaterials(entity, s, isLocal); return; }
            const containsCamera = object => {
                if (!object) return false;
                if (object.isCamera || object.type === 'PerspectiveCamera') return true;
                return Array.isArray(object.children) && object.children.some(containsCamera);
            };
            const cameraRoot = isLocal && entity.children ? entity.children.find(containsCamera) : null;
            const isDescendantOf = (object, root) => {
                for (let parent = object; parent; parent = parent.parent) if (parent === root) return true;
                return false;
            };
            entity.traverse(child => {
                if (!child.isMesh) return;
                if (isLocal && cameraRoot && isDescendantOf(child, cameraRoot)) return;
                if (!child.__originalMaterials) child.__originalMaterials = child.material;
                if (!child.__chamsMaterial) child.__chamsMaterial = this._createChamsMaterial(s, entity, isLocal);
                child.material = child.__chamsMaterial;
                child.renderOrder = 9998;
                child.frustumCulled = false;
            });
            entity.__chamsApplied = true;
            if (!this._chamsEntities.includes(entity)) this._chamsEntities.push(entity);
            this._updateChamsMaterials(entity, s, isLocal);
        }

        updateFOV() {
            const scene = this.renderer && this.renderer.scene;
            const value = Number(this.settings.fovChanger);
            if (!scene) return;

            if (!Number.isFinite(value) || value <= 0) {
                for (const [camera, state] of this._fovCameraLocks) this._unlockFOVCamera(camera, state);
                this._fovCameraLocks.clear();
                return;
            }

            const cameras = new Set();
            scene.traverse(child => { if (child && child.isCamera) cameras.add(child); });
            if (this.renderer.camera) cameras.add(this.renderer.camera);
            if (this.renderer.fpsCamera) cameras.add(this.renderer.fpsCamera);

            for (const camera of cameras) {
                let state = this._fovCameraLocks.get(camera);
                if (!state) {
                    state = {
                        fov: Number(camera.fov),
                        zoom: Number(camera.zoom),
                        fovDescriptor: Object.getOwnPropertyDescriptor(camera, 'fov'),
                        zoomDescriptor: Object.getOwnPropertyDescriptor(camera, 'zoom'),
                        lockedFov: value,
                        lockedZoom: 1
                    };
                    try {
                        Object.defineProperty(camera, 'fov', {
                            configurable: true,
                            enumerable: state.fovDescriptor ? state.fovDescriptor.enumerable : true,
                            get: () => state.lockedFov,
                            set: next => { if (Number.isFinite(Number(next))) state.fov = Number(next); }
                        });
                        Object.defineProperty(camera, 'zoom', {
                            configurable: true,
                            enumerable: state.zoomDescriptor ? state.zoomDescriptor.enumerable : true,
                            get: () => state.lockedZoom,
                            set: next => { if (Number.isFinite(Number(next))) state.zoom = Number(next); }
                        });
                        this._fovCameraLocks.set(camera, state);
                    } catch (e) {
                        camera.fov = value;
                        camera.zoom = 1;
                    }
                }
                state.lockedFov = value;
                state.lockedZoom = 1;
                camera.updateProjectionMatrix();
            }

            for (const [camera, state] of this._fovCameraLocks) {
                if (cameras.has(camera)) continue;
                this._unlockFOVCamera(camera, state);
                this._fovCameraLocks.delete(camera);
            }
        }

        _unlockFOVCamera(camera, state) {
            if (!camera || !state) return;
            try {
                if (state.fovDescriptor) Object.defineProperty(camera, 'fov', { ...state.fovDescriptor, value: state.fov });
                else { delete camera.fov; camera.fov = state.fov; }
                if (state.zoomDescriptor) Object.defineProperty(camera, 'zoom', { ...state.zoomDescriptor, value: state.zoom });
                else { delete camera.zoom; camera.zoom = state.zoom; }
                camera.updateProjectionMatrix();
            } catch (e) {}
        }

        update3DESP() {
            const scene = this.renderer && this.renderer.scene;
            if (!scene || !this.three) return;
            const active = new Set();
            const addBox = (player, isBot) => {
                if (!player || (!isBot && !player.active) || player.health <= 0) return;
                const isSelf = !isBot && player.isYou;
                if (isSelf && (!this.settings.selfESP || !this.shouldShowSelfESP())) return;
                if (!isSelf && this.settings.espTeamCheck && this.isTeam(player)) return;
                const entity = player.objInstances || player.mesh;
                if (!entity) return;
                active.add(player);

                const height = isBot
                    ? ((player.dat && player.dat.mSize) || this.PLAYER_HEIGHT)
                    : (player.height || this.PLAYER_HEIGHT) - ((player.crouchVal || 0) * this.CROUCH_FACTOR);
                const halfWidth = isBot
                    ? (((player.dat && player.dat.mSize) || this.PLAYER_WIDTH) * 0.2)
                    : this.PLAYER_WIDTH / 2;
                const x = Number(player.x ?? entity.position?.x ?? 0);
                const y = Number(player.y ?? entity.position?.y ?? 0);
                const z = Number(player.z ?? entity.position?.z ?? 0);
                const boxColor = (isSelf || this.getCanSee(player))
                    ? (this.settings.espBoxVisibleColor || this.settings.espBoxColor || '#ffffff')
                    : (this.settings.espBoxColor || '#ffffff');

                let helper = this._esp3DBoxes.get(player);
                if (!helper) {
                    const box = new this.three.Box3();
                    helper = new this.three.Box3Helper(box, boxColor);
                    helper.material.depthTest = false;
                    helper.material.depthWrite = false;
                    helper.material.transparent = false;
                    helper.material.opacity = 1;
                    helper.material.blending = this.three.NormalBlending;
                    helper.material.toneMapped = false;
                    helper.renderOrder = 9999;
                    helper.frustumCulled = false;
                    this._esp3DBoxes.set(player, helper);
                }
                helper.box.min.set(x - halfWidth, y, z - halfWidth);
                helper.box.max.set(x + halfWidth, y + height, z + halfWidth);
                helper.material.color.set(boxColor);
                helper.material.linewidth = Math.max(1, Number(this.settings.espScale) || 1);
                helper.visible = true;
                if (helper.parent !== scene) scene.add(helper);
            };

            if (this.settings.espBoxMode === '3d') {
                const players = (this.game && this.game.players && this.game.players.list) || [];
                for (const player of players) addBox(player, false);
                if (this.settings.espBotCheck && this.game?.AI?.ais) {
                    for (const bot of this.game.AI.ais) addBox(bot, true);
                }
            }

            for (const [player, helper] of this._esp3DBoxes) {
                if (active.has(player)) continue;
                if (helper.parent) helper.parent.remove(helper);
                if (helper.geometry) helper.geometry.dispose();
                if (helper.material) helper.material.dispose();
                this._esp3DBoxes.delete(player);
            }
        }

        _updateChamsMaterials(entity, s, isLocal) {
            const color = this._resolveChamsColor(entity, isLocal, s);
            entity.traverse(child => {
                if (!child.isMesh || !child.__chamsMaterial) return;
                child.__chamsMaterial.color.copy(color);
                child.__chamsMaterial.opacity = s.chamsOpacity;
                child.__chamsMaterial.depthTest = false;
                child.__chamsMaterial.depthWrite = false;
                child.__chamsMaterial.transparent = true;
                child.__chamsMaterial.needsUpdate = true;
            });
        }

        _removeChamsFromEntity(entity) {
            if (!entity) return;
            entity.traverse(child => {
                if (child.isMesh && child.__originalMaterials) {
                    child.material = child.__originalMaterials;
                    child.renderOrder = 0;
                }
            });
            entity.__chamsApplied = false;
            const idx = this._chamsEntities.indexOf(entity);
            if (idx !== -1) this._chamsEntities.splice(idx, 1);
        }

        _rgbChamsColor() {
            if (this._rgbHue === undefined) this._rgbHue = 0;
            this._rgbHue = (this._rgbHue + 0.02) % (Math.PI * 2);
            const r = Math.sin(this._rgbHue) * 0.5 + 0.5;
            const g = Math.sin(this._rgbHue + 2.094) * 0.5 + 0.5;
            const b = Math.sin(this._rgbHue + 4.188) * 0.5 + 0.5;
            return new this.three.Color(r, g, b);
        }

        onProcessInputs(inputPacket, player) {
            const gameInputIndices = { frame: 0, delta: 1, xdir: 2, ydir: 3, moveDir: 4, shoot: 5, scope: 6, jump: 7, reload: 8, crouch: 9, weaponScroll: 10, weaponSwap: 11, moveLock: 12 };

            const _shootingNow = !!inputPacket[gameInputIndices.shoot];
            if (_shootingNow && !this._lastShoot) {
                if (this.settings.bulletTracers || this.settings.alwaysTrail) this.spawnTracer();
                if (this.settings.hitmarkers) this.checkHitmarker();
            }
            this._lastShoot = _shootingNow;

            if (this.settings.bhopEnabled && this.pressedKeys.has('Space')) {
                this.controls.keys[this.controls.binds.jump.val] ^= 1;
                if (this.controls.keys[this.controls.binds.jump.val]) { this.controls.didPressed[this.controls.binds.jump.val] = 1; }
                if (this.me.velocity.y < -0.03 && this.me.canSlide) {
                    setTimeout(() => { this.controls.keys[this.controls.binds.crouch.val] = 0; }, this.me.slideTimer || 325);
                    this.controls.keys[this.controls.binds.crouch.val] = 1; this.controls.didPressed[this.controls.binds.crouch.val] = 1;
                }
            }
            if (this.settings.autoNuke && Object.keys(this.me.streaks).length && this.socket?.send) { this.socket.send('k', 0); }
            if (this.settings.autoReload && this.vars.weaponIndex && this.me.weapon.secondary !== undefined && this.me.weapon.secondary !== null && this.me.ammos[this.me[this.vars.weaponIndex]] === 0 && this.me.reloadTimer === 0) {
                this.game.players.reload(this.me); inputPacket[gameInputIndices.reload] = 1;
            }

            let target = null;
            const aimKeyHeld = Boolean(this.hotkeys.aimKey && this.pressedKeys.has(this.hotkeys.aimKey));
            if (this.settings.aimbotEnabled && (!this.settings.aimbotOnAimKey || aimKeyHeld)) {
                let potentialTargets = [];

                for (let i = 0; i < this.game.players.list.length; i++) {
                    const p = this.game.players.list[i];
                    if (this.isDefined(p) && !p.isYou && p.active && p.health > 0 &&
                        (!this.settings.aimbotTeamCheck || !this.isTeam(p)) &&
                        (!this.settings.aimbotWallCheck || this.getCanSee(p))) {
                        p.isBot = false;
                        potentialTargets.push(p);
                    }
                }

                if (this.settings.aimbotBotCheck && this.game.AI?.ais) {
                    for (let i = 0; i < this.game.AI.ais.length; i++) {
                        const bot = this.game.AI.ais[i];
                        if (bot.mesh && bot.mesh.visible && bot.health > 0 &&
                            (!this.settings.aimbotWallCheck || this.getCanSee(bot))) {
                            bot.isBot = true;
                            potentialTargets.push(bot);
                        }
                    }
                }

                potentialTargets.sort((a, b) => this.getDistanceSq(this.me, a) - this.getDistanceSq(this.me, b));

                if (this.settings.aimbotFovCheck && this.settings.fovSize > 0) {
                    const fovRadiusSq = this.settings.fovSize * this.settings.fovSize;
                    const centerX = this.overlay.canvas.width / 2;
                    const centerY = this.overlay.canvas.height / 2;

                    potentialTargets = potentialTargets.filter(p => {
                        const screenPos = this.world2Screen(this.getAimPoint(p));
                        if (!screenPos) return false;
                        const distSq = (screenPos.x - centerX)**2 + (screenPos.y - centerY)**2;
                        return distSq <= fovRadiusSq;
                    });
                }

                let bestTarget = potentialTargets[0] || null;
                const prevTarget = this.aimbotTarget;
                if (prevTarget && potentialTargets.includes(prevTarget) && bestTarget &&
                    this.getDistanceSq(this.me, prevTarget) <= this.getDistanceSq(this.me, bestTarget) * 1.25) {
                    bestTarget = prevTarget;
                }
                this.aimbotTarget = bestTarget;
                target = bestTarget;
            }

            // Standalone legit triggerbot: checks the crosshair without moving
            // the camera and does not depend on the aimbot toggle or aim key.
            if (this.settings.triggerbotEnabled && this.me.reloadTimer === 0 &&
                this.game.gameState !== 4 && this.game.gameState !== 5 && !this.me.didShoot) {
                const triggerTarget = this.findTriggerbotTarget();
                if (triggerTarget) inputPacket[gameInputIndices.shoot] = 1;
            }

            if (target && this.me.reloadTimer === 0 && this.game.gameState !== 4 && this.game.gameState !== 5) {
                const isMelee = this.me.weapon.melee; const closeRange = 17.6; const throwRange = 65.2;
                const distance = Math.sqrt(this.getDistanceSq(this.me, target));

                if (isMelee && distance > (this.me.weapon.canThrow ? throwRange : closeRange)) { }
                else {
                    const aimPoint = this.getAimPoint(target);
                    const targetY = aimPoint.y + (Number(this.settings.aimOffset) || 0);
                    const yDire = this.getDirection(this.me.z, this.me.x, aimPoint.z, aimPoint.x);
                    const xDire = this.getXDirection(this.me.x, this.me.y, this.me.z, aimPoint.x, targetY, aimPoint.z) - (0.3 * this.me.recoilAnimY);

                    // Keep the original smooth target interpolation for both
                    // visible and silent aim. Silent aim only suppresses camera
                    // movement; it must not turn aiming into an inaccurate snap.
                    if (this.settings.legitAimbot && (!target.isBot || this.settings.legitAiAim)) {
                        let adsReduction = 1.0; if (this.me.aimVal < 1) { adsReduction = 1.0 - (this.settings.adsTremorReduction / 100.0); }

                        if (this.legitTarget !== target) {
                            this.legitTarget = target;
                            this.lastTargetChangeTime = Date.now();
                            this.aimOffset.x = (Math.random() - 0.5) * (this.settings.aimRandomness * adsReduction);
                            this.aimOffset.y = (Math.random() - 0.5) * (this.settings.aimRandomness * adsReduction);
                        }

                        const wanderAmount = this.settings.aimRandomness * adsReduction;
                        this.aimOffset.x += (Math.random() - 0.5) * wanderAmount * 0.1;
                        this.aimOffset.y += (Math.random() - 0.5) * wanderAmount * 0.1;
                        this.aimOffset.x = Math.max(-wanderAmount, Math.min(wanderAmount, this.aimOffset.x));
                        this.aimOffset.y = Math.max(-wanderAmount, Math.min(wanderAmount, this.aimOffset.y));

                        const currentY = this.controls.object.rotation.y;
                        const __pch = this.vars.pchObjc && this.controls[this.vars.pchObjc];
                        const currentX = __pch ? __pch.rotation.x : 0;

                        const finalX = xDire + this.aimOffset.y * 0.01;
                        const finalY = yDire + this.aimOffset.x * 0.01;

                        const flickFactor = this.settings.flickSpeed * 0.01;

                        const shortestAngleY = Math.atan2(Math.sin(finalY - currentY), Math.cos(finalY - currentY));
                        let newY = currentY + shortestAngleY * flickFactor;

                        const shortestAngleX = finalX - currentX;
                        let newX = currentX + shortestAngleX * flickFactor;

                        if (this.settings.aimTremor > 0) {
                            const tremorAmount = this.settings.aimTremor * adsReduction;
                            newX += (Math.random() - 0.5) * tremorAmount * 0.01;
                            newY += (Math.random() - 0.5) * tremorAmount * 0.01;
                        }

                        if (!this.settings.superSilentEnabled) this.lookDir(newX, newY);
                        inputPacket[gameInputIndices.xdir] = newX * 1000; inputPacket[gameInputIndices.ydir] = newY * 1000;
                        this._aimError = Math.abs(shortestAngleY) + Math.abs(shortestAngleX);
                    } else {
                        if (!this.settings.superSilentEnabled) this.lookDir(xDire, yDire);
                        inputPacket[gameInputIndices.xdir] = xDire * 1000; inputPacket[gameInputIndices.ydir] = yDire * 1000;
                        this._aimError = 0;
                    }

                    if (this.settings.autoFireEnabled) {
                        this.playerMaps.length = 0; this.rayC.setFromCamera(this.vec2, this.renderer.fpsCamera);
                        this.playerMaps = this.game.players.list.map(p => p.objInstances).filter(Boolean);
                        const inCast = this.rayC.intersectObjects(this.playerMaps, true).length;
                        const canSee = target.objInstances && this.containsPoint(target.objInstances.position);
                        const confirmed = !this.settings.legitAimbot || (inCast && canSee);
                        // Don't waste the first shot: fire only once the gun is
                        // truly on target (tight angular convergence) and, for
                        // scoped weapons, fully scoped in. Snap aim and silent aim
                        // converge instantly and skip the wait.
                        const aimSettled = this.settings.superSilentEnabled || !this.settings.legitAimbot || (this._aimError || 0) < 0.012;
                        const scopeReady = this.me.weapon.noAim || (Number(this.me.aimVal) || 0) >= 0.85;
                        if (this.me.reloadTimer === 0 && !this.me.didShoot && confirmed && aimSettled && (isMelee || scopeReady)) {
                            if (isMelee) {
                                if (distance <= closeRange) { inputPacket[gameInputIndices.shoot] = 1; }
                                else if (distance <= throwRange && this.me.weapon.canThrow) {
                                    inputPacket[gameInputIndices.scope] = 1;
                                    inputPacket[gameInputIndices.shoot] = 1;
                                }
                            } else {
                                if (!this.me.weapon.noAim) inputPacket[gameInputIndices.scope] = 1;
                                inputPacket[gameInputIndices.shoot] = 1;
                            }
                        }
                    }
                }
            } else if (!target && this.game.gameState !== 4 && this.game.gameState !== 5) {
            this.legitTarget = null;
            this.aimbotTarget = null;
                if (!this.settings.superSilentEnabled && !this.settings.antiAimEnabled && !this.settings.antiAimSpinEnabled) {
                    this.resetLookAt();
                }
                if ((this.settings.antiAimEnabled || this.settings.antiAimSpinEnabled) && !this.me.didShoot) {
                    this.applyAntiAim(inputPacket, gameInputIndices);
                }
                this.updateFOV();

            } else if (this.me.weapon.nAuto && this.me.didShoot) {
                inputPacket[gameInputIndices.shoot] = 0; inputPacket[gameInputIndices.scope] = 0;
                this.me.inspecting = false; this.me.inspectX = 0;
            }

        }

        applyAntiAim(inputPacket, idx) {
            const s = this.settings;
            const me = this.me;
            if (!me) return;
            const realYaw = this.controls.object.rotation.y;

            // Anti-aim is deliberately independent from spinbot: it only sends
            // the look-down pitch and preserves the camera yaw.
            if (s.antiAimEnabled) {
                inputPacket[idx.ydir] = realYaw * 1000;
                inputPacket[idx.xdir] = -Math.PI * 500;
            }
            if (!s.antiAimSpinEnabled) return;

            const inAir = !me.onGround;
            const now = performance.now();
            if (inAir && !this._aeroWasAirborne) this._aeroAirStartedAt = now;
            this._aeroWasAirborne = inAir;
            const justLeftGround = now - this._aeroAirStartedAt < 28;
            const verticalVelocity = Number(me.velocity && me.velocity.y);
            const landingNow = inAir && Number.isFinite(verticalVelocity) &&
                verticalVelocity < -0.07 && !!me.canSlide;
            const invertSpin = this._aeroSpinOverrideHeld === true;
            const normalAeroSpin = inAir && !justLeftGround && !landingNow;
            const wantSpin = invertSpin ? !inAir : normalAeroSpin;

            if (wantSpin) {
                this.antiAimAngle += (s.antiAimSpinSpeed * 0.001) * Math.PI * 2;
                if (this.antiAimAngle > Math.PI * 2) this.antiAimAngle %= Math.PI * 2;
                const stepAngle = Math.PI / 4;
                const spinSteps = ((Math.round(this.antiAimAngle / stepAngle) % 8) + 8) % 8;
                const spinYaw = realYaw + spinSteps * stepAngle;
                inputPacket[idx.ydir] = spinYaw * 1000;
                inputPacket[idx.xdir] = -Math.PI * 500;
                const moveIndex = inputPacket[idx.moveDir];
                if (Number.isInteger(moveIndex) && moveIndex >= 0 && moveIndex < 8) {
                    inputPacket[idx.moveDir] = ((moveIndex - spinSteps) % 8 + 8) % 8;
                }
            } else {
                inputPacket[idx.ydir] = realYaw * 1000;
                if (s.antiAimEnabled && !inAir) {
                    inputPacket[idx.xdir] = -Math.PI * 500;
                }
            }
        }

        findTriggerbotTarget() {
            if (!this.overlay || !this.overlay.canvas || !this.game || !this.game.players) return null;
            const cx = this.overlay.canvas.width / 2;
            const cy = this.overlay.canvas.height / 2;
            const maxPixels = 14;
            const candidates = [];
            for (const p of (this.game.players.list || [])) {
                if (!this.isDefined(p) || p.isYou || !p.active || p.health <= 0) continue;
                if (this.settings.aimbotTeamCheck && this.isTeam(p)) continue;
                if (this.settings.aimbotWallCheck && !this.getCanSee(p)) continue;
                const screen = this.world2Screen(this.getAimPoint(p));
                if (!screen || screen.z < 0 || !Number.isFinite(screen.x) || !Number.isFinite(screen.y)) continue;
                const distance = Math.hypot(screen.x - cx, screen.y - cy);
                if (distance <= maxPixels) candidates.push({ p, distance });
            }
            candidates.sort((a, b) => a.distance - b.distance);
            return candidates.length ? candidates[0].p : null;
        }

        getLobbyId() {
            try {
                const params = new URLSearchParams(window.location.search);
                return params.get('game') || null;
            } catch (e) { return null; }
        }

        startLobbyHeartbeat() {
            if (this.lobbyHeartbeatInterval) clearInterval(this.lobbyHeartbeatInterval);
            if (this.lobbyFetchInterval) clearInterval(this.lobbyFetchInterval);
            let firstBeatDone = false;
            const beat = async () => {
                if (!this.settings.showCheaterRadar || this.settings.hideFromRadar) return;
                const lobbyId = this.getLobbyId();
                if (!lobbyId) return;
                const playerName = this.me && this.me.name ? this.me.name : null;
                if (!playerName) return;
                try {
                    const res = await fetch('https://krunker.twitchfollows.de/api/lobby/heartbeat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            key: this.scriptId,
                            sessionId: localStorage.getItem('hvhm_sid'),
                            username: playerName,
                            lobbyId,
                            teamMode: this.settings.teamWithCheaters
                        })
                    });
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    const data = await res.json().catch(() => ({}));
                    if (data.role) {
                        this.myRole = data.role;
                        this.lobbyCheatUsers.set(playerName, {
                            teamMode: !!this.settings.teamWithCheaters,
                            role: this.myRole
                        });
                    }
                    this.heartbeatFailCount = 0;
                    firstBeatDone = true;
                } catch (e) { console.warn('hvhm: lobby heartbeat notice:', e.message || e); }
            };
            this.sendLobbyHeartbeat = beat;
            const fetchUsers = () => {
                const id = this.getLobbyId();
                if (id && this.settings.showCheaterRadar) this.fetchLobbyUsers(id);
            };
            beat();
            fetchUsers();
            this.lobbyHeartbeatInterval = setInterval(beat, 15000);
            this.lobbyFetchInterval = setInterval(fetchUsers, 10000);
            let lastHref = window.location.href;
            setInterval(() => {
                const changed = window.location.href !== lastHref;
                const hasName = !!this.me && !!this.me.name;
                if (changed) {
                    lastHref = window.location.href;
                    this.lobbyCheatUsers.clear();
                    firstBeatDone = false;
                    beat();
                    fetchUsers();
                } else if (!firstBeatDone && hasName) {
                    firstBeatDone = true;
                    beat();
                }
            }, 1500);
        }

        async fetchLobbyUsers(lobbyId) {
            if (!lobbyId) return;
            try {
                const res = await fetch('https://krunker.twitchfollows.de/api/lobby/users?lobbyId=' + encodeURIComponent(lobbyId));
                if (!res.ok) return;
                const data = await res.json();
                const next = new Map((data.users || []).map(u => [u.name, {
                    teamMode: u.teamMode,
                    role: u.role || 'user'
                }]));
                const myName = this.me?.name;
                next.forEach((entry, name) => {
                    if (name === myName) return;
                    const prev = this.lobbyCheatUsers.get(name);
                    const wasStaff = prev && (prev.role === 'owner' || prev.role === 'moderator');
                    if (!wasStaff && (entry.role === 'owner' || entry.role === 'moderator')) {
                        const isOwner = entry.role === 'owner';
                        this.notify({
                            title: isOwner ? 'Owner in Lobby' : 'Moderator in Lobby',
                            message: name + ' (' + (isOwner ? 'Owner' : 'Moderator') + ') is now in your game.',
                            timeout: 8000
                        });
                    }
                });
                this.lobbyCheatUsers = next;
            } catch (e) {}
        }

        async fetchFeatureStatuses() {
            const now = Date.now();
            if (now - this.featureStatusLastFetch < 300000) return;
            this.featureStatusLastFetch = now;
            try {
                const res = await fetch('https://krunker.twitchfollows.de/api/feature-status');
                if (!res.ok) return;
                const list = await res.json();
                this.featureStatuses = {};
                for (const f of list) {
                    this.featureStatuses[f.feature_id] = f;
                    if (f.force_disabled === 1) this.settings[f.feature_id] = false;
                }
                this.saveSettings('hvhm_settings', this.settings);
            } catch (e) {}
        }

        isTeamingFriendly() {
            const now = Date.now();
            const on = !!this.settings.teamWithCheaters;
            if (on !== this._lastTeamWithCheatersState) {
                this._lastTeamWithCheatersState = on;
                if (on) this._teamWithCheatersToggledOnTime = now;
                else this._teamWithCheatersLastEnabled = now;
                if (typeof this.sendLobbyHeartbeat === 'function') this.sendLobbyHeartbeat();
            }
            if (on) return now - (this._teamWithCheatersToggledOnTime || 0) >= 5000;
            return now - (this._teamWithCheatersLastEnabled || 0) < 10000;
        }

        onNetSend(socket, type, args) {
            if (!this.settings.unlockSkins) return;
            this.socket = socket;
            const data = args[0];
            if (type === 'en' && Array.isArray(data)) {
                this.skinCache = {
                    main: data[2] && data[2][0] !== undefined ? data[2][0] : -1,
                    secondary: data[2] && data[2][1] !== undefined ? data[2][1] : -1,
                    hat: data[3],
                    body: data[4],
                    knife: data[9],
                    dye: data[14],
                    waist: data[17] !== undefined ? data[17] : data[15],
                    back: data[16],
                    playerCard: data[32]
                };
            }
            if (type === 'spry' && data && data !== 4577) {
                if (!this.skinCache) this.skinCache = {};
                this.skinCache.spray = data;
                args[0] = 4577;
            }
        }

        onNetDispatch(socket, eventName, eventData) {
            this.socket = socket;
            if (eventName === 'error' && eventData[0] && typeof eventData[0][0] === 'string' && eventData[0][0].includes('Connection Banned')) {
                localStorage.removeItem('krunker_token');
                this.notify({ title: 'Banned', message: 'Due to a ban, you have been signed out.\nPlease connect to the game with a VPN.', timeout: 5000 });
            }
            if (!this.settings.unlockSkins) return;
            if (eventName === '0' && eventData[0]) {
                try {
                    const arr = eventData[0];
                    const socketId = socket ? socket.socketId : 0;
                    let stride = arr.length % 52 === 0 ? 52 : arr.length % 51 === 0 ? 51 : 38;
                    while (arr.length % stride !== 0 && stride < 100) stride++;
                    const cache = this.getEffectiveSkinCache();
                    for (let k = 0; k < arr.length; k += stride) {
                        const isLocal = (socketId !== undefined && socketId !== -1 && arr[k] === socketId) || (this.me && arr[k + 5] === this.me.name);
                        if (isLocal && cache) {
                            if (cache.main !== -1) arr[k + 12] = [cache.main, cache.secondary !== -1 ? cache.secondary : -1];
                            if (cache.hat !== -1) arr[k + 13] = cache.hat;
                            if (cache.body !== -1) arr[k + 14] = cache.body;
                            if (cache.knife !== -1) arr[k + 19] = cache.knife;
                            if (cache.dye !== -1) arr[k + 24] = cache.dye;
                            if (cache.waist !== -1) arr[k + 30] = cache.waist;
                            if (cache.back !== -1) arr[k + 41] = cache.back;
                            if (cache.playerCard !== -1) arr[k + 43] = cache.playerCard;
                        }
                    }
                } catch (e) { console.error('hvhm: spawn injection error', e); }
            }
            if (eventName === 'sp' && eventData[0] && this.skinCache && this.skinCache.spray !== undefined) {
                eventData[0][1] = this.skinCache.spray;
            }
            if (eventName === 'rg' && eventData[0] && Array.isArray(eventData[0][2])) {
                try {
                    const rg = eventData[0][2];
                    const cache = this.getEffectiveSkinCache();
                    if (cache) {
                        if (cache.main !== -1) rg[0] = [cache.main, cache.secondary !== -1 ? cache.secondary : -1];
                        if (cache.hat !== -1) rg[3] = cache.hat;
                        if (cache.body !== -1) rg[5] = cache.body;
                        if (cache.waist !== -1) rg[7] = cache.waist;
                        if (cache.knife !== -1) rg[8] = cache.knife;
                        if (cache.dye !== -1) rg[11] = cache.dye;
                        if (cache.playerCard !== -1) rg[18] = cache.playerCard;
                    }
                } catch (e) {}
            }
        }

        getEquippedSkinCache() {
            let saved = {};
            try {
                const raw = localStorage.getItem('skins');
                if (raw) saved = JSON.parse(raw);
            } catch (e) {}
            const cls = parseInt(localStorage.getItem('classindex') || '0', 10);
            const sec = parseInt(localStorage.getItem('secondaryInd') || '2', 10);
            const num = (key, fb) => {
                const v = parseInt(localStorage.getItem(key) ?? '', 10);
                return Number.isFinite(v) ? v : fb;
            };
            return {
                main: saved[cls] !== undefined ? parseInt(saved[cls], 10) : -1,
                secondary: saved[sec] !== undefined ? parseInt(saved[sec], 10) : -1,
                knife: num('meleeIndex', -1),
                hat: num('hatIndex', -1),
                body: num('bodyIndex', -1),
                dye: num('dyeIndex', -1),
                waist: num('waistIndex', -1),
                back: num('backIndex', -1),
                playerCard: num('playerCardIndex', -1)
            };
        }

        getEffectiveSkinCache() {
            const equipped = this.getEquippedSkinCache();
            if (!this.skinCache) this.skinCache = {};
            const pick = (key) => (this.skinCache[key] !== undefined && this.skinCache[key] !== -1) ? this.skinCache[key] : equipped[key];
            return {
                main: pick('main'),
                secondary: pick('secondary'),
                knife: pick('knife'),
                hat: pick('hat'),
                body: pick('body'),
                dye: pick('dye'),
                waist: pick('waist'),
                back: pick('back'),
                playerCard: pick('playerCard')
            };
        }

        getSkinForPlayer(player, origSkins) {
            if (!this._isLocalPlayer(player)) return origSkins || [-1, -1];
            const cache = this.getEffectiveSkinCache();
            if (cache && (cache.main !== -1 || cache.secondary !== -1)) {
                return [cache.main !== -1 ? cache.main : (origSkins ? origSkins[0] : -1), cache.secondary !== -1 ? cache.secondary : (origSkins ? origSkins[1] : -1)];
            }
            return origSkins || [-1, -1];
        }

        _isLocalPlayer(player) {
            try {
                if (!player) return false;
                if (player.isYou) return true;
                if (this.me && player === this.me) return true;
                const myName = this.me && this.me.name;
                if (myName && player.name && player.name === myName) return true;
            } catch (e) {}
            return false;
        }

        getMeleeForPlayer(player, origMelee) {
            if (!this._isLocalPlayer(player)) return origMelee;
            const cache = this.getEffectiveSkinCache();
            if (cache && cache.knife !== -1) return cache.knife;
            return origMelee;
        }

        getHatForPlayer(player, orig) {
            if (!this._isLocalPlayer(player)) return orig;
            const cache = this.getEffectiveSkinCache();
            if (cache && cache.hat !== -1) return cache.hat;
            return orig;
        }

        getBodyForPlayer(player, orig) {
            if (!this._isLocalPlayer(player)) return orig;
            const cache = this.getEffectiveSkinCache();
            if (cache && cache.body !== -1) return cache.body;
            return orig;
        }

        getDyeForPlayer(player, orig) {
            if (!this._isLocalPlayer(player)) return orig;
            const cache = this.getEffectiveSkinCache();
            if (cache && cache.dye !== -1) return cache.dye;
            return orig;
        }

        getWaistForPlayer(player, orig) {
            if (!this._isLocalPlayer(player)) return orig;
            const cache = this.getEffectiveSkinCache();
            if (cache && cache.waist !== -1) return cache.waist;
            return orig;
        }

        applyPreset(preset) {
            switch (preset) {
                case 'blatant':
                    this.settings.aimbotEnabled = true;
                    this.settings.autoFireEnabled = true;
                    this.settings.superSilentEnabled = true;
                    this.settings.aimbotWallCheck = true;
                    this.settings.aimbotWallBangs = true;
                    this.settings.aimbotTeamCheck = true;
                    this.settings.aimbotBotCheck = true;
                    this.settings.legitAimbot = false;
                    this.settings.legitAiAim = false;
                    this.settings.flickSpeed = 0;
                    this.settings.adsTremorReduction = 0;
                    this.settings.aimRandomness = 0;
                    this.settings.aimTremor = 0;
                    this.settings.fovSize = 0;
                    this.settings.drawFovCircle = false;
                    break;
                case 'legit':
                    this.settings.aimbotEnabled = true;
                    this.settings.superSilentEnabled = false;
                    this.settings.autoFireEnabled = false;
                    this.settings.aimbotWallCheck = true;
                    this.settings.aimbotWallBangs = true;
                    this.settings.aimbotTeamCheck = true;
                    this.settings.aimbotBotCheck = true;
                    this.settings.legitAimbot = true;
                    this.settings.legitAiAim = false;
                    this.settings.flickSpeed = 5;
                    this.settings.adsTremorReduction = 50;
                    this.settings.aimRandomness = 1.5;
                    this.settings.aimTremor = 0;
                    this.settings.aimTarget = 'head';
                    this.settings.fovSize = 300;
                    this.settings.drawFovCircle = true;
                    break;
                case 'legitai':
                    this.settings.aimbotEnabled = true;
                    this.settings.superSilentEnabled = false;
                    this.settings.autoFireEnabled = false;
                    this.settings.aimbotWallCheck = true;
                    this.settings.aimbotWallBangs = true;
                    this.settings.aimbotTeamCheck = true;
                    this.settings.aimbotBotCheck = true;
                    this.settings.legitAimbot = true;
                    this.settings.legitAiAim = true;
                    this.settings.flickSpeed = 5;
                    this.settings.adsTremorReduction = 50;
                    this.settings.aimRandomness = 1.5;
                    this.settings.aimTremor = 0;
                    this.settings.aimTarget = 'head';
                    this.settings.fovSize = 300;
                    this.settings.drawFovCircle = true;
                    break;
                case 'off':
                    Object.assign(this.settings, this.defaultSettings);
                    break;
                default:
                    return;
            }
            this.saveSettings('hvhm_settings', this.settings);
            const menu = document.querySelector('.hvhm-menu-container');
            if (menu) {
                const toggleUI = (key) => {
                    const item = menu.querySelector(`.hvhm-menu-item[data-setting="${key}"]`);
                    if (item) {
                        item.classList.toggle('active', !!this.settings[key]);
                        const sw = item.querySelector('.hvhm-toggle-switch');
                        if (sw) sw.classList.toggle('active', !!this.settings[key]);
                    }
                };
                const sliderUI = (key) => {
                    const sl = menu.querySelector(`.hvhm-slider[data-setting="${key}"]`);
                    const sv = menu.querySelector(`.hvhm-slider-value[data-setting="${key}"]`);
                    if (sl) sl.value = this.settings[key];
                    if (sv) sv.value = this.settings[key] <= 0 ? 'Off' : this.settings[key];
                };
                ['aimbotEnabled', 'autoFireEnabled', 'superSilentEnabled', 'aimbotWallCheck', 'aimbotWallBangs', 'aimbotTeamCheck', 'aimbotBotCheck', 'legitAimbot', 'legitAiAim', 'drawFovCircle', 'hideMenuButton', 'rainbowEsp', 'showWelcome', 'unlockSkins', 'unlockPremium', 'teamWithCheaters'].forEach(toggleUI);
                ['flickSpeed', 'adsTremorReduction', 'aimRandomness', 'aimTremor', 'fovSize'].forEach(sliderUI);
                const aimSel = menu.querySelector('.hvhm-select[data-setting="aimTarget"]');
                if (aimSel) aimSel.value = this.settings.aimTarget || 'head';
                menu.querySelectorAll('.hvhm-preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === preset));
            }
            this.currentPreset = preset;
            this.applyMenuButtonVisibility();
            this.notify({ title: 'Preset Applied', message: preset.toUpperCase() });
        }

        applyMenuButtonVisibility() {
            const btn = document.getElementById('hvhm-menu-button');
            if (btn) btn.style.display = this.settings.hideMenuButton ? 'none' : 'flex';
        }

        renderESPPreview() {
            const canvas = this.espPreviewCanvas;
            if (!canvas) return;
            const ctx = this.espPreviewCtx;
            if (!ctx) return;
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0d0815';
            ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += 25) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += 25) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }
            const cx = W / 2;
            let top = 55;
            let height = 230;
            let width = 110;
            if (this.espCharLoaded && this.espCharImg) {
                const ratio = this.espCharImg.width / this.espCharImg.height;
                width = height * ratio;
                if (width > W - 16) {
                    width = W - 16;
                    height = width / ratio;
                }
                const dx = cx - width / 2;
                top = (H - height) / 2 - 10;
                if (this.settings.chamsEnabled) {
                    const rgb = this.settings.chamsMode === 'rgb' ? Date.now() / 10 % 360 : null;
                    const tint = rgb !== null ? 'hsl(' + rgb + ', 100%, 55%)' : this.settings.chamsColor;
                    const tmp = document.createElement('canvas');
                    tmp.width = Math.ceil(width);
                    tmp.height = Math.ceil(height);
                    const tctx = tmp.getContext('2d');
                    tctx.drawImage(this.espCharImg, 0, 0, width, height);
                    tctx.globalCompositeOperation = 'source-atop';
                    tctx.fillStyle = tint;
                    tctx.fillRect(0, 0, width, height);
                    ctx.globalAlpha = 0.95;
                    ctx.drawImage(tmp, dx, top, width, height);
                    ctx.globalAlpha = 1;
                } else {
                    ctx.globalAlpha = 0.9;
                    ctx.drawImage(this.espCharImg, dx, top, width, height);
                    ctx.globalAlpha = 1;
                }
            }
            const pad = 10;
            const bx = cx - width / 2 - pad;
            const by = top - pad;
            const bw = width + pad * 2;
            const bh = height + pad * 2;
            const col = (kind, alpha = 1) => {
                if (this.settings.rainbowEsp) {
                    const hue = Date.now() / 15 % 360;
                    return 'hsla(' + hue + ', 100%, 50%, ' + alpha + ')';
                }
                const base = kind === 'box' ? this.settings.boxColor : this.settings.espColor;
                let r = 0, g = 0, b = 0;
                if (base && base.length === 7) {
                    r = parseInt(base.slice(1, 3), 16);
                    g = parseInt(base.slice(3, 5), 16);
                    b = parseInt(base.slice(5, 7), 16);
                }
                return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            };
            if (this.settings.espLines) {
                ctx.beginPath();
                ctx.moveTo(W / 2, H);
                ctx.lineTo(cx, by + bh);
                ctx.strokeStyle = col('esp', 0.9);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            if (this.settings.espSquare) {
                ctx.strokeStyle = col('box', 0.35);
                ctx.lineWidth = 4;
                ctx.strokeRect(bx, by, bw, bh);
                ctx.strokeStyle = col('box', 1);
                ctx.lineWidth = 2;
                ctx.strokeRect(bx, by, bw, bh);
            }
            if (this.settings.espHealth) {
                const frac = 0.72;
                const hx = bx - 9;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(hx, by, 5, bh);
                ctx.fillStyle = '#FDD835';
                ctx.fillRect(hx, by + bh * (1 - frac), 5, bh * frac);
                ctx.font = 'bold 12px Rajdhani,sans-serif';
                ctx.textAlign = 'right';
                ctx.fillStyle = '#fff';
                ctx.fillText('72', hx - 3, by + 14);
            }
            if (this.settings.espNameTags) {
                const label = 'HVHM BOT' + (this.settings.espWeaponIcon ? '  AK-47' : '');
                ctx.font = 'bold 13px Rajdhani,sans-serif';
                ctx.textAlign = 'left';
                const tw = ctx.measureText(label).width;
                let iw = 0;
                const ih = 18;
                if (this.settings.espWeaponIcon && this.espWeaponLoaded && this.espWeaponImg) {
                    iw = this.espWeaponImg.width * (ih / this.espWeaponImg.height);
                }
                const pw = tw + (iw > 0 ? iw + 6 : 0) + 16;
                const ph = 26;
                const px = cx - pw / 2;
                const py = by - ph - 8;
                if (this.settings.espInfoBackground) {
                    ctx.fillStyle = 'rgba(15,15,15,0.7)';
                    ctx.strokeStyle = col('box', 1);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 4);
                    else ctx.rect(px, py, pw, ph);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.fillStyle = '#fff';
                ctx.fillText(label, px + 8, py + 18);
                if (iw > 0) {
                    ctx.drawImage(this.espWeaponImg, px + 8 + tw + 6, py + (ph - ih) / 2, iw, ih);
                }
            }
            ctx.font = 'bold 12px Rajdhani,sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.fillText('[24m]', cx, by + bh + 18);
        }

        drawCheaterTag(player) {
            if (!this.settings.showCheaterRadar || !player || player.isYou || !player.active || player.health <= 0 || !player.name) return;
            if (!this.lobbyCheatUsers.has(player.name)) return;
            const entry = this.lobbyCheatUsers.get(player.name) || {};
            const height = (player.height || this.PLAYER_HEIGHT) - ((player.crouchVal || 0) * this.CROUCH_FACTOR);
            const half = this.PLAYER_WIDTH / 2;
            const points = [
                { x: player.x - half, y: player.y, z: player.z - half },
                { x: player.x + half, y: player.y, z: player.z + half },
                { x: player.x - half, y: player.y + height, z: player.z - half },
                { x: player.x + half, y: player.y + height, z: player.z + half }
            ].map(p => this.world2Screen(p)).filter(Boolean);
            if (points.length < 2) return;
            const xs = points.map(p => p.x), ys = points.map(p => p.y);
            const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys);
            const isOwner = entry.role === 'owner';
            const isMod = entry.role === 'moderator';
            const teaming = this.isTeamingFriendly() && entry.teamMode === true;
            const color = isOwner ? '#d946ef' : isMod ? '#00f0ff' : teaming ? '#00ff88' : entry.teamMode ? '#ffaa00' : (this.settings.cheaterTagColor || '#ff0000');
            const label = isOwner ? 'OWNER' : isMod ? 'MODERATOR' : teaming ? 'Cheater Friend' : 'CHEATER';
            const ctx = this.ctx;
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.font = '700 10px Rajdhani, sans-serif';
            ctx.textAlign = 'center';
            const labelY = Math.max(12, ymin - 5);
            const w = ctx.measureText(label).width + 12;
            const bx = (xmin + xmax - w) / 2, by = labelY - 12;
            ctx.fillStyle = 'rgba(10, 5, 5, 0.85)';
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(bx, by, w, 15, 3);
            else ctx.rect(bx, by, w, 15);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.fillText(label, (xmin + xmax) / 2, labelY);
            ctx.restore();
        }

        featureBadge(setting) {
            if (!this.settings.showFeatureStatus) return '';
            const st = (this.featureStatuses || {})[setting];
            if (!st) return '';
            if (st.force_disabled === 1) {
                this.settings[setting] = false;
                return '<span class="hvhm-feature-badge hvhm-feature-off">OFF</span>';
            }
            return '<span class="hvhm-feature-badge">' + (st.status || 'OK') + '</span>';
        }

        panic() {
            ['aimbotEnabled', 'autoFireEnabled', 'triggerbotEnabled', 'superSilentEnabled', 'legitAimbot', 'chamsEnabled', 'espLines', 'espNameTags', 'espWeapon', 'espWeaponIcon', 'espLevel', 'espDistance', 'skeletonESP', 'selfESP', 'selfSkeletonESP', 'drawFovCircle', 'wireframeEnabled', 'bulletTracers', 'hitmarkers'].forEach(k => { this.settings[k] = false; });
            this.saveSettings('hvhm_settings', this.settings);
            const c = document.querySelector('.hvhm-menu-container');
            if (c) c.style.display = 'none';
            try { this.notify({ title: 'Panic', message: 'Aimbot and visuals disabled' }); } catch (e) {}
        }

        async checkForUpdates() {
            try {
                const last = parseInt(localStorage.getItem('hvhm_update_check') || '0', 10);
                if (Date.now() - last < 86400000) return;
                localStorage.setItem('hvhm_update_check', Date.now().toString());
                const res = await fetch('https://raw.githubusercontent.com/levifrsn63/krunker-loader/main/hvhm.user.js', { cache: 'no-store' });
                if (!res.ok) return;
                const text = await res.text();
                const m = /@version\s+([0-9.]+)/.exec(text);
                if (!m) return;
                const cmp = (a, b) => {
                    const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
                    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
                        if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0) ? 1 : -1;
                    }
                    return 0;
                };
                if (cmp(m[1], this.scriptVersion) > 0) {
                    this.notify({ title: 'Update Available', message: 'hvhm ' + m[1] + ' is out (you have ' + this.scriptVersion + '). Update the userscript to get it.', timeout: 12000 });
                }
            } catch (e) {}
        }

        showGUI() {
            if (this.game && !this.game.gameClosed) { if (document.pointerLockElement || document.mozPointerLockElement) { document.exitPointerLock(); } }
            window.showWindow(this.GUI.windowIndex);
            try { this.fetchFeatureStatuses(); } catch (e) {}
        }

        initGameGUI() {
            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Outfit:wght@300;400;600;700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);

            const menuCSS = `
.hvhm-menu-container{position:fixed!important;top:18px!important;left:50%!important;transform:translateX(-50%)!important;width:1140px!important;max-width:97vw!important;max-height:92vh!important;background:#111111!important;border:1px solid rgba(255,255,255,0.09)!important;border-radius:16px!important;color:#e8eaf2!important;font-family:'Rajdhani','Outfit','Segoe UI',system-ui,sans-serif!important;overflow:visible!important;display:flex!important;flex-direction:column!important;animation:hvhmIn .35s cubic-bezier(0.16,1,0.3,1)!important;}
@keyframes hvhmIn{from{opacity:0;transform:translateX(-50%) translateY(-14px) scale(.985);}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}}
.hvhm-menu{display:flex!important;flex-direction:row!important;width:100%!important;height:100%!important;background:transparent!important;border-radius:16px!important;overflow:hidden!important;}
.hvhm-side{display:flex!important;flex-direction:column!important;width:208px!important;flex-shrink:0!important;background:rgba(0,0,0,0.28)!important;border-right:1px solid rgba(255,255,255,0.08)!important;}
.hvhm-menu-titlebar{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 16px 10px!important;box-sizing:border-box!important;background:transparent!important;color:rgba(255,255,255,0.35)!important;font-size:10px!important;font-weight:600!important;letter-spacing:2px!important;text-transform:uppercase!important;cursor:move!important;user-select:none!important;flex-shrink:0!important;}
.hvhm-menu-titlebar span:last-child{font-size:10px!important;color:rgba(255,255,255,0.25)!important;}
.hvhm-tab-container{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:6px!important;background:transparent!important;border-bottom:none!important;padding:6px 12px!important;flex:1!important;}
.hvhm-tab{flex:none!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;text-align:center!important;padding:14px 8px!important;cursor:pointer!important;color:rgba(255,255,255,0.55)!important;text-transform:uppercase!important;letter-spacing:2px!important;font-weight:700!important;font-size:14px!important;font-family:'Rajdhani',sans-serif!important;border:1px solid transparent!important;border-radius:9px!important;background:transparent!important;user-select:none!important;transition:all .2s!important;}
.hvhm-tab svg{width:16px!important;height:16px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;flex-shrink:0!important;}
.hvhm-tab:hover{color:#fff!important;background:rgba(255,255,255,0.04)!important;}
.hvhm-tab.active{background:#232329!important;color:#fff!important;border-color:rgba(255,255,255,0.45)!important;}
.hvhm-window-controls{display:flex!important;align-items:center!important;justify-content:center!important;margin:auto 0 0!important;flex:none!important;gap:0!important;padding:12px!important;}
.hvhm-window-controls button{width:28px!important;height:28px!important;border:0!important;display:grid!important;place-items:center!important;background:transparent!important;color:rgba(255,255,255,0.35)!important;cursor:pointer!important;transition:color .15s,background .15s!important;padding:0!important;border-radius:6px!important;}
.hvhm-window-controls button:hover{background:rgba(255,255,255,0.07)!important;color:#fff!important;}
.hvhm-window-controls button svg{width:13px!important;height:13px!important;stroke-width:1.7!important;fill:none!important;stroke:currentColor!important;}
.hvhm-window-controls .hvhm-close-btn:hover{background:rgba(120,120,120,0.85)!important;color:#fff!important;}
.hvhm-menu-body{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;background:rgba(0,0,0,0.22)!important;}
.hvhm-tab-pane{display:none!important;flex:1 1 auto!important;min-height:0!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;align-content:start!important;gap:12px!important;padding:22px 24px!important;overflow-y:auto!important;scrollbar-width:thin!important;scrollbar-color:rgba(255,255,255,0.35) rgba(0,0,0,0.25)!important;}
.hvhm-tab-pane::-webkit-scrollbar{width:7px!important;}
.hvhm-tab-pane::-webkit-scrollbar-track{background:rgba(0,0,0,0.2)!important;}
.hvhm-tab-pane::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.14)!important;border-radius:8px!important;}
.hvhm-tab-pane::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.45)!important;}
.hvhm-tab-pane.active{display:grid!important;animation:hvhmFade .3s ease!important;}
@keyframes hvhmFade{from{opacity:0;transform:translateY(7px);}to{opacity:1;transform:translateY(0);}}
.hvhm-section{box-sizing:border-box!important;width:100%!important;font-weight:700!important;color:#ffffff!important;text-transform:uppercase!important;font-size:12px!important;letter-spacing:2.5px!important;padding:20px 4px 4px!important;border-top:none!important;display:flex!important;align-items:center!important;font-family:'Rajdhani',sans-serif!important;}
.hvhm-section::after{content:''!important;flex:1!important;height:1px!important;background:rgba(255,255,255,0.28)!important;margin-left:14px!important;}
.hvhm-section:first-child{padding-top:0!important;}
.hvhm-menu-item{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;padding:15px 18px!important;background:rgba(255,255,255,0.025)!important;border:1px solid rgba(255,255,255,0.05)!important;border-radius:10px!important;cursor:pointer!important;transition:all .15s!important;}
.hvhm-section,.hvhm-menu-item[data-setting-share],.hvhm-menu-item[data-setting="customSoundPack"]{grid-column:1 / -1!important;}
.hvhm-menu-item:hover{background:rgba(255,255,255,0.05)!important;border-color:rgba(255,255,255,0.35)!important;}
.hvhm-menu-item.active{border-color:rgba(255,255,255,0.35)!important;}
.hvhm-menu-item-content{display:flex!important;align-items:center!important;gap:12px!important;color:#e8eaf2!important;min-width:0!important;flex:1!important;}
.hvhm-menu-item-icon{width:19px!important;height:19px!important;fill:none!important;stroke:rgba(255,255,255,0.55)!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important;flex-shrink:0!important;}
.hvhm-menu-item.active .hvhm-menu-item-icon{stroke:#fff!important;}
.hvhm-menu-item-content label{cursor:pointer!important;font-size:15px!important;font-weight:600!important;letter-spacing:.4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-family:'Rajdhani',sans-serif!important;}
.hvhm-menu-item[data-tip]:hover::after{content:attr(data-tip)!important;position:absolute!important;bottom:calc(100% + 8px)!important;left:50%!important;transform:translateX(-50%)!important;background:#1a1a1a!important;color:#c9c9c9!important;padding:8px 12px!important;border-radius:8px!important;font-size:12px!important;max-width:280px!important;z-index:100!important;border:1px solid rgba(255,255,255,0.4)!important;pointer-events:none!important;line-height:1.4!important;font-weight:500!important;white-space:normal!important;}
.hvhm-controls{display:flex!important;align-items:center!important;gap:10px!important;flex-shrink:0!important;}
.hvhm-toggle-switch{width:46px!important;height:24px!important;background:rgba(255,255,255,0.09)!important;border:1px solid rgba(255,255,255,0.06)!important;border-radius:20px!important;position:relative!important;cursor:pointer!important;transition:all .2s!important;flex-shrink:0!important;}
.hvhm-toggle-switch::after{content:''!important;position:absolute!important;top:2px!important;left:2px!important;width:18px!important;height:18px!important;background:#8a8a8a!important;border-radius:50%!important;transition:left .2s,background .2s!important;}
.hvhm-toggle-switch.active{background:#ffffff!important;border-color:#ffffff!important;}
.hvhm-toggle-switch.active::after{left:24px!important;background:#111!important;}
.hvhm-slider-container{display:flex!important;align-items:center!important;gap:8px!important;}
.hvhm-slider{width:130px!important;accent-color:#ffffff!important;}
.hvhm-slider-value{width:46px!important;background:rgba(0,0,0,0.3)!important;color:#ffffff!important;border:1px solid rgba(255,255,255,0.3)!important;border-radius:6px!important;padding:3px 5px!important;font-family:'Rajdhani',sans-serif!important;font-weight:700!important;font-size:12px!important;text-align:center!important;}
.hvhm-select{min-width:118px!important;background:#1a1a1a!important;color:#fff!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:7px!important;padding:6px 9px!important;font:700 12px 'Rajdhani',sans-serif!important;letter-spacing:.5px!important;outline:none!important;cursor:pointer!important;}
.hvhm-select option{background:#1a1a1a!important;}
.hvhm-color-container{display:flex!important;align-items:center!important;gap:6px!important;}
.hvhm-color-picker-input{width:24px!important;height:18px!important;padding:0!important;border:none!important;background:none!important;cursor:pointer!important;border-radius:4px!important;overflow:hidden!important;}
.hvhm-color-preview{width:30px!important;height:22px!important;border:1px solid rgba(255,255,255,0.2)!important;border-radius:6px!important;flex-shrink:0!important;}
.hvhm-inline-color{width:24px!important;height:24px!important;min-width:24px!important;padding:0!important;border:2px solid rgba(255,255,255,0.55)!important;border-radius:50%!important;background:none!important;overflow:hidden!important;cursor:pointer!important;}
.hvhm-inline-color.hvhm-visible-color{border-color:rgba(255,255,255,0.35)!important;}
.hvhm-inline-color::-webkit-color-swatch-wrapper{padding:0!important;}
.hvhm-inline-color::-webkit-color-swatch{border:none!important;border-radius:50%!important;}
.hvhm-hk-btn{background:rgba(255,255,255,0.045)!important;color:#c9c9c9!important;border:1px solid rgba(255,255,255,0.1)!important;border-radius:6px!important;padding:5px 11px!important;cursor:pointer!important;font-family:'Rajdhani',sans-serif!important;font-weight:700!important;font-size:12px!important;min-width:30px!important;text-align:center!important;letter-spacing:.5px!important;}
.hvhm-hk-btn:hover{border-color:#ffffff!important;color:#fff!important;}
.hvhm-hk-btn.bound{background:rgba(255,255,255,0.14)!important;color:#ffffff!important;border-color:rgba(255,255,255,0.6)!important;}
.hvhm-esp-layout-panel{position:absolute!important;right:calc(100% + 12px)!important;top:0!important;width:350px!important;box-sizing:border-box!important;padding:16px!important;background:#111111!important;border:1px solid rgba(255,255,255,0.09)!important;border-radius:14px!important;color:#e8eaf2!important;user-select:none!important;}
.hvhm-layout-title{font-size:14px!important;font-weight:700!important;letter-spacing:2.5px!important;text-transform:uppercase!important;margin-bottom:4px!important;color:#fff!important;font-family:'Rajdhani',sans-serif!important;}
.hvhm-layout-help{font-size:11px!important;color:rgba(255,255,255,.45)!important;margin-bottom:12px!important;line-height:1.35!important;}
.hvhm-esp-preview{position:relative!important;width:320px!important;height:390px!important;background:#0a0a0a!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:10px!important;overflow:hidden!important;}
.hvhm-preview-box{--esp-preview-color:#fff;position:absolute!important;left:120px!important;top:90px!important;width:80px!important;height:205px!important;border:2px solid var(--esp-preview-color)!important;box-sizing:border-box!important;pointer-events:none!important;background:rgba(255,255,255,0.05)!important;}
.hvhm-preview-box-depth{display:none!important;position:absolute!important;left:10px!important;top:-10px!important;width:100%!important;height:100%!important;border:2px solid var(--esp-preview-color)!important;box-sizing:border-box!important;opacity:.58!important;}
.hvhm-preview-box.mode-3d{background:transparent!important;transform:none!important;}
.hvhm-preview-box.mode-3d .hvhm-preview-box-depth{display:block!important;}
.hvhm-preview-box.mode-3d::before,.hvhm-preview-box.mode-3d::after{content:''!important;position:absolute!important;width:14px!important;height:2px!important;background:var(--esp-preview-color)!important;transform:rotate(-45deg)!important;transform-origin:left center!important;opacity:.78!important;}
.hvhm-preview-box.mode-3d::before{left:0!important;top:0!important;}
.hvhm-preview-box.mode-3d::after{left:0!important;bottom:-2px!important;}
.hvhm-preview-health{position:absolute!important;left:114px!important;top:90px!important;width:4px!important;height:205px!important;background:#43a047!important;pointer-events:none!important;}
.hvhm-preview-element{position:absolute!important;transform:translate(-50%,-50%)!important;padding:1px 2px!important;border:1px solid transparent!important;border-radius:3px!important;background:transparent!important;color:#fff!important;font:600 10px/1.1 'IBM Plex Mono',ui-monospace,monospace!important;white-space:nowrap!important;cursor:grab!important;touch-action:none!important;}
.hvhm-preview-element:hover,.hvhm-preview-element:active{cursor:grabbing!important;border-color:rgba(255,255,255,.5)!important;background:rgba(255,255,255,.1)!important;}
.hvhm-preview-weapon-icon{padding:1px 2px!important;}
.hvhm-preview-weapon-icon img{display:block!important;width:42px!important;height:16px!important;object-fit:contain!important;pointer-events:none!important;}
.hvhm-layout-reset{width:100%!important;margin-top:10px!important;padding:9px!important;background:#ffffff!important;color:#111!important;border:0!important;border-radius:7px!important;font:700 12px 'Rajdhani',sans-serif!important;text-transform:uppercase!important;letter-spacing:1px!important;cursor:pointer!important;}
.hvhm-layout-reset:hover{background:#ffffff!important;color:#111!important;}
.hvhm-menu-resize-handle{position:absolute!important;right:3px!important;bottom:3px!important;width:16px!important;height:16px!important;z-index:20!important;cursor:nwse-resize!important;background:rgba(255,255,255,0.12)!important;border-radius:4px 0 12px 0!important;}
@media(max-width:1360px){.hvhm-esp-layout-panel{right:auto!important;left:calc(100% + 8px)!important;}}
@media(max-width:760px){.hvhm-menu{flex-direction:column!important;}.hvhm-side{width:100%!important;border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.08)!important;}.hvhm-tab-container{flex-direction:row!important;}.hvhm-tab{justify-content:center!important;}.hvhm-window-controls{display:none!important;}.hvhm-tab-pane.active{display:flex!important;flex-direction:column!important;}.hvhm-esp-layout-panel{display:none!important;}}
.hvhm-hotkey-modal{position:fixed!important;inset:0!important;background:rgba(0,0,0,0.72)!important;display:none!important;align-items:center!important;justify-content:center!important;z-index:2147483647!important;}
.hvhm-hotkey-modal.active{display:flex!important;}
.hvhm-hotkey-modal-box,.hvhm-hotkey-content{background:#141414!important;border:1px solid rgba(255,255,255,0.4)!important;border-radius:14px!important;padding:28px 36px!important;text-align:center!important;color:#e8eaf2!important;font-family:'Rajdhani',sans-serif!important;animation:hvhmPop .25s cubic-bezier(0.16,1,0.3,1)!important;}
@keyframes hvhmPop{from{opacity:0;transform:scale(.93);}to{opacity:1;transform:scale(1);}}
.hvhm-hotkey-content h2{color:#ffffff!important;font-size:22px!important;font-weight:700!important;letter-spacing:2px!important;margin:0 0 10px!important;}
.hvhm-hotkey-content p{color:#b5b5b5!important;font-size:14px!important;margin:0 0 6px!important;}
.hvhm-hotkey-content p span{color:#fff!important;font-weight:700!important;}
.hvhm-hotkey-modal-box button{margin-top:14px!important;padding:8px 20px!important;background:#ffffff!important;color:#111!important;border:none!important;border-radius:8px!important;cursor:pointer!important;font-family:inherit!important;font-weight:700!important;}
.hvhm-hotkey-modal-box button:hover{background:#ffffff!important;}
#hvhm-notify-wrap{position:fixed!important;top:16px!important;right:16px!important;display:flex!important;flex-direction:column!important;gap:10px!important;z-index:2147483647!important;}
.hvhm-notify-container{position:fixed!important;top:16px!important;right:16px!important;display:flex!important;flex-direction:column!important;gap:10px!important;z-index:2147483647!important;}
.hvhm-notify,.hvhm-notify-card{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;background:#141414!important;border:1px solid rgba(255,255,255,0.4)!important;border-left:3px solid #ffffff!important;border-radius:10px!important;padding:11px 15px!important;min-width:220px!important;max-width:340px!important;font-family:'Rajdhani',sans-serif!important;transform:translateX(calc(100% + 20px))!important;opacity:0!important;transition:transform .35s cubic-bezier(0.16,1,0.3,1),opacity .35s!important;}
.hvhm-notify.visible,.hvhm-notify-card.visible{transform:translateX(0)!important;opacity:1!important;}
.hvhm-notify-content{display:flex!important;align-items:center!important;gap:11px!important;min-width:0!important;}
.hvhm-notify-logo{width:30px!important;height:30px!important;flex:0 0 30px!important;border-radius:50%!important;background:#ffffff!important;}
.hvhm-notify-texts{display:flex!important;flex-direction:column!important;min-width:0!important;}
.hvhm-notify-title{font-weight:700!important;color:#fff!important;font-size:14px!important;letter-spacing:1px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
.hvhm-notify-message{font-size:12px!important;color:#b5b5b5!important;line-height:1.35!important;}
.hvhm-notify-controls{display:flex!important;align-items:center!important;gap:8px!important;}
.hvhm-notify-action-btn{background:rgba(255,255,255,0.12)!important;color:#ffffff!important;padding:6px 13px!important;border-radius:6px!important;font-size:12px!important;font-weight:700!important;border:1px solid rgba(255,255,255,0.5)!important;cursor:pointer!important;white-space:nowrap!important;}
.hvhm-notify-action-btn:hover{background:#ffffff!important;color:#111!important;}
.hvhm-feature-badge{display:inline-block!important;margin-left:8px!important;padding:1px 8px!important;font-size:10px!important;font-weight:700!important;letter-spacing:1px!important;border-radius:10px!important;background:rgba(255,255,255,0.12)!important;color:#ffffff!important;border:1px solid rgba(255,255,255,0.5)!important;vertical-align:middle!important;}
.hvhm-feature-badge.hvhm-feature-off{background:rgba(170,170,180,0.12)!important;color:#9a9aa2!important;border-color:rgba(170,170,180,0.5)!important;}
.hvhm-preset-row{display:flex!important;gap:10px!important;grid-column:1 / -1!important;padding:2px 0 8px!important;}
.hvhm-preset-btn{flex:1!important;padding:11px 0!important;background:rgba(255,255,255,0.03)!important;border:1px solid rgba(255,255,255,0.09)!important;color:#fff!important;padding:9px 0!important;border-radius:8px!important;cursor:pointer!important;font-family:'Rajdhani',sans-serif!important;font-weight:700!important;font-size:13px!important;letter-spacing:1.5px!important;text-transform:uppercase!important;transition:all .15s!important;}
.hvhm-preset-btn:hover{background:rgba(255,255,255,0.12)!important;border-color:rgba(255,255,255,0.5)!important;}
.hvhm-preset-btn.active{background:rgba(255,255,255,0.2)!important;border-color:#ffffff!important;color:#ffffff!important;}
#hvhm-menu-button{display:flex!important;align-items:center!important;padding:0 16px!important;height:44px!important;margin-right:15px!important;background:rgba(17,17,17,0.9)!important;border:1px solid rgba(255,255,255,0.4)!important;border-radius:10px!important;cursor:pointer!important;color:#ffffff!important;font:700 15px 'Rajdhani',sans-serif!important;letter-spacing:1.5px!important;}
#hvhm-menu-button:hover{border-color:#ffffff!important;}
.hvhm-menu-body.searching .hvhm-tab-pane{display:grid!important;}
#hvhm-espPreview{width:100%!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.1)!important;background:#0a0a0a!important;display:block!important;}

`;

        const style = document.createElement('style');
        style.textContent = menuCSS;
        document.head.appendChild(style);

        const hotkeyModalHTML = `
              <div class="hvhm-hotkey-modal" id="hvhm-hotkeyModal">
                  <div class="hvhm-hotkey-content">
                      <h2>Press a Key or Mouse Button</h2>
                      <p>Assign hotkey to <span id="hvhm-hotkeyFeatureName">...</span></p>
                      <p>ESC to cancel · DEL to unbind</p>
                  </div>
              </div>`;
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = hotkeyModalHTML;
        document.body.appendChild(modalContainer);
        this.hotkeyModal = document.getElementById('hvhm-hotkeyModal');
        this.waitFor(() => document.querySelector('.headerBarRight')).then((bar) => {
            if (bar && !document.getElementById('hvhm-menu-button')) {
                const btn = document.createElement('div');
                btn.id = 'hvhm-menu-button';
                btn.innerHTML = '<span>hvhm</span>';
                btn.addEventListener('click', () => this.showGUI());
                bar.prepend(btn);
                this.applyMenuButtonVisibility();
            }
        });

        this.GUI.windowIndex = window.windows.length + 1;
        this.GUI.windowObj = {
            closed: false,
            header: "hvhm",
            html: "",
            extraCls: "hvhm-menu-container",
            gen: () => this.getGuiHtml(),
            hideScroll: true,
            height: 'calc(100% - 120px)',
            width: 850,
        };

        Object.defineProperty(window.windows, window.windows.length, { value: this.GUI.windowObj });

    }

        getGuiHtml() {
            const I = {
                aimbot: '<circle cx="12" cy="12" r="7" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke-width="2"/>',
                rightMouse: '<rect x="7" y="3" width="10" height="18" rx="3" stroke-width="2" fill="none"/><path d="M12 3v6" stroke-width="2"/>',
                wall: '<path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"/><path d="M4 8h16"/><path d="M20 12h-16"/><path d="M4 16h16"/><path d="M9 4v4"/><path d="M14 8v4"/><path d="M8 12v4"/><path d="M16 12v4"/><path d="M11 16v4"/>',
                wallOff: '<path d="M8 4h10a2 2 0 0 1 2 2v10m-.589 3.417c-.361 .36 -.86 .583 -1.411 .583h-12a2 2 0 0 1 -2 -2v-12c0 -.55 .222 -1.047 .58 -1.409"/><path d="M4 8h4m4 0h8"/><path d="M20 12h-4m-4 0h-8"/><path d="M4 16h12"/><path d="M9 4v1"/><path d="M14 8v2"/><path d="M8 12v4"/><path d="M11 16v4"/><path d="M3 3l18 18"/>',
                teamCheck: '<path d="M12 2l8 3.5v7c0 5.5-3.5 9.3-8 10.5-4.5-1.2-8-5-8-10.5v-7z" stroke-width="2" fill="none"/><path d="M8 12l3 3 5-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
                autoFire: '<path d="M13 2l-2 7h4l-3 11 7-11h-4l2-7z" stroke-width="2" fill="none"/>',
                superSilent: '<circle cx="12" cy="12" r="3" stroke-width="2" fill="none"/><path d="M3 12h6M15 12h6" stroke-width="2" stroke-dasharray="3 2"/>',
                line: '<path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M16 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M7.5 16.5l9 -9"/>',
                espSquare: '<path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" stroke-width="2" stroke-linecap="round"/>',
                nameTags: '<rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2" fill="none"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><line x1="11" y1="10" x2="18" y2="10" stroke-width="1.5"/><line x1="11" y1="14" x2="16" y2="14" stroke-width="1.5"/>',
                weaponIcons: '<path d="M7 4l1.5 3v11a1 1 0 001 1h3a1 1 0 001-1V7l1.5-3z" stroke-width="2" fill="none"/><path d="M16 8v8l2 2" stroke-width="2" stroke-linecap="round"/>',
                espInfoBg: '<rect x="3" y="6" width="18" height="12" rx="2" stroke-width="2" fill="none"/><rect x="5" y="8" width="14" height="8" rx="1" opacity=".3" fill="currentColor"/>',
                palette: '<path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"/><path d="M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>',
                wireframe: '<path d="M12 2l9 5v10l-9 5-9-5V7z" stroke-width="2" fill="none"/><path d="M12 2v20M21 7l-18 10M3 7l18 10" stroke-width="1" opacity=".5"/>',
                unlockSkins: '<rect x="5" y="11" width="14" height="10" rx="2" stroke-width="2" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke-width="2" fill="none"/><circle cx="12" cy="16" r="1" fill="currentColor"/>',
                bounce: '<path d="M4 15.5c3 -1 5.5 -.5 8 4.5c.5 -3 1.5 -5.5 3 -8"/><path d="M18 9a2 2 0 1 1 0 -4a2 2 0 0 1 0 4"/>',
                antiAim: '<circle cx="12" cy="12" r="8" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke-width="2" stroke-linecap="round"/>',
                rocket: '<path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3"/><path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3"/><path d="M14 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>',
                antiKick: '<path d="M12 2l8 3.5v7c0 5.5-3.5 9.3-8 10.5-4.5-1.2-8-5-8-10.5v-7z" stroke-width="2" fill="none"/><path d="M8 8l8 8M16 8l-8 8" stroke-width="2" stroke-linecap="round"/>',
                autoReload: '<path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9c2.5 0 4.7 1 6.3 2.7" stroke-width="2" fill="none"/><path d="M21 4v5h-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
                fov: '<circle cx="12" cy="12" r="9" stroke-width="2" fill="none"/><path d="M12 12l6-4M12 12l6 4" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
                robot: '<path d="M6 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -4"/><path d="M12 2v2"/><path d="M9 12v9"/><path d="M15 12v9"/><path d="M5 16l4 -2"/><path d="M15 14l4 2"/><path d="M9 18h6"/><path d="M10 8v.01"/><path d="M14 8v.01"/>',
                sound: '<path d="M11 5L6.5 9H3v6h3.5l4.5 4z" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" stroke-width="2" fill="none" stroke-linecap="round"/>',
                recoil: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
                settings: '<circle cx="12" cy="12" r="3" stroke-width="2" fill="none"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06l-2.14 2.14l-.06-.06a1.8 1.8 0 0 0-1.98-.36a1.8 1.8 0 0 0-1.1 1.64v.1h-3.02v-.1a1.8 1.8 0 0 0-1.1-1.64a1.8 1.8 0 0 0-1.98.36l-.06.06l-2.14-2.14l.06-.06A1.8 1.8 0 0 0 6.6 15a1.8 1.8 0 0 0-1.64-1.1h-.1v-3.02h.1A1.8 1.8 0 0 0 6.6 9.78a1.8 1.8 0 0 0-.36-1.98l-.06-.06l2.14-2.14l.06.06a1.8 1.8 0 0 0 1.98.36a1.8 1.8 0 0 0 1.1-1.64v-.1h3.02v.1a1.8 1.8 0 0 0 1.1 1.64a1.8 1.8 0 0 0 1.98-.36l.06-.06l2.14 2.14l-.06.06a1.8 1.8 0 0 0-.36 1.98a1.8 1.8 0 0 0 1.64 1.1h.1v3.02h-.1A1.8 1.8 0 0 0 19.4 15z" stroke-width="1.5" fill="none" stroke-linejoin="round"/>'
            };

            const tips = {
                aimbotEnabled:'Master aimbot toggle.', aimbotOnAimKey:'Only activate while the assigned aim key is held.', aimKey:'Key held to activate the aimbot when Aimkey Only is enabled.', aimbotFovCheck:'When off, aimbot ignores FOV and targets everyone.',
                aimbotWallCheck:'No target through walls.', aimbotWallBangs:'Shoot through penetrable walls.',
                aimbotTeamCheck:'No target teammates.', aimbotBotCheck:'Target AI/bots.',
                autoFireEnabled:'Auto fires for the aimbot target.', triggerbotEnabled:'Legit triggerbot: fires when an enemy crosses your crosshair, even with aimbot disabled.', superSilentEnabled:'Aims without moving camera.',
                fovSize:'FOV radius. 0 = full screen.', drawFovCircle:'Displays FOV circle.', aimBone:'Selects the model joint the aimbot aims at.',
                espTeamCheck:'No ESP for teammates.', espBotCheck:'ESP for AI/bots.',
                espLines:'Line from bottom to enemies.', espSquare:'Flat screen-space box around enemies.', esp3DBoxes:'3D box around player models.',
                 espNameTags:'Shows player names.', espColor:'ESP line color.',
                 espWeapon:'Shows the equipped weapon name below players.', espWeaponIcon:'Shows the equipped weapon icon.', espLevel:'Shows player level independently above the box.', espDistance:'Shows distance below players.', espScale:'Scales ESP text, lines and bars.', skeletonESP:'Draws player joints using live model bones when available.', selfESP:'Shows the normal overlay on your own player.', selfSkeletonESP:'Shows the animated skeleton on your own player independently.', selfESPView:'Choose which camera view displays self ESP.',
noRecoil:'Removes weapon recoil.', noSpread:'Removes weapon spread.', rapidFire:'Massively increases fire rate.', infiniteAmmo:'Keeps your ammo at 9999.', instantReload:'Skips the reload timer.', godMode:'Prevents all incoming damage.', fly:'Lets you fly by looking and moving (noclip).', speedHack:'Multiplies your movement speed.', speedHackValue:'Movement speed multiplier.', recon:'Grants the recon/ghost vision perk.', bulletTracers:'Draws tracers when you shoot.', hitmarkers:'Shows a hitmarker when you damage a player.',
                boxColor:'Box & info color.', botColor:'Bot ESP color.',
                wireframeEnabled:'Wireframe rendering.', unlockSkins:'Client-side skin unlocker.',
                bhopEnabled:'Hold space auto-jump.', antiAimEnabled:'Anti-aim pose: makes your character look down while preserving camera yaw.',
                spectatorAlertEnabled:'Shows an alert when another player is spectating you.',
                captureSafeOverlay:'Hides custom ESP/overlay drawing for screen sharing or recording. Toggle manually before capture.',
                customSoundPack:'Plays a local replacement sound when your kill count increases. Built-in packs use Web Audio; custom sounds stay in local browser storage.',
                autoNuke:'Auto nuke when available.', antikick:'Prevents inactivity kick.',
                autoReload:'Auto reload when empty.',
                thirdPersonEnabled: 'Play in 3rd person view.',
                alwaysTrail: 'Always show bullet trails.',
                weaponZoom: 'Adjust ADS zoom level (1 = default).',
                fovChanger: 'Locks the same camera FOV across hip-fire, ADS, and every weapon. 0 = off.',
                chamsEnabled: 'Highlights player models with separate normal and visible colors.',
                chamsThroughWalls: 'Chams render through walls (no depth).',
                chamsEnemyColor: 'Color for enemy player models.',
                chamsTeamColor: 'Color for teammate player models.',
                chamsSelf: 'Also apply chams to your own player model.',
                chamsTeammates: 'Include teammates in the chams pass. Disabled by default.',
                chamsOpacity: 'Chams material opacity (1 = fully solid).',
                rgbChams: 'Animated rainbow chams.',
                weaponChamsEnabled: 'Highlights your gun / viewmodel.',
                weaponChamsColor: 'Weapon chams color.',
                weaponChamsOpacity: 'Weapon chams opacity.',
                antiAimSpinSpeed: 'Anti-aim spin speed (desync rotation).',
                aeroSpinOverride: 'Hold to invert Aero Spin: spin on the ground and stop spinning in the air.',
                antiAimJitter: 'Adds subtle random wobble to anti-aim.',
                antiAimSpinEnabled: 'Spinbot: continuously spins your yaw independently of the look-down anti-aim.',
                airAntiAimEnabled: 'Aero anti-aim: spins in the air, applies look-down anti-aim on the ground.',
                antiAimLookDownPitch: 'Pitch angle (radians) used by the look-down anti-aim.',
            };

            setTimeout(() => {
                this.bindMenuEvents();
            }, 100);

            return `
<div class="hvhm-menu">
    <div class="hvhm-side">
        <div class="hvhm-menu-titlebar"><span>hvhm</span><span></span></div>
        <div class="hvhm-tab-container">
            <div class="hvhm-tab active" data-tab="aimbot"><svg viewBox="0 0 24 24">${I.aimbot}</svg>Aimbot</div>
            <div class="hvhm-tab" data-tab="esp"><svg viewBox="0 0 24 24">${I.espSquare}</svg>Visuals</div>
            <div class="hvhm-tab" data-tab="misc"><svg viewBox="0 0 24 24">${I.settings}</svg>Misc</div>
            <div class="hvhm-tab" data-tab="beta"><svg viewBox="0 0 24 24">${I.robot}</svg>Beta</div>
        </div>
        <div class="hvhm-window-controls">
            <button type="button" title="Close" class="hvhm-close-btn" onclick="document.querySelector('.hvhm-menu-container').style.display='none'"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
    </div>
    <div class="hvhm-menu-body">
        <div class="hvhm-tab-pane active" id="hvhm-tab-aimbot">
            <div class="hvhm-section">Presets</div>
            <div class="hvhm-preset-row">
                <button type="button" class="hvhm-preset-btn" data-preset="blatant">Blatant</button>
                <button type="button" class="hvhm-preset-btn" data-preset="legit">Legit</button>
                <button type="button" class="hvhm-preset-btn" data-preset="legitai">Legit+AI</button>
                <button type="button" class="hvhm-preset-btn" data-preset="off">Off</button>
            </div>
            <div class="hvhm-section">Activation</div>
            ${this.createMenuItemHTML('toggle','aimbotEnabled','Aimbot', I.aimbot, tips.aimbotEnabled)}
            ${this.createMenuItemHTML('toggle','aimbotOnAimKey','Aimkey Only', I.rightMouse, tips.aimbotOnAimKey)}
            ${this.createHotkeyMenuItemHTML('aimKey','Aim Key', I.rightMouse, tips.aimKey)}
            <div class="hvhm-section">Target Selection</div>
            ${this.createMenuItemHTML('toggle','aimbotFovCheck','FOV Check (off = all)', I.fov, tips.aimbotFovCheck)}
            ${this.createSelectMenuItemHTML('aimTarget','Aim Spot', I.aimbot, 'Choose where the aimbot targets on the enemy.', [['head','Head'],['torso','Torso'],['legs','Legs'],['random','Random']])}
            ${this.createMenuItemHTML('slider','fovSize','FOV Size', I.fov, tips.fovSize, 0, 1000, 1)}
            ${this.createMenuItemHTML('toggle','drawFovCircle','FOV Circle', I.fov, tips.drawFovCircle)}
            ${this.createMenuItemHTML('toggle','aimbotTeamCheck','Team Check', I.teamCheck, tips.aimbotTeamCheck)}
            ${this.createMenuItemHTML('toggle','aimbotBotCheck','Bot Check', I.robot, tips.aimbotBotCheck)}
            ${this.createMenuItemHTML('toggle','aimbotWallCheck','Wall Check', I.wall, tips.aimbotWallCheck)}
            ${this.createMenuItemHTML('toggle','aimbotWallBangs','Wall Bangs', I.wallOff, tips.aimbotWallBangs)}
            <div class="hvhm-section">Fire Control</div>
            ${this.createMenuItemHTML('toggle','autoFireEnabled','Auto Fire', I.autoFire, tips.autoFireEnabled)}
            ${this.createMenuItemHTML('toggle','triggerbotEnabled','Triggerbot', I.autoFire, tips.triggerbotEnabled)}
            <div class="hvhm-section">Aim Behavior</div>
            ${this.createMenuItemHTML('toggle','legitAimbot','Legit Smoothing', I.aimbot, tips.legitAimbot)}
            ${this.createMenuItemHTML('toggle','legitAiAim','Legit AI Aim', I.robot, 'Apply legit smoothing to bots.')}
            ${this.createMenuItemHTML('toggle','superSilentEnabled','Silent Aim', I.superSilent, tips.superSilentEnabled)}
            ${this.createMenuItemHTML('slider','flickSpeed','Flick Speed', I.aimbot, tips.flickSpeed, 0, 100, 1)}
            ${this.createMenuItemHTML('slider','aimRandomness','Aim Randomness', I.aimbot, tips.aimRandomness, 0, 100, 1)}
            ${this.createMenuItemHTML('slider','aimTremor','Aim Tremor', I.aimbot, tips.aimTremor, 0, 100, 1)}
            ${this.createMenuItemHTML('slider','adsTremorReduction','ADS Reduction', I.aimbot, tips.adsTremorReduction, 0, 100, 1)}
            ${this.createMenuItemHTML('slider','aimOffset','Aim Offset', I.aimbot, tips.aimOffset, -100, 100, 1)}
        </div>
        <div class="hvhm-tab-pane" id="hvhm-tab-esp">
            <div class="hvhm-section">Camera</div>
            ${this.createMenuItemHTML('toggle','thirdPersonEnabled','Third Person', I.robot, tips.thirdPersonEnabled)}
            ${this.createMenuItemHTML('toggle','alwaysTrail','Weapon Trails', I.line, tips.alwaysTrail)}
            ${this.createMenuItemHTML('toggle','captureSafeOverlay','Capture-Safe Overlay', I.settings, tips.captureSafeOverlay)}
            ${this.createMenuItemHTML('slider','fovChanger','FOV Changer (0=off)', I.fov, tips.fovChanger, 0, 160, 1)}
            ${this.createMenuItemHTML('slider','weaponZoom','Weapon Zoom', I.fov, 'Adjust ADS zoom level (1 = default).', 0.1, 5, 0.1)}
            <div class="hvhm-section">Overlay</div>
            ${this.createMenuItemHTML('slider','espScale','ESP Scale', I.espSquare, tips.espScale, 0.5, 2.5, 0.05)}
            ${this.createSelectMenuItemHTML('espBoxMode','ESP Box Style', I.espSquare, tips.espSquare, [['off','Off'],['2d','2D'],['3d','3D']], 'espBoxColor', 'espBoxVisibleColor')}
            ${this.createMenuItemHTML('toggle','espSquare','ESP Box', I.espSquare, 'Simple 2D box around enemies.')}
            ${this.createMenuItemHTML('toggle','espHealth','Health Stats', I.nameTags, 'Health bar and health text.')}
            ${this.createMenuItemHTML('toggle','espInfoBackground','Info Background', I.espSquare, 'Background panel behind ESP info.')}
            ${this.createOverlayToggleHTML('espLines','ESP Lines', I.line, tips.espLines, 'espLineColor', 'espLineVisibleColor')}
            ${this.createSelectMenuItemHTML('espLineOrigin','Line Origin', I.line, tips.espLines, [['top','Top'],['center','Center'],['bottom','Bottom']])}
            ${this.createOverlayToggleHTML('espNameTags','Names', I.nameTags, tips.espNameTags, 'espNameColor', 'espNameVisibleColor')}
            ${this.createOverlayToggleHTML('espWeapon','Weapon', I.weaponIcons, tips.espWeapon, 'espWeaponColor', 'espWeaponVisibleColor')}
            ${this.createOverlayToggleHTML('espWeaponIcon','Weapon Icon', I.weaponIcons, tips.espWeaponIcon, 'espWeaponColor', 'espWeaponVisibleColor')}
            ${this.createOverlayToggleHTML('espLevel','Level', I.nameTags, tips.espLevel, 'espLevelColor', 'espLevelVisibleColor')}
            ${this.createOverlayToggleHTML('espDistance','Distance', I.espInfoBg, tips.espDistance, 'espDistanceColor', 'espDistanceVisibleColor')}
            ${this.createOverlayToggleHTML('skeletonESP','Skeleton', I.robot, tips.skeletonESP, 'skeletonColor', 'skeletonVisibleColor')}
            ${this.createMenuItemHTML('toggle','wireframeEnabled','Wireframe', I.wireframe, tips.wireframeEnabled)}
            ${this.createMenuItemHTML('toggle','rainbowEsp','Rainbow ESP', I.palette, 'Cycling rainbow colors on ESP.')}
            <div class="hvhm-section">Self Overlay</div>
            ${this.createMenuItemHTML('toggle','selfESP','Self ESP', I.espSquare, tips.selfESP)}
            ${this.createMenuItemHTML('toggle','selfSkeletonESP','Self Skeleton', I.robot, tips.selfSkeletonESP)}
            ${this.createSelectMenuItemHTML('selfESPView','Self ESP View', I.robot, tips.selfESPView, [['first','First Person'],['third','Third Person'],['both','Both']])}
            <div class="hvhm-section">Chams</div>
            ${this.createMenuItemHTML('toggle','chamsEnabled','Chams', I.palette, tips.chamsEnabled)}
            ${this.createMenuItemHTML('toggle','chamsSelf','Self Chams', I.robot, tips.chamsSelf)}
            ${this.createMenuItemHTML('toggle','chamsTeammates','Teammate Chams', I.teamCheck, tips.chamsTeammates)}
            ${this.createSelectMenuItemHTML('chamsMode','Chams Color Mode', I.palette, tips.chamsEnabled, [['static','Static'],['rgb','RGB']], 'chamsColor', 'chamsVisibleColor')}
            ${this.createMenuItemHTML('slider','chamsOpacity','Chams Opacity', I.palette, tips.chamsOpacity, 0.1, 1, 0.05)}
            <div class="hvhm-section">Filters</div>
            ${this.createMenuItemHTML('toggle','espTeamCheck','Team Check', I.teamCheck, tips.espTeamCheck)}
            ${this.createMenuItemHTML('toggle','espBotCheck','Bot ESP', I.robot, tips.espBotCheck)}
        </div>
        <div class="hvhm-tab-pane" id="hvhm-tab-misc">
            <div class="hvhm-section">Movement</div>
            ${this.createMenuItemHTML('toggle','bhopEnabled','Bunny Hop', I.bounce, tips.bhopEnabled)}
            <div class="hvhm-section">Anti-Aim</div>
            ${this.createMenuItemHTML('toggle','antiAimEnabled','Anti-Aim (Look Down)', I.antiAim, tips.antiAimEnabled)}
            ${this.createMenuItemHTML('toggle','antiAimSpinEnabled','Spinbot', I.antiAim, tips.antiAimSpinEnabled)}
            ${this.createMenuItemHTML('slider','antiAimSpinSpeed','Spinbot Speed', I.antiAim, tips.antiAimSpinSpeed, 50, 500, 5)}
            ${this.createHotkeyMenuItemHTML('aeroSpinOverride','Aero Spin Override', I.antiAim, tips.aeroSpinOverride)}
            <div class="hvhm-section">Automation</div>
            ${this.createMenuItemHTML('toggle','autoNuke','Auto Nuke', I.rocket, tips.autoNuke)}
            ${this.createMenuItemHTML('toggle','antikick','Anti Kick', I.antiKick, tips.antikick)}
            ${this.createMenuItemHTML('toggle','autoReload','Auto Reload', I.autoReload, tips.autoReload)}
            <div class="hvhm-section">Other</div>
            ${this.createMenuItemHTML('toggle','unlockSkins','Unlock All Skins', I.unlockSkins, tips.unlockSkins)}
            ${this.createMenuItemHTML('toggle','unlockPremium','Unlock Premium', I.unlockSkins, 'Client-side Krunker Premium unlocker.')}
            ${this.createMenuItemHTML('toggle','spectatorAlertEnabled','Spectator Alert', I.nameTags, tips.spectatorAlertEnabled)}
            ${this.createHotkeyMenuItemHTML('panicKey','Panic Key', I.wallOff, 'Instantly disable aimbot and all visuals.')}
            ${this.createMenuItemHTML('toggle','middleMouseMenu','Middle Mouse Menu', I.rightMouse, 'Toggle menu with middle mouse button.')}
            ${this.createMenuItemHTML('toggle','hideMenuButton','Hide Menu Button', I.wallOff, 'Hides the top bar menu trigger. Use Insert to open.')}
            ${this.createMenuItemHTML('toggle','showWelcome','Welcome Message', I.nameTags, 'Show welcome notification on start.')}
            <div class="hvhm-section">Cheater Radar</div>
            ${this.createMenuItemHTML('toggle','showCheaterRadar','Show Cheaters', I.nameTags, 'Show detected script users in the lobby.')}
            ${this.createMenuItemHTML('toggle','teamWithCheaters','Team With Cheaters', I.teamCheck, 'Treat lobby cheaters with team mode as teammates.')}
            ${this.createMenuItemHTML('toggle','hideFromRadar','Hide From Radar', I.antiKick, 'Stop reporting yourself to the lobby server.')}
            ${this.createMenuItemHTML('color','cheaterTagColor','Cheater Tag Color', I.palette, 'Customize the cheater tag color.')}
            ${this.createMenuItemHTML('toggle','showFeatureStatus','Feature Status', I.unlockSkins, 'Show Working/Maintenance/Broken badges.')}
            <div class="hvhm-section">Settings Share</div>
            <div class="hvhm-menu-item" data-setting-share>
                <div class="hvhm-menu-item-content"><svg class="hvhm-menu-item-icon" viewBox="0 0 24 24">${I.settings}</svg><label>Export / Import Code</label></div>
                <div class="hvhm-controls" style="flex-wrap:wrap;justify-content:flex-end;max-width:72%">
                    <textarea data-hvhm-settings-code placeholder="Paste a settings code here" rows="2" style="width:260px;resize:vertical;background:#111;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:5px;font:10px ui-monospace,monospace"></textarea>
                    <button type="button" data-hvhm-export-settings class="hvhm-hk-btn">Export</button>
                    <button type="button" data-hvhm-import-settings class="hvhm-hk-btn">Import</button>
                    <input data-hvhm-config-name placeholder="Config name" maxlength="32" style="width:120px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:5px;font:11px ui-monospace,monospace">
                    <select data-hvhm-config-list style="width:120px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:5px;font:11px ui-monospace,monospace"><option value="">Saved configs</option></select>
                    <button type="button" data-hvhm-save-config class="hvhm-hk-btn">Save</button>
                    <button type="button" data-hvhm-load-config class="hvhm-hk-btn">Load</button>
                    <button type="button" data-hvhm-delete-config class="hvhm-hk-btn">Delete</button>
                </div>
            </div>
        </div>
        <div class="hvhm-tab-pane" id="hvhm-tab-beta">
            <div class="hvhm-section">Weapon</div>
            ${this.createMenuItemHTML('toggle','noRecoil','No Recoil', I.recoil, tips.noRecoil)}
            <div class="hvhm-section">Visual</div>
            ${this.createMenuItemHTML('toggle','bulletTracers','Bullet Tracers', I.line, tips.bulletTracers)}
            ${this.createMenuItemHTML('toggle','hitmarkers','Hitmarkers', I.aimbot, tips.hitmarkers)}
            <div class="hvhm-section">Audio</div>
            ${this.createSoundPackMenuHTML(I.sound, tips.customSoundPack)}
        </div>
    </div>
</div>
<div class="hvhm-esp-layout-panel">
    <div class="hvhm-layout-title">ESP Layout</div>
    <div class="hvhm-layout-help">Drag each label to choose where it appears around the player.</div>
    <div class="hvhm-esp-preview">
        <div class="hvhm-preview-health"></div>
        <div class="hvhm-preview-box"><div class="hvhm-preview-box-depth"></div></div>
        <div class="hvhm-preview-element" data-layout-element="name" style="color:${this.settings.espNameColor || '#ffffff'}">PLAYER</div>
        <div class="hvhm-preview-element" data-layout-element="level" style="color:${this.settings.espLevelColor || '#ffffff'}">LV 42</div>
        <div class="hvhm-preview-element hvhm-preview-weapon-icon" data-layout-element="weaponIcon"><img src="https://assets.krunker.io/textures/weapons/icon_1.png" alt="Weapon icon"></div>
        <div class="hvhm-preview-element" data-layout-element="weapon" style="color:${this.settings.espWeaponColor || '#ffffff'}">ASSAULT RIFLE</div>
        <div class="hvhm-preview-element" data-layout-element="distance" style="color:${this.settings.espDistanceColor || '#ffffff'}">25m</div>
    </div>
        <button class="hvhm-layout-reset" type="button">Reset positions</button>
</div>
<div class="hvhm-menu-resize-handle" title="Resize menu"></div>
`;
        }

        createMenuItemHTML(type, setting, label, iconPath, tooltip = '', min, max, step) {
            let controlHTML = '';
            const iconSVG = `<svg class="hvhm-menu-item-icon" viewBox="0 0 24 24">${iconPath}</svg>`;
            const tipAttr = tooltip ? ` data-tip="${tooltip}"` : '';
            const hasHK = this.defaultHotkeys.hasOwnProperty(setting);

            switch (type) {
                case 'toggle':
                    if (hasHK) {
                        const kd = this.hotkeys[setting] ? this.hotkeys[setting].replace('Key','').replace('Digit','').replace('Numpad','Num') : '-';
                        const bc = this.hotkeys[setting] ? ' bound' : '';
                        controlHTML = `<button class="hvhm-hk-btn${bc}" data-hk="${setting}">${kd}</button>`;
                    }
                    controlHTML += `<div class="hvhm-toggle-switch ${this.settings[setting] ? 'active' : ''}"></div>`;
                    break;
                case 'color':
                    controlHTML = `<div class="hvhm-color-container">
                        <input type="color" class="hvhm-color-picker-input" data-setting="${setting}" value="${this.settings[setting]}">
                        <div class="hvhm-color-preview" data-setting="${setting}" style="background-color: ${this.settings[setting]}"></div>
                    </div>`;
                    break;
                case 'slider':
                    const val = (this.settings && typeof this.settings[setting] !== 'undefined') ? this.settings[setting] : 0;
                    const displayVal = val <= 0 ? 'Off' : val;
                    controlHTML = `<div class="hvhm-slider-container" data-setting="${setting}">
                        <input type="range" class="hvhm-slider" data-setting="${setting}" min="${min}" max="${max}" step="${step}" value="${val}">
                        <input type="text" class="hvhm-slider-value" data-setting="${setting}" value="${displayVal}" onfocus="this.type='number'" onblur="this.type='text'; this.value = this.value <= 0 ? 'Off' : this.value">
                    </div>`;
                    break;
            }
            return `<div class="hvhm-menu-item ${this.settings[setting] ? 'active' : ''}" data-setting="${setting}"${tipAttr}>
                <div class="hvhm-menu-item-content">${iconSVG}<label>${label}</label>${this.featureBadge(setting)}</div>
                <div class="hvhm-controls">${controlHTML}</div>
            </div>`;
        }

        createHotkeyMenuItemHTML(setting, label, iconPath, tooltip = '') {
            const iconSVG = `<svg class="hvhm-menu-item-icon" viewBox="0 0 24 24">${iconPath}</svg>`;
            const tipAttr = tooltip ? ` data-tip="${tooltip}"` : '';
            const key = this.hotkeys[setting] ? this.hotkeys[setting].replace('Key','').replace('Digit','').replace('Numpad','Num') : '-';
            const boundClass = this.hotkeys[setting] ? ' bound' : '';
            return `<div class="hvhm-menu-item" data-setting="${setting}"${tipAttr}>
                <div class="hvhm-menu-item-content">${iconSVG}<label>${label}</label>${this.featureBadge(setting)}</div>
                <div class="hvhm-controls"><button class="hvhm-hk-btn${boundClass}" data-hk="${setting}">${key}</button></div>
            </div>`;
        }

        createOverlayToggleHTML(setting, label, iconPath, tooltip, colorSetting, visibleColorSetting = null) {
            const iconSVG = `<svg class="hvhm-menu-item-icon" viewBox="0 0 24 24">${iconPath}</svg>`;
            const tipAttr = tooltip ? ` data-tip="${tooltip}"` : '';
            let hotkeyHTML = '';
            if (this.defaultHotkeys.hasOwnProperty(setting)) {
                const key = this.hotkeys[setting] ? this.hotkeys[setting].replace('Key','').replace('Digit','').replace('Numpad','Num') : '-';
                const boundClass = this.hotkeys[setting] ? ' bound' : '';
                hotkeyHTML = `<button class="hvhm-hk-btn${boundClass}" data-hk="${setting}">${key}</button>`;
            }
            const color = this.settings[colorSetting] || '#ffffff';
            const visibleColor = visibleColorSetting ? (this.settings[visibleColorSetting] || '#ffffff') : null;
            const colorHTML = `<input type="color" class="hvhm-color-picker-input hvhm-inline-color" data-setting="${colorSetting}" value="${color}" title="${label}: normal / not visible">${visibleColorSetting ? `<input type="color" class="hvhm-color-picker-input hvhm-inline-color hvhm-visible-color" data-setting="${visibleColorSetting}" value="${visibleColor}" title="${label}: player visible">` : ''}`;
            return `<div class="hvhm-menu-item ${this.settings[setting] ? 'active' : ''}" data-setting="${setting}"${tipAttr}>
                <div class="hvhm-menu-item-content">${iconSVG}<label>${label}</label>${this.featureBadge(setting)}</div>
                <div class="hvhm-controls">
                    ${hotkeyHTML}
                    ${colorHTML}
                    <div class="hvhm-toggle-switch ${this.settings[setting] ? 'active' : ''}"></div>
                </div>
            </div>`;
        }

        createSelectMenuItemHTML(setting, label, iconPath, tooltip, options, colorSetting = null, visibleColorSetting = null) {
            const iconSVG = `<svg class="hvhm-menu-item-icon" viewBox="0 0 24 24">${iconPath}</svg>`;
            const tipAttr = tooltip ? ` data-tip="${tooltip}"` : '';
            const optionHTML = options.map(([value, text]) => `<option value="${value}" ${this.settings[setting] === value ? 'selected' : ''}>${text}</option>`).join('');
            const colorHTML = colorSetting ? `<input type="color" class="hvhm-color-picker-input hvhm-inline-color" data-setting="${colorSetting}" value="${this.settings[colorSetting] || '#ffffff'}" title="${label}: normal / not visible">${visibleColorSetting ? `<input type="color" class="hvhm-color-picker-input hvhm-inline-color hvhm-visible-color" data-setting="${visibleColorSetting}" value="${this.settings[visibleColorSetting] || '#ffffff'}" title="${label}: player visible">` : ''}` : '';
            return `<div class="hvhm-menu-item" data-setting="${setting}"${tipAttr}>
                <div class="hvhm-menu-item-content">${iconSVG}<label>${label}</label>${this.featureBadge(setting)}</div>
                <div class="hvhm-controls">${colorHTML}<select class="hvhm-select" data-setting="${setting}">${optionHTML}</select></div>
            </div>`;
        }

        createSoundPackMenuHTML(iconPath, tooltip) {
            const iconSVG = `<svg class="hvhm-menu-item-icon" viewBox="0 0 24 24">${iconPath}</svg>`;
            const tipAttr = tooltip ? ` data-tip="${tooltip}"` : '';
            const selected = this.settings.customSoundPack || 'off';
            return `<div class="hvhm-menu-item" data-setting="customSoundPack"${tipAttr}>
                <div class="hvhm-menu-item-content">${iconSVG}<label>Kill Sound Pack</label></div>
                <div class="hvhm-controls" style="gap:5px;flex-wrap:wrap;justify-content:flex-end">
                    <select class="hvhm-select" data-setting="customSoundPack">
                        <option value="off" ${selected === 'off' ? 'selected' : ''}>Off</option>
                        <option value="satisfying" ${selected === 'satisfying' ? 'selected' : ''}>Satisfying</option>
                        <option value="arcade" ${selected === 'arcade' ? 'selected' : ''}>Arcade</option>
                        <option value="custom" ${selected === 'custom' ? 'selected' : ''}>Custom File</option>
                        <option value="online" ${selected === 'online' ? 'selected' : ''}>Online JSON</option>
                    </select>
                    <input type="file" accept="audio/*" data-hvhm-kill-sound-file style="max-width:145px;font-size:10px">
                    <input type="url" data-hvhm-sound-pack-url placeholder="HTTPS pack JSON URL" value="${String(this.settings.onlineSoundPackUrl || '').replace(/"/g, '&quot;')}" style="max-width:165px;font-size:10px">
                    <button type="button" data-hvhm-load-sound-pack class="hvhm-hk-btn">Load Online</button>
                    <button type="button" data-hvhm-test-sound class="hvhm-hk-btn">Test Kill</button>
                    <button type="button" data-hvhm-clear-sound class="hvhm-hk-btn">Clear</button>
                </div>
            </div>`;
        }

        bindMenuEvents() {
            const menu = document.querySelector('.hvhm-menu-container');
            if (!menu) return;

            const configName = menu.querySelector('[data-hvhm-config-name]');
            const configList = menu.querySelector('[data-hvhm-config-list]');
            const refreshConfigs = () => {
                if (!configList) return;
                const selected = configList.value;
                configList.innerHTML = '<option value="">Saved configs</option>';
                for (const name of Object.keys(this.getNamedConfigs()).sort()) {
                    const option = document.createElement('option'); option.value = name; option.textContent = name;
                    configList.appendChild(option);
                }
                if (selected && this.getNamedConfigs()[selected]) configList.value = selected;
            };
            refreshConfigs();
            menu.querySelector('[data-hvhm-save-config]')?.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (this.saveNamedConfig(configName?.value)) { refreshConfigs(); this.notify({ title: 'Config', message: 'Configuration saved.' }); }
            });
            menu.querySelector('[data-hvhm-load-config]')?.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (configList?.value) this.loadNamedConfig(configList.value);
            });
            menu.querySelector('[data-hvhm-delete-config]')?.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (configList?.value && this.deleteNamedConfig(configList.value)) { refreshConfigs(); this.notify({ title: 'Config', message: 'Configuration deleted.' }); }
            });

            menu.querySelector('.hvhm-tab-container').addEventListener('click', (e) => {
                if (e.target.classList.contains('hvhm-tab')) {
                    if (window.SOUND) window.SOUND.play('select_0', 0.1);
                    const tabName = e.target.dataset.tab;
                    menu.querySelectorAll('.hvhm-tab').forEach(t => t.classList.remove('active'));
                    menu.querySelectorAll('.hvhm-tab-pane').forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    menu.querySelector(`#hvhm-tab-${tabName}`).classList.add('active');
                    try { localStorage.setItem('hvhm_last_tab', tabName); } catch (e) {}
                }
            });

            menu.querySelectorAll('.hvhm-preset-btn').forEach(btn => btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                if (window.SOUND) window.SOUND.play('select_0', 0.1);
                this.applyPreset(btn.dataset.preset);
            }));

            const searchInput = menu.querySelector('#hvhm-menu-search');
            if (searchInput) {
                searchInput.addEventListener('click', (e) => e.stopPropagation());
                searchInput.addEventListener('input', () => {
                    const q = searchInput.value.trim().toLowerCase();
                    const body = menu.querySelector('.hvhm-menu-body');
                    const panes = menu.querySelectorAll('.hvhm-tab-pane');
                    menu.querySelectorAll('.hvhm-preset-row').forEach(r => { r.style.display = q ? 'none' : ''; });
                    if (!q) {
                        body.classList.remove('searching');
                        const activeTab = menu.querySelector('.hvhm-tab.active');
                        panes.forEach(p => p.classList.remove('active'));
                        if (activeTab) {
                            const tp = menu.querySelector(`#hvhm-tab-${activeTab.dataset.tab}`);
                            if (tp) tp.classList.add('active');
                        }
                        return;
                    }
                    body.classList.add('searching');
                    panes.forEach(pane => {
                        pane.classList.add('active');
                        pane.querySelectorAll('.hvhm-menu-item').forEach(item => {
                            const label = (item.querySelector('label')?.textContent || '').toLowerCase();
                            item.style.display = label.includes(q) ? '' : 'none';
                        });
                        pane.querySelectorAll('.hvhm-section').forEach(sec => {
                            let next = sec.nextElementSibling;
                            let show = false;
                            while (next && !next.classList.contains('hvhm-section')) {
                                if (next.classList.contains('hvhm-menu-item') && next.style.display !== 'none') { show = true; break; }
                                next = next.nextElementSibling;
                            }
                            sec.style.display = show ? '' : 'none';
                        });
                    });
                });
            }

            menu.querySelector('.hvhm-menu-body').addEventListener('click', (e) => {
                if (e.target.closest('.hvhm-inline-color') || e.target.closest('.hvhm-select')) return;
                const hkBtn = e.target.closest('.hvhm-hk-btn');
                if (hkBtn) { e.stopPropagation(); if (hkBtn.dataset.hk) this.showHotkeyModal(hkBtn.dataset.hk); return; }

                const menuItem = e.target.closest('.hvhm-menu-item');
                if (!menuItem) return;
                const setting = menuItem.dataset.setting;
                if (!setting || menuItem.querySelector('.hvhm-slider-container')) return;

                if (window.SOUND) window.SOUND.play('select_0', 0.1);

                if (menuItem.querySelector('.hvhm-toggle-switch')) {
                    this.settings[setting] = !this.settings[setting];
                    this.saveSettings('hvhm_settings', this.settings);
                    menuItem.classList.toggle('active');
                    menuItem.querySelector('.hvhm-toggle-switch').classList.toggle('active');
                    this._refreshESPLayoutPreview(menu);
                    if (setting === 'hideMenuButton') this.applyMenuButtonVisibility();


                } else if (menuItem.querySelector('.hvhm-color-picker-input')) {
                    menuItem.querySelector('.hvhm-color-picker-input').click();
                }
            });

            menu.querySelectorAll('.hvhm-color-picker-input').forEach(cp => cp.addEventListener('input', (e) => {
                const setting = e.target.dataset.setting;
                this.settings[setting] = e.target.value;
                this.saveSettings('hvhm_settings', this.settings);
                const preview = menu.querySelector(`.hvhm-color-preview[data-setting="${setting}"]`);
                if (preview) preview.style.backgroundColor = e.target.value;
                this._refreshESPLayoutPreview(menu);
                if (this.espPreviewCtx) { try { this.renderESPPreview(); } catch (e) {} }

            }));
            menu.querySelectorAll('.hvhm-inline-color').forEach(cp => cp.addEventListener('click', (e) => e.stopPropagation()));
            menu.querySelectorAll('.hvhm-select').forEach(select => select.addEventListener('change', e => {
                this.settings[e.target.dataset.setting] = e.target.value;
                this.saveSettings('hvhm_settings', this.settings);
                this._refreshESPLayoutPreview(menu);
                if (this.espPreviewCtx) { try { this.renderESPPreview(); } catch (e) {} }
            }));
            const settingsCode = menu.querySelector('[data-hvhm-settings-code]');
            const exportSettings = menu.querySelector('[data-hvhm-export-settings]');
            if (exportSettings) exportSettings.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (settingsCode) {
                    settingsCode.value = this.exportSettingsCode(); settingsCode.select();
                    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(settingsCode.value).catch(() => {});
                }
                this.notify({ title: 'Settings', message: 'Export code generated and copied when permitted.' });
            });
            const importSettings = menu.querySelector('[data-hvhm-import-settings]');
            if (importSettings) importSettings.addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (settingsCode) this.importSettingsCode(settingsCode.value);
            });
            const soundFile = menu.querySelector('[data-hvhm-kill-sound-file]');
            if (soundFile) soundFile.addEventListener('change', e => this.storeCustomKillSound(e.target.files && e.target.files[0]));
            const soundPackUrl = menu.querySelector('[data-hvhm-sound-pack-url]');
            if (soundPackUrl) soundPackUrl.addEventListener('change', e => { this.settings.onlineSoundPackUrl = e.target.value.trim(); this.saveSettings('hvhm_settings', this.settings); });
            const loadSoundPack = menu.querySelector('[data-hvhm-load-sound-pack]');
            if (loadSoundPack) loadSoundPack.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.loadOnlineSoundPack(); });
            const testSound = menu.querySelector('[data-hvhm-test-sound]');
            if (testSound) testSound.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.playSoundEvent('kill', true); });
            const clearSound = menu.querySelector('[data-hvhm-clear-sound]');
            if (clearSound) clearSound.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.clearCustomKillSound(); try { localStorage.removeItem('hvhm_online_sound_pack'); } catch (error) {} });

            menu.querySelectorAll('.hvhm-slider').forEach(slider => {
                const setting = slider.dataset.setting;
                const valueInput = menu.querySelector(`.hvhm-slider-value[data-setting="${setting}"]`);
                slider.addEventListener('input', () => {
                    const value = slider.value; this.settings[setting] = Number(value);
                    if (valueInput) valueInput.value = value <= 0 ? 'Off' : value;
                    if (setting === 'fovChanger') this.updateFOV();
                    if (setting === 'espScale') this._refreshESPLayoutPreview(menu);

                });
                slider.addEventListener('change', () => this.saveSettings('hvhm_settings', this.settings));
                const resetSlider = () => {
                    const def = this.defaultSettings[setting];
                    if (typeof def !== 'number') return;
                    this.settings[setting] = def;
                    slider.value = def;
                    if (valueInput) valueInput.value = def <= 0 ? 'Off' : def;
                    this.saveSettings('hvhm_settings', this.settings);
                    if (setting === 'fovChanger') this.updateFOV();
                    if (setting === 'espScale') this._refreshESPLayoutPreview(menu);

                };
                slider.addEventListener('dblclick', resetSlider);
                if (valueInput) valueInput.addEventListener('dblclick', resetSlider);
            });

            menu.querySelectorAll('.hvhm-slider-value').forEach(valueInput => {
                const setting = valueInput.dataset.setting;
                const slider = menu.querySelector(`.hvhm-slider[data-setting="${setting}"]`);
                valueInput.addEventListener('input', () => {
                    let value = Number(valueInput.value);
                    const min = Number(slider.min); const max = Number(slider.max);
                    if (value > max) value = max; if (value < min) value = min;
                    valueInput.value = value; this.settings[setting] = value; if (slider) slider.value = value;
                    if (setting === 'fovChanger') this.updateFOV();
                    if (setting === 'espScale') this._refreshESPLayoutPreview(menu);
                });
                valueInput.addEventListener('change', () => this.saveSettings('hvhm_settings', this.settings));
            });

            menu.querySelectorAll('.hvhm-menu-item, .hvhm-tab').forEach(el => {
                el.addEventListener('mouseenter', () => { if (window.SOUND) window.SOUND.play('hover_0', 0.1); });
            });
            this.bindESPLayoutEditor(menu);
            try {
                const lastTab = localStorage.getItem('hvhm_last_tab');
                if (lastTab) {
                    const tab = menu.querySelector(`.hvhm-tab[data-tab="${lastTab}"]`);
                    if (tab) tab.click();
                }
            } catch (e) {}
            this.bindMenuWindowInteraction(menu);
        }

        bindMenuWindowInteraction(menu) {
            const titlebar = menu.querySelector('.hvhm-menu-titlebar');
            const resizeHandle = menu.querySelector('.hvhm-menu-resize-handle');
            if (titlebar) titlebar.addEventListener('pointerdown', e => {
                if (e.button !== 0) return;
                e.preventDefault();
                const rect = menu.getBoundingClientRect();
                const startX = e.clientX, startY = e.clientY;
                titlebar.setPointerCapture(e.pointerId);
                menu.style.setProperty('left', `${rect.left}px`, 'important');
                menu.style.setProperty('top', `${rect.top}px`, 'important');
                menu.style.setProperty('transform', 'none', 'important');
                const move = moveEvent => {
                    const left = Math.max(0, Math.min(window.innerWidth - rect.width, rect.left + moveEvent.clientX - startX));
                    const top = Math.max(0, Math.min(window.innerHeight - 80, rect.top + moveEvent.clientY - startY));
                    menu.style.setProperty('left', `${left}px`, 'important');
                    menu.style.setProperty('top', `${top}px`, 'important');
                };
                const stop = () => {
                    titlebar.removeEventListener('pointermove', move);
                    titlebar.removeEventListener('pointerup', stop);
                    titlebar.removeEventListener('pointercancel', stop);
                };
                titlebar.addEventListener('pointermove', move);
                titlebar.addEventListener('pointerup', stop);
                titlebar.addEventListener('pointercancel', stop);
            });
            if (resizeHandle) resizeHandle.addEventListener('pointerdown', e => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();
                const rect = menu.getBoundingClientRect();
                const startX = e.clientX, startY = e.clientY;
                resizeHandle.setPointerCapture(e.pointerId);
                const move = moveEvent => {
                    const width = Math.max(480, Math.min(window.innerWidth - rect.left - 8, rect.width + moveEvent.clientX - startX));
                    const height = Math.max(360, Math.min(window.innerHeight - rect.top - 8, rect.height + moveEvent.clientY - startY));
                    menu.style.setProperty('width', `${width}px`, 'important');
                    menu.style.setProperty('height', `${height}px`, 'important');
                    menu.style.setProperty('max-height', `${height}px`, 'important');
                };
                const stop = () => {
                    resizeHandle.removeEventListener('pointermove', move);
                    resizeHandle.removeEventListener('pointerup', stop);
                    resizeHandle.removeEventListener('pointercancel', stop);
                };
                resizeHandle.addEventListener('pointermove', move);
                resizeHandle.addEventListener('pointerup', stop);
                resizeHandle.addEventListener('pointercancel', stop);
            });
        }

        _getESPLayoutConfig() {
            return {
                name: { x: 160, y: 72, xKey: 'espNameOffsetX', yKey: 'espNameOffsetY', colorKey: 'espNameColor' },
                level: { x: 160, y: 84, xKey: 'espLevelOffsetX', yKey: 'espLevelOffsetY', colorKey: 'espLevelColor' },
                weaponIcon: { x: 108, y: 303, xKey: 'espWeaponIconOffsetX', yKey: 'espWeaponIconOffsetY', colorKey: 'espWeaponColor' },
                weapon: { x: 160, y: 309, xKey: 'espWeaponOffsetX', yKey: 'espWeaponOffsetY', colorKey: 'espWeaponColor' },
                distance: { x: 160, y: 321, xKey: 'espDistanceOffsetX', yKey: 'espDistanceOffsetY', colorKey: 'espDistanceColor' }
            };
        }

        _refreshESPLayoutPreview(menu) {
            if (!menu) return;
            const config = this._getESPLayoutConfig();
            const box = { left: 120, top: 90, width: 80, height: 205 };
            const layout = this.getESPVisualLayout(box.left, box.top, box.left + box.width, box.top + box.height);
            const scale = layout.scale;
            const previewBox = menu.querySelector('.hvhm-preview-box');
            if (previewBox) {
                previewBox.style.display = this.settings.espBoxMode === 'off' ? 'none' : 'block';
                previewBox.style.left = `${box.left}px`;
                previewBox.style.top = `${box.top}px`;
                previewBox.style.width = `${box.width}px`;
                previewBox.style.height = `${box.height}px`;
                previewBox.style.borderColor = this.settings.espBoxColor || '#ffffff';
                previewBox.style.setProperty('--esp-preview-color', this.settings.espBoxColor || '#ffffff');
                previewBox.classList.toggle('mode-3d', this.settings.espBoxMode === '3d');
            }
            const previewHealth = menu.querySelector('.hvhm-preview-health');
            if (previewHealth) {
                previewHealth.style.left = `${layout.health.x}px`;
                previewHealth.style.top = `${layout.health.y}px`;
                previewHealth.style.width = `${layout.health.width}px`;
                previewHealth.style.height = `${layout.health.height}px`;
            }
            const anchors = {
                name: layout.name, level: layout.level, weaponIcon: layout.weaponIcon,
                weapon: layout.weapon, distance: layout.distance
            };
            const visibility = { name: this.settings.espNameTags, level: this.settings.espLevel, weaponIcon: this.settings.espWeaponIcon, weapon: this.settings.espWeapon, distance: this.settings.espDistance };
            for (const [name, item] of Object.entries(config)) {
                const node = menu.querySelector(`.hvhm-preview-element[data-layout-element="${name}"]`);
                if (!node) continue;
                node.style.left = `${anchors[name].x}px`;
                node.style.top = `${anchors[name].y}px`;
                node.style.color = this.settings[item.colorKey] || '#ffffff';
                node.style.transform = 'translate(-50%,-50%)';
                const fontBase = name === 'name' ? 12 : name === 'level' ? 11 : 10;
                node.style.fontSize = `${Math.max(8, fontBase * scale)}px`;
                if (name === 'weaponIcon') {
                    const image = node.querySelector('img');
                    if (image) {
                        image.style.width = `${44 * scale}px`;
                        image.style.height = `${18 * scale}px`;
                    }
                }
                node.style.display = visibility[name] ? 'block' : 'none';
            }
        }

        bindESPLayoutEditor(menu) {
            const preview = menu.querySelector('.hvhm-esp-preview');
            if (!preview) return;
            const config = this._getESPLayoutConfig();
            this._refreshESPLayoutPreview(menu);
            preview.querySelectorAll('.hvhm-preview-element').forEach(node => {
                node.addEventListener('pointerdown', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const item = config[node.dataset.layoutElement];
                    if (!item) return;
                    const previewRect = preview.getBoundingClientRect();
                    node.setPointerCapture(e.pointerId);
                    const move = moveEvent => {
                        const targetLeft = Math.max(8, Math.min(preview.clientWidth - 8, moveEvent.clientX - previewRect.left));
                        const targetTop = Math.max(8, Math.min(preview.clientHeight - 8, moveEvent.clientY - previewRect.top));
                        // Store offsets relative to the fixed preview anchor.
                        // This avoids feedback from the node's transformed box.
                        this.settings[item.xKey] = Math.round(targetLeft - item.x);
                        this.settings[item.yKey] = Math.round(targetTop - item.y);
                        this._refreshESPLayoutPreview(menu);
                    };
                    const stop = () => {
                        node.removeEventListener('pointermove', move);
                        node.removeEventListener('pointerup', stop);
                        node.removeEventListener('pointercancel', stop);
                        this.saveSettings('hvhm_settings', this.settings);
                    };
                    node.addEventListener('pointermove', move);
                    node.addEventListener('pointerup', stop);
                    node.addEventListener('pointercancel', stop);
                });
            });
            const reset = menu.querySelector('.hvhm-layout-reset');
            if (reset) reset.addEventListener('click', e => {
                e.preventDefault();
                for (const item of Object.values(config)) {
                    this.settings[item.xKey] = 0;
                    this.settings[item.yKey] = 0;
                }
                this.saveSettings('hvhm_settings', this.settings);
                this._refreshESPLayoutPreview(menu);
            });
        }

        addEventListeners() {
            window.addEventListener('pointerdown', (e) => {
                const mouseCode = `Mouse${e.button}`;
                this.pressedKeys.add(mouseCode);
                if (e.button === 2) this.rightMouseDown = true;
                if (e.button === 1 && this.settings.middleMouseMenu && !this.isBindingHotkey) { e.preventDefault(); this.showGUI(); return; }
                if (!this.isBindingHotkey) return;
                e.preventDefault(); e.stopPropagation();
                const duplicate = Object.keys(this.hotkeys).find(key => key !== this.currentBindingSetting && this.hotkeys[key] === mouseCode);
                if (duplicate) { this.notify({ title: "Hotkey Error", message: "Mouse button already assigned!" }); return; }
                this.hotkeys[this.currentBindingSetting] = mouseCode;
                this.saveSettings('hvhm_hotkeys', this.hotkeys);
                const menu = document.querySelector('.hvhm-menu-container');
                if (menu) {
                    const hkBtn = menu.querySelector(`.hvhm-hk-btn[data-hk="${this.currentBindingSetting}"]`);
                    if (hkBtn) { hkBtn.textContent = mouseCode; hkBtn.classList.add('bound'); }
                }
                this.hideHotkeyModal();
            });
            window.addEventListener('pointerup', (e) => {
                this.pressedKeys.delete(`Mouse${e.button}`);
                if (e.button === 2) this.rightMouseDown = false;
            });
            window.addEventListener('contextmenu', (e) => { if (this.isBindingHotkey) e.preventDefault(); });
            window.addEventListener('keydown', (e) => {
                this.pressedKeys.add(e.code);
                if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

                if (this.isBindingHotkey) {
                    e.preventDefault(); e.stopPropagation();
                    if (e.code === 'Escape') { this.hideHotkeyModal(); return; }
                    if (e.code === 'Delete' || e.code === 'Backspace') {
                        delete this.hotkeys[this.currentBindingSetting];
                        this.saveSettings('hvhm_hotkeys', this.hotkeys);
                        const menu = document.querySelector('.hvhm-menu-container');
                        if (menu) { const hkBtn = menu.querySelector(`.hvhm-hk-btn[data-hk="${this.currentBindingSetting}"]`); if (hkBtn) { hkBtn.textContent = '-'; hkBtn.classList.remove('bound'); } }
                        this.hideHotkeyModal(); return;
                    }
                    if (Object.values(this.hotkeys).includes(e.code)) { this.notify({ title: "Hotkey Error", message: "Key already assigned!"}); return; }
                    this.hotkeys[this.currentBindingSetting] = e.code;
                    this.saveSettings('hvhm_hotkeys', this.hotkeys);
                    const menu = document.querySelector('.hvhm-menu-container');
                    if(menu) { const hkBtn = menu.querySelector(`.hvhm-hk-btn[data-hk="${this.currentBindingSetting}"]`); if(hkBtn) { hkBtn.textContent = e.code.replace('Key','').replace('Digit','').replace('Numpad','Num'); hkBtn.classList.add('bound'); } }
                    this.hideHotkeyModal(); return;
                }

                if (this.hotkeys.aeroSpinOverride && e.code === this.hotkeys.aeroSpinOverride) {
                    this._aeroSpinOverrideHeld = true;
                }

                if (e.code === 'KeyO') {
                    e.preventDefault(); e.stopPropagation();
                    if (!e.repeat) this.showGUI();
                    return;
                }

                const action = Object.keys(this.hotkeys).find(key => this.hotkeys[key] === e.code);
                if (action) {
                    const holdAction = action === 'aimKey' || action === 'aeroSpinOverride';
                    if (!holdAction) { e.preventDefault(); e.stopPropagation(); }
                    if (action === 'toggleMenu') { this.showGUI(); }
                    else if (action === 'panicKey') { e.preventDefault(); e.stopPropagation(); this.panic(); }
                    else if (this.settings.hasOwnProperty(action)) {
                        this.settings[action] = !this.settings[action];
                        this.saveSettings('hvhm_settings', this.settings);
                        this.notify({ title: "Toggled", message: `${action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${this.settings[action] ? 'ON' : 'OFF'}`});
                        const menu = document.querySelector('.hvhm-menu-container');
                        if (menu) {
                            const item = menu.querySelector(`.hvhm-menu-item[data-setting="${action}"]`);
                            if (item) { item.classList.toggle('active', this.settings[action]); const toggle = item.querySelector('.hvhm-toggle-switch'); if (toggle) toggle.classList.toggle('active', this.settings[action]); }
                        }

                    }
                }
            });
            window.addEventListener('keyup', (e) => {
                this.pressedKeys.delete(e.code);
                if (e.code === this.hotkeys.aeroSpinOverride) this._aeroSpinOverrideHeld = false;
            });
            window.addEventListener('blur', () => {
                this.pressedKeys.clear();
                this._aeroSpinOverrideHeld = false;
            });
        }

        showHotkeyModal(settingName) {
            if (!this.hotkeyModal) return;
            this.isBindingHotkey = true; this.currentBindingSetting = settingName;
            const featureNameEl = document.getElementById('hvhm-hotkeyFeatureName');
            if (featureNameEl) featureNameEl.textContent = settingName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            this.hotkeyModal.classList.add('active');
        }

        hideHotkeyModal() { if (!this.hotkeyModal) return; this.isBindingHotkey = false; this.currentBindingSetting = null; this.hotkeyModal.classList.remove('active'); }

        isDefined(val) { return val !== undefined && val !== null; }
        isTeam(player) {
            if (player && typeof player.name === 'string' && this.isTeamingFriendly() && this.lobbyCheatUsers.get(player.name)?.teamMode === true) return true;
            return this.me && this.me.team ? this.me.team === player.team : false;
        }
        getDistanceSq(p1, p2) { return (p2.x - p1.x)**2 + (p2.y - p1.y)**2 + (p2.z - p1.z)**2; }
        getDirection(z1, x1, z2, x2) { return Math.atan2(x1 - x2, z1 - z2); }
        getXDirection(t,e,o,i,s,n){const r=s-e,a=Math.sqrt((i-t)**2+(s-e)**2+(n-o)**2);return Math.asin(r/a)}

        containsPoint(point) { let planes = this.renderer.frustum.planes; for (let i = 0; i < 6; i ++) { if (planes[i].distanceToPoint(point) < 0) { return false; } } return true; }

        lineInRect(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
            let t1 = (x1 - lx1) * dx; let t2 = (x2 - lx1) * dx; let t3 = (y1 - ly1) * dy; let t4 = (y2 - ly1) * dy;
            let t5 = (z1 - lz1) * dz; let t6 = (z2 - lz1) * dz;
            let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
            let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
            if (tmax < 0) return false; if (tmin > tmax) return false; return tmin;
        }

        getCanSee(player, boxSize) {
            const from = this.me; if (!from || !this.game?.map?.manager?.objects) return true;
            boxSize = boxSize || 0; const toX = player.x, toY = player.y, toZ = player.z; let penetrableWallsHit = 0;
            for (let obj, dist = Math.sqrt((toX-from.x)**2+(toY-from.y)**2+(toZ-from.z)**2), xDr = this.getDirection(from.z, from.x, toZ, toX), yDr = this.getDirection(Math.sqrt((toX-from.x)**2+(toZ-from.z)**2), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || this.PLAYER_HEIGHT) - this.CAMERA_HEIGHT, i = 0; i < this.game.map.manager.objects.length; ++i) {
                let tmpDst;
                if (!(obj = this.game.map.manager.objects[i]).noShoot && obj.active && obj.transparent !== false &&
                    (tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize))) && 1 > tmpDst) {
                    if (!this.settings.aimbotWallBangs || !obj.penetrable || !this.me.weapon.pierce) { return false; }
                    penetrableWallsHit++;
                }
            }
            return penetrableWallsHit <= 1;
        }

        async waitFor(condition, timeout = Infinity) {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            return new Promise(async (resolve, reject) => {
                if (typeof timeout != 'number') reject('Timeout argument not a number in waitFor');
                let result;
                while (result === undefined || result === false || result === null || result.length === 0) {
                    if ((timeout -= 100) < 0) { resolve(false); return; } await sleep(100);
                    result = typeof condition === 'string' ? Function(condition)() : condition();
                }
                resolve(result);
            });
        }

        lookDir(xDire, yDire) {
            this.controls.object.rotation.y = yDire;
            const __pch = this.vars.pchObjc && this.controls[this.vars.pchObjc];
            if (!__pch) return;
            __pch.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, xDire));
            this.controls.yDr = __pch.rotation.x % Math.PI;
            this.controls.xDr = this.controls.object.rotation.y % Math.PI;
            this.renderer.camera.updateProjectionMatrix();
            this.renderer.updateFrustum();
        }

        resetLookAt() {
            this.controls.object.rotation.y = this.controls.xDr;
            const __pch = this.vars.pchObjc && this.controls[this.vars.pchObjc];
            if (!__pch) return;
            __pch.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.controls.yDr));
            this.renderer.camera.updateProjectionMatrix();
            this.renderer.updateFrustum();
        }

        getModelBoneNodes(player) {
            const entity = player && (player.objInstances || player.mesh);
            if (!entity || typeof entity.traverse !== 'function') return {};
            const cached = this._boneNodeCache.get(entity);
            if (cached) return cached;

            const nodes = {};
            const patterns = {
                head: ['head', 'skull'], neck: ['neck'],
                chest: ['chest', 'upperbody', 'torso', 'spine2', 'spine1', 'spine', 'body'],
                pelvis: ['pelvis', 'hips', 'hip', 'waist', 'lowerbody'],
                leftShoulder: ['leftshoulder', 'shoulderl', 'lshoulder', 'leftupperarm', 'upperarml', 'arml'],
                leftElbow: ['leftelbow', 'elbowl', 'leftforearm', 'forearml'],
                leftHand: ['lefthand', 'handl', 'lhand'],
                rightShoulder: ['rightshoulder', 'shoulderr', 'rshoulder', 'rightupperarm', 'upperarmr', 'armr'],
                rightElbow: ['rightelbow', 'elbowr', 'rightforearm', 'forearmr'],
                rightHand: ['righthand', 'handr', 'rhand'],
                leftHip: ['lefthip', 'hipl', 'leftthigh', 'thighl', 'leftupleg', 'uplegl'],
                leftKnee: ['leftknee', 'kneel', 'leftlowerleg', 'lowerlegl', 'leftcalf', 'calfl', 'legl'],
                leftFoot: ['leftfoot', 'footl', 'lfoot'],
                rightHip: ['righthip', 'hipr', 'rightthigh', 'thighr', 'rightupleg', 'uplegr'],
                rightKnee: ['rightknee', 'kneer', 'rightlowerleg', 'lowerlegr', 'rightcalf', 'calfr', 'legr'],
                rightFoot: ['rightfoot', 'footr', 'rfoot']
            };
            entity.traverse(node => {
                const name = String(node.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                if (!name) return;
                for (const [bone, aliases] of Object.entries(patterns)) {
                    if (!nodes[bone] && aliases.some(alias => name === alias || name.includes(alias))) nodes[bone] = node;
                }
            });
            this._boneNodeCache.set(entity, nodes);
            return nodes;
        }

        getNodeWorldCenter(node) {
            if (!node || !this.three) return null;
            node.updateWorldMatrix?.(true, false);
            if (node.geometry) {
                if (!node.geometry.boundingBox) node.geometry.computeBoundingBox?.();
                if (node.geometry.boundingBox) {
                    const center = node.geometry.boundingBox.getCenter(new this.three.Vector3());
                    node.localToWorld(center);
                    return { x: center.x, y: center.y, z: center.z };
                }
            }
            if (typeof node.getWorldPosition === 'function') {
                const center = node.getWorldPosition(new this.three.Vector3());
                return { x: center.x, y: center.y, z: center.z };
            }
            return null;
        }

        isRenderedLimb(node, root) {
            if (!node) return false;
            for (let current = node; current; current = current.parent) {
                if (current.visible === false) return false;
                if (current === root) break;
            }
            return true;
        }

        getLimbSegment(mesh) {
            if (!mesh || !this.three) return null;
            mesh.updateWorldMatrix?.(true, true);
            const originVector = mesh.getWorldPosition(new this.three.Vector3());
            let descriptor = this._limbEndpointCache.get(mesh);
            if (!descriptor) {
                let best = null;
                let bestDistance = -1;
                mesh.traverse(node => {
                    if (!node.geometry) return;
                    if (!node.geometry.boundingBox) node.geometry.computeBoundingBox?.();
                    const box = node.geometry.boundingBox;
                    if (!box) return;
                    const center = box.getCenter(new this.three.Vector3());
                    const candidates = [
                        new this.three.Vector3(box.min.x, center.y, center.z), new this.three.Vector3(box.max.x, center.y, center.z),
                        new this.three.Vector3(center.x, box.min.y, center.z), new this.three.Vector3(center.x, box.max.y, center.z),
                        new this.three.Vector3(center.x, center.y, box.min.z), new this.three.Vector3(center.x, center.y, box.max.z)
                    ];
                    for (const localPoint of candidates) {
                        const worldPoint = node.localToWorld(localPoint.clone());
                        const distance = worldPoint.distanceToSquared(originVector);
                        if (distance > bestDistance) {
                            bestDistance = distance;
                            best = { node, localPoint: localPoint.clone() };
                        }
                    }
                });
                descriptor = best;
                if (descriptor) this._limbEndpointCache.set(mesh, descriptor);
            }
            if (!descriptor) return null;
            descriptor.node.updateWorldMatrix?.(true, false);
            const endVector = descriptor.node.localToWorld(descriptor.localPoint.clone());
            return {
                start: { x: originVector.x, y: originVector.y, z: originVector.z },
                middle: { x: (originVector.x + endVector.x) / 2, y: (originVector.y + endVector.y) / 2, z: (originVector.z + endVector.z) / 2 },
                end: { x: endVector.x, y: endVector.y, z: endVector.z }
            };
        }

        getMergedArmSegments(mesh, chestPoint) {
            if (!mesh || !chestPoint || !this.three) return {};
            const geometry = mesh.geometry;
            const positions = geometry && geometry.attributes && geometry.attributes.position && geometry.attributes.position.array;
            const ranges = geometry && geometry.tVecs;
            if (!positions) return {};
            mesh.updateWorldMatrix?.(true, false);

            let descriptors = this._mergedArmPointCache.get(mesh);
            if (!descriptors) {
                descriptors = {};
                const localChest = mesh.worldToLocal(new this.three.Vector3(chestPoint.x, chestPoint.y, chestPoint.z));
                const allVertices = [];
                for (let i = 0; i + 2 < positions.length; i += 3) allVertices.push(new this.three.Vector3(positions[i], positions[i + 1], positions[i + 2]));
                let minX = Infinity, maxX = -Infinity;
                for (const point of allVertices) { minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x); }
                const splitX = (minX + maxX) / 2;
                const spatialGroups = {
                    left: allVertices.filter(point => point.x <= splitX),
                    right: allVertices.filter(point => point.x > splitX)
                };
                for (const [resultSide, spatialVertices] of Object.entries(spatialGroups)) {
                    const sideKey = resultSide === 'left' ? 'l' : 'r';
                    const range = ranges && ranges[sideKey];
                    const hasUsableRange = range && Number.isFinite(Number(range.startP)) && Number.isFinite(Number(range.endP)) && Number(range.endP) > Number(range.startP);
                    const sourceVertices = hasUsableRange
                        ? allVertices.slice(Math.floor(Number(range.startP) / 3), Math.ceil(Number(range.endP) / 3))
                        : spatialVertices;
                    const vertices = sourceVertices.map(point => ({ point, distance: point.distanceToSquared(localChest) }));
                    if (!vertices.length) continue;
                    vertices.sort((a, b) => a.distance - b.distance);
                    const groupSize = Math.max(3, Math.floor(vertices.length * 0.08));
                    const average = group => {
                        const value = new this.three.Vector3();
                        for (const vertex of group) value.add(vertex.point);
                        return value.multiplyScalar(1 / group.length);
                    };
                    descriptors[resultSide] = {
                        start: average(vertices.slice(0, groupSize)),
                        end: average(vertices.slice(-groupSize))
                    };
                }
                this._mergedArmPointCache.set(mesh, descriptors);
            }

            const result = {};
            for (const [side, descriptor] of Object.entries(descriptors)) {
                const start = mesh.localToWorld(descriptor.start.clone());
                const end = mesh.localToWorld(descriptor.end.clone());
                result[side] = {
                    start: { x: start.x, y: start.y, z: start.z },
                    middle: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2, z: (start.z + end.z) / 2 },
                    end: { x: end.x, y: end.y, z: end.z }
                };
            }
            return result;
        }

        getAnimatedModelBonePositions(player) {
            const result = {};
            const root = player && (player.objInstances || player.mesh);
            if (!root) return result;
            const namedNodes = this.getModelBoneNodes(player);

            result.head = this.getNodeWorldCenter(player.headObj || player.headMesh || namedNodes.head);
            result.chest = this.getNodeWorldCenter(player.bodyMesh || namedNodes.chest || player.upperBody);
            result.pelvis = this.getNodeWorldCenter(player.lowerBody);
            if (result.head && result.chest) {
                result.neck = {
                    x: result.chest.x + (result.head.x - result.chest.x) * 0.68,
                    y: result.chest.y + (result.head.y - result.chest.y) * 0.68,
                    z: result.chest.z + (result.head.z - result.chest.z) * 0.68
                };
            }

            const arms = Array.isArray(player.armMeshes) ? player.armMeshes : [];
            const selfThirdPerson = player.isYou && this.isThirdPersonView();
            const visibleArms = arms.map((mesh, index) => ({ mesh, index })).filter(item =>
                player.isYou ? !selfThirdPerson && Boolean(item.mesh) && item.index < 2 : this.isRenderedLimb(item.mesh, root));
            const leftArm = visibleArms.find(item => item.index % 2 === 0)?.mesh;
            const rightArm = visibleArms.find(item => item.index % 2 === 1)?.mesh;
            const legs = Array.isArray(player.legMeshes) ? player.legMeshes : [];
            const visibleLeg = indices => indices.map(index => legs[index]).find(mesh =>
                player.isYou ? Boolean(mesh) : this.isRenderedLimb(mesh, root));
            const crouched = (Number(player.crouchVal) || 0) > 0.5;
            const leftLeg = visibleLeg(crouched ? [3, 1] : [1, 3]);
            const rightLeg = visibleLeg(crouched ? [2, 0] : [0, 2]);

            const addArm = (side, mesh) => {
                const segment = this.getLimbSegment(mesh);
                if (!segment) return;
                result[`${side}Shoulder`] = segment.start;
                result[`${side}Elbow`] = segment.middle;
                result[`${side}Hand`] = segment.end;
            };
            const addLeg = (side, mesh) => {
                const segment = this.getLimbSegment(mesh);
                if (!segment) return;
                result[`${side}Hip`] = segment.start;
                result[`${side}Knee`] = segment.middle;
                result[`${side}Foot`] = segment.end;
            };
            addArm('left', leftArm); addArm('right', rightArm);
            const mergedArms = Array.isArray(player.mergedArmMeshes) ? player.mergedArmMeshes : [];
            const allowMergedArms = !player.isYou || selfThirdPerson;
            const activeMergedArm = allowMergedArms ? (mergedArms[player.loadoutIndex] || mergedArms.find(mesh => this.isRenderedLimb(mesh, root))) : null;
            const mergedSegments = this.getMergedArmSegments(activeMergedArm, result.chest);
            for (const side of ['left', 'right']) {
                const segment = mergedSegments[side];
                if (!segment || result[`${side}Hand`]) continue;
                result[`${side}Shoulder`] = segment.start;
                result[`${side}Elbow`] = segment.middle;
                result[`${side}Hand`] = segment.end;
            }
            addLeg('left', leftLeg); addLeg('right', rightLeg);
            return result;
        }

        getModelBonePositions(player) {
            const result = this.getAnimatedModelBonePositions(player);
            if (!this.three) return result;
            const nodes = this.getModelBoneNodes(player);
            for (const [name, node] of Object.entries(nodes)) {
                if (result[name]) continue;
                if (!node || typeof node.getWorldPosition !== 'function') continue;
                const point = this.getNodeWorldCenter(node);
                if (point && Number.isFinite(point.x + point.y + point.z)) result[name] = point;
            }
            return result;
        }

        getAimPoint(target) {
            let selected = this.settings.aimTarget || 'head';
            if (selected === 'random') {
                const r = Math.random();
                selected = r < 0.33 ? 'head' : r < 0.66 ? 'torso' : 'legs';
            }
            const isBot = !!target.isBot;
            const botSize = Number(target.dat && target.dat.mSize) || this.PLAYER_HEIGHT;
            const headY = isBot
                ? Number(target.y) - botSize / 2
                : Number(target.y) - (Number(target.crouchVal) || 0) * this.CROUCH_FACTOR + (Number(this.me && this.me.crouchVal) || 0) * this.CROUCH_FACTOR;
            const scale = isBot ? Math.max(0.5, botSize / this.PLAYER_HEIGHT) : 1;
            const lowerOffset = ({ head: 0, torso: 2.45, legs: 4.5 }[selected] ?? 0) * scale;
            return { x: Number(target.x) || 0, y: headY - lowerOffset, z: Number(target.z) || 0 };
        }

        drawSkeletonESP(player, xmin, ymin, xmax, ymax, scale, skeletonColor = null) {
            const modelBones = this.getModelBonePositions(player);
            const projected = {};
            for (const [name, worldPoint] of Object.entries(modelBones)) {
                const screenPoint = this.world2Screen(worldPoint);
                if (screenPoint) projected[name] = screenPoint;
            }
            const firstPersonSelf = player.isYou && !this.isThirdPersonView();
            const torsoHeight = projected.head && projected.pelvis
                ? Math.max(8, Math.abs(projected.pelvis.y - projected.head.y))
                : Math.max(8, Math.abs(ymax - ymin) * 0.5);
            // Lift the shoulder anchor slightly so the arms connect cleanly to
            // the upper torso instead of starting low on the chest.
            for (const side of ['left', 'right']) {
                const shoulder = projected[`${side}Shoulder`];
                if (shoulder) shoulder.y -= torsoHeight * 0.08;
            }
            // At distance the game may cull leg meshes. Keep a small projected
            // fallback so the skeleton does not randomly lose both legs.
            if (!firstPersonSelf && projected.pelvis) {
                const halfWidth = Math.max(3, (xmax - xmin) * 0.16);
                for (const side of ['left', 'right']) {
                    const sign = side === 'left' ? -1 : 1;
                    if (!projected[`${side}Hip`]) projected[`${side}Hip`] = { x: projected.pelvis.x + sign * halfWidth, y: projected.pelvis.y, };
                    if (!projected[`${side}Knee`]) projected[`${side}Knee`] = { x: projected[`${side}Hip`].x + sign * halfWidth * 0.18, y: projected.pelvis.y + torsoHeight * 0.30 };
                    if (!projected[`${side}Foot`]) projected[`${side}Foot`] = { x: projected[`${side}Knee`].x - sign * halfWidth * 0.10, y: projected.pelvis.y + torsoHeight * 0.58 };
                }
            }
            const hasAnimatedLimbs = firstPersonSelf
                ? Boolean(projected.leftHand || projected.rightHand)
                : Boolean(projected.head && projected.chest && projected.pelvis &&
                    (projected.leftHand || projected.rightHand || projected.leftFoot || projected.rightFoot));
            if (!hasAnimatedLimbs) return;
            const links = firstPersonSelf ? [
                ['leftShoulder','leftElbow'], ['leftElbow','leftHand'],
                ['rightShoulder','rightElbow'], ['rightElbow','rightHand']
            ] : [
                ['head','neck'], ['neck','chest'], ['chest','pelvis'],
                ['chest','leftShoulder'], ['leftShoulder','leftElbow'], ['leftElbow','leftHand'],
                ['chest','rightShoulder'], ['rightShoulder','rightElbow'], ['rightElbow','rightHand'],
                ['pelvis','leftHip'], ['leftHip','leftKnee'], ['leftKnee','leftFoot'],
                ['pelvis','rightHip'], ['rightHip','rightKnee'], ['rightKnee','rightFoot']
            ];
            this.ctx.strokeStyle = skeletonColor || this.settings.skeletonColor || '#ffffff';
            // Skeletons stay at a stable, readable size; ESP Scale affects the
            // box/text/icons but never stretches the live bone positions.
            this.ctx.lineWidth = 1.35;
            this.ctx.lineCap = 'round';
            CRC2d.beginPath.apply(this.ctx, []);
            for (const [from, to] of links) {
                if (!projected[from] || !projected[to]) continue;
                CRC2d.moveTo.apply(this.ctx, [projected[from].x, projected[from].y]);
                CRC2d.lineTo.apply(this.ctx, [projected[to].x, projected[to].y]);
            }
            CRC2d.stroke.apply(this.ctx, []);
            if (!firstPersonSelf && projected.head) {
                const headRadius = Math.max(2.5, Math.min(8, torsoHeight * 0.09));
                CRC2d.beginPath.apply(this.ctx, []);
                CRC2d.arc.apply(this.ctx, [projected.head.x, projected.head.y, headRadius, 0, Math.PI * 2]);
                CRC2d.stroke.apply(this.ctx, []);
            }
        }

        world2Screen(worldPosition) {
            if (!this.renderer?.camera || !this.overlay?.canvas) return null;
            this.tempVector.set(worldPosition.x, worldPosition.y, worldPosition.z);
            this.tempVector.project(this.renderer.camera);
            if (this.tempVector.z > 1) return null;
            return { x: (this.tempVector.x + 1) / 2 * this.overlay.canvas.width, y: (-this.tempVector.y + 1) / 2 * this.overlay.canvas.height };
        }

        getESPWeapon(player) {
            if (!player) return null;
            let weapon = player.weapon;
            if (typeof weapon === 'number' && Array.isArray(player.weapons)) weapon = player.weapons[weapon];
            if (!weapon && Array.isArray(player.weapons)) {
                const index = Number(player.weaponIndex ?? player.weaponInd ?? 0);
                weapon = player.weapons[index];
            }
            return weapon || null;
        }

        getESPWeaponName(player) {
            const weapon = this.getESPWeapon(player);
            const name = player.weaponName || (typeof weapon === 'string' ? weapon : weapon && (weapon.name || weapon.n));
            return String(name || 'WEAPON').toUpperCase();
        }

        getESPWeaponIcon(player) {
            const weapon = this.getESPWeapon(player);
            if (!weapon || typeof weapon !== 'object') return null;
            const icon = String(weapon.icon || 'icon_0').replace(/\.png$/i, '');
            const path = weapon.melee ? `textures/melee/${icon || 'icon_0'}.png` : `textures/weapons/${icon}.png`;
            const url = `https://assets.krunker.io/${path}`;
            const cacheKey = `esp-weapon-icon:${url}`;
            if (!this.skinCache[cacheKey]) {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.src = url;
                this.skinCache[cacheKey] = image;
            }
            const image = this.skinCache[cacheKey];
            return image.complete && image.naturalWidth > 0 ? image : null;
        }

        drawESPWeaponIcon(player, x, y, scale, iconColor = null) {
            const width = 44 * scale;
            const height = 18 * scale;
            const image = this.getESPWeaponIcon(player);
            if (image) {
                CRC2d.drawImage.apply(this.ctx, [image, x - width / 2, y - height / 2, width, height]);
                return;
            }
            this.ctx.fillStyle = iconColor || this.settings.espWeaponColor || '#ffffff';
            CRC2d.fillRect.apply(this.ctx, [x - width * 0.45, y - height * 0.18, width * 0.72, height * 0.28]);
            CRC2d.fillRect.apply(this.ctx, [x - width * 0.1, y + height * 0.08, width * 0.18, height * 0.38]);
            CRC2d.fillRect.apply(this.ctx, [x + width * 0.22, y - height * 0.09, width * 0.23, height * 0.16]);
        }

        getESPVisualLayout(xmin, ymin, xmax, ymax) {
            const scale = Math.max(0.5, Math.min(2.5, Number(this.settings.espScale) || 1));
            const width = xmax - xmin;
            const height = ymax - ymin;
            const centerX = xmin + width / 2;
            const offset = key => Number(this.settings[key]) || 0;
            return {
                xmin, ymin, xmax, ymax, width, height, centerX, scale,
                health: { x: xmin - 6 * scale, y: ymin, width: 3 * scale, height },
                weaponIcon: { x: centerX - 52 + offset('espWeaponIconOffsetX'), y: ymax + 8 * scale + offset('espWeaponIconOffsetY') },
                weapon: { x: centerX + offset('espWeaponOffsetX'), y: ymax + 14 * scale + offset('espWeaponOffsetY') },
                name: { x: centerX + offset('espNameOffsetX'), y: ymin + (this.settings.espLevel ? -18 : -6) * scale + offset('espNameOffsetY') },
                level: { x: centerX + offset('espLevelOffsetX'), y: ymin - 6 * scale + offset('espLevelOffsetY') },
                distance: { x: centerX + offset('espDistanceOffsetX'), y: ymax + (this.settings.espWeapon || this.settings.espWeaponIcon ? 26 : 14) * scale + offset('espDistanceOffsetY') }
            };
        }

        drawCanvasESP(player, isBot, isSelf = false) {
            if (!isSelf && this.settings.espTeamCheck && this.isTeam(player)) return;
            const showStandard = !isSelf || this.settings.selfESP;
            const showSkeleton = isSelf ? this.settings.selfSkeletonESP : this.settings.skeletonESP;
            const playerPos = { x: player.x, y: player.y, z: player.z };
            const effectiveHeight = isBot ? player.dat.mSize : (player.height || this.PLAYER_HEIGHT) - ((player.crouchVal || 0) * this.CROUCH_FACTOR);
            const halfWidth = isBot ? (player.dat.mSize * 0.4) / 2 : this.PLAYER_WIDTH / 2;
            const corners = [
                { x: playerPos.x - halfWidth, y: playerPos.y, z: playerPos.z - halfWidth },
                { x: playerPos.x + halfWidth, y: playerPos.y, z: playerPos.z - halfWidth },
                { x: playerPos.x - halfWidth, y: playerPos.y, z: playerPos.z + halfWidth },
                { x: playerPos.x + halfWidth, y: playerPos.y, z: playerPos.z + halfWidth },
                { x: playerPos.x - halfWidth, y: playerPos.y + effectiveHeight, z: playerPos.z - halfWidth },
                { x: playerPos.x + halfWidth, y: playerPos.y + effectiveHeight, z: playerPos.z - halfWidth },
                { x: playerPos.x - halfWidth, y: playerPos.y + effectiveHeight, z: playerPos.z + halfWidth },
                { x: playerPos.x + halfWidth, y: playerPos.y + effectiveHeight, z: playerPos.z + halfWidth },
            ];

            let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity, onScreen = false;
            for (let i = 0; i < corners.length; i++) {
                const screenPos = this.world2Screen(corners[i]);
                if (screenPos) {
                    onScreen = true;
                    xmin = Math.min(xmin, screenPos.x);
                    xmax = Math.max(xmax, screenPos.x);
                    ymin = Math.min(ymin, screenPos.y);
                    ymax = Math.max(ymax, screenPos.y);
                }
            }
            if (!onScreen || !isFinite(xmin + xmax + ymin + ymax)) {
                if (isSelf && this.settings.selfSkeletonESP && !this.isThirdPersonView()) {
                    const fallbackScale = Math.max(0.5, Math.min(2.5, Number(this.settings.espScale) || 1));
                    this.drawSkeletonESP(player, 0, 0, this.overlay.canvas.width, this.overlay.canvas.height, fallbackScale);
                }
                return;
            }
            const layout = this.getESPVisualLayout(xmin, ymin, xmax, ymax);
            const { width: visualBoxWidth, height: visualBoxHeight, centerX, scale: espScale } = layout;
            const playerVisible = isSelf || this.getCanSee(player);
            const colorFor = (normalKey, visibleKey) => {
                if (this.settings.rainbowEsp) {
                    const hue = Date.now() / 15 % 360;
                    return `hsla(${hue}, 100%, 50%, 1)`;
                }
                return playerVisible
                    ? (this.settings[visibleKey] || this.settings[normalKey] || '#ffffff')
                    : (this.settings[normalKey] || '#ffffff');
            };
            const boxColor = colorFor('espBoxColor', 'espBoxVisibleColor');
            const lineColor = colorFor('espLineColor', 'espLineVisibleColor');
            const nameColor = colorFor('espNameColor', 'espNameVisibleColor');
            const weaponColor = colorFor('espWeaponColor', 'espWeaponVisibleColor');
            const levelColor = colorFor('espLevelColor', 'espLevelVisibleColor');
            const distanceColor = colorFor('espDistanceColor', 'espDistanceVisibleColor');
            const skeletonColor = colorFor('skeletonColor', 'skeletonVisibleColor');
            const col = boxColor;
            CRC2d.save.apply(this.ctx, []);
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'transparent';

            if (showStandard && this.settings.espLines) {
                const origin = this.settings.espLineOrigin || 'bottom';
                const startX = this.overlay.canvas.width / 2;
                const startY = origin === 'top' ? 0 : (origin === 'center' ? this.overlay.canvas.height / 2 : this.overlay.canvas.height);
                const endX = centerX, endY = ymax;
                this.ctx.lineWidth = Math.max(1, espScale); this.ctx.strokeStyle = lineColor;
                CRC2d.beginPath.apply(this.ctx, []); CRC2d.moveTo.apply(this.ctx, [startX, startY]); CRC2d.lineTo.apply(this.ctx, [endX, endY]); CRC2d.stroke.apply(this.ctx, []);
            }

            if (showStandard && (this.settings.espSquare || this.settings.espBoxMode === '2d')) {
                if (this.settings.espInfoBackground) {
                    const boxFill = this.ctx.createLinearGradient(xmin, ymin, xmax, ymax);
                    boxFill.addColorStop(0, 'rgba(35,35,35,0.62)');
                    boxFill.addColorStop(0.55, 'rgba(120,120,120,0.28)');
                    boxFill.addColorStop(1, 'rgba(255,255,255,0.18)');
                    this.ctx.fillStyle = boxFill;
                    CRC2d.fillRect.apply(this.ctx, [xmin, ymin, visualBoxWidth, visualBoxHeight]);
                }
                this.ctx.lineWidth = 1.5; this.ctx.strokeStyle = col;
                CRC2d.strokeRect.apply(this.ctx, [xmin, ymin, visualBoxWidth, visualBoxHeight]);
            }

            if (showSkeleton) {
                this.drawSkeletonESP(player, xmin, ymin, xmax, ymax, espScale, skeletonColor);
            }

            if (showStandard && this.settings.espHealth && player.health && player.maxHealth) {
                const healthPercentage = Math.max(0, player.health / player.maxHealth);
                const { x: barX, y: barY, width: barWidth, height: barHeight } = layout.health;
                this.ctx.fillStyle = "rgba(0,0,0,0.5)"; CRC2d.fillRect.apply(this.ctx, [barX, barY, barWidth, barHeight]);
                const healthColor = healthPercentage > 0.75 ? '#43A047' : healthPercentage > 0.4 ? '#FDD835' : '#E53935';
                const healthFillHeight = barHeight * healthPercentage;
                const healthGradient = this.ctx.createLinearGradient(barX, barY + barHeight, barX + barWidth, barY);
                healthGradient.addColorStop(0, healthColor);
                healthGradient.addColorStop(1, '#ffffff');
                this.ctx.fillStyle = healthGradient;
                CRC2d.fillRect.apply(this.ctx, [barX, barY + barHeight - healthFillHeight, barWidth, healthFillHeight]);
            }

            if (showStandard && this.settings.espWeaponIcon) {
                this.drawESPWeaponIcon(player, layout.weaponIcon.x, layout.weaponIcon.y, espScale, weaponColor);
            }

            if (showStandard && this.settings.espWeapon) {
                this.ctx.font = `500 ${10 * espScale}px 'IBM Plex Mono', monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = weaponColor;
                CRC2d.fillText.apply(this.ctx, [this.getESPWeaponName(player), layout.weapon.x, layout.weapon.y]);
            }

            if (showStandard && this.settings.espNameTags) {
                this.ctx.font = `600 ${12 * espScale}px 'IBM Plex Mono', monospace`; this.ctx.textAlign = "center"; this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = nameColor;
                CRC2d.fillText.apply(this.ctx, [isBot ? (player.name || 'BOT') : (player.name || 'PLAYER'), layout.name.x, layout.name.y]);
            }
            if (showStandard && this.settings.espLevel) {
                const level = Number(player.level ?? player.stats?.level);
                if (Number.isFinite(level)) {
                    this.ctx.font = `600 ${11 * espScale}px 'IBM Plex Mono', monospace`; this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = levelColor;
                    CRC2d.fillText.apply(this.ctx, [`LV ${level}`, layout.level.x, layout.level.y]);
                }
            }
            if (showStandard && this.settings.espDistance) {
                const distance = Math.round(Math.sqrt((this.me.x-player.x)**2+(this.me.y-player.y)**2+(this.me.z-player.z)**2) / 10);
                this.ctx.font = `500 ${10 * espScale}px 'IBM Plex Mono', monospace`; this.ctx.textAlign = 'center';
                this.ctx.fillStyle = distanceColor;
                CRC2d.fillText.apply(this.ctx, [`${distance}m`, layout.distance.x, layout.distance.y]);
            }
            CRC2d.restore.apply(this.ctx, []);
        }
    }

    window[uniqueId] = new hvhm();

})('hvhm_' + Math.random().toString(36).substring(2, 10), CanvasRenderingContext2D.prototype);
