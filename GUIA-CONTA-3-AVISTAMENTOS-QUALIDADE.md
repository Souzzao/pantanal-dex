# PantanalDex — guia da Conta 3

## Missão da Conta 3

Você é responsável pela frente de **avistamentos, interface de uso, testes e qualidade** do PantanalDex. Seu objetivo é tornar o caderno de campo confiável, simples de usar com uma mão e resistente a estados vazios, cancelamentos, permissões negadas e ausência de conexão.

## Link de trabalho

Abra o mesmo projeto pelo checkpoint compartilhado:

`manus-webdev://a527690e`

Preview web:

`https://8081-iausgyir2g6c9aqyvcejb-f320377e.us3.manus.computer`

Não crie uma cópia independente. Verifique se há checkpoint mais recente antes de editar.

## Arquivos permitidos como foco principal

Trabalhe principalmente em `app/(tabs)/sightings.tsx`, `app/sightings/new.tsx`, `app/sightings/[id].tsx`, `app/(tabs)/settings.tsx`, componentes visuais e testes. Evite alterar `shared/pantanal.ts`, `app/_layout.tsx`, `app.config.ts` e a estrutura do catálogo sem comunicar a Conta Coordenadora.

## Objetivo do primeiro ciclo

Implementar edição completa de avistamentos, validação de campos, filtros combinados, fallback de permissões nativas, melhorias de confirmação e testes determinísticos para persistência e exportação.

O usuário deve poder iniciar um registro pela ficha da espécie ou pela área de avistamentos, escolher ou buscar a espécie, adicionar foto opcional, informar data, horário, local, quantidade e observações, usar localização quando autorizar, salvar sem coordenadas, abrir o detalhe, editar e excluir após confirmação.

## Regras de privacidade e permissões

Localização e fotografia são opcionais. A permissão deve ser explicada antes da solicitação. Se a permissão for negada, o formulário continua utilizável. Registros pessoais não devem ser compartilhados automaticamente. Qualquer aproximação ou ocultação de coordenadas deve preservar o registro original local.

## Regras de interface

Use `ScreenContainer` em todas as telas. Preserve portrait 9:16, alvos de toque confortáveis, contraste, textos legíveis e retorno claro. Cada botão precisa ter ação real. Todo estado deve possuir feedback: salvando, salvo, cancelado, sem registros, nenhum resultado, permissão negada e erro de exportação.

## Regras de testes

Crie testes determinísticos para validação de data obrigatória, quantidade, criação, atualização, exclusão, serialização JSON e CSV. Não dependa de GPS real, câmera real ou rede nos testes. Use dados estáticos e mocks para recursos nativos.

Após cada alteração, execute `pnpm check`. Ao concluir a frente, execute TypeScript, lint, testes e revisão visual das telas Início, Avistamentos, Detalhe, Novo Avistamento e Configurações.

## Entrega para a Conta Coordenadora

Envie o resumo no formato:

```text
Frente: Avistamentos, interface e qualidade
Fluxos concluídos:
Validações adicionadas:
Testes criados ou atualizados:
Arquivos alterados:
Verificações executadas:
Pendências, riscos ou permissões necessárias:
```

Não criar checkpoint consolidado sem combinar com a Conta Coordenadora. Ela será responsável por integrar alterações das três contas e salvar a versão final.
