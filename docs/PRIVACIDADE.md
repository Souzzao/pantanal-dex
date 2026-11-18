# Política de Privacidade — PantanalDex

Última atualização: 18 de novembro de 2026 · versão 3.9

O PantanalDex é um guia de campo da fauna do Pantanal com caderno de avistamentos. Esta política
explica quais dados pessoais o app trata, para quê, com quem compartilha e como você exerce seus
direitos, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).

## Quem é o controlador

**Felipe de Souza Aquino**, desenvolvedor do PantanalDex, Cáceres/MT, Brasil.
Canal para dúvidas e pedidos sobre seus dados: abra uma solicitação em
https://github.com/Souzzao/pantanal-dex/issues (ou pelo e-mail de contato informado na página do app
na Google Play). Respondemos em até 15 dias.

## Quais dados tratamos e por quê

| Dado | Quando | Finalidade | Base legal (LGPD, art. 7º) | Onde fica |
|---|---|---|---|---|
| E-mail e senha | Ao criar a conta (obrigatória para usar o app) | Entrar no app e recuperar o acesso | Execução de contrato (V) | Servidor (Supabase); a senha é guardada só como código criptografado (hash) |
| Nome de exibição | Ao criar a conta | Identificar você para os auditores que revisam publicações | Execução de contrato (V) | Servidor |
| Avistamentos (espécie, data, hora, local, notas, foto, caderno) | Sempre que você registra | Seu caderno de campo | Execução de contrato (V) | **Só no seu aparelho** |
| Localização do aparelho | Só ao registrar um avistamento, se você permitir | Preencher o local do avistamento | Consentimento (I) — pedido pelo Android, pode ser negado | Fica no avistamento; não há rastreamento em segundo plano |
| Câmera e fotos | Só quando você escolhe tirar ou anexar uma foto | Foto do avistamento | Consentimento (I) — pedido pelo Android | No aparelho; vai ao servidor só se você publicar |
| Avistamentos que você decide publicar (espécie, data, hora, local exato, notas, foto) | Só quando você toca em publicar | Revisão por auditores e mapa público | Consentimento (I) — você escolhe cada publicação | Servidor |
| Registros técnicos de acesso (data/hora, endereço IP) | Ao usar login e publicação | Segurança e prevenção de abuso | Legítimo interesse (IX) | Servidor (Supabase) |

Não usamos anúncios, não vendemos dados, não fazemos rastreamento entre apps nem análise de
comportamento. O app não usa ferramentas de terceiros de estatística ou publicidade.

## O que é público

No mapa público aparecem só **a espécie, a data, a hora e uma área de cerca de 11 km**, nunca o ponto
exato, para proteger você, ninhos e espécies ameaçadas. Enquanto não é revisado, o registro aparece
com o selo "aguardando verificação". **Seu nome, seu e-mail, a foto, as notas e o local exato não são
públicos**: só você e os auditores do projeto veem.

## Com quem compartilhamos

- **Supabase Inc.**, que hospeda o banco de dados e as fotos publicadas, apenas para operar o app.
  Os dados ficam em servidores na região **São Paulo (sa-east-1), Brasil**.
- **Auditores do PantanalDex**: veem os avistamentos que você publicou e seu nome de exibição, para
  aprovar ou recusar.
- Autoridades, somente quando a lei obrigar.

As fotos do catálogo de espécies e o mapa são carregados de serviços externos (iNaturalist, GBIF,
Wikimedia Commons e o provedor do mapa); esses serviços recebem o endereço IP do aparelho, como em
qualquer página da internet, mas não recebem dados da sua conta.

## Por quanto tempo guardamos

- Conta e nome de exibição: enquanto a conta existir.
- Publicações: até você encerrar a publicação, até ela expirar ou até a conta ser excluída.
- Histórico de revisões dos auditores: apagado junto com a publicação.
- Registros técnicos de acesso: pelo tempo em que o Supabase os mantém (dias, no plano atual).
- Dados no aparelho: até você apagá-los ou desinstalar o app.

## Seus direitos (LGPD, art. 18)

- **Excluir a conta e os dados do servidor**: Ajustes → Sua conta → *Excluir minha conta*. Apaga conta,
  perfil, fotos enviadas e publicações. Os avistamentos do aparelho continuam com você.
- **Acessar, corrigir ou levar seus dados**: Cadernos → exportar em JSON, CSV ou GeoJSON. Para os
  dados do servidor, peça pelo canal acima.
- **Revogar consentimentos**: negue a localização ou a câmera nas configurações do Android; encerre
  publicações a qualquer momento.
- Informação sobre compartilhamento, oposição e revisão: pelo canal acima.
- Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD): https://www.gov.br/anpd

## Segurança

Conexões sempre criptografadas (HTTPS); acesso ao banco controlado por regras por usuário (RLS);
backup automático do Android desligado para que avistamentos com local exato não saiam do aparelho
sem você querer; o app pede só as permissões que usa.

## Crianças e adolescentes

O app não é direcionado a menores de 13 anos e não coleta dados deles de propósito. Adolescentes
devem usar com conhecimento dos responsáveis.

## Mudanças

Mudanças nesta política aparecem nesta página, com nova data no topo.
