// --- cypress/e2e/usabilidade/bugs-usabilidade.cy.js ---

/// <reference types="cypress" />

describe('Testes de Problemas de Usabilidade', () => {

    beforeEach(() => {
        cy.visit('https://kanban-dusky-five.vercel.app/');
        cy.clearLocalStorage();
    });

    it('USAB-001: O botão "+" não adiciona uma nova tarefa', () => {
        // Definir variáveis
        const boardName = 'USAB001-BOARD1';

        // Criar um novo board
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Declarar caminho do board de teste
        const boardContainer = cy.contains(boardName).parent().parent();

        // Tentar clicar no ícone de "+" (svg) para adicionar tarefa
        boardContainer.contains('Adicionar Tarefa').parent().parent().find('svg').click();

        // Verificar que o input de nova tarefa NÃO abriu
        boardContainer.contains('Enviar').should('not.exist');
    });

    it('USAB-002: A caixa de edição sobrepõe o nome da tarefa', () => {
        // Definir variáveis
        const boardName = 'USAB002-BOARD1';
        const taskName = 'USAB002-TASK1';

        // Criar um novo board para teste
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Declarar caminho para o board de teste
        const boardContainer = cy.contains(boardName).parent().parent();
        boardContainer.as('boardContainer');

        // Criar uma tarefa no board
        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Abrir a tarefa para edição
        cy.get('@boardContainer').contains(taskName).click();

        // Declarar o modal que abriu a tarefa
        const taskModal = cy.contains('Cores').parent().parent().parent();

        // Clicar no nome da tarefa para entrar no modo edição
        taskModal.contains(taskName).click()

        // Verificar se o modal de edição não existe
        taskModal.should('not.exist');
    });

    it('USAB-003: O botão "+" não adiciona uma nova tarefa', () => {
        // Definir variáveis
        const boardName = 'USAB003-BOARD1';
        const taskName = 'USAB003-TASK1'

        // Criar um novo board
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Declarar caminho do board de teste
        const boardContainer = cy.contains(boardName).parent().parent().as('boardContainer');

        // Criar uma tarefa no board
        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Abrir a tarefa para edição
        cy.get('@boardContainer').contains(taskName).click();

        // Declarar o modal que abriu a tarefa
        const taskModal = cy.contains('Cores').parent().parent().parent();

        // Tentar clicar no ícone de "+" (svg) para adicionar tarefa
        taskModal.contains(taskName).parent().parent().find('svg').click();

        // Verificar que o input de edição de nome NÃO apareceu
        taskModal.contains('Editar Nome da task').should('not.exist');
    });
});