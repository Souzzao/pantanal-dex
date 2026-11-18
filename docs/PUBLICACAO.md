# Checklist de publicação (Google Play)

Estado em 18/11/2026. ✅ pronto · 🟡 em andamento · ⬜ falta

## Exigências da loja
- ✅ Excluir a conta pelo app (Ajustes → Sua conta → Excluir minha conta) + função `delete_my_account` no Supabase
- ✅ Política de privacidade escrita ([PRIVACIDADE.md](PRIVACIDADE.md)); ⬜ precisa de um link público (GitHub Pages ou o próprio arquivo no GitHub)
- ⬜ Formulário "Segurança dos dados" no Play Console (base: tabela da política de privacidade)
- ⬜ Classificação etária (questionário IARC): sem violência, sem compras, conteúdo gerado por usuário moderado
- ⬜ Conta de desenvolvedor Google Play (taxa única de US$ 25); contas pessoais novas precisam de **teste fechado com 12 testadores por 14 dias** antes da produção

## Build
- ⬜ Chave de assinatura de release (hoje o APK é assinado com chave de debug) — gerar pelo EAS (`eas credentials`) e guardar o backup fora do repositório
- ⬜ Gerar **AAB** (`eas build -p android --profile production`); a Play não aceita APK novo
- ✅ `versionCode` sobe a cada versão (hoje 5)
- ⬜ Revisar permissões pedidas (localização só "durante o uso", câmera, galeria)

## Servidor (Supabase)
- ⬜ Plano gratuito pausa o projeto depois de 7 dias sem uso → com usuários reais, plano Pro ou rotina de "ping"
- ⬜ Ativar proteção contra senhas vazadas (Auth → Passwords)
- ⬜ E-mail de confirmação com SMTP próprio (o envio padrão do Supabase tem limite baixo por hora)

## Conteúdo
- 🟡 Mais fotos por espécie, priorizando licenças comerciais (CC0, CC BY, CC BY-SA)
- ⬜ Decidir monetização: com anúncio ou versão paga, as fotos **CC BY-NC** (≈ 60% hoje) precisam sair ou ser trocadas
- ✅ Créditos das fotos dentro do app ([LICENCAS-E-CREDITOS.md](LICENCAS-E-CREDITOS.md))

## Página na loja
- ⬜ Ícone 512×512, imagem de destaque 1024×500
- ⬜ 4–8 capturas de tela do celular
- ⬜ Descrição curta (80 caracteres) e completa (4000)
