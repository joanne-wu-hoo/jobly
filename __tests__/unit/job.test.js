const Job = require("../../models/job");
const Company = require("../../models/company");
const db = require("../../db");

let j1;

describe("Job model tests", function() {
  beforeEach(async function() {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");

    c1 = await Company.create({
      handle: "test-company",
      name: "Test Company",
      num_employees: 12345,
      description: "test company",
      logo_url: "test-company.jpg"
    });

    j1 = await Job.create({
      title: "test-job",
      salary: 100,
      equity: .5,
      company_handle: "test-company"
    });

  });

  afterEach(async function() {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");
  });

  // Get tests
  describe("Get a job", function() {
    it("should return requested job's info", async function () {
      expect(await Job.get(j1.id)).toEqual(j1);
    });

    it("should error when requesting information for a non-existant job", async function () {
      expect.hasAssertions();
      try {
        await Job.get(0);
      } catch(err){
        expect(err.status).toEqual(404)
        expect(err.message).toEqual("Job with id: 0 not found");
      }
    });
  });

  // Query tests
  describe("Get a job based on query paramaters", function () {
    it("should return jobs from database", async function () {
      expect((await Job.query({})).length).toEqual(1)
    });
  });

  // Update tests
  describe("Update a job", () => {
    it("should update a job", async function() {
      let id= j1.id
      let items = { 
          salary: 1000000,
          equity: .75
      }
      expect(await Job.update(items, id)).toEqual({
        id: j1.id,
        title: "test-job",
        salary: 1000000,
        equity: .75,
        date_posted: j1.date_posted,
        company_handle: "test-company"
      });
    });
  
    it("should throw an error if user is trying to update a company that does not exist in db", async function() {
      let id = 0
      let items = { 
        salary: 1000000,
        equity: .75
      }
      expect.hasAssertions();
      try {
        await Job.update(items, id);
      } catch(err) {
        expect(err.status).toEqual(404);
        expect(err.message).toEqual("Job with id: 0 not found");
      }
    });
  });        

  // Create tests
  describe("Create a job", function() {
    it("should create a job", async function() {
      let newJob = {
        title: "test-job-2",
        salary: 750,
        equity: .75,
        company_handle: "test-company"
      } 
      expect(await Job.create(newJob)).toEqual({
        id: expect.any(Number),
        title: "test-job-2",
        salary: 750,
        equity: .75,
        company_handle: "test-company",
        date_posted: expect.any(Date)
      });
    });
  });

  // Delete tests
  describe("Delete a job", function() {
    it("should not error when deleting a real job", async function() {
      expect(await Job.delete(j1.id)).toEqual(undefined);
    });

    it("should error when deleting a non-existant job", async function(){
      expect.hasAssertions();
      try {
        await Job.delete(0);
      } catch(err) {
        expect(err.status).toEqual(404);
        expect(err.message).toEqual("Job with id: 0 not found");
      }
    });
  });
    
  
  afterAll(async function() {
    await db.end();
  });

});