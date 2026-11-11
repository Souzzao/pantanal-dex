/**
 * Endereço de uma foto do Wikimedia Commons num tamanho leve para celular.
 * O Commons limita miniaturas a larguras padronizadas (120, 250, 330, 500, 960...); pedir o arquivo
 * original (vários MB) ou uma largura fora do padrão faz a foto demorar ou falhar.
 */
export function commonsThumb(uri: string, width: 120 | 250 | 330 | 500 | 960 = 500): string {
  const direct = /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)$/i.exec(uri);
  if (direct) return `https://commons.wikimedia.org/wiki/Special:FilePath/${direct[1]}?width=${width}`;
  const special = /^(https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^?#]+)(?:\?.*)?$/i.exec(uri);
  if (special) return `${special[1]}?width=${width}`;
  return uri;
}
