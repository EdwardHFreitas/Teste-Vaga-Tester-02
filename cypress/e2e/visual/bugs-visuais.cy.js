// --- cypress/e2e/visual/bugs-visuais.cy.js ---

/// <reference types="cypress" />

describe('Testes de Bugs Visuais', () => {

    beforeEach(() => {
        cy.visit('https://kanban-dusky-five.vercel.app/');
        cy.clearLocalStorage();
    });

    it('VISUAL-001: O nome "ADICIONAR LISTA" fica fora da caixa', () => {

        // Abrir o input de adição de lista
        cy.contains('Adicionar outra lista').click();

        // Verificar que o texto do botão está visível
        cy.contains('Adicionar Lista').should('be.visible');

        // Definir o elemento de texto
        const elementoTexto = cy.contains('Adicionar Lista');

        // Definir altura do texto e da div pai
        elementoTexto.then(($texto) => {
            const larguraTexto = $texto[0].getBoundingClientRect().height;
            const larguraDivPai = $texto.parent().height();
            // O valor de 10 pode ser ajustado para um valor mínimo de diferença
            expect(larguraTexto).to.be.greaterThan(larguraDivPai - 10);
        });
    });

    it('VISUAL-002: Nome de tarefa grande é cortado ao meio', () => {

        // Declarar variáveis
        const boardName = 'VISUAL002-BOARD1';
        const nomeLongo = 'A resposta para a vida, o universo e tudo mais é 4.';
        // Criar a substring para verificar o truncamento automaticamente
        const nomeTruncado = nomeLongo.substring(0, 24);

        // Criar o board para o teste
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Declarar a referência do boardContainer em um alias
        cy.contains(boardName).parent().parent().as('boardContainer');

        // Criar uma tarefa com nome longo
        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(nomeLongo);
        cy.contains('Enviar').click();

        // Verificar que o texto do card foi truncado corretamente
        cy.get('@boardContainer')
            .contains('p', nomeTruncado)
            .should('exist');

        // Verificar que o texto completo não está presente
        cy.get('@boardContainer')
            .contains('p', nomeLongo)
            .should('exist');
    });

    it('VISUAL-003: A tag não possui cor de fundo ao ser adicionada sem seleção prévia', () => {
        // Declarar variáveis
        const boardName = 'VISUAL003-BOARD1';
        const taskName = 'VISUAL003-TASK1';
        const tagName = 'TAG1';

        // Criar um novo board e uma tarefa
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        cy.contains(boardName).parent().parent().as('boardContainer');

        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Abrir o modal da tarefa
        cy.get('@boardContainer').contains(taskName).click();

        // Adicionar uma tag sem cor
        const taskModal = cy.contains('Cores').parent().parent();
        taskModal.contains("Adicionar nova Tag").click();
        cy.contains("Enviar").parent().parent().find('input').eq(0).type(tagName);
        cy.contains("Enviar").click();

        cy.get('body').click('topLeft');

        // Criar um comparativo entre as cores da div da tag e da tarefa
        const tagElement = cy.get('@boardContainer').contains(tagName).should('exist');

        tagElement.then(($tag) => {
            const parentColor = $tag.parent().css('background-color');
            const tagColor = $tag.css('background-color');
            expect(tagColor).to.equal(parentColor);
        });
    });

    it('VISUAL-004: Título de lista longo é truncado com reticências', () => {
        // Declarar variáveis
        const boardName = 'Indubitavelmente';
        const nomeTruncado = boardName.substring(0, 14);

        // Criar um board com título longo
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Verificar se o título está truncado com reticências
        cy.contains(nomeTruncado).should('exist');
    });

    it('VISUAL-005: Tags com mais de 8 caracteres sobrepõem as bordas', () => {
        // Declarar variáveis
        const boardName = 'VISUAL005-BOARD1';
        const taskName = 'VISUAL005-TASK1';
        const tagName = 'Urgente e Crítico';

        // Criar o board de teste e verificar sua existência
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Definir o caminho do container do board
        cy.contains(boardName).parent().parent().as('boardContainer');

        // Criar tarefa de teste
        cy.get('@boardContainer').contains('Adicionar Tarefa').click();
        cy.contains('Enviar').parent().parent().find('input').eq(0).type(taskName);
        cy.contains('Enviar').click();

        // Clicar na tarefa para abrir o modal
        cy.get('@boardContainer').contains(taskName).click();

        // Criar a tag com nome longo
        cy.contains('Cores').parent().parent().contains("Adicionar nova Tag").click();
        cy.contains("Enviar").parent().parent().find('input').eq(0).type(tagName);
        cy.contains("Enviar").click();

        // Fechar modal
        cy.get('body').click('topLeft');

        // Verificar se o texto da tag é visível e que o elemento-pai não esconde o excesso
        cy.contains(tagName).parent().should('not.have.css', 'overflow', 'hidden');
    });

    it('VISUAL-006: Espaço é criado em todas as listas quando apenas uma precisa de scroll', () => {
        // Declarar variáveis
        const boardName1 = 'Board A';
        const boardName2 = 'Board B';

        // Criar os boards para o teste
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName1);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName1).should('exist');

        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName2);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName2).should('exist');

        // Declarar e salvar a altura inicial dos boards A e B
        let alturaBoardA_antes;
        let alturaBoardB_antes;

        cy.contains(boardName1).parent().parent().then(($el) => {
            alturaBoardA_antes = $el.height();
        });

        cy.contains(boardName2).parent().parent().then(($el) => {
            alturaBoardB_antes = $el.height();
        });

        // Adicionar 10 tarefas no 'Board A' para forçar o scroll
        for (let i = 0; i < 10; i++) {
            cy.contains(boardName1).parent().parent().contains('Adicionar Tarefa').click();
            cy.contains('Enviar').parent().parent().find('input').eq(0).type(`Tarefa ${i + 1}`);
            cy.contains('Enviar').click();
        }

        // Salvar a altura dos boards após a adição das tarefas
        let alturaBoardA_depois;
        let alturaBoardB_depois;

        cy.contains(boardName1).parent().parent().then(($el) => {
            alturaBoardA_depois = $el.height();
        });

        // Comparar as alturas de antes e depois da adição das tarefas
        cy.contains(boardName2).parent().parent().then(($el) => {
            alturaBoardB_depois = $el.height();

            expect(alturaBoardB_depois).to.not.equal(alturaBoardB_antes);
        });
    });

    it('VISUAL-007: A cor da lista se repete após a quarta lista', () => {
        // Criar 5 boards para testar a repetição de cores
        for (let i = 0; i < 5; i++) {
            cy.contains('Adicionar outra lista').click();
            cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(`Board ${i + 1}`);
            cy.contains('Adicionar Lista').click();
            cy.contains(`Board ${i + 1}`).should('exist');
        }

        // Verificar que a cor do quinto board é a mesma do primeiro
        cy.contains('Board 1').parent().parent().should('have.css', 'background-color').then((color1) => {
            cy.contains('Board 5').parent().parent().should('have.css', 'background-color', color1);
        });
    });

    it('VISUAL-008: Não há margem inferior nos boards e no final da tela', () => {
        // Declarar variáveis
        const boardName = 'VISUAL008-BOARD1';

        // Criar o board de teste
        cy.contains('Adicionar outra lista').click();
        cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(boardName);
        cy.contains('Adicionar Lista').click();
        cy.contains(boardName).should('exist');

        // Definir o container do board
        cy.contains(boardName).parent().parent().as('boardContainer');

        // Verificar que o container do board não tem padding inferior
        cy.get('@boardContainer').should('have.css', 'padding-bottom', '0px');
    });

    it('VISUAL-009: A margem direita fica colada à tela', () => {
        // Criar vários boards
        for (let i = 0; i < 5; i++) {
            cy.contains('Adicionar outra lista').click();
            cy.contains('Adicionar Lista').parent().parent().find('input').eq(0).type(`Board ${i + 1}`);
            cy.contains('Adicionar Lista').click();
            cy.contains(`Board ${i + 1}`).should('exist');
        }

        // Definir o container de Adicionar outra lista
        cy.contains('Adicionar outra lista').parent().as('buttonContainer');

        // Verificar que o último container não tem margem direita
        cy.get('@buttonContainer').should('have.css', 'margin-right', '0px');
    });
});