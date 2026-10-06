# betascript — Krunker.IO Cheat

Krunker.io cheat: aimbot, ESP/wallhack, skin unlocker, bhop, mod menu and more. Previously known as hvhm.

> [!WARNING]
> Educational/research purposes. Cheating violates Krunker's Terms of Service and **will** get accounts banned. Use at your own risk —ideally on throwaway accounts.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or another userscript manager).
2. Click to install: **[betascript.user.js](https://raw.githubusercontent.com/levifrsn63/betascript/main/betascript.user.js)**
3. Confirm the install prompt, open [krunker.io](https://krunker.io) and press `Insert` for the menu.

Updates are automatic via the built-in updater (`@updateURL`).

## Features

**Aimbot tab**
- Aimbot toggle, Aimkey Only (hold-to-aim), Aim Key hotkey
- FOV Check, Aim Bone (head/neck/chest/pelvis), FOV Size + circle, Team/Bot/Wall checks, Wall Bangs
- Auto Fire, Triggerbot, Legit Smoothing, Silent Aim, Flick Speed, Randomness, Tremor, ADS Reduction, Aim Offset

**Visuals tab**
- Third Person, Weapon Trails, FOV Changer (locks across ADS), Weapon Zoom
- ESP Scale, Box Style (off/2D/3D), Lines (origin top/center/bottom), Names, Weapon name + icon, Level, Distance, Skeleton, Wireframe
- Self ESP / Self Skeleton, Chams (static/RGB, opacity, self), team + bot filters
- Camera Offset (X/Y/Z shoulder-cam sliders)

**Misc tab**
- Bunny Hop, Anti-Aim (look-down), Spinbot + speed, Aero Spin Override
- Auto Nuke, Anti Kick, Auto Reload, Unlock All Skins, Spectator Alert
- Script Network: HVHM-style user radar — see who else runs the client (`betauser` tags, `betadev` for the dev), lobby user list, team-up requests
- Settings share (export/import code or `betascript-settings.json` file), named configs, hotkeys

**Beta tab**
- No Recoil, Bullet Tracers, Hitmarkers, Custom kill-sound packs (built-in, online URL, or your own file)

## Layout

| Path | What it is |
|------|------------|
| `betascript.user.js` | The cheat (Tampermonkey userscript, `@run-at document-start`) |
| `GameSource/game.js` | Pinned Krunker client bundle the cheat patches at load |
| `Assets/logo.svg` | Script icon |
| `krunker_loader.user.js` | Optional keyless loader (separate auxiliary script) |

## Notes

- **v1.10.63+ is a clean rebrand break**: localStorage keys, settings and the beacon protocol moved from `hvhm_*` / `HVHM|` to `betascript_*` / `BETASCRIPT|`. **Export your settings file first** (Misc → Save File) and re-import after updating. Old and new builds do not see each other on the user radar.
- The game bundle in `GameSource/` is Krunker's property and is only pinned here so the loader can patch a known-good client.

## License

MIT — see [LICENSE](LICENSE).
