const Company = require("../../models/company");
const db = require("../../db");
const ExpressError = require("../../helpers/expressError");


describe("Company model tests", function() {
  beforeEach(async function () {
    await db.query("DELETE FROM companies");

    let c1 = await Company.create({
      handle: "test-company",
      name: "Test Company",
      num_employees: 12345,
      description: "test",
      logo_url: "test.jpg"
    });

    let c2 = await Company.create({
      handle: "company-test",
      name: "Company Test",
      num_employees: 1,
      description: "test",
      logo_url: "test.jpg"
    });

    let c3 = await Company.create({
      handle: "test-company2",
      name: "Test Company2",
      num_employees: 12,
      description: "test",
      logo_url: "test.jpg"
    })
  });

  afterEach(async function () {
    await db.query("DELETE FROM companies");
  });

  describe("Company CRUD methods", function() {
    // Create tests
    describe("Create a company", function() {
      it("should create a company", async function () {
        let company = {
          handle: "google",
          name: "Google",
          num_employees: 12345,
          description: "test",
          logo_url: "test.jpg"
        }
        expect(await Company.create(company)).toEqual({
          handle: "google",
          name: "Google",
          num_employees: 12345,
          description: "test",
          logo_url: "test.jpg"
        });
      });

      it("should throw an error if bad request", async function () {
        expect(Company.create({})).rejects.toThrowError();
      });
    });

    // Query tests
    describe("Get a company based on query paramaters", function () {
      it("should return all companies if no paramters provided", async function () {
        expect((await Company.query({})).length).toEqual(3)
      });

      it("should return filtered results based on search term", async function () {
        expect(await Company.query({ search: "company-test" })).toEqual([{
          handle: "company-test",
          name: "Company Test",
          num_employees: 1,
          description: "test",
          logo_url: "test.jpg"
        }])
      });

      it("should retun filtered results based on minEmployees", async function () {
        expect(await Company.query({ min_employees: 100 })).toEqual([{
          handle: "test-company",
          name: "Test Company",
          num_employees: 12345,
          description: "test",
          logo_url: "test.jpg"
        }])
      });

      it("should retun filtered results based on maxEmployees", async function () {
        expect(await Company.query({ max_employees: 2 })).toEqual([{
          handle: "company-test",
          name: "Company Test",
          num_employees: 1,
          description: "test",
          logo_url: "test.jpg"
        }])
      });

      it("should return filtered results based on multiple criteria", async function () {
        expect(await Company.query({ search: "test-company", min_employees: 2, max_employees: 100 })).toEqual([{
          handle: "test-company2",
          name: "Test Company2",
          num_employees: 12,
          description: "test",
          logo_url: "test.jpg"
        }])
      });

      it("should throw error if minEmployees is greater than max employees", async function () {
        expect(Company.query({ min_employees: 100, max_employees: 2 })).rejects.toThrowError(ExpressError);
      });
    })

    // Delete tests
    describe("Delete a company", function() {
      it("should not error when deleting a real company", async function () {
        expect(await Company.delete("test-company")).toEqual(undefined);
      });

      it("should error when deleting a non-existant company", async function () {
        expect.hasAssertions();
        try {
          await Company.delete("wrong");
        } catch(err) {
          expect(err.status).toEqual(404);
          expect(err.message).toEqual("Company with handle: wrong not found");
        }        
      })
    });

    // Update tests
    describe("Update a company", function() {
      it("should update a company", async function () {
        let handle = "test-company"
        let items = {
          name: "Google",
          num_employees: 7
        }

        expect(await Company.update(items, handle)).toEqual({
          handle: "test-company",
          name: "Google",
          num_employees: 7,
          description: "test",
          logo_url: "test.jpg"
        });
      });

      it("should throw an error if user is trying to update a company that does not exist in db", async function () {
        let handle = "wrong"
        let items = {
          name: "Google",
          num_employees: 7
        }

        expect.hasAssertions();

        try {
          await Company.update(items, handle);
        } catch(err) {
          expect(err.status).toEqual(404);
          expect(err.message).toEqual("Company with handle: wrong not found");
        }
      });

    });

    // Get tests
    describe("Get a company", function() {
      it("should return requested company's info", async function () {
        expect(await Company.get("test-company")).toEqual({
          handle: "test-company",
          name: "Test Company",
          num_employees: 12345,
          description: "test",
          logo_url: "test.jpg"
        });
      });

      it("should error when requesting information for a non-existant company", async function () {
        expect.hasAssertions();
        try {
          await Company.get("wrong");
        } catch(err) {
          expect(err.status).toEqual(404);
          expect(err.message).toEqual("Company with handle: wrong not found");
        }
      });
    });
  });

  afterAll(async function () {
    await db.end();
  });
});
