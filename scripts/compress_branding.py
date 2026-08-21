from PIL import Image
from pathlib import Path

root = Path('/home/ubuntu/pantanal-dex/assets/images')
for name in ['icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png']:
    path = root / name
    image = Image.open(path).convert('RGB')
    image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    image.save(path, format='JPEG', quality=82, optimize=True, progressive=True)
