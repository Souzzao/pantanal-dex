import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });
const gbif = (name: string) => ({ title: `GBIF Species Match — ${name}`, url: `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}` });

export const invertebrates03: CatalogBatch = {
  batchId: "catalog-invertebrates-03",
  cycle: 13,
  group: "Invertebrados",
  status: "pending-review",
  sources: [gbif("Paraponera clavata"), gbif("Atta sexdens")],
  pendingNotes: ["Confirmar ocorrência no recorte do Pantanal e eventual conservação em fonte ICMBio/MMA; as imagens documentam a espécie, mas não provam ocorrência regional."],
  species: [
    {
      id: "paraponera-clavata",
      commonName: "Formiga-bala",
      scientificName: "Paraponera clavata",
      group: "Invertebrados",
      environments: ["Matas", "Bordas de mata"],
      description: "Formiga de grande porte que vive em colônias associadas ao solo e à vegetação de florestas tropicais.",
      physicalCharacteristics: "Corpo robusto, coloração escura e mandíbulas desenvolvidas, com pernas e antenas longas.",
      habitat: "Solo de matas tropicais, especialmente locais com serapilheira e raízes onde a colônia pode se estabelecer.",
      behavior: "Forrageia individualmente ou em trilhas curtas e defende a colônia quando perturbada.",
      diet: "Néctar, pequenos artrópodes e outros recursos orgânicos encontrados na vegetação e no solo.",
      curiosities: ["O nome popular está associado à dor intensa de sua ferroada.", "A espécie é social e organiza tarefas entre indivíduos da colônia."],
      distribution: "Regiões tropicais da América Central e do norte da América do Sul.",
      ecologicalImportance: "Move matéria orgânica no solo e participa das cadeias alimentares de florestas tropicais.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/d/d6/Paraponera_clavata_MHNT.jpg", "Didier Descouens", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Paraponera_clavata_MHNT.jpg", "Didier Descouens / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/c/cb/Paraponera_clavata.jpg", "Hans Hillewaert", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Paraponera_clavata.jpg", "Hans Hillewaert / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/5/58/Bullet_Ant_%28Paraponera_clavata%29_-_Hormiguero_Campeche.jpg", "Bernard DUPONT", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Bullet_Ant_(Paraponera_clavata)_-_Hormiguero_Campeche.jpg", "Bernard DUPONT / Wikimedia Commons"),
      ],
      sources: [gbif("Paraponera clavata")],
    },
    {
      id: "atta-sexdens",
      commonName: "Saúva-limão",
      scientificName: "Atta sexdens",
      group: "Invertebrados",
      environments: ["Campos", "Matas", "Bordas de mata"],
      description: "Formiga-cortadeira que coleta fragmentos vegetais para cultivar o fungo usado como alimento pela colônia.",
      physicalCharacteristics: "Formigas de coloração avermelhada, com castas de tamanhos diferentes e mandíbulas adaptadas ao corte de folhas.",
      habitat: "Solo de campos, bordas e matas onde existam plantas forrageiras e espaço para ninhos subterrâneos.",
      behavior: "Organiza trilhas de forrageamento e transporta fragmentos vegetais para câmaras internas do ninho.",
      diet: "Fungo cultivado dentro da colônia a partir do material vegetal coletado.",
      curiosities: ["As folhas coletadas não são consumidas diretamente pela maioria das operárias.", "A colônia possui divisão de trabalho entre castas com diferentes funções."],
      distribution: "América do Sul, incluindo o Brasil e diferentes formações vegetais tropicais.",
      ecologicalImportance: "Fragmenta folhas, modifica o solo e influencia a ciclagem de nutrientes e a composição da vegetação.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/a/a4/Atta.sexdens.jpg", "Sarefo", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Atta.sexdens.jpg", "Sarefo / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/d/dd/Atta_sexdens_casent0178706_dorsal_1.jpg", "April Nobile", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Atta_sexdens_casent0178706_dorsal_1.jpg", "April Nobile / AntWeb / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/a/ad/Atta_sexdens_au_travail.jpg", "Dinkum", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Atta_sexdens_au_travail.jpg", "Dinkum / Wikimedia Commons"),
      ],
      sources: [gbif("Atta sexdens")],
    },
  ],
};
