# PantanalDex — guia da Conta 2

## Missão da Conta 2

Você é responsável pela frente de **conteúdo científico e catálogo** do PantanalDex. Seu trabalho é ampliar o catálogo com espécies verificadas, preencher dados confiáveis e melhorar a experiência de descoberta sem quebrar a navegação ou os contratos existentes.

## Link de trabalho

Abra o mesmo projeto pelo checkpoint compartilhado:

`manus-webdev://a527690e`

Preview web:

`https://8081-iausgyir2g6c9aqyvcejb-f320377e.us3.manus.computer`

Não crie uma cópia independente do projeto. Antes de editar, verifique se existe checkpoint mais recente.

## Arquivos permitidos como foco principal

Trabalhe principalmente em `shared/pantanal.ts`, em um possível futuro `data/species.json`, em `app/(tabs)/animals.tsx`, em `app/species/[id].tsx` e em componentes de catálogo. Evite alterar `contexts/AppContext.tsx`, `app/_layout.tsx`, `app.config.ts` e rotas de avistamento, salvo quando a Conta Coordenadora autorizar.

## Objetivo do primeiro ciclo

Expandir o catálogo para pelo menos 20 espécies, cobrindo mamíferos, aves, répteis, anfíbios, peixes e invertebrados. Também deve haver variedade entre rios e corixos, áreas alagadas, campos, matas e bordas de mata.

Cada espécie precisa ter `id`, nome popular, nome científico, grupo, ambientes, descrição, características físicas, habitat, comportamento, alimentação, curiosidades, distribuição, importância ecológica, situação de conservação quando disponível, três imagens e fontes estruturadas.

## Regras científicas

Não invente informações. Use fontes confiáveis, como órgãos ambientais, instituições científicas, bases taxonômicas e listas de conservação reconhecidas. Registre a URL da fonte para cada espécie. Quando uma informação não estiver confirmada, deixe o campo pendente e informe a Conta Coordenadora.

Cada imagem precisa registrar autor, licença, URL de origem e crédito. Não usar imagens sem licença identificável. Se uma imagem remota não carregar no preview, o objeto de dados ainda deve preservar crédito e origem; a interface tratará o fallback visual separadamente.

## Regras de código

Preserve o contrato `Species` existente ou comunique antes qualquer alteração. Não renomeie chaves utilizadas pelas telas sem atualizar todos os consumidores. Não adicionar dependências apenas para inserir conteúdo. Prefira dados separados da interface quando o catálogo crescer.

Após editar, execute `pnpm check`. Se modificar a interface, revise busca, filtros, estado vazio e ficha de espécie no preview. Não marcar todos os itens do catálogo como concluídos se ainda faltarem fontes ou imagens.

## Entrega para a Conta Coordenadora

Envie o resumo no formato:

```text
Frente: Conteúdo científico e catálogo
Espécies adicionadas:
Grupos e ambientes cobertos:
Fontes usadas:
Imagens e licenças:
Arquivos alterados:
Verificações executadas:
Pendências ou dúvidas:
```

Não crie o checkpoint consolidado. A Conta Coordenadora integrará sua entrega, resolverá conflitos e salvará a versão final.
