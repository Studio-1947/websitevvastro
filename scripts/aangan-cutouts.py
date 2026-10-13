"""
Cut the people out of the Aangan courtyard photos.

On phones the Aangan logo sits on top of each card's photo. To keep it from
covering faces, the page lays a cutout of just the people over the logo, so the
logo appears to pass behind them (see src/components/aangan/Courtyard).

For each photo this writes cutouts/<same name>.webp beside it: the same picture
at the same proportions, transparent everywhere except the people. A photo
with no cutout simply shows the logo on top, as before.

Run after adding or replacing a courtyard photo:

    python3 -m venv .venv-cutouts && .venv-cutouts/bin/pip install "rembg[cpu]" pillow
    .venv-cutouts/bin/python scripts/aangan-cutouts.py

The first run downloads the segmentation model (about 170 MB) to ~/.rembg.
"""
import sys
from pathlib import Path

from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent / "public"
PHOTOS = [
    *sorted((ROOT / "assets/img/products/aangan").glob("story-0*.webp")),
    *sorted((ROOT / "images/aangan").glob("loop-0*.webp")),
    *sorted((ROOT / "images/aangan").glob("day-0*.webp")),
]
WIDTH = 900  # the photos show at most ~560px wide on the screens that use the cutout


def main() -> None:
    only = set(sys.argv[1:])
    session = new_session("u2net_human_seg")
    for photo in PHOTOS:
        if only and photo.stem not in only:
            continue
        img = Image.open(photo).convert("RGB")
        img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.LANCZOS)
        mask = remove(img, session=session, only_mask=True)
        # Pull the edge in a touch and soften it, so no halo of background rides along.
        mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
        img.putalpha(mask)
        out = photo.parent / "cutouts" / photo.name
        out.parent.mkdir(exist_ok=True)
        img.save(out, "WEBP", quality=80, method=6)
        print(f"{photo.stem}: {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
