# Headshot source images

Full-resolution originals for the mentorship headshots, kept alongside the
avatars they were cropped from so there's one place to look.

The site serves the 400x400 square crops one directory up
(`public/images/mentorship/<first>-<last>.jpg`). Files in *this* directory are
not referenced by the site — they exist so a headshot can be re-cropped later
without going back to ask the person for their photo again.

Note: these are inside `public/`, so they are published with the build and
fetchable at `/images/mentorship/derived/<file>`. Keep that in mind before
adding a source image someone wouldn't want served whole.

## Re-cropping

Watch for source images padded to a square with blurred bars on the sides
(common with phone/LinkedIn exports) — those bars show up inside the circular
avatar. Crop to the real photo region first, then resize:

```sh
# inspect dimensions
sips -g pixelWidth -g pixelHeight public/images/mentorship/derived/<name>-headshot.jpeg

# crop the real photo region (offset is "y x"), then resize to 400x400
sips --cropOffset <y> <x> -c <side> <side> \
  public/images/mentorship/derived/<name>-headshot.jpeg --out /tmp/crop.jpg
sips -z 400 400 /tmp/crop.jpg --out public/images/mentorship/<first>-<last>.jpg
```

Then set `image: "/images/mentorship/<first>-<last>.jpg"` on that person's entry
in `ASSOCIATE_MENTORS` at the top of `app/mentorship/page.tsx`. Entries with no
`image` fall back to an initial-letter avatar, so it's safe to ship without one.

## Crops currently in use

| Person | Source | Treatment |
|---|---|---|
| Smriti Singh | 1200x1200 | Cropped out blurred side bars (930x930 @ x=135) |
| Sukriti Paul | 560x560 | Mild tighten (430x430 @ 75,45) |
| Anisha Gunjal | 423x423 | Tightened (280x280 @ 72,30); low-res source, softest of the set |
| Ankit Aich | 800x799 | Already framed; straight resize |
| Rakshit Naidu | 2048x1152 | Full-body travel photo; head/shoulders crop (635x635 @ 412,133) |
