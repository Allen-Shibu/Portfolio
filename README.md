# Allen Shibu Portfolio

The home page is Allen's React portfolio with its full sticky, horizontal, reveal, gallery, and closing scroll choreography. The published [Swarm animation engine](https://github.com/califa/swarm-site) runs as a cursor, ruler, guide, and selection overlay on the page's real elements.

`public/swarm/portfolio-blueprint.js` maps existing DOM elements into engine tasks; `portfolio-adapter.js` keeps task geometry aligned while scrolling. See `public/swarm/NOTICE.md` for provenance.

```bash
npm install
npm run dev
```

Run `npm run build` and `npm test` before deployment.
