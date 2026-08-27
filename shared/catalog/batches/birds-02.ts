import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string) => ({ uri, author, license, sourceUrl, credit: `${author} / Wikimedia Commons` });

export const birds02: CatalogBatch = {
  batchId: "catalog-birds-02",
  cycle: 4,
  group: "Aves",
  status: "pending-review",
  sources: [
    { title: "GBIF Species Match — Busarellus nigricollis", url: "https://api.gbif.org/v1/species/match?name=Busarellus%20nigricollis" },
    { title: "GBIF Species Match — Sarcoramphus papa", url: "https://api.gbif.org/v1/species/match?name=Sarcoramphus%20papa" },
  ],
  pendingNotes: [
    "Taxonomia e imagens passam a validação estrutural; manter pendente até comprovar ocorrência individual no Pantanal e conservação oficial em ficha SALVE ou portaria aplicável.",
    "A solicitação do Passo 7 cita Arara-canindé, Jabiru e Colhereiro, mas esses registros não compõem birds-02: Arara-canindé está em birds-03, Tuiuiú/Jabiru em birds-04 e Colhereiro ainda não está cadastrado."
  ],
  species: [
    {
      id: "gaviao-belo", commonName: "Gavião-belo", scientificName: "Busarellus nigricollis", group: "Aves", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Ave de rapina associada a rios, baías e áreas alagadas, especializada em capturar presas aquáticas.", physicalCharacteristics: "Plumagem castanha, cabeça clara, asas largas e garras fortes.", habitat: "Margens de rios, lagoas, baías e vegetação aquática.", behavior: "Pousa próximo da água e mergulha ou desce rapidamente para capturar presas.", diet: "Peixes e outros pequenos animais aquáticos.", curiosities: ["A visão ajuda a localizar presas em águas rasas.", "Pousos em galhos sobre a água favorecem a caça de emboscada."], distribution: "América tropical, incluindo o Pantanal.", ecologicalImportance: "Participa do controle de peixes e da dinâmica alimentar de áreas úmidas.",
      images: [image("https://upload.wikimedia.org/wikipedia/commons/d/d0/Black-collared_hawk_%28Busarellus_nigricollis%29_adult.jpg", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Black-collared_hawk_(Busarellus_nigricollis)_adult.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/9/93/Black-collared_hawk_%28Busarellus_nigricollis%29_immature.JPG", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Black-collared_hawk_(Busarellus_nigricollis)_immature.JPG"), image("https://upload.wikimedia.org/wikipedia/commons/9/90/022_Black-collared_hawk_flying_with_a_fish_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:022_Black-collared_hawk_flying_with_a_fish_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg")],
      sources: [{ title: "GBIF Species Match — Busarellus nigricollis", url: "https://api.gbif.org/v1/species/match?name=Busarellus%20nigricollis" }],
    },
    {
      id: "urubu-rei", commonName: "Urubu-rei", scientificName: "Sarcoramphus papa", group: "Aves", environments: ["Matas", "Bordas de mata"],
      description: "Grande ave necrófaga que utiliza áreas florestais e abertas em busca de carcaças.", physicalCharacteristics: "Cabeça colorida, corpo branco e preto, bico robusto e asas largas.", habitat: "Matas, clareiras, bordas e áreas abertas próximas de florestas.", behavior: "Voa longas distâncias e aproveita correntes térmicas para localizar alimento.", diet: "Carcaças de animais de diferentes tamanhos.", curiosities: ["Seu bico forte permite abrir tecidos resistentes.", "A remoção de carcaças reduz matéria orgânica disponível para agentes patogênicos."], distribution: "América Central e América do Sul, com registros no Pantanal.", ecologicalImportance: "Recicla nutrientes e atua como importante agente de limpeza ambiental.",
      images: [image("https://upload.wikimedia.org/wikipedia/commons/f/f5/Sarcoramphus_papa_in_Ecuador.jpg", "Geoff Gallice", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Sarcoramphus_papa_in_Ecuador.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/5/55/Sarcoramphus_papa_%28K%C3%B6nigsgeier_-_King_Vulture%29_-_Weltvogelpark_Walsrode_2013-01.jpg", "Olaf Oliviero Riemer", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Sarcoramphus_papa_(K%C3%B6nigsgeier_-_King_Vulture)_-_Weltvogelpark_Walsrode_2013-01.jpg"), image("https://upload.wikimedia.org/wikipedia/commons/d/da/Sarcoramphus_papa_441774682.jpg", "Anthony Batista", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Sarcoramphus_papa_441774682.jpg")],
      sources: [{ title: "GBIF Species Match — Sarcoramphus papa", url: "https://api.gbif.org/v1/species/match?name=Sarcoramphus%20papa" }],
    },
  ],
};
