import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const amphibians01: CatalogBatch = {
  batchId: "catalog-amphibians-01",
  cycle: 8,
  group: "Anfíbios",
  status: "pending-review",
  sources: [
    { title: "GBIF Species Match — Boana albopunctata", url: "https://api.gbif.org/v1/species/match?name=Boana%20albopunctata" },
    { title: "GBIF Species Match — Phyllomedusa sauvagii", url: "https://api.gbif.org/v1/species/match?name=Phyllomedusa%20sauvagii" },
  ],
  pendingNotes: ["Não preencher situação de conservação sem fonte oficial ICMBio/MMA confirmada.", "Confirmar ocorrência no recorte do Pantanal e revisar nomenclatura regional antes de promover o lote."],
  species: [
    {
      id: "perereca-do-banheiro", commonName: "Perereca", scientificName: "Boana albopunctata", group: "Anfíbios", environments: ["Áreas alagadas", "Bordas de mata"],
      description: "Perereca de hábitos arborícolas associada a ambientes úmidos e vegetação próxima a corpos d’água.",
      physicalCharacteristics: "Corpo compacto, discos adesivos nos dedos e coloração variável em tons amarelados e acastanhados.",
      habitat: "Brejos, margens de lagoas, vegetação ripária e áreas úmidas com abrigo vertical.",
      behavior: "Vocaliza principalmente durante períodos reprodutivos e utiliza a vegetação para repouso e deslocamento.",
      diet: "Pequenos artrópodes capturados durante o forrageamento noturno.",
      curiosities: ["Os discos adesivos auxiliam a subir em folhas e ramos.", "A reprodução depende da disponibilidade de água e microambientes úmidos."],
      distribution: "América do Sul, com registros em diferentes áreas do Brasil e países vizinhos.",
      ecologicalImportance: "Participa do controle de pequenos invertebrados e integra as cadeias alimentares de áreas úmidas.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/a/ae/Hypsiboas_albopunctatus01a.jpg", "Lucas Grandinetti", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Hypsiboas_albopunctatus01a.jpg", "Lucas Grandinetti / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/c/c8/Boana_albopunctata_-_Lucas_Mantelo_Cruz_-_353779982.jpeg", "Lucas Mantelo Cruz", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Boana_albopunctata_-_Lucas_Mantelo_Cruz_-_353779982.jpeg", "Lucas Mantelo Cruz / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/7/76/Boana_albopunctata_-_karla_daniel_de_faria_-_536102291.jpeg", "karla daniel de faria", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Boana_albopunctata_-_karla_daniel_de_faria_-_536102291.jpeg", "karla daniel de faria / Wikimedia Commons"),
      ],
      sources: [{ title: "GBIF Species Match — Boana albopunctata", url: "https://api.gbif.org/v1/species/match?name=Boana%20albopunctata" }],
    },
    {
      id: "perereca-macaco", commonName: "Perereca-macaco", scientificName: "Phyllomedusa sauvagii", group: "Anfíbios", environments: ["Matas", "Bordas de mata"],
      description: "Perereca arborícola de hábitos noturnos que ocupa ramos e folhas em ambientes tropicais sazonais.",
      physicalCharacteristics: "Corpo verde, olhos grandes, dedos com discos adesivos e adaptações para a vida sobre a vegetação.",
      habitat: "Matas, cerrados arborizados e bordas com arbustos e árvores adequados à vida arborícola.",
      behavior: "Permanece sobre a vegetação e reproduz-se em folhas dobradas sobre a água, onde os girinos completam o desenvolvimento.",
      diet: "Artrópodes e outros pequenos invertebrados capturados na vegetação.",
      curiosities: ["A postura em folhas dobradas reduz a exposição direta dos ovos.", "A pele cerosa ajuda a reduzir a perda de água em ambientes sazonais."],
      distribution: "Regiões secas e sazonais do centro da América do Sul, incluindo áreas do Brasil, Bolívia, Paraguai e Argentina.",
      ecologicalImportance: "Controla pequenos invertebrados e transfere energia entre a vegetação e os predadores noturnos.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/b/be/Phyllomedusa_sauvagii_-_Zoo_Frankfurt.jpg", "Jutta234", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Phyllomedusa_sauvagii_-_Zoo_Frankfurt.jpg", "Jutta234 / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/9/95/WaxingMonekyFrog_PhyllomedusaSauvagii.jpg", "Ltshears", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:WaxingMonekyFrog_PhyllomedusaSauvagii.jpg", "Ltshears / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/b/b0/Waxy_Monkey_Frog_%28Phyllomedusa_sauvagii%29_%282864604026%29.jpg", "Cliff from Arlington, Virginia, USA", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Waxy_Monkey_Frog_(Phyllomedusa_sauvagii)_(2864604026).jpg", "Cliff from Arlington, Virginia, USA / Wikimedia Commons"),
      ],
      sources: [{ title: "GBIF Species Match — Phyllomedusa sauvagii", url: "https://api.gbif.org/v1/species/match?name=Phyllomedusa%20sauvagii" }],
    },
  ],
};
