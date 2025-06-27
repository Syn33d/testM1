// describe('add task', () => {
//     it('should add a task', () => {
//         cy.visit('http://localhost:3000');
//         cy.get('input[placeholder="Username"]').type('user1');
//         cy.get('input[placeholder="Password"]').type('pass1');
//         cy.get('button[type="submit"]').click();

//         cy.get('input[placeholder="New task"]').type('New Task');
//         cy.get('button[type="submit"]').contains('Add Task').click();
//         cy.get('li').should('contain', 'New Task');
//     });
// });

describe('Convert Currency then calculate TVA', () => {
    it('should convert currency and calculate TVA', () => {
        cy.visit('http://localhost:3000');

        //Conversion
        cy.get('input[data-cy="conversion"]').clear().type('100');
        cy.get('select[data-cy="from"]').select('EUR');
        cy.get('select[data-cy="to"]').select('USD');
        cy.get('button[type="submit"]').contains('Convertir').click();
        cy.get('div[data-cy="conversionResult"]').should('contain', '110');

        //Calcul TVA
        cy.get('input[data-cy="ht"]').clear().type('100');
        cy.get('input[data-cy="tva"]').clear().type('20');
        cy.get('button[type="submit"]').contains('Calculer TTC').click();
        cy.get('div[data-cy="ttcResult"]').should('contain', '120');
        cy.get('div[data-cy="calculValues"]').should('contain', 'HT : 100, TVA : 20%');

        //Application Remise
        cy.get('input[data-cy="prix"]').clear().type('100');
        cy.get('input[data-cy="remise"]').clear().type('10');
        cy.get('button[type="submit"]').contains('Appliquer Remise').click();
        cy.get('div[data-cy="remiseResult"]').should('contain', '90');
        cy.get('div[data-cy="remiseValues"]').should('contain', 'Prix initial : 100, Remise : 10%');
    });
});