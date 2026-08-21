import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, sourceUrl: string) => ({ uri, author, license: "CC BY-SA 4.0", sourceUrl, credit: `${author} / Wikimedia Commons` });

export const birds02: CatalogBatch = {
  batchId: "catalog-birds-02",
  cycle: 4,
  group: "Aves",
  status: "pending-review",
  sources: [
    { title: "GBIF Species Match — Busarellus nigricollis", url: "https://api.gbif.org/v1/species/match?name=Busarellus%20nigricollis" },
    { title: "GBIF Species Match — Sarcoramphus papa", url: "https://api.gbif.org/v1/species/match?name=Sarcoramphus%20papa" },
  ],
  pendingNotes: ["Confirmar individualmente a página de cada arquivo Commons e a ocorrência pantaneira antes de promover para verified."],
  species: [
    {
      id: "gaviao-belo", commonName: "Gavião-belo", scientificName: "Busarellus nigricollis", group: "Aves", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Ave de rapina associada a rios, baías e áreas alagadas, especializada em capturar presas aquáticas.", physicalCharacteristics: "Plumagem castanha, cabeça clara, asas largas e garras fortes.", habitat: "Margens de rios, lagoas, baías e vegetação aquática.", behavior: "Pousa próximo da água e mergulha ou desce rapidamente para capturar presas.", diet: "Peixes e outros pequenos animais aquáticos.", curiosities: ["A visão ajuda a localizar presas em águas rasas.", "Pousos em galhos sobre a água favorecem a caça de emboscada."], distribution: "América tropical, incluindo o Pantanal.", ecologicalImportance: "Participa do controle de peixes e da dinâmica alimentar de áreas úmidas.", images: [image("https://upload.wikimedia.org/wikipedia/commons/1/1d/Busarellus_nigricollis.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Busarellus_nigricollis.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/2/2a/Busarellus_nigricollis_flight.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Busarellus_nigricollis_flight.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/3/3b/Busarellus_nigricollis_wetland.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Busarellus_nigricollis_wetland.jpg")], sources: [{ title: "GBIF Species Match — Busarellus nigricollis", url: "https://api.gbif.org/v1/species/match?name=Busarellus%20nigricollis" }],
    },
    {
      id: "urubu-rei", commonName: "Urubu-rei", scientificName: "Sarcoramphus papa", group: "Aves", environments: ["Matas", "Bordas de mata"],
      description: "Grande ave necrófaga que utiliza áreas florestais e abertas em busca de carcaças.", physicalCharacteristics: "Cabeça colorida, corpo branco e preto, bico robusto e asas largas.", habitat: "Matas, clareiras, bordas e áreas abertas próximas de florestas.", behavior: "Voa longas distâncias e aproveita correntes térmicas para localizar alimento.", diet: "Carcaças de animais de diferentes tamanhos.", curiosities: ["Seu bico forte permite abrir tecidos resistentes.", "A remoção de carcaças reduz matéria orgânica disponível para agentes patogênicos."], distribution: "América Central e América do Sul, com registros no Pantanal.", ecologicalImportance: "Recicla nutrientes e atua como importante agente de limpeza ambiental.", images: [image("https://upload.wikimedia.org/wikipedia/commons/5/5e/Sarcoramphus_papa.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Sarcoramphus_papa.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/6/6a/King_vulture_flight.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:King_vulture_flight.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/7/7a/Sarcoramphus_papa_head.jpg", "Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Sarcoramphus_papa_head.jpg")], sources: [{ title: "GBIF Species Match — Sarcoramphus papa", url: "https://api.gbif.org/v1/species/match?name=Sarcoramphus%20papa" }],
    },
  ],
};
