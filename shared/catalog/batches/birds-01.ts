import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const birds01: CatalogBatch = {
  batchId: "catalog-birds-01",
  cycle: 4,
  group: "Aves",
  status: "pending-review",
  sources: [
    { title: "IUCN Red List — Cariama cristata", url: "https://www.iucnredlist.org/search?query=Cariama%20cristata&searchType=species" },
    { title: "IUCN Red List — Crax fasciolata", url: "https://www.iucnredlist.org/search?query=Crax%20fasciolata&searchType=species" },
    { title: "IUCN Red List — Anhima cornuta", url: "https://www.iucnredlist.org/search?query=Anhima%20cornuta&searchType=species" },
  ],
  pendingNotes: [
    "Confirmar nomenclatura aceita, situação de conservação e ocorrência no recorte do Pantanal antes de promover a verified.",
    "As imagens de aves em zoológico ou em outras localidades são referências visuais, não evidência de ocorrência regional.",
  ],
  species: [
    {
      id: "seriema", commonName: "Seriema", scientificName: "Cariama cristata", group: "Aves", environments: ["Campos", "Bordas de mata"],
      description: "Ave terrestre de pernas longas, associada a campos e formações abertas da América do Sul.",
      physicalCharacteristics: "Plumagem parda, pernas avermelhadas, bico forte e crista de penas na base do bico.",
      habitat: "Campos, cerrados, savanas e bordas de formações florestais.",
      behavior: "Caminha e corre pelo solo, vocaliza com intensidade e captura presas durante o forrageamento terrestre.",
      diet: "Insetos, pequenos vertebrados, ovos e outros animais disponíveis no ambiente.",
      curiosities: ["A vocalização pode ser ouvida a longa distância.", "É uma ave predominantemente terrestre, embora possa empoleirar-se."],
      distribution: "Regiões abertas do centro e leste da América do Sul, incluindo o Brasil.",
      ecologicalImportance: "Preda invertebrados e pequenos vertebrados e participa das cadeias alimentares dos campos.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/2/24/Cariama_cristata_-near_Goiania%2C_Goias%2C_Brazil-8.jpg", "Wagner Machado Carlos Lemes", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Cariama_cristata_-near_Goiania,_Goias,_Brazil-8.jpg", "Wagner Machado Carlos Lemes / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/6/64/174_Red-legged_seriema_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:174_Red-legged_seriema_in_Encontro_das_Águas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/a/a0/Red-legged_seriema_%28Cariama_cristata%29_head.JPG", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Red-legged_seriema_(Cariama_cristata)_head.JPG", "Charles J. Sharp / Wikimedia Commons"),
      ],
      sources: [{ title: "IUCN Red List — Cariama cristata", url: "https://www.iucnredlist.org/search?query=Cariama%20cristata&searchType=species" }],
    },
    {
      id: "mutum-de-penacho", commonName: "Mutum-de-penacho", scientificName: "Crax fasciolata", group: "Aves", environments: ["Matas", "Bordas de mata"],
      description: "Ave florestal de grande porte que utiliza o solo e a vegetação baixa para se alimentar.",
      physicalCharacteristics: "Macho predominantemente escuro com ventre branco e fêmeas de plumagem mais críptica, com penacho evidente.",
      habitat: "Matas, florestas ribeirinhas e mosaicos de vegetação no centro da América do Sul.",
      behavior: "Forrageia no solo, desloca-se em pares ou pequenos grupos e usa árvores e vegetação densa como abrigo.",
      diet: "Frutos, sementes, folhas e pequenos invertebrados encontrados no chão da mata.",
      curiosities: ["Machos e fêmeas apresentam diferenças marcantes de plumagem.", "A perda de florestas e a pressão de caça podem afetar populações locais."],
      distribution: "Brasil central e meridional, Bolívia, Paraguai e regiões adjacentes da América do Sul.",
      ecologicalImportance: "Consome e transporta frutos e sementes, contribuindo para a dinâmica das florestas e matas ciliares.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/2/2b/076_Male_Bare-faced_curassow_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:076_Male_Bare-faced_curassow_in_Encontro_das_Águas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/d/da/Bare-faced_curassow_%28Crax_fasciolata%29_male_head.JPG", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Bare-faced_curassow_(Crax_fasciolata)_male_head.JPG", "Charles J. Sharp / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/a/ac/Crax_fasciolata_-Parque_das_Aves-8.jpg", "Bruno Girin", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Crax_fasciolata_-Parque_das_Aves-8.jpg", "Bruno Girin / Wikimedia Commons"),
      ],
      sources: [{ title: "IUCN Red List — Crax fasciolata", url: "https://www.iucnredlist.org/search?query=Crax%20fasciolata&searchType=species" }],
    },
    {
      id: "anhuma", commonName: "Anhuma", scientificName: "Anhima cornuta", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
      description: "Ave aquática de grande porte associada a áreas úmidas, com um prolongamento córneo característico na cabeça.",
      physicalCharacteristics: "Corpo escuro com manchas claras, pernas fortes e estrutura córnea fina projetada na testa.",
      habitat: "Brejos, margens de lagoas, áreas alagadas e vegetação aquática.",
      behavior: "Alimenta-se e desloca-se próximo à água, podendo vocalizar e voar entre áreas úmidas conectadas.",
      diet: "Folhas, brotos, plantas aquáticas e outros itens vegetais disponíveis nas margens.",
      curiosities: ["O nome popular faz referência à estrutura córnea na cabeça.", "A espécie costuma permanecer próxima de ambientes úmidos com vegetação."],
      distribution: "América do Sul tropical, especialmente em bacias e áreas úmidas do norte e centro do continente.",
      ecologicalImportance: "Participa do consumo e transporte de matéria vegetal em ambientes alagados.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/9/93/Anhima_cornuta.jpg", "Christoph2007", "Public domain", "https://commons.wikimedia.org/wiki/File:Anhima_cornuta.jpg", "Christoph2007 / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/6/60/Anhima_cornuta_252513408.jpg", "agujaceratops", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Anhima_cornuta_252513408.jpg", "agujaceratops / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/f/f7/Anhima_cornuta_366954418.jpg", "miguelpodas", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Anhima_cornuta_366954418.jpg", "miguelpodas / Wikimedia Commons"),
      ],
      sources: [{ title: "IUCN Red List — Anhima cornuta", url: "https://www.iucnredlist.org/search?query=Anhima%20cornuta&searchType=species" }],
    },
  ],
};
