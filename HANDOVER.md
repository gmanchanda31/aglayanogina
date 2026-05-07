# Handover for Aglaya

A short guide to editing your website at **aglayanogina.art**.

---

## How to log in

Open **https://aglayanogina.sanity.studio** on your phone or computer and
sign in with your Google account.

**Add to home screen on iPhone:**
1. Tap the share icon in Safari
2. Tap "Add to Home Screen"
3. Name it "Studio"

It now opens like a native app.

---

## What you'll see

The studio has two sections at the top, then five lists below:

- **Homepage** — what's featured on the front page (featured project, four
  selected works, two journal essays, the optional italic line and tagline).
  This is a single document; you edit, you don't add new ones.
- **Artist · Bio + CV** — your bio, intro paragraph, body paragraphs,
  Education, Publications, Solo Exhibitions, Selected Exhibitions, contact
  details, studio portrait. Also a single document.

Then:

- **Projects** (8) — your bodies of work
- **Exhibitions** (9) — your shows
- **Illustration series** (5)
- **Photograph archives** (4)
- **Writings** (11) — your essays

---

## How to make any edit

1. Click the section in the left sidebar
2. Click the document you want to edit
3. Make the change
4. Click **Publish** (bottom right)

Within ~60 seconds, your change is live at aglayanogina.art.

---

## Adding a new project / exhibition / illustration

1. Click the section (e.g. **Projects**)
2. Click **+ Create**
3. Fill in:
   - **Title** (e.g. "Lost Beauty")
   - **URL slug** auto-generates from the title — leave it
   - **Year** (e.g. 2024 or 2023 — 2025)
   - **Medium** (e.g. "Paper, textile, ink, xerography")
   - **Hero image** — tap to upload from your camera roll
   - **Description** — first paragraph becomes the italic stand-first on
     the page. Add more paragraphs as you like.
   - **Gallery** — tap **+ Add** to add more images. Drag to reorder.
4. **Publish**

---

## Adding a new writing

1. Click **Writings** → **+ Create**
2. Title + slug
3. **Excerpt** — one or two sentences shown on the writings index
4. **Body** — your essay. Format options:
   - The first letter of the first paragraph automatically becomes a
     drop cap on the website.
   - For a **pull quote** in the middle of the essay: in the body editor,
     click the small "+" button → choose **Pull quote**. Type the line.
   - **Italic** / **Bold** / **link** — toolbar above the body field.
5. **Publish**

---

## Adding photographs to an existing archive

1. Click **Photograph archives** → pick the archive (Colour, B&W, Turkey,
   India)
2. Scroll to **Photographs**
3. Click **+ Add** to upload more from your camera roll
4. Drag photos to reorder
5. **Publish**

---

## Choosing what's featured on the homepage

Click **Homepage** in the sidebar. You can change:

- The italic line under your name (leave empty if you don't want one)
- The tagline below it (same)
- **Featured project (Currently on view)** — pick one. This becomes the
  big cinematic banner on the home.
- **Featured project teaser** — an italic one-liner that sits beside the
  featured title (optional).
- **Featured project — exhibition line** — e.g. "KUT Gallery, Kyiv ·
  October 2025".
- **Selected works** — pick 2 to 8 projects. Four works at the canonical
  asymmetric grid layout.
- **Journal pair** — pick exactly two essays for the homepage. Optionally
  override their teasers; otherwise the first sentence is used.

**Publish** when you're done.

---

## A few tips

- **Drafts**: Sanity auto-saves as you type. You can leave any document
  unpublished — only when you click **Publish** does it go live. If you
  start something and aren't ready, just close the tab.
- **Image upload**: works from camera roll, drag-and-drop on desktop, or
  the camera if you're in mobile Safari.
- **Image focal point**: after upload, click the image and tap the spot
  you want centered when it's cropped to a square thumbnail. Useful for
  portraits.
- **Reordering**: hold the drag handle (the dots on the left) and drag
  to reorder lists of items (gallery photos, selected works, etc.).
- **Markdown / HTML**: the body editor doesn't take markdown. Use the
  toolbar buttons.
- **Mistakes**: every document has a version history. Open a document,
  click the clock icon top-right, see all past versions, restore any.

---

## What's where on the website

| Studio section | Live URL |
|---|---|
| Homepage | https://aglayanogina.art/ |
| Artist | https://aglayanogina.art/about |
| Projects | https://aglayanogina.art/projects |
|   each project | https://aglayanogina.art/projects/&lt;slug&gt; |
| Exhibitions | https://aglayanogina.art/exhibitions |
|   each show | https://aglayanogina.art/exhibitions/&lt;slug&gt; |
| Illustration series | https://aglayanogina.art/illustrations |
| Photograph archives | https://aglayanogina.art/photographs |
| Writings | https://aglayanogina.art/writings |
|   each essay | https://aglayanogina.art/writings/&lt;slug&gt; |

---

## If something looks wrong

If a published change isn't showing up after a couple of minutes, tell
Gourav — there's a build log on Vercel that shows what happened.

If the studio won't let you log in, you've probably been signed out. Try
logging in again with the same Google account.

If you accidentally delete something, open Sanity → click the document
type that contained it → look for a **Trash** view (deleted docs can be
restored within a window).

---

## When you publish, behind the scenes

1. Sanity saves your change
2. Sanity tells Vercel to rebuild the website
3. Vercel rebuilds (~60 seconds)
4. The new version goes live at aglayanogina.art
5. Anyone refreshing the site sees the new content

You don't need to think about any of this — just **Publish**.
