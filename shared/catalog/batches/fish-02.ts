import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string) => ({ uri, author, license, sourceUrl, credit: `${author} / Wikimedia Commons` });

export const fish02: CatalogBatch = {
  batchId: "catalog-fish-02",
  cycle: 11,
  group: "Peixes",
  status: "pending-review",
  sources: [
    { title: "GBIF Species Match — Zungaro jahu", url: "https://api.gbif.org/v1/species/match?name=Zungaro%20jahu" },
    { title: "GBIF Species Match — Acestrorhynchus pantaneiro", url: "https://api.gbif.org/v1/species/match?name=Acestrorhynchus%20pantaneiro" },
    { title: "GBIF Species Match — Myloplus tiete", url: "https://api.gbif.org/v1/species/match?name=Myloplus%20tiete" },
  ],
  pendingNotes: ["Confirmar as páginas individuais dos arquivos Commons e a nomenclatura aceita antes da promoção.", "Zungaro jahu não possui imagem específica segura encontrada na busca atual; Myloplus tiete possui apenas uma imagem específica segura. Não usar espécies próximas, gráficos, PDF ou duplicações para completar o mínimo de três imagens."],
  species: [
    {
      id: "jau", commonName: "Jaú", scientificName: "Zungaro jahu", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"], description: "Grande bagre de água doce que ocupa trechos profundos de rios e ambientes conectados pelas cheias.", physicalCharacteristics: "Corpo robusto, cabeça larga, barbilhões sensoriais e nadadeira caudal forte.", habitat: "Calhas profundas, poços de rios, corixos e baías conectadas.", behavior: "Predador de fundo, mais ativo em períodos de menor luminosidade.", diet: "Peixes, crustáceos e outros animais aquáticos.", curiosities: ["Os barbilhões ajudam na orientação em águas turvas.", "A conectividade dos rios é importante para deslocamento e reprodução."], distribution: "Bacia do Paraguai e outras bacias do centro da América do Sul.", ecologicalImportance: "Predador de grande porte e indicador da integridade de rios profundos.", images: [], sources: [{ title: "GBIF Species Match — Zungaro jahu", url: "https://api.gbif.org/v1/species/match?name=Zungaro%20jahu" }],
    },
    {
      id: "peixe-cachorro", commonName: "Peixe-cachorro", scientificName: "Acestrorhynchus pantaneiro", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"], description: "Peixe predador de corpo alongado que caça em águas abertas e margens de rios.", physicalCharacteristics: "Corpo prateado, dentes caniniformes e nadadeira caudal adaptada a natação rápida.", habitat: "Rios, corixos, lagoas e áreas de remanso.", behavior: "Forma pequenos grupos e investe rapidamente contra presas menores.", diet: "Peixes pequenos e invertebrados aquáticos.", curiosities: ["A dentição é uma característica marcante do grupo.", "A vegetação marginal fornece abrigo para presas e predadores."], distribution: "Bacia do Paraguai e regiões vizinhas da América do Sul.", ecologicalImportance: "Regula comunidades de peixes pequenos em ambientes de água doce.", images: [image("https://upload.wikimedia.org/wikipedia/commons/0/0d/Acestrorhynchus_pantaneiro_313835282.jpg", "demianlescano", "CC0", "https://commons.wikimedia.org/wiki/File:Acestrorhynchus_pantaneiro_313835282.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/8/8a/Acestrorhynchus_pantaneiro_333993221.jpg", "Luciano Massa", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Acestrorhynchus_pantaneiro_333993221.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/3/3d/Acestrorhynchus_pantaneiro_351129961.jpg", "Sebastián Lovera", "CC0", "https://commons.wikimedia.org/wiki/File:Acestrorhynchus_pantaneiro_351129961.jpg")], sources: [{ title: "GBIF Species Match — Acestrorhynchus pantaneiro", url: "https://api.gbif.org/v1/species/match?name=Acestrorhynchus%20pantaneiro" }],
    },
    {
      id: "pacupeva", commonName: "Pacupeva", scientificName: "Myloplus tiete", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"], description: "Peixe de pequeno a médio porte que explora vegetação, frutos e sementes em ambientes de água doce.", physicalCharacteristics: "Corpo alto e comprimido, dentes fortes e coloração prateada.", habitat: "Rios, lagoas, baías e margens vegetadas.", behavior: "Explora cardumes e utiliza áreas rasas durante períodos de alimentação.", diet: "Frutos, sementes, plantas, algas e pequenos invertebrados.", curiosities: ["A dieta acompanha a oferta sazonal de frutos e sementes.", "Áreas inundadas ampliam o acesso a alimento terrestre."], distribution: "Bacias do sul e centro da América do Sul.", ecologicalImportance: "Transfere matéria vegetal para a cadeia aquática e pode dispersar sementes.", images: [image("https://upload.wikimedia.org/wikipedia/commons/2/2c/Myloplus_tiete.jpg", "Douglas Lopes", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Myloplus_tiete.jpg")], sources: [{ title: "GBIF Species Match — Myloplus tiete", url: "https://api.gbif.org/v1/species/match?name=Myloplus%20tiete" }],
    },
  ],
};
