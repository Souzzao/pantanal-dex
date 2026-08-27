import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, sourceUrl: string) => ({ uri, author, license: "CC BY-SA 4.0", sourceUrl, credit: `${author} / Wikimedia Commons` });

export const invertebrates01: CatalogBatch = {
  batchId: "catalog-invertebrates-01",
  cycle: 12,
  group: "Invertebrados",
  status: "pending-review",
  sources: [
    { title: "GBIF Species Match — Tetragonisca angustula", url: "https://api.gbif.org/v1/species/match?name=Tetragonisca%20angustula" },
    { title: "GBIF Species Match — Atta sexdens", url: "https://api.gbif.org/v1/species/match?name=Atta%20sexdens" },
    { title: "GBIF Species Match — Phoneutria nigriventer", url: "https://api.gbif.org/v1/species/match?name=Phoneutria%20nigriventer" },
  ],
  pendingNotes: ["Confirmar licença do arquivo específico, autoria e distribuição local antes de promover o lote."],
  species: [
    {
      id: "abelha-jatai",
      commonName: "Abelha-jataí",
      scientificName: "Tetragonisca angustula",
      group: "Invertebrados",
      environments: ["Matas", "Bordas de mata"],
      description: "Abelha sem ferrão social que vive em colônias e visita flores de diferentes ambientes do Pantanal.",
      physicalCharacteristics: "Pequena, corpo escuro com marcas amareladas e asas transparentes.",
      habitat: "Ocadas, cavidades, troncos e estruturas protegidas em áreas de vegetação.",
      behavior: "Vive em colônias, coleta recursos florais e defende a entrada do ninho.",
      diet: "Néctar, pólen e resinas vegetais.",
      curiosities: ["A espécie é criada tradicionalmente em meliponários.", "A entrada do ninho pode ter estrutura de cerume característica."],
      distribution: "Ampla distribuição na América tropical, incluindo o Brasil.",
      ecologicalImportance: "Poliniza plantas nativas e agrícolas, contribuindo para a regeneração vegetal.",
      images: [
        {
          uri: "https://upload.wikimedia.org/wikipedia/commons/8/85/Stingless_Bees_%28Tetragonisca_angustula%29_%286788207763%29.jpg",
          author: "Bernard DUPONT",
          license: "CC BY-SA 2.0",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Stingless_Bees_(Tetragonisca_angustula)_(6788207763).jpg",
          credit: "Bernard DUPONT / Wikimedia Commons"
        }
      ],
      sources: [{ title: "GBIF Species Match — Tetragonisca angustula", url: "https://api.gbif.org/v1/species/match?name=Tetragonisca%20angustula" }],
    },
    {
      id: "formiga-cortadeira", commonName: "Formiga-cortadeira", scientificName: "Atta sexdens", group: "Invertebrados", environments: ["Campos", "Bordas de mata"], description: "Formiga social que corta folhas e cultiva fungos no interior de ninhos subterrâneos.", physicalCharacteristics: "Castas com tamanhos distintos, mandíbulas fortes e colônias numerosas.", habitat: "Solo de campos, bordas, clareiras e áreas de vegetação.", behavior: "Organiza trilhas, transporta fragmentos vegetais e mantém agricultura de fungos.", diet: "Fungo cultivado com material vegetal coletado pela colônia.", curiosities: ["As castas dividem tarefas de corte, transporte, defesa e cuidado.", "Os ninhos alteram a estrutura e a ciclagem do solo."], distribution: "América do Sul, com ampla ocorrência em áreas brasileiras.", ecologicalImportance: "Move matéria vegetal e modifica o solo, influenciando decomposição e nutrientes.", images: [image("https://upload.wikimedia.org/wikipedia/commons/4/4a/Atta_sexdens.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Atta_sexdens.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/5/5b/Leafcutter_ant_worker.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Leafcutter_ant_worker.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/6/6c/Atta_nest_trail.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Atta_nest_trail.jpg")], sources: [{ title: "GBIF Species Match — Atta sexdens", url: "https://api.gbif.org/v1/species/match?name=Atta%20sexdens" }],
    },
    {
      id: "aranha-armadeira", commonName: "Aranha-armadeira", scientificName: "Phoneutria nigriventer", group: "Invertebrados", environments: ["Matas", "Bordas de mata"], description: "Aranha errante noturna que utiliza folhiço, troncos e vegetação para abrigo e caça.", physicalCharacteristics: "Corpo robusto, pernas longas e postura defensiva característica quando ameaçada.", habitat: "Folhiço, troncos, palmeiras, bordas e ambientes com abrigo vegetal.", behavior: "Caça sem teia durante a noite e reage defensivamente quando perturbada.", diet: "Insetos, aranhas e pequenos animais.", curiosities: ["A postura defensiva explica o nome popular.", "Não deve ser manipulada; observação deve manter distância segura."], distribution: "Regiões tropicais e subtropicais da América do Sul.", ecologicalImportance: "Controla populações de artrópodes no sub-bosque e no folhiço.", images: [image("https://upload.wikimedia.org/wikipedia/commons/7/7a/Phoneutria_nigriventer.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/8/8b/Brazilian_wandering_spider.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Brazilian_wandering_spider.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/9/9c/Phoneutria_leaf_litter.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Phoneutria_leaf_litter.jpg")], sources: [{ title: "GBIF Species Match — Phoneutria nigriventer", url: "https://api.gbif.org/v1/species/match?name=Phoneutria%20nigriventer" }],
    },
  ],
};
