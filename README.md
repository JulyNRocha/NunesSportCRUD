# Nunes Sports - Sistema de Gerenciamento de Produtos
Bem-vindo ao repositório do Nunes Sports, um sistema de gerenciamento de produtos construído com Node.js, Express, e MySQL. Este projeto é uma aplicação web que permite aos usuários adicionar, visualizar, editar e excluir produtos de um banco de dados.

## Funcionalidades
* **Listagem de Produtos:** Veja todos os produtos cadastrados com opções para editar ou excluir.
* **Paginação:** Navegue entre as páginas para visualizar os produtos.
* **Adicionar Produto:** Adicione novos produtos ao banco de dados.
* **Editar Produto:** Atualize as informações de produtos existentes.
* **Excluir Produto:** Remova produtos do banco de dados.

## Como usar
Para executar o projeto localmente, siga estes passos:

1. **Clone o Repositório:**

```bash!
git clone https://github.com/JulyNRocha/NunesSportCRUD.git
```
2. **Ir até o diretorio do projeto na pasta server**

```bash!
cd server
```   
3. **Instale as Dependências:**

```bash!
npm install
```
4. **Configure o Banco de Dados:**

* Certifique-se de ter o MySQL instalado e em execução.
* Crie um banco de dados chamado nunesdb.
* Adapte as configurações de conexão do banco de dados no arquivo do projeto conforme necessário.

5. ## Inicie o Servidor:

```bash!
npm start
```
O servidor será iniciado na porta 3000. Acesse http://localhost:3000 em seu navegador.

## Tecnologias Utilizadas
* **Backend:** Node.js com Express
* **Frontend:** EJS, Bootstrap
* **Banco de Dados:** MySQL
