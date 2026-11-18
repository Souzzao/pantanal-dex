<div align="center">

<img src="assets/images/app-mark.png" alt="PantanalDex" width="120" />

# PantanalDex

**Guia de campo offline e caderno de avistamentos da fauna do Pantanal.**

[![Verificação](https://github.com/Souzzao/pantanal-dex/actions/workflows/ci.yml/badge.svg)](https://github.com/Souzzao/pantanal-dex/actions/workflows/ci.yml)
[![APK Android](https://github.com/Souzzao/pantanal-dex/actions/workflows/apk.yml/badge.svg)](https://github.com/Souzzao/pantanal-dex/actions/workflows/apk.yml)
![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000?logo=expo)
![React Native 0.81](https://img.shields.io/badge/React%20Native-0.81-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-RLS-3ecf8e?logo=supabase&logoColor=white)

</div>

---

## Sobre o projeto

Quem visita o Pantanal vê uma onça, um tuiuiú ou um jacaré e fica com as mesmas dúvidas: **que bicho é esse, o que ele come, está ameaçado?** As fotos acabam perdidas na galeria, sem nome e sem local, e no campo quase nunca há sinal de celular.

O **PantanalDex** resolve isso em um único app que funciona **sem internet**:

- 📖 **Wiki na palma da mão** — 1.018 espécies de vertebrados do Pantanal, com foto, dieta, grau de ameaça (IUCN) e fontes.
- 📷 **Organiza as fotos** — cada avistamento guarda espécie, foto, data, hora e local.
- 📍 **Localiza os animais** — mapa com a área aproximada de cada registro público.
- 🌎 **Tradução** — interface e fichas em português, inglês, espanhol e alemão.
- 🏅 **Explorador do Pantanal** — check-in por GPS em 35 pontos turísticos e cidades pantaneiras, com insígnias.

> Projeto idealizado e desenvolvido por **Felipe de Souza Aquino** como trabalho final da disciplina de Engenharia de Software (UNEMAT, 2026).

## Funcionalidades

| Área | O que faz |
|---|---|
| **Catálogo** | 1.018 espécies (mamíferos, aves, répteis, anfíbios, peixes e invertebrados), busca por nome popular ou científico, filtros por grupo, ambiente e ameaça. |
| **Ficha da espécie** | Descrição, dieta medida (EltonTraits/AmphiBIO), massa corporal, status IUCN, curiosidades, fontes e créditos de imagem, em 4 idiomas. |
| **Novo avistamento** | Abre a câmera na hora, lê o GPS, confere se o ponto está no Pantanal e salva no caderno local. Alternativas: galeria e marcação manual no mapa. |
| **Cadernos** | Avistamentos separados em cadernos (Principal, Teste, criados e importados). Juntar cadernos removendo repetidos, importar e exportar em JSON, CSV ou GeoJSON, com histórico dos cadernos exportados. |
| **Mapa público** | Registros auditados exibidos como círculos de até 3 km (o tamanho depende do animal), filtros por espécie, grupo e data. Nunca mostra o ponto exato. |
| **Pontos turísticos** | 19 atrativos e 16 municípios pantaneiros, check-in validado por distância (Haversine) e precisão do GPS. |
| **Coleção** | XP, nível, progresso por grupo, conquistas e insígnias Bronze, Prata e Ouro. |
| **Auditoria** | Fila em cartões (arrastar para aprovar ou recusar), correção de espécie e histórico. Modo demonstração simula publicações e o processo completo, sem enviar nada ao servidor. |
| **Contas e perfis** | Login com Supabase Auth e três perfis: **usuário** (registra), **auditor** (aprova, corrige ou recusa registros públicos) e **dev** (gerencia contas e papéis). |
| **Offline** | Catálogo, caderno e mapa funcionam sem rede; fotos do catálogo podem ser baixadas para uso offline. |

## Tecnologias

- **App:** Expo SDK 54, React Native 0.81, React 19, Expo Router, NativeWind (Tailwind), TypeScript.
- **Mapa:** Leaflet em WebView, contorno oficial do Pantanal (IBGE) e camada de satélite.
- **Back-end:** Supabase (Auth, Postgres com Row Level Security e funções RPC).
- **Dados:** pipeline Python que monta o catálogo a partir de iNaturalist, GBIF, EltonTraits 1.0, AmphiBIO, Wikidata e Wikimedia Commons.
- **Qualidade:** Vitest (200+ testes), TypeScript estrito, GitHub Actions (verificação em todo PR e APK a cada mudança).

## Começando

Requisitos: **Node.js 20+** e **pnpm 9**.

```bash
git clone https://github.com/Souzzao/pantanal-dex.git
cd pantanal-dex
pnpm install --frozen-lockfile
cp .env.example .env      # opcional: sem o .env o app roda em modo local, sem login
pnpm start                # abre o Expo (Android, iOS ou web)
```

Comandos úteis:

| Comando | Para quê |
|---|---|
| `pnpm start` | Servidor de desenvolvimento do Expo |
| `pnpm android` | Abre no emulador ou aparelho Android |
| `pnpm check` | Verificação de tipos (TypeScript) |
| `pnpm test` | Testes automáticos |
| `pnpm catalog:build` | Regenera o catálogo de espécies a partir de `data/` |

Para gerar o APK, configurar o Supabase e rodar os testes no Android, veja **[docs/COMO-RODAR.md](docs/COMO-RODAR.md)**.

## Estrutura do repositório

```
app/            Telas (Expo Router): abas, ficha da espécie, avistamentos, mapa, coleção, auditoria, área dev
components/     Componentes de interface reutilizáveis (mapa, cartões, login, imagens)
contexts/       Estado global: conta (Auth), preferências e caderno (App), publicações
shared/         Regras de negócio puras e testáveis: catálogo, avistamentos, mapa, check-in, i18n
  catalog/      Catálogo gerado (1.018 espécies) e auditoria de licenças
  i18n/         Textos da interface em pt, en, es e de
lib/            Integrações: cliente Supabase, fotos, tema
supabase/       Migrações SQL (tabelas, RLS e funções do servidor)
scripts/        Pipeline do catálogo (Python) e utilitários de build
tests/          Testes automáticos (Vitest)
docs/           Documentação técnica
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [Arquitetura](docs/ARQUITETURA.md) | Camadas, fluxo de dados, offline-first e decisões técnicas |
| [Engenharia de software](docs/ENGENHARIA.md) | Problema, escopo, stakeholders, requisitos, casos de uso e diagramas UML |
| [Segurança](docs/SEGURANCA.md) | Modelo de ameaças, RLS, perfis, privacidade da localização |
| [Como rodar](docs/COMO-RODAR.md) | Ambiente, Supabase, APK e testes no Android |
| [Dados do catálogo](docs/DADOS.md) · [Pipeline](docs/PIPELINE-CATALOGO.md) | Origem e montagem das 1.018 espécies |
| [Licenças e créditos](docs/LICENCAS-E-CREDITOS.md) | Regras de licença das imagens e fontes |
| [Mapa público](docs/MAPA-PUBLICO.md) | Como os registros viram áreas aproximadas |
| [Testes](docs/TESTES.md) | Estratégia de verificação e validação |
| [Histórico de versões](CHANGELOG.md) | O que mudou em cada versão |

## Segurança

Encontrou uma falha? **Não abra issue pública** — veja [SECURITY.md](SECURITY.md).

## Autor

**Felipe de Souza Aquino** — idealização, especificação, desenvolvimento, testes e revisão.
GitHub: [@Souzzao](https://github.com/Souzzao)

O desenvolvimento contou com apoio de assistentes de IA (Claude, GPT e Manus) como ferramentas de produtividade; todas as mudanças foram revisadas e aprovadas pelo autor antes de entrar no projeto.

## Licença

© 2026 Felipe de Souza Aquino. Todos os direitos reservados — veja [LICENSE](LICENSE).
Os dados de terceiros seguem as licenças listadas em [docs/LICENCAS-E-CREDITOS.md](docs/LICENCAS-E-CREDITOS.md).
