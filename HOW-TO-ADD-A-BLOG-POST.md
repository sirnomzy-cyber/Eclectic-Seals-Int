# How To Add A New Blog Post

Your blog page doesn't need a developer to update. Every post on the page is
read from one file: `data/blog-posts.json`. To publish a new update, you edit
that file and push it to GitHub — no HTML or CSS to touch.

## The short version

1. Open `data/blog-posts.json` (on GitHub, or in GitHub Desktop).
2. Copy one of the existing post blocks (the bit between `{` and `}`).
3. Paste it at the top of the list, just after the opening `[`.
4. Change the text and image paths.
5. Save, commit, and push. The new post appears on the live site automatically.

## What a post looks like

```json
{
  "id": "unique-id-for-this-post",
  "date": "2026-08-01",
  "category": "Completed Project",
  "title": "Your Post Title Here",
  "excerpt": "A one-line summary (not shown on the page yet, but keep it filled in).",
  "body": "The full update text. This is what visitors will read.",
  "media": [
    { "type": "image", "src": "images/blog/your-photo.jpg" }
  ]
}
```

**Rules that matter:**
- Every post needs a comma after its closing `}` — except the very last post in the list.
- `id` just needs to be unique — lowercase words separated by dashes is safest (e.g. `"new-showroom-opening"`).
- `date` must be in `YYYY-MM-DD` format. Posts are shown newest first automatically.
- `category` can be anything you want (e.g. "Site Update", "Completed Project", "New Service",
  "Behind The Scenes", "Team"). A filter button is created automatically for every category in use.

## Adding photos

1. Add your image file(s) to the `images/blog/` folder in the repo (create that folder if it
   doesn't exist yet).
2. Reference it in the post like this:
   ```json
   "media": [
     { "type": "image", "src": "images/blog/my-photo-1.jpg" },
     { "type": "image", "src": "images/blog/my-photo-2.jpg" }
   ]
   ```
3. You can add as many images as you like to one post. Visitors can click any image to open
   the full-screen gallery and browse them all.

Keep photos reasonably sized before uploading (under ~1–2MB each is plenty for web use) so the
site stays fast.

## Adding a video

**Option A — YouTube (recommended):** upload the video to YouTube (can be "Unlisted" if you
don't want it publicly searchable), then use the video's ID — that's the part of the URL after
`watch?v=`.

```json
"media": [
  { "type": "youtube", "id": "dQw4w9WgXcQ" }
]
```

**Option B — a short self-hosted clip:** add a small `.mp4` file to `images/blog/` and reference
it like this. Keep these very short (a few seconds to a minute) — video files are much larger
than photos and will slow down GitHub uploads and the site itself if they're long or high-resolution.

```json
"media": [
  { "type": "video", "src": "images/blog/short-clip.mp4" }
]
```

You can mix images and videos in the same post — just list them in the order you want them shown.

## Removing or editing a post

Find its block in the JSON file, edit the text directly, or delete the whole `{ ... }` block
(remembering to fix up the commas around it) and push the change.

## If something looks broken after you publish

The most common cause is a small JSON typo — a missing comma or quote mark. Before pushing, you
can paste the whole file into an online JSON validator (search "JSON validator") to check it's
valid. If the page shows "Updates could not be loaded right now," that's the site telling you the
JSON file has a syntax error.
