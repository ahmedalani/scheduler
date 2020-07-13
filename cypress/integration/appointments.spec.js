describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("[data-testid=day]", "Monday");
  });
  it("should book an interview", () => {
    // click add
    cy.get("[alt=Add]").first().click();
    // enter student name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    // select interviewer
    cy.get("[alt='Sylvia Palmer']").click();
    // click save
    cy.contains("button", "Save").click();
    // check if appointment is booked and shown
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });
  it("should edit an interview", () => {
    // click edit
    cy.get("[alt=Edit]").click({ force: true });
    // change student name
    cy.get("[data-testid=student-name-input]").clear().type("Archie Cohen2");
    // select different interviewer
    cy.get("[alt='Tori Malcolm']").click();
    // click save
    cy.contains("button", "Save").click();
    // check if booking has been updated
    cy.contains(".appointment__card--show", "Archie Cohen2");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });
  it("should cancel an interview", () => {
    // click edit
    cy.get("[alt=Delete]").first().click({ force: true });
    // click confirm
    cy.contains("button", "Confirm").click();
    // check Deleting exist
    cy.contains("Deleting").should("exist");
    // check Deleting is no longer shown
    cy.contains("Deleting").should("not.exist");
    // check the appointmnet is no longer shown (deleted)
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
