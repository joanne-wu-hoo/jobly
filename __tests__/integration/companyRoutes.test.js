const app = require("../../app");
const db = require("../../db");
const request = require("supertest");
const { g, beforeEachSeedData, afterEachTearDownData, cleanDate } = require("../../helpers/seedTestData")


describe("Company routes tests", function() {
  beforeEach(async function() {
    await beforeEachSeedData();
  });

  afterEach(async function() {
    await afterEachTearDownData();
  });

  /** GET/companies => {companies: [companyData, ...]} 
   * where companyData looks like: {handle, name, num_employees, description, logo_url}
   */
  describe("GET /companies", function() {
    it("returns info for all companies", async function() {
      let response = await request(app)
        .get("/companies");

      expect(response.body).toEqual({
        companies:
          [{
            handle: "test-company",
            name: "Test Company",
            num_employees: 12345,
            description: "test",
            logo_url: "test.jpg"
          }, {
            handle: "company-test",
            name: "Company Test",
            num_employees: 1,
            description: "test",
            logo_url: "test.jpg"
          }, {
            handle: "test-company2",
            name: "Test Company2",
            num_employees: 12,
            description: "test",
            logo_url: "test.jpg"
          }]
      });
    });

    it("throws error if min_employees < max_employees", async function() {

      let response = await request(app)
        .get("/companies?min_employees=100&max_employees=1");
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toEqual("Bad request, min_employees should be less than max_employees");

    });
  });

  /** POST/companies => {company: {handle, name, num_employees, description, logo_url}} */
  describe("POST /companies", function() {
    it("adds company", async function() {
      let newCompanyInfo = {
        handle: "test-add-company",
        name: "Test Add Company",
        num_employees: 12345,
        description: "test add description",
        logo_url: "test-add.jpg"
      }

      let response = await request(app)
        .post("/companies")
        .send(newCompanyInfo);

      expect(response.body).toEqual({
        company: newCompanyInfo
      });
    });

    it("throws error if user provides malformed data", async function() {
      let malformedCompanyInfo = {
        wrong: "test-add-company",
        name: "Test Add Company",
        num_employees: 12345,
        description: "test add description",
        logo_url: "test-add.jpg"
      }

      let response = await request(app)
        .post("/companies")
        .send(malformedCompanyInfo);
      expect(response.body.status).toEqual(400)

    });

    it("throws error if user tries to create a duplicate entry", async function() {
      let duplicateCompany = {
        handle: "test-company",
        name: "Test Company",
        num_employees: 12345,
        description: "test",
        logo_url: "test.jpg"
      };

      let response = await request(app)
        .post("/companies")
        .send(duplicateCompany);
      expect(response.body.status).toEqual(400)
      expect(response.body.message).toEqual("Company test-company already exists")
    });
  });

  /** GET/companies/[handle] =>  {company: {...companyData, jobs: [job, ...]}} */
  describe("GET/companies/[handle]", function() {
    it("returns requested company info", async function() {
      let response = await request(app)
        .get("/companies/test-company");

      expect(response.body).toEqual({
        company: {
          ...g.c1,
          jobs: [
            cleanDate(g.j1),
            cleanDate(g.j2)
          ]
        }
      });
    });

    it("throws error if user is requesting info for a company that does not exist", async function() {

      let response = await request(app)
        .get("/companies/wrong-company");
      expect(response.body.status).toEqual(404)
      expect(response.body.message).toEqual("Company with handle: wrong-company not found")

    });
  });

  /** PATCH/companies/[handle] =>  {company: {handle, name, num_employees, description, logo_url}} */
  describe("PATCH/companies/[handle]", function() {
    it("updates company info", async function() {
      let updatedCompanyInfo = {
        name: "Test updated Company",
        num_employees: 54321,
        description: "test updated description",
        logo_url: "test-update.jpg"
      }

      let response = await request(app)
        .patch("/companies/test-company")
        .send(updatedCompanyInfo);

      let expectedReturn = { handle: "test-company", ...updatedCompanyInfo };

      expect(response.body).toEqual({
        company: expectedReturn
      });
    });

    it("throws error if user provides malformed data (extra fields)", async function() {
      let wrongUpdatedCompanyInfo = {
        wrong: "wrong field"
      }


      let response = await request(app)
        .patch("/companies/test-company")
        .send(wrongUpdatedCompanyInfo);
      expect(response.body.status).toEqual(400)

    });

    it("throws error if user is trying to update a company that does not exist in the database", async function() {
      let updatedCompanyInfo = {
        name: "Test updated Company",
        num_employees: 54321,
        description: "test updated description",
        logo_url: "test-update.jpg"
      }

      let response = await request(app)
        .patch("/companies/wrong-company")
        .send(updatedCompanyInfo);
      expect(response.body.status).toEqual(404)
      expect(response.body.message).toEqual("Company with handle: wrong-company not found")

    });
  });

  /** DELETE/companies/[handle] =>  { message: "Company deleted" } */
  describe("DELETE/companies/[handle]", function() {
    it("deletes company info", async function() {
      let response = await request(app)
        .delete("/companies/test-company")

      expect(response.body).toEqual({
        message: "Company deleted"
      });
    });

    it("throws error if user is trying to delete a company that does not exist in the database", async function() {
      let response = await request(app)
        .delete("/companies/wrong-company")
      expect(response.body.status).toEqual(404)
      expect(response.body.message).toEqual("Company with handle: wrong-company not found")
    });
  });



  afterAll(async function() {
    await db.end();
  });
});
