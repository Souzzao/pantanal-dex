from bs4 import BeautifulSoup
from pathlib import Path

candidates = list(Path('/home/ubuntu/upload').glob('www.gov.br*livro-vermelho*'))
if not candidates:
    raise SystemExit('HTML oficial do Livro Vermelho não encontrado')
path = max(candidates, key=lambda item: item.stat().st_mtime)
soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
for anchor in soup.find_all('a', href=True):
    text = ' '.join(anchor.get_text(' ', strip=True).split())
    if 'Volume' in text or 'Peixes' in text or 'Livro Vermelho' in text:
        print(f'{text} => {anchor["href"]}')
