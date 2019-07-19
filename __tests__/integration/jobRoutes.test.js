const Company = require("../../models/company");
const Job = require("../../models/job");
const app = require("../../app");
const db = require("../../db");
const request = require("supertest");

let c1;
let j1;

function cleanDate(date) {
  return JSON.parse(JSON.stringify(date))
}

describe("Job routes tests", function() {
  beforeEach(async function() {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");

    c1 = await Company.create({
      handle: "test-company",
      name: "Test Company",
      num_employees: 12345,
      description: "test",
      logo_url: "test.jpg"
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

  /** GET/jobs => {jobs: [jobData, ...]} 
   * where jobData looks like: { id, title, salary, equity, company_handle, date_posted }
   */
  describe("GET /jobs", function() {
    it("returns info for all jobs", async function() {
      let response = await request(app)
        .get("/jobs");

      expect(response.body).toEqual({
        jobs:
          [{
            id: j1.id,
            title: "test-job",
            salary: 100,
            equity: .5,
            company_handle: "test-company",
            date_posted: cleanDate(j1.date_posted)
          }]
      });
    });
  });

  /** POST/jobs => {job: { id, title, salary, equity, company_handle, date_posted }} */
  describe("POST /jobs", function() {
    it("adds job", async function() {
      let newJobInfo = {
        title: "test-add-job",
        salary: 100,
        equity: .5,
        company_handle: "test-company",
      }

      let response = await request(app)
        .post("/jobs")
        .send(newJobInfo);

      expect(response.body).toEqual({
        job: {
          id: expect.any(Number),
          date_posted: expect.any(String),
          ...newJobInfo
        }
      });
    });

    it("throws error if user provides malformed data", async function() {
      let malformedJobInfo = {
          wrong: "test-add-job"
      }

      let response = await request(app)
        .post("/jobs")
        .send(malformedJobInfo);
      expect(response.body.status).toEqual(400)
    
    });
  });

  afterAll(async function() {
    await db.end();
  });
});