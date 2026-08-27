import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const birds07: CatalogBatch = {
  batchId: "catalog-birds-07",
  cycle: 3,
  group: "Aves",
  status: "review-ready",
  sources: [
    { title: "GBIF Species Match — Ramphastos toco", url: "https://api.gbif.org/v1/species/match?name=Ramphastos%20toco" },
    { title: "PubMed — abundância e frugivoria no Pantanal Sul", url: "https://pubmed.ncbi.nlm.nih.gov/16680316/" },
  ],
  pendingNotes: [
    "A espécie possui restrição comercial CITES II no GBIF; isso não é categoria nacional de ameaça e não substitui a revisão normativa de conservação.",
    "Imagens de cativeiro ou de outras localidades são recursos visuais e de crédito, não prova de ocorrência no Pantanal.",
  ],
  species: [{
    id: "tucano-toco", commonName: "Tucano-toco", scientificName: "Ramphastos toco", group: "Aves", environments: ["Matas", "Bordas de mata"],
    description: "Tucano de grande porte e bico marcante, associado a florestas de galeria, bordas de mata e paisagens semiabertas do Pantanal.",
    physicalCharacteristics: "Plumagem predominantemente preta, garganta branca, peito amarelo, área vermelha sob a cauda e bico grande alaranjado com ponta escura.",
    habitat: "Florestas de galeria, capões, bordas de mata e mosaicos semiabertos com árvores frutíferas no Pantanal.",
    behavior: "Desloca-se durante o dia entre árvores e áreas abertas, pode ocorrer em pares ou pequenos grupos e forrageia principalmente no dossel.",
    diet: "Frutos carnosos, sementes e, complementarmente, pequenos animais; a disponibilidade de frutos influencia sua presença em florestas de galeria.",
    curiosities: ["É o maior representante da família Ramphastidae.", "O estudo no Pantanal Sul relacionou sua abundância à disponibilidade sazonal de frutos, especialmente de jenipapo e figueiras."],
    distribution: "Ocorre em grande parte da América do Sul, incluindo o Brasil central e o Pantanal; estudo primário documenta a espécie na sub-região de Miranda, no Pantanal Sul.",
    ecologicalImportance: "Atua como frugívoro de dossel e participa do transporte e da deposição de sementes em florestas de galeria e mosaicos campestres.",
    images: [
      image("https://commons.wikimedia.org/wiki/Special:FilePath/Ramphastos%20toco%20-Birdworld%2C%20Farnham%2C%20Surrey%2C%20England-8a.jpg", "Chris Parfitt", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Ramphastos_toco_-Birdworld,_Farnham,_Surrey,_England-8a.jpg", "Chris Parfitt / Wikimedia Commons"),
      image("https://commons.wikimedia.org/wiki/Special:FilePath/Tucano%C3%A7u%20-%20Ramphastos%20toco%2006.jpg", "Germano Roberto Schüür", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Tucano%C3%A7u_-_Ramphastos_toco_06.jpg", "Germano Roberto Schüür / Wikimedia Commons"),
      image("https://commons.wikimedia.org/wiki/Special:FilePath/Toco%20toucan%20%28Ramphastos%20toco%29.jpg", "gipe25", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Toco_toucan_(Ramphastos_toco).jpg", "gipe25 / Wikimedia Commons"),
    ],
    sources: [
      { title: "GBIF Species Match — Ramphastos toco", url: "https://api.gbif.org/v1/species/match?name=Ramphastos%20toco" },
      { title: "PubMed — abundância e frugivoria no Pantanal Sul", url: "https://pubmed.ncbi.nlm.nih.gov/16680316/" },
    ],
  }],
};
