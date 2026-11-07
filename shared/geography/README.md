# Limite offline do bioma Pantanal

`pantanal-ibge-2025.json` contém somente a feição `CD_BIOMA=6`, `NM_BIOMA=Pantanal` da edição 2025 do produto **Biomas e Sistema Costeiro-Marinho do Brasil**, publicado pelo **IBGE**, compatível com a escala **1:250.000**.

Fonte primária:

- [Página do produto Biomas no IBGE](https://www.ibge.gov.br/geociencias/informacoes-ambientais/vegetacao/15842-biomas.html).
- [Diretório público dos vetores](https://geoftp.ibge.gov.br/informacoes_ambientais/estudos_ambientais/biomas/vetores/).
- [ZIP oficial da edição 2025](https://geoftp.ibge.gov.br/informacoes_ambientais/estudos_ambientais/biomas/vetores/2025_Biomas-e-Sistema-Costeiro-Marinho-do-Brasil-1-250000_shp.zip).
- Camada extraída: `lml_bioma_e250k_v20250911_A.shp`, com os atributos correspondentes do DBF.
- Sistema de referência declarado no PRJ: SIRGAS 2000, coordenadas geográficas em graus (EPSG:4674).
- Consulta e download: 6 de novembro de 2026.

O diretório oficial declara os arquivos como públicos. A atribuição **Fonte: IBGE, 2025** e estes endereços devem acompanhar reutilizações do contorno.

## Transformação e integridade

O arquivo mantém os **32.918 vértices** e a ordem do único anel fechado da feição. Não foi aplicado Douglas-Peucker nem outra simplificação de segmentos: o tamanho é suficientemente pequeno para manter o contorno completo no app. Somente as coordenadas foram arredondadas a seis casas decimais para remover ruído de representação; a alteração por eixo é de no máximo 0,0000005 grau. Essa redução não torna a escala regional da fonte mais precisa.

O GeoJSON usa a ordem `[longitude, latitude]`. A função pública `isInsidePantanal(latitude, longitude)` recebe os argumentos na ordem usual de GPS e inclui pontos sobre a linha do contorno. Seu epsilon de 1e-9 grau trata somente arredondamento numérico, sem acrescentar uma faixa de tolerância de GPS ao bioma.

| Arquivo | Tamanho | SHA-256 |
|---|---:|---|
| ZIP original | 13.685.677 bytes | `247b15c427070805044ebe02012f15552850d535fbfecaddb359875cdda1ea8f` |
| GeoJSON extraído | 777.799 bytes | `4bf2708174732cb089308657c6f443d62d28e04a3decb6411bf03b36c38b0aa2` |

Para reproduzir o arquivo, baixe o ZIP oficial e execute o extrator de biblioteca padrão Python:

```text
python shared/geography/generate-boundary.py caminho/ibge-biomas-2025.zip
```

O extrator confere o SHA-256 de origem antes de ler o DBF/SHP e reescrever o GeoJSON. O ZIP completo não precisa entrar no aplicativo.

## Limites da validação

- A geometria cobre o **bioma Pantanal no território brasileiro**. Não cobre todo o Pantanal internacional, a bacia do Alto Paraguai ou todos os municípios chamados pantaneiros.
- O contorno abrange Mato Grosso e Mato Grosso do Sul. Um recorte exclusivo para o piloto de Mato Grosso exigiria uma interseção adicional com a malha estadual; essa função não faz esse recorte.
- A escala de 1:250.000 é uma referência regional, e a precisão do GPS pode variar. Pontos perto da borda exigem consideração dessa incerteza; o resultado não é uma medição cadastral nem uma autorização ambiental.
- O aplicativo não transforma datums geodésicos. Recebe latitude/longitude em graus e compara com a base SIRGAS 2000.
- A validação usa coordenadas originais do registro. Coordenadas arredondadas para compartilhamento não devem ser usadas para decidir se a observação está dentro do bioma.

Fonte: **IBGE, Biomas e Sistema Costeiro-Marinho do Brasil, edição 2025**.
