# /scripts — maintenance utilities

Run from project root.

## measure-images.mjs

Reads every image referenced in `data/image_plan.json` from `public/assets/...`
and writes its intrinsic `width` / `height` back into the plan. Run after
adding new artwork files so `<Image>` gets correct intrinsic dimensions
(prevents distortion / cropping).

```bash
node scripts/measure-images.mjs
```

Idempotent — entries that already have `width`/`height` are skipped.
