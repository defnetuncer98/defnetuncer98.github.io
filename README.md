# defnetuncer98.github.io 🖥️☕✨

My personal portfolio, in two generations — both built with [Three.js](https://threejs.org/), by two very different kinds of author:

| | | |
|---|---|---|
| **v2** (current) | [defnetuncer98.github.io](https://defnetuncer98.github.io/) | 🤖 designed & built by **AI** (Claude), art-directed by the Moth Village from *A Cube Story* |
| **v1** (2020) | [defnetuncer98.github.io/v1.html](https://defnetuncer98.github.io/v1.html) | 🧑‍🎨 **handmade by a human** — every model placement, bloom pass, and raycast tuned by hand |

---

## v2 — The Moth Village 🌙

A single-page portfolio whose hero is a live three.js scene inspired by the Moth Village
render from [A Cube Story](https://github.com/BlueVariable/ACubeStory): a dark voxel
amphitheater, a self-luminous cube, drifting fireflies and moths, amber window lights.
The camera follows the mouse, and clicking the world sends a ripple through the pillars.

Below the fold: A Cube Story (in development) with its trailer and in-engine captures,
shipped titles (Color Bus Trip, Knit N Loop, Mayor Match…), the
[Blue Variable](https://bluevariable.github.io/) corner, an open-source lab, and the
full experience timeline.

### Structure

```
.
├── index.html            # The whole v2 site — HTML, CSS and JS in one file
├── lib/three.module.js   # Three.js r160, vendored (works offline)
├── assets/               # Curated media, all original A Cube Story work
├── serve.mjs             # Dependency-free dev server with HTTP Range support
├── view.cmd              # Windows: double-click to serve + open the site
└── v1.html               # The 2020 portfolio (uses build/ and src/ below)
```

### Running locally

```bash
node serve.mjs 8123   # or double-click view.cmd on Windows
```

Then open [http://localhost:8123](http://localhost:8123). A server is required —
browsers block ES-module imports from `file://` — and it must support **HTTP Range
requests** or the videos will never load (`python -m http.server` does not; `serve.mjs` does).

> ⚠️ `assets/trailer.mp4` is 89 MB. It streams fine, but compressing it (or swapping
> the modal for a YouTube embed) would speed up the trailer on slow connections.

---

## v1 — The Desk 🦖

Not a webpage with sections and scrollbars, but a fully **interactive 3D workspace**
rendered in the browser. Everything on the desk is clickable: flip through my projects,
play some music, grab my resume.

> 🦖 **Fun fact:** Hand-crafted in 2020, before AI coding assistants existed — which is
> exactly why it stays online next to its AI-built successor. 🙂

### What's on the Desk

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

### Under the Hood

| Technique | How it's used |
|-----------|---------------|
| **glTF/GLB models** | Table, workspace, hologram, jet, coffee mug loaded with `GLTFLoader` |
| **HDR environment lighting** | `RGBELoader` + an equirectangular `.hdr` map for realistic reflections |
| **Selective bloom** | `EffectComposer` with `UnrealBloomPass` on a dedicated bloom layer — non-bloomed objects are darkened and restored each frame |
| **Raycasting** | `THREE.Raycaster` turns 3D meshes into buttons for navigation and external links |
| **Video textures** | Project demos are `<video>` elements streamed onto in-scene planes |
| **3D typography** | Multiple JSON fonts (including custom icon fonts) rendered as text geometry |

v1's engine lives in `app.js` (~1600 lines) with its assets under `src/` and
`build/three.module.js` — untouched, exactly as shipped in 2020.

---

## Author

**Defne Tunçer** — [Resume](https://defnetuncer98.github.io/src/docs/DEFNE%20TUNCER.pdf) · [GitHub](https://github.com/defnetuncer98) · [Blue Variable](https://github.com/BlueVariable) · [LinkedIn](https://linkedin.com/in/defnetuncer98) · [ArtStation](https://www.artstation.com/defnetuncer98) · [Medium](https://medium.com/@defnetuncer)
