describe('add task', () => {
    it('should add a task', () => {
        cy.visit('http://localhost:3000');
        cy.get('input[placeholder="Username"]').type('user1');
        cy.get('input[placeholder="Password"]').type('pass1');
        cy.get('button[type="submit"]').click();

        cy.get('input[placeholder="New task"]').type('New Task');
        cy.get('button[type="submit"]').contains('Add Task').click();
        cy.get('li').should('contain', 'New Task');
    });
});