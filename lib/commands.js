Cypress.Commands.add('snapshot', (
  title,
  {widths, browsers, hideSelectors, selectors} = {},
) => {
  cy.document().then(d => {
    const source = d.documentElement.outerHTML;
    cy.task('snapshot', { title, widths, browsers, hideSelectors, selectors, source, });
  })
});