# Passo 41/50 — validação oficial de conservação do curimbatá

## Alvo

A sequência P2 segue para o curimbatá, `Prochilodus lineatus`, registro prioritário do catálogo.

## Fonte oficial e busca normativa

A Portaria MMA nº 148/2022 foi extraída e pesquisada diretamente por `Prochilodus lineatus`, `lineatus` e `Prochilodus`. Não foi localizada correspondência exata para o táxon do catálogo. O anexo contém outros representantes de Prochilodontidae, como `Prochilodus britskii` e `Prochilodus vimboides`, mas esses táxons não foram confundidos com `P. lineatus`.

A ausência será registrada como `not-listed`, limitada à lista nacional consultada. Nenhuma categoria de ameaça será inferida, e a espécie não será tratada como LC apenas por não aparecer na Portaria.

Fonte: [1]

## Referências

[1]: https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf "Portaria MMA nº 148/2022 — lista oficial de espécies ameaçadas"


---

# Registro V3 do passo 41/60 — elegibilidade do Lote 01

## Auditoria de duplicidades e elegibilidade

A verificação do catálogo em `shared/catalog` encontrou seis candidatos do Lote 01 já existentes no catálogo: *Panthera onca*, *Hydrochoerus hydrochaeris*, *Myrmecophaga tridactyla*, *Tapirus terrestris*, *Platalea ajaja* e *Amazona aestiva*. Eles foram excluídos da ingestão do lote para evitar duplicidades.

Os nove candidatos restantes — *Puma concolor*, *Lontra longicaudis*, *Pteronura brasiliensis*, *Nasua nasua*, *Rhea americana*, *Anhinga anhinga*, *Eudocimus ruber*, *Caracara plancus* e *Eupsittula nenday* — não possuem simultaneamente registro modular, confirmação regional individual no ledger e auditoria comercial de três imagens. Portanto, nenhum deles foi promovido neste passo.

| Resultado | Quantidade |
|---|---:|
| Candidatos Lote 01 | 15 |
| Já presentes no catálogo | 6 |
| Novos sem pacote completo de evidências | 9 |
| Registros novos ingeridos | 0 |
| Duplicidades criadas | 0 |
| Imagens/licenças não verificadas inseridas | 0 |

## Decisão

O passo 41 encerra a triagem de elegibilidade sem ingestão definitiva. Isso não é uma pendência silenciosa: os seis casos foram resolvidos como duplicidades e os nove restantes foram explicitamente classificados como **não elegíveis neste estado do repositório**, porque a presença regional e as três licenças comerciais por espécie ainda não formam um pacote verificável. Nenhuma fonte, categoria de conservação ou licença foi inventada para forçar a ingestão.

Os contratos científicos e comerciais permanecem inalterados. O catálogo publicado continua com 60 espécies modulares e 26 lotes, e o Lote 01 permanece fora da ingestão até que cada nova espécie atenda ao conjunto completo de evidências.

## Checks

| Verificação | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm lint` | PASS; aviso preexistente de módulo do ESLint |
| `pnpm test` | 20 aprovados; 1 teste legado ignorado |
| Auditoria de prioridades | PASS; 41 entradas, 0 pendências |
| Auditoria de fontes | PASS; 26 lotes, 60 espécies, 66 fontes estruturadas, 120 URLs GBIF |
| Auditoria de conservação | PASS; 38 registros, 0 pendências |
| Auditoria regional | PASS; 22 registros, 19 confirmados, 3 `not-confirmed`, 0 `pending-review` |
