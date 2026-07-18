# defnetuncer98.github.io 🖥️☕✨

My personal portfolio — not a webpage with sections and scrollbars, but a fully **interactive 3D workspace** rendered in the browser with [Three.js](https://threejs.org/). Everything on the desk is clickable: flip through my projects, play some music, grab my resume.

**▶ Visit:** [defnetuncer98.github.io](https://defnetuncer98.github.io/)

> 🦖 **Fun fact:** Hand-crafted in 2020, before AI coding assistants existed — every model placement, bloom pass, and raycast tuned by an actual human. 🙂

## What's on the Desk

- 🌀 **Animated hologram** — a glTF character animated with `THREE.AnimationMixer`, glowing via selective bloom
- 📓 **Project notebook** — flip through pages of my projects, each playing a live video demo on a `VideoTexture`:
  - [smellycat](https://github.com/defnetuncer98/smellycat) — a game (playable [here](https://defnetuncer98.github.io/smellycat/))
  - [Tomayto-Tomahto](https://github.com/Tomayto-Tomahto/demo)
  - [rock-or-not](https://github.com/HUbbm409/rock-or-not)
  - [vizGoogleFit](https://github.com/defnetuncer98/vizGoogleFit) — try it [live](https://defnetuncer98.github.io/vizGoogleFit)
  - [mall-e](https://github.com/HacettepeUniversityBBM384/mall-e)
  - Echost — [teaser on YouTube](https://www.youtube.com/watch?v=B2-HE7WCahc)
- 🎵 **Music player** — an in-scene player with 3D text UI, play/pause and track skipping (Josh Lippi & The Overtimers)
- ☕ **Coffee mug** — essential equipment
- 🔗 **Clickable links** — GitHub, LinkedIn, ArtStation, Medium, mail, and my resume (PDF), all opened by clicking 3D objects in the scene

## Under the Hood

| Technique | How it's used |
|-----------|---------------|
| **glTF/GLB models** | Table, workspace, hologram, jet, coffee mug loaded with `GLTFLoader` |
| **HDR environment lighting** | `RGBELoader` + an equirectangular `.hdr` map for realistic reflections |
| **Selective bloom** | `EffectComposer` with `UnrealBloomPass` on a dedicated bloom layer — non-bloomed objects are darkened and restored each frame |
| **Raycasting** | `THREE.Raycaster` turns 3D meshes into buttons for navigation and external links |
| **Video textures** | Project demos are `<video>` elements streamed onto in-scene planes |
| **3D typography** | Multiple JSON fonts (including custom icon fonts) rendered as text geometry |

## Running Locally

No build tools needed — it's an ES-module app with Three.js included in the repo.

```bash
git clone https://github.com/defnetuncer98/defnetuncer98.github.io.git
cd defnetuncer98.github.io

# Any static server works (ES modules won't load from file://)
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Project Structure

```
.
├── index.html              # Entry point, hidden link buttons & loading screen
├── app.js                  # The whole 3D experience (~1600 lines)
├── build/three.module.js   # Three.js
└── src/
    ├── models/             # glTF/GLB assets (workspace, hologram, jet, coffee...)
    ├── videos/             # Project demo clips used as textures
    ├── fonts/              # JSON fonts for 3D text & icons
    ├── sounds/             # Music player tracks
    ├── images/             # Background, HDR environment map
    ├── docs/               # Resume PDF
    └── jsm/                # Three.js addons (loaders, postprocessing)
```

## Author

**Defne Tunçer** — [Resume](https://defnetuncer98.github.io/src/docs/DEFNE%20TUNCER.pdf) · [GitHub](https://github.com/defnetuncer98) · [LinkedIn](https://linkedin.com/in/defnetuncer98) · [ArtStation](https://www.artstation.com/defnetuncer98) · [Medium](https://medium.com/@defnetuncer)
