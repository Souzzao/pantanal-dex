import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });
const gbif = (name: string) => ({ title: `GBIF Species Match — ${name}`, url: `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}` });

export const invertebrates04: CatalogBatch = {
  batchId: "catalog-invertebrates-04",
  cycle: 14,
  group: "Invertebrados",
  status: "pending-review",
  sources: [gbif("Caligo eurilochus"), gbif("Danaus gilippus")],
  pendingNotes: ["Confirmar ocorrência no recorte do Pantanal e eventual conservação em fonte ICMBio/MMA; imagens licenciadas não provam ocorrência regional."],
  species: [
    {
      id: "caligo-eurilochus",
      commonName: "Borboleta-coruja",
      scientificName: "Caligo eurilochus",
      group: "Invertebrados",
      environments: ["Matas", "Bordas de mata"],
      description: "Borboleta de grande porte associada a áreas florestais, reconhecida pelos desenhos que lembram olhos na face inferior das asas.",
      physicalCharacteristics: "Asas largas com coloração predominantemente parda e manchas ocelares na face inferior.",
      habitat: "Matas úmidas, bordas e clareiras com plantas hospedeiras e abrigo para adultos.",
      behavior: "Voa principalmente em trechos sombreados e pousa com as asas fechadas sobre troncos ou folhas.",
      diet: "As larvas utilizam plantas hospedeiras; adultos exploram frutos fermentados e outros líquidos disponíveis.",
      curiosities: ["Os ocelos podem confundir predadores ao simular olhos de um animal maior.", "A face inferior das asas favorece a camuflagem quando a borboleta permanece pousada."],
      distribution: "Regiões tropicais da América do Sul, com registros em diferentes áreas do Brasil.",
      ecologicalImportance: "Participa da polinização ocasional e serve de recurso alimentar para predadores durante diferentes fases do ciclo de vida.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/f/f7/Caligo_eurilochus_%28Pieter_Cramer%2C_1775%29.jpg", "Michael Gäbler", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Caligo_eurilochus_(Pieter_Cramer,_1775).jpg", "Michael Gäbler / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/6/6a/Caligo_eurilochus%2C_Gew%C3%B6hnlicher_Bananenfalter.JPG", "Feel free to use my photos, but please mention me as the author", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Caligo_eurilochus,_Gewöhnlicher_Bananenfalter.JPG", "Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/2/25/Caligo_eurilochus_2.jpg", "Pro2", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Caligo_eurilochus_2.jpg", "Pro2 / Wikimedia Commons"),
      ],
      sources: [gbif("Caligo eurilochus")],
    },
    {
      id: "danaus-gilippus",
      commonName: "Rainha",
      scientificName: "Danaus gilippus",
      group: "Invertebrados",
      environments: ["Campos", "Bordas de mata"],
      description: "Borboleta danaínea de voo diurno que utiliza áreas abertas e bordas com plantas hospedeiras para completar seu ciclo.",
      physicalCharacteristics: "Asas alaranjadas e castanhas com nervuras e margens escuras, variando entre formas regionais.",
      habitat: "Campos, clareiras, bordas de mata e jardins com plantas nectaríferas e hospedeiras.",
      behavior: "Voa durante o dia e visita flores, alternando períodos de deslocamento com pousos em folhas e ramos.",
      diet: "Adultos consomem néctar; lagartas alimentam-se de plantas hospedeiras do grupo das asclepiadáceas.",
      curiosities: ["A coloração de advertência pode sinalizar compostos desagradáveis a predadores.", "O gênero apresenta padrões de voo e coloração associados a estratégias de mimetismo."],
      distribution: "Américas, incluindo regiões tropicais e subtropicais da América do Sul.",
      ecologicalImportance: "Contribui para a polinização e integra as cadeias alimentares de campos e bordas florestais.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/8/82/Danaus_gilippus-03_%28xndr%29.jpg", "Svdmolen", "CC BY 2.5", "https://commons.wikimedia.org/wiki/File:Danaus_gilippus-03_(xndr).jpg", "Svdmolen / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/4/47/Danaus_gilippus_thersippus.jpg", "Francisco Farriols Sarabia", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Danaus_gilippus_thersippus.jpg", "Francisco Farriols Sarabia / iNaturalist / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/d/d2/Danaus_gilippus_156589495.jpg", "Eli Diego Moreno", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Danaus_gilippus_156589495.jpg", "Eli Diego Moreno / iNaturalist / Wikimedia Commons"),
      ],
      sources: [gbif("Danaus gilippus")],
    },
  ],
};
