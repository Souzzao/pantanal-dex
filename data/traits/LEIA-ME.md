# Bases científicas de traços — arquivos originais

Baixados em **17/11/2026** para cruzamento posterior por nome científico. Nenhuma dieta foi inventada ou atribuída ao catálogo nesta etapa. Os bytes originais foram preservados; integridade e contagens verificadas. SHA-256 e URLs estão em `manifest.json`.

## EltonTraits 1.0 — aves e mamíferos

Wilman, H.; Belmaker, J.; Simpson, J.; de la Rosa, C.; Rivadeneira, M. M.; Jetz, W. (2014). *EltonTraits 1.0: Species-level foraging attributes of the world's birds and mammals*. Ecology 95:2027. [DOI do artigo](https://doi.org/10.1890/13-1917.1). [DOI da coleção de dados](https://doi.org/10.6084/m9.figshare.c.3306933).

Fonte direta: [Ecological Archives E095-178-D1](https://www.esapubs.org/archive/ecol/E095/178/default.php). [Metadados e significado das colunas](https://www.esapubs.org/archive/ecol/E095/178/metadata.php). Licença **CC BY 4.0**, conforme a [política do arquivo](https://www.esapubs.org/archive/copyright.htm), sem exceção indicada nesta publicação; [termos da licença](https://creativecommons.org/licenses/by/4.0/).

- `BirdFuncDat.txt`: TSV; 9.993 linhas com `Scientific` preenchido.
- `MamFuncDat.txt`: TSV; 5.400 linhas com `Scientific` preenchido.
- `BirdFuncDatSources.txt` e `MamFuncDatSources.txt`: referências citadas pelas colunas de fonte.

Os quatro MD5 coincidem com os publicados no arquivo dos autores. Há linhas finais sem nome científico nos arquivos originais: ignorá-las no cruzamento, preservando os arquivos. `Diet-*` contém estimativas semiquantitativas; manter os indicadores de fonte e certeza, inclusive valores extrapolados taxonomicamente. Não tratar todas as entradas como observações diretas.

## AmphiBIO v1 — anfíbios

Oliveira, B. F.; São-Pedro, V. A.; Santos-Barrera, G.; Penone, C.; Costa, G. C. (2017). *AmphiBIO, a global database for amphibian ecological traits*. Scientific Data 4:170123. [DOI do artigo](https://doi.org/10.1038/sdata.2017.123). Dados: [Figshare, versão 5](https://doi.org/10.6084/m9.figshare.4644424.v5), licença **CC BY 4.0** declarada no registro.

Arquivo original baixado: [AmphiBIO_v1.zip, arquivo Figshare 8828578](https://ndownloader.figshare.com/files/8828578). MD5 do ZIP conferido com a API do Figshare: `3d2c8f3371516209f190fc842f26e32b`.

- `AmphiBIO_v1.csv`: 6.776 espécies, CSV com vírgulas, codificação Windows-1252 original.
- `AmphiBIO_v1_references.csv`: referências por espécie.
- `Metadata.pdf`: dicionário original de variáveis.

As categorias alimentares indicam presença/ausência, não percentuais. `NA` significa informação ausente; não converter em ausência nem completar por suposição. Conferir o dicionário antes de interpretar variáveis. Estes dados não cobrem peixes ou répteis.

## Uso posterior

Aguardar a lista do catálogo do Claude. Fazer correspondência rastreável por nome científico e revisar sinônimos; registrar nomes sem correspondência, sem preencher automaticamente. Citar autores e dados, informar transformações futuras e manter links de licença ao distribuir derivados. Estes arquivos de trabalho não foram importados no bundle do aplicativo.
