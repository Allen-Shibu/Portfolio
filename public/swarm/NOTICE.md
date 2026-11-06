# Swarm animation bundle

`engine.css` is the published build artifact from [califa/swarm-site](https://github.com/califa/swarm-site), commit `486d72a278d70fc803f30fd56e760535736a6e85`. `engine.js` keeps the published scheduler, task behavior, cursor movement, guides, and rulers. Its entry point loads tasks from the existing portfolio DOM, mounts an overlay into `#swarm-root`, and keeps task positions synced as the original page scrolls.

The published repository contains no license or editable source. The user stated that they have permission from the author to reuse the bundle. Keep that permission record with this project before redistribution.

`portfolio-blueprint.js`, `portfolio-adapter.js`, and `portfolio.css` adapt the engine to the original page without changing its content or theme.
