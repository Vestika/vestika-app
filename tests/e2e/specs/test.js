// https://docs.cypress.io/api/introduction/api.html

describe("Signin Page", () => {
  it("Visits the app root url and lands on Signin page", () => {
    cy.visit("/");
    cy.url().should("eq", "http://localhost:8080/#/signin");
  });

  it("Has email password and btns inputs", () => {
    const title = "[data-cy=title]";
    const emailInput = "[data-cy=emailInput]";
    const passwordInput = "[data-cy=passwordInput]";
    const forgotPass = "[data-cy=forgotPass]";
    const signin = "[data-cy=signin]";

    cy.get(title).should("have.text", "Login");

    cy.get(emailInput).should("be.visible");
    cy.get(emailInput).should("have.focus");

    cy.get(passwordInput)
      .type("test")
      .should("not.contain", "test");

    cy.get(forgotPass).should("contain", "Forgot Password?");

    cy.get(signin).should("contain", "Sign in");
  });
});
