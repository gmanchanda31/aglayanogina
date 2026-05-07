# /studio — Sanity Studio for Aglaya Nogina

The admin UI Aglaya uses to edit her site. Independent from the Next.js app
in `/`. Hosted at **`studio.aglayanogina.art`** (or `<projectName>.sanity.studio`
during development).

## Once-only setup

These steps run when the Sanity project is first created.

### 1. Create the Sanity project (in a browser)

1. Go to <https://www.sanity.io/manage> and sign in with Google.
2. Create a new project named **Aglaya Nogina**.
3. Region: **`eu-central-1` (Frankfurt)** for EU latency.
4. Dataset: **`production`** (default).
5. Plan: free / Growth Trial (good for 1 editor + 10k docs).
6. Settings → API → Tokens → **Add API token**:
   - Name: `migration-script`
   - Permissions: **Editor**
   - Copy the token (starts with `sk...`). Sanity won't show it again.

### 2. Wire credentials

```bash
cd studio
cp .env.example .env
# Edit .env with your projectId
```

`SANITY_WRITE_TOKEN` (the editor token from step 1.6) lives at the **repo
root** `.env.local` because the migration script runs from there.

### 3. Install + start the studio locally

```bash
cd studio
pnpm install
pnpm dev          # starts on http://localhost:3333
```

Sign in with the same Google account you used to create the project.

### 4. Deploy the studio to a public URL

```bash
pnpm sanity deploy
# Pick a hostname when prompted, e.g. "aglayanogina"
# → Studio lives at https://aglayanogina.sanity.studio
```

We can later point `studio.aglayanogina.art` at this via DNS CNAME.

### 5. Invite Aglaya

Once content is migrated and the studio works:

1. Sanity → Project → Members → Invite
2. Email: `aglaya.nn.art@gmail.com`
3. Role: **Editor**
4. (Later) Settings → Members → transfer ownership to her account.

## Day-to-day

```bash
pnpm dev          # local studio
pnpm build        # build for deploy
pnpm deploy       # publish to *.sanity.studio
pnpm typecheck    # run TS checks
```

## Schema overview

| Type | Singleton? | Drives |
|---|---|---|
| `artist` | yes | `/about` — bio, intro paragraphs, CV (Education / Publications / Solo / Selected exhibitions), contact, portrait |
| `homePicks` | yes | `/` — hero italic line, tagline, featured project, selected works, journal pair |
| `project` | no (many) | `/projects` index + `/projects/[slug]` detail |
| `exhibition` | no (many) | `/exhibitions` index + `/exhibitions/[slug]` detail |
| `illustration` | no (many) | `/illustrations` index + `/illustrations/[slug]` detail |
| `photographSet` | no (many) | `/photographs` index + `/photographs/[slug]` detail |
| `writing` | no (many) | `/writings` index + `/writings/[slug]` detail (literary layout, drop caps, pull quotes) |

Reusable objects live in `schemas/objects/`:
- `imageWithAlt` — every artwork image; required alt text + optional caption
- `cvRow` — one row of a CV section
- `portableText` — rich text block: paragraphs, headings, lists, links, drop-cap mark, inline pull-quote block

## Conventions

- **Slugs** auto-generate from titles. Lowercase, hyphens, no diacritics.
- **First paragraph** of a project / exhibition description renders as the
  italic stand-first on the page. Subsequent paragraphs are body.
- **Pull quotes** in `portableText` render as oversized italic blocks with
  optional attribution.
- **Featured project** in homePicks should be the most current — typically
  the one with an active exhibition.

## Publish flow

1. Aglaya edits in studio (mobile or desktop).
2. Hits **Publish**.
3. Sanity → webhook → Vercel deploy hook → site rebuilds in ~60s.
4. Live at <https://aglayanogina.art>.

The webhook is configured in **Phase 4** of the admin rollout.
