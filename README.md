# My ArangoDB Admin #

Ferramenta de importação e exportação de coleções para o ArangoDB, pois o cliente web ainda não possui estas funções.

![alt text](https://image.ibb.co/idkKJy/Captura_de_Tela_2018_05_09_s_16_21_49.png)

## Utilização ##

* Exportar Coleções: faz o download de todas as coleções presentes no banco de dados indicado em arquivos *.json que podem ser utilizados pelo cliente web do arangoDB (um a um) e por esta ferramenta para importação em massa

* Importar Coleções: importar os arquivos *.json criados a partir da exportação pelo cliente web do arangoDB ou por esta ferramenta

* Clonar Propriedades: cada coleção possui propriedades específicas - como tipo de coleção, tipo de gerador, intervalo de incremento de chave, etc. - esta ferramenta copia todas essas propriedades em um arquivo *.json para que se possa posteriormente recriar as coleções com maior precisão posteriormente

* Criar Coleções: pode-se tanto criar uma coleção com as propriedades desejadas (mais completo do que o cliente web do arangoDB) quanto aproveitar o arquivo *.json gerado pelo "Clonar Propriedades" para se criá-las com maior precisão

## Instalação de Backend e Frontend ##

* Clonar repositório:
~~~~
git clone git@github.com:fabiotabalipa/my-arangodb-admin.git
~~~~

* No diretório raiz (instalar dependências e rodar aplicação):
~~~~
npm install
npm start
~~~~

## Variáveis de Ambiente ##

* Configurar as variáveis de ambiente, criando arquivo .env (vide .envexample) ou de outra maneira correspondente

## Variáveis de ambiente #

* PORT      - Porta do serviço (default: 4009)
* HOST      - Domínio do backend (default: localhost)

Desenvolvido para uso pessoal, mas fique à vontade para testar e opinar.

Licença MIT.
