- TESTES DE AUTOMAÇÃO COM CYPRESS
Este repositório contém um conjunto de testes de automação desenvolvidos com o Cypress, com o objetivo de identificar e documentar bugs de funcionalidade, usabilidade e visuais em uma aplicação web de Kanban.

- TECNOLOGIAS
Cypress: Framework de automação de testes End-to-End.

JavaScript: Linguagem de programação utilizada na escrita dos testes.

Node.js: Ambiente de execução para o JavaScript no lado do servidor.

npm: Gerenciador de pacotes do Node.js.

- ESTRUTURA DO PROJETO
A estrutura de pastas do projeto segue as convenções do Cypress, com uma organização adicional para categorizar os testes por tipo de bug.

.
├── cypress/
│   ├── downloads/
│   ├── e2e/
│   │   ├── funcionalidade/        # Testes de bugs de funcionalidade
│   │   │   └── bugs-funcionais.cy.js
│   │   ├── usabilidade/            # Testes de bugs de usabilidade
│   │   │   └── bugs-usabilidade.cy.js
│   │   └── visual/                 # Testes de bugs visuais
│   │       └── bugs-visuais.cy.js
│   ├── fixtures/
│   │   └── example.json            # Arquivos de dados de teste (mocks)
│   └── support/                    # Arquivos de suporte para o Cypress
├── node_modules/
├── cypress.config.js               # Arquivo de configuração do Cypress
├── package-lock.json
└── package.json                    # Gerenciamento de dependências e scripts
└── README.md                       # Instruções básicas de uso

- COMO EXECUTAR OS TESTES
Para rodar os testes, siga os passos abaixo:

1. Pré-requisitos
Certifique-se de ter o Node.js e o npm instalados em sua máquina.

2. Instalação das Dependências
No terminal, navegue até a pasta raiz do projeto (TESTE VAGA TESTER 02) e execute o seguinte comando para instalar todas as dependências:

npm install

3. Execução dos Testes
Você pode executar os testes de duas maneiras:

Modo Interativo (Cypress Test Runner)
Para abrir a interface gráfica do Cypress e rodar os testes interativamente, use o comando:

npx cypress open

A partir da interface, você pode selecionar o tipo de teste (E2E Testing) e o navegador de sua preferência.

Modo headless (Linha de Comando)
Para rodar todos os testes em modo headless (sem interface gráfica), use o comando:

npx cypress run

Para rodar apenas um tipo de teste específico, você pode usar o comando npx cypress run --spec "cypress/e2e/<nome_da_pasta>/*". Por exemplo:

# Rodar apenas os testes de funcionalidade
npx cypress run --spec "cypress/e2e/funcionalidade/*"

- VISÃO GERAL DOS TESTES
Os testes estão organizados por categoria para facilitar a manutenção e a identificação dos problemas.

funcionalidade/: Testes que verificam se as funcionalidades do sistema estão operando corretamente (ex: arrastar e soltar, renomear elementos).

usabilidade/: Testes focados em como o usuário interage com a interface (ex: botões e ícones clicáveis).

visual/: Testes que detectam problemas visuais ou de layout (ex: textos truncados, cores inconsistentes).