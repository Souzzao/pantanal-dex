import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const mammals01: CatalogBatch = {
  batchId: "catalog-mammals-01",
  cycle: 2,
  group: "Mamíferos",
  status: "pending-review",
  sources: [
    { title: "GBIF Species Match — espécie e avaliação global", url: "https://api.gbif.org/v1/species/match?name=Chrysocyon%20brachyurus" },
    { title: "GBIF Species Match — espécie e avaliação global", url: "https://api.gbif.org/v1/species/match?name=Tayassu%20pecari" },
    { title: "GBIF Species Match — espécie e avaliação global", url: "https://api.gbif.org/v1/species/match?name=Pecari%20tajacu" },
  ],
  pendingNotes: [
    "Confirmar nomenclatura aceita e status regional no recorte do Pantanal com fonte taxonômica especializada antes de marcar o lote como verified.",
    "As imagens são de indivíduos em zoológicos ou outras localidades; não devem ser interpretadas como prova de ocorrência no Pantanal.",
  ],
  species: [
    {
      id: "lobo-guara", commonName: "Lobo-guará", scientificName: "Chrysocyon brachyurus", group: "Mamíferos", environments: ["Campos", "Bordas de mata"],
      description: "Canídeo de pernas longas associado a ambientes abertos e formações de cerrado da América do Sul.",
      physicalCharacteristics: "Pelagem predominantemente alaranjada, pernas escuras, crina dorsal e orelhas grandes.",
      habitat: "Campos, savanas, cerrados e áreas abertas com cobertura vegetal intercalada.",
      behavior: "Geralmente solitário e crepuscular ou noturno, deslocando-se por grandes áreas em busca de alimento.",
      diet: "Frutos, pequenos vertebrados e invertebrados, com participação importante do fruto da lobeira em sua dieta.",
      curiosities: ["A espécie é o maior canídeo da América do Sul.", "Sua comunicação inclui marcação odorífera e vocalizações."],
      distribution: "Centro da América do Sul, principalmente em áreas de cerrado e formações abertas do Brasil, Bolívia, Paraguai, Peru e Argentina.",
      ecologicalImportance: "Atua como predador de pequenos animais e dispersor de sementes em ambientes abertos.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/c/c4/Maned_wolf_%28Chrysocyon_brachyurus%29_%2892775971%29.jpg", "Pascal Vuylsteker", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Maned_wolf_(Chrysocyon_brachyurus)_(92775971).jpg", "Pascal Vuylsteker / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/7/7c/Chrysocyon_Brachyurus.jpg", "Spencer Wright", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Chrysocyon_Brachyurus.jpg", "Spencer Wright / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/9/9c/Chrysocyon.brachyurus.jpg", "sarefo", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Chrysocyon.brachyurus.jpg", "sarefo / Wikimedia Commons"),
      ],
      sources: [{ title: "GBIF Species Match — Chrysocyon brachyurus", url: "https://api.gbif.org/v1/species/match?name=Chrysocyon%20brachyurus" }],
    },
    {
      id: "queixada", commonName: "Queixada", scientificName: "Tayassu pecari", group: "Mamíferos", environments: ["Matas", "Bordas de mata"],
      description: "Porco-do-mato social que forma grupos e percorre áreas florestadas e mosaicos de vegetação.",
      physicalCharacteristics: "Pelagem escura, faixa clara na região do queixo e corpo compacto com patas fortes.",
      habitat: "Florestas, matas ciliares, cerrados arborizados e áreas com disponibilidade de frutos e água.",
      behavior: "Vive em grupos, percorre longas distâncias e pode usar vocalizações e sinais químicos para manter a coesão social.",
      diet: "Frutos, sementes, raízes, folhas e pequenos organismos encontrados no solo.",
      curiosities: ["Grandes grupos podem movimentar-se por extensas áreas.", "A espécie usa a vegetação e o solo durante a busca por alimento."],
      distribution: "Do sul do México ao norte da Argentina, em diferentes formações florestais e savânicas da América do Sul.",
      ecologicalImportance: "Atua na movimentação do solo e na dispersão ou predação de sementes, conectando processos da floresta e do chão da mata.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/8/85/Tayassu_pecari.jpg", "Chrumps", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Tayassu_pecari.jpg", "Chrumps / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/2/2a/Tayassu_pecari_-Brazil-8.jpg", "Ana_Cotta", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Tayassu_pecari_-Brazil-8.jpg", "Ana_Cotta / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/6/6e/Tayassu_pecari_339487426.jpg", "Tomás Tamagno", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Tayassu_pecari_339487426.jpg", "Tomás Tamagno / Wikimedia Commons"),
      ],
      sources: [{ title: "GBIF Species Match — Tayassu pecari", url: "https://api.gbif.org/v1/species/match?name=Tayassu%20pecari" }],
    },
    {
      id: "cateto", commonName: "Cateto", scientificName: "Pecari tajacu", group: "Mamíferos", environments: ["Matas", "Bordas de mata", "Campos"],
      description: "Pequeno porco-do-mato de ampla distribuição, encontrado em ambientes florestados e abertos com abrigo.",
      physicalCharacteristics: "Pelagem grisalha ou castanha, faixa clara semelhante a um colar no pescoço e corpo robusto.",
      habitat: "Matas, cerrados, bordas florestais e áreas com abrigo e acesso a água.",
      behavior: "Vive em pequenos grupos ou grupos familiares, usa vocalizações e marcações odoríferas e explora o solo em busca de alimento.",
      diet: "Frutos, sementes, raízes, folhas, cactos e pequenos invertebrados.",
      curiosities: ["A faixa clara no pescoço ajuda a distinguir o cateto de outros porcos-do-mato.", "Glândulas odoríferas participam da comunicação entre indivíduos."],
      distribution: "Do sudoeste dos Estados Unidos à América do Sul, incluindo grande parte do Brasil.",
      ecologicalImportance: "Revolve o solo, influencia a disponibilidade de sementes e participa das cadeias alimentares como consumidor e presa.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/b/b5/Pecari_tajacu_%28Costa_Rica%29.jpg", "Hans Hillewaert", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Pecari_tajacu_(Costa_Rica).jpg", "Hans Hillewaert / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/a/a5/Pecari_tajacu_-_02.jpg", "Carlos Delgado", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Pecari_tajacu_-_02.jpg", "Carlos Delgado / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/9/91/Collared_Peccary_%28Pecari_tajacu%29_-_geograph.org.uk_-_883326.jpg", "Evelyn Simak", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Collared_Peccary_(Pecari_tajacu)_-_geograph.org.uk_-_883326.jpg", "Evelyn Simak / Wikimedia Commons"),
      ],
      sources: [{ title: "GBIF Species Match — Pecari tajacu", url: "https://api.gbif.org/v1/species/match?name=Pecari%20tajacu" }],
    },
  ],
};
