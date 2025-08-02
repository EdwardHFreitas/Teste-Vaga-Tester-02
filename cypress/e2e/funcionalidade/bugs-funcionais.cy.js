// --- cypress/e2e/funcionalidade/bugs-funcionais.cy.js ---

/// <reference types="cypress" />

describe('Testes de Bugs de Funcionalidade', () => {

    beforeEach(() => {
        cy.visit('https://kanban-dusky-five.vercel.app/');
        cy.clearLocalStorage();
    });

    it('BUG-001: Não é possível arrastar uma tarefa de um board para o outro', () => {
        // Declarar variáveis
        const boardOrigem = 'Board de Origem';
        const boardDestino = 'Board de Destino';
        const taskName = 'BUG001_TEST1';

        // Adicionar board de origem e destino para teste
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardOrigem);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardOrigem).should('exist');

        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardDestino);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardDestino).should('exist');

        // Declarar caminho para o container do board de origem
        const boardContainerOrigem = cy.contains(boardOrigem).parent().parent();

        // Adicionar tarefa para testes
        boardContainerOrigem.contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Tentar arrastar a tarefa
        const dataTransfer = new DataTransfer();
        cy.contains(taskName).first().trigger('dragstart', { dataTransfer });
        const boardContainerDestino = cy.contains(boardDestino).parent().parent();
        boardContainerDestino.trigger('drop', { dataTransfer });

        // Verificar que a tarefa não foi movida
        boardContainerDestino.contains(taskName).should('not.exist');
    });

    it('BUG-002: Não é possível remover uma tag existente de uma tarefa', () => {
        // Declarar variáveis
        const boardName = 'BUG002-BOARD1';
        const taskName = 'BUG002-TASK1';
        const tagName = 'TAG1';

        // Criar lista e tarefa para testes
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        cy.contains(boardName).parent().parent().as('boardContainer');
        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Criar nova tag para testes dentro da tarefa
        cy.get('@boardContainer').contains(taskName).click();
        cy.contains(taskName).parent().parent().parent().contains("Adicionar nova Tag").click();
        cy.contains("Enviar").parent().parent().find('input').eq(0).type(tagName);
        cy.contains("Enviar").click();

        // Clicar fora do modal para fechá-lo
        cy.get('body').click('topLeft');

        // Reabrir a tarefa para inspecionar as tags
        cy.get('@boardContainer').contains(taskName).click();

        // Verificar que a tag existe, mas não há um botão para removê-la
        cy.contains(tagName).should('exist');
        cy.contains(tagName).parent().find('button').should('not.exist');
    });


    it('BUG-003: Não é possível renomear um board', () => {
        // Declarar variáveis
        const boardName = 'BUG003-BOARD1';

        // Criar lista e verificar se foi criada
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Clicar no board para tentar renomear
        const boardContainer = cy.contains(boardName).parent().parent();
        boardContainer.click();

        // Verificar que o nome não se tornou um campo de input após o clique
        cy.contains(boardName).parent().find('input').should('not.exist');

        // Tentar com clique duplo para abrir a edição de nome
        boardContainer.dblclick();
        cy.contains(boardName).parent().find('input').should('not.exist');
    });

    it('BUG-004: Não é possível renomear uma tag existente de uma tarefa', () => {
        // Declarar variáveis
        const boardName = 'BUG004-BOARD1';
        const taskName = 'BUG004-TASK1';
        const tagName = 'TAG1';

        // Criar novo Board e verificar se foi criado
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Criar nova tarefa
        cy.contains(boardName).parent().parent().as('boardContainer');
        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.get('@boardContainer').find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Abrir o modal da tarefa criada
        cy.get('@boardContainer').contains(taskName).click();

        // Adicionar uma tag
        cy.contains('Adicionar nova Tag').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(tagName);
        cy.contains('Enviar').click()

        // Sair do Modal
        cy.get('body').click('topLeft');
        cy.get('@boardContainer').contains(tagName).click();

        // Verificar que um campo de input "Renomear Tag" não apareceu
        cy.contains('Renomear Tag').should('not.exist');
    });

    it('BUG-005: Não é possível arrastar um board para mudar sua posição', () => {
        // Declarar variáveis que serão utilizadas
        const boardOrigem = 'Board de Origem';
        const boardDestino = 'Board de Destino';

        // Criar o board de origem e verificar se foi criado
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardOrigem);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardOrigem).should('exist');

        // Criar o board de destino e verificar se foi criada
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardDestino);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardDestino).should('exist');

        // Pegar a posição dos boards antes do arrastar
        let positionBoardOrigemBeforeDrag;
        let positionBoardDestinoBeforeDrag;
        cy.contains(boardOrigem).parent().parent().then(($el) => {
            positionBoardOrigemBeforeDrag = $el.position().left;
        });
        cy.contains(boardDestino).parent().parent().then(($el) => {
            positionBoardDestinoBeforeDrag = $el.position().left;
        });

        // Tentar arrastar o board de origem para a posição do board de destino
        const dataTransfer = new DataTransfer();
        cy.contains(boardOrigem).parent().parent().trigger('dragstart', { dataTransfer });
        cy.contains(boardDestino).parent().parent().trigger('drop', { dataTransfer });

        // Pegar a nova posição dos boards
        let positionBoardOrigemAfterDrag;
        let positionBoardDestinoAfterDrag;
        cy.contains(boardOrigem).parent().parent().then(($el) => {
            positionBoardOrigemAfterDrag = $el.position().left;
        });
        cy.contains(boardDestino).parent().parent().then(($el) => {
            positionBoardDestinoAfterDrag = $el.position().left;
        });

        // Verificar que a posição do board não mudou
        expect(positionBoardOrigemBeforeDrag).to.equal(positionBoardOrigemAfterDrag);
        expect(positionBoardDestinoBeforeDrag).to.equal(positionBoardDestinoAfterDrag);
    });

    it('BUG-006: É possível adicionar uma nova tarefa com um único espaço', () => {
        // Declarar variáveis que serão utilizadas
        const boardName = 'BUG006-BOARD1';

        // Adicionar lista para testes e verificar se realmente foi criada
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Adicionar tarefa em branco (com apenas um espaço)
        const boardContainer = cy.contains(boardName).parent().parent();
        boardContainer.contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(' ');
        cy.contains('Enviar').click();

        // Verificar se o card da tarefa foi criado e se o texto é um espaço vazio
        cy.contains(boardName).parent().parent().find('p').first().then(($el) => {
            expect($el.text().trim()).to.be.empty;
        });
    });
});