# Distribuição Android 3.10

O workflow APK Android produz os artefatos APK-production e APK-demo. Os disparos por push geram candidatos. A publicação é manual e publica apenas PantanalDex.apk. O link do README aponta para o asset final da última release.

Para publicar, use a chave de distribuição do projeto. Configure os segredos DEX_ANDROID_KEYSTORE_B64, DEX_ANDROID_STORE_PASSWORD, DEX_ANDROID_KEY_ALIAS e DEX_ANDROID_KEY_PASSWORD no GitHub Actions. Configure DEX_ANDROID_CERT_SHA256 como variável com a impressão digital SHA-256 do certificado esperado. Guarde a chave e os dados de acesso em um cofre fora do Git. Um APK de validação com assinatura de depuração pode ser instalado para testar. Para atualizar uma instalação antiga sem reinstalar, o Android exige assinatura compatível com a já instalada. Valide a transição e a preservação do caderno em aparelho de teste.

Antes de publicar, confira o CI, o resultado de pnpm audit --prod --audit-level high, a assinatura do APK e o funcionamento no Android. Teste login, câmera, importação no HUD, criação offline, ficha, envio à equipe e camada offline do mapa. Verifique no Supabase se a RPC de exclusão, suas permissões e a política de exclusão de fotos da migração original foram aplicadas. Aplique também 20261125110000_team_media_attached.sql para restringir leitura às fotos vinculadas.

Os patches em patches/ permitem que o Metro e o Expo Router usem as dependências corrigidas. Ao atualizar o SDK, reavalie se essas adaptações ainda são necessárias.
