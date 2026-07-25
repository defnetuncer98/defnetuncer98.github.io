# Defne Tunçer — Portfolio

A single-page portfolio with an interactive three.js hero inspired by the
A Cube Story "Moth Village" render. Dark voxel amphitheater, glowing cube,
fireflies, mouse parallax — click anywhere in the hero to send a ripple
through the pillars.

## View locally

Double-click **`view.cmd`** (starts a tiny local server and opens the page), or:

```
node serve.mjs 8123
# then open http://localhost:8123/
```

A server is required — browsers block ES-module imports and video streaming
from `file://` URLs. `serve.mjs` is dependency-free and supports HTTP Range
requests (needed for the videos).

## Structure

```
index.html      the whole site (HTML + CSS + JS in one file)
lib/three.module.js   three.js r160, vendored so the page works offline
assets/         curated media (all Defne's own work — see below)
serve.mjs       dev server with Range support
view.cmd        double-click launcher
```

## Assets (sources)

| File | Copied from |
|---|---|
| mothvillage.png | Renders/mothvillage_v16.png |
| a_cube_story.gif | stuff/a_cube_story.gif |
| trailer.mp4 (89 MB) | ACubeStory-Trailer.mp4 |
| acs_village.mp4 | ACubeStoryRecordings/Village_01.mp4 |
| acs_final.mp4 | ACubeStoryRecordings/final.mp4 |
| acs_before.mp4 / acs_after.mp4 | ACubeStoryRecordings/before.mp4 / after.mp4 |
| acs_devlog.mp4 | stuff/Video Project 3.mp4 |

The hash-named GIF/JPG files in `Renders/` were deliberately **not** used —
they appear to be downloaded reference/inspiration images, not original work.

## Deploying (e.g. GitHub Pages)

Push this folder as-is — no build step. Two notes:

- `trailer.mp4` is 89 MB (GitHub's hard limit is 100 MB per file). It works,
  but consider compressing it with ffmpeg (`ffmpeg -i trailer.mp4 -crf 26
  -preset slow -vf scale=1280:-2 trailer_web.mp4` → ~10–15 MB) or hosting the
  trailer on YouTube and swapping the modal for an embed.
- `mothvillage.png` (7.9 MB) and the 4K clips could also be downscaled for
  faster first paint on slow connections.

## Content to review

Copy was written from the resume, LinkedIn and GitHub profiles. Worth a
personal pass: the A Cube Story blurb ("follows a small glowing cube through
a sleeping world") is an editorial guess at the game's story, and role labels
on the shipped-title cards ("lead developer" / "core developer") are inferred
from the resume bullets.
