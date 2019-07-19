const app = require("../../app");
const db = require("../../db");
const request = require("supertest");
const { g, beforeEachSeedData, afterEachTearDownData, cleanDate } = require("../../helpers/seedTestData")


describe("Job routes tests", function() {
  beforeEach(async function() {
    await beforeEachSeedData();
  });

  afterEach(async function() {
    await afterEachTearDownData();
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
            id: g.j1.id,
            title: "test-job",
            salary: 100,
            equity: .5,
            company_handle: "test-company",
            date_posted: cleanDate(g.j1.date_posted)
          }, 
          {
            id: g.j2.id,
            title: "test-job2",
            salary: 200,
            equity: .75,
            company_handle: "test-company",
            date_posted: cleanDate(g.j2.date_posted)            
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

  /** PATCH/jobs/[id] => {job: { id, title, salary, equity, company_handle, date_posted }} */
  describe("PATCH/jobs/[id]", function() {
    it("updates job info", async function() {
      let updatedJobInfo = {
        title: "test-updated-job",
        salary: 10,
        equity: .25,
        company_handle: "test-company"
      }

      let response = await request(app)
        .patch(`/jobs/${g.j1.id}`)
        .send(updatedJobInfo);

      expect(response.body).toEqual({
        job: {
          id: g.j1.id,
          date_posted: cleanDate(g.j1.date_posted),
          ...updatedJobInfo
        }
      });
    });

    it("throws error if user provides malformed data (extra fields)", async function() {
      let wrongUpdatedjobInfo = {
        wrong: "wrong field"
      }

      let response = await request(app)
        .patch(`/jobs/${g.j1.id}`)
        .send(wrongUpdatedjobInfo);
      expect(response.body.status).toEqual(400)

    });

    it("throws error if user is trying to update a job that does not exist in the database", async function() {
      let updatedjobInfo = {
        title: "test-updated-job",
        salary: 10,
        equity: .25,
        company_handle: "test-company"
      }

      let response = await request(app)
        .patch("/jobs/0")
        .send(updatedjobInfo);
      expect(response.body.status).toEqual(404)
      expect(response.body.message).toEqual("Job with id: 0 not found")

    });
  });

   /** DELETE/jobs/[id] =>  { message: "Job deleted" } */
   describe("DELETE/jobs/[id]", function() {
    it("deletes job info", async function() {
      let response = await request(app)
        .delete(`/jobs/${g.j1.id}`)

      expect(response.body).toEqual({
        message: "Job deleted"
      });
    });

    it("throws error if user is trying to delete a job that does not exist in the database", async function() {
      let response = await request(app)
        .delete("/jobs/0")
      expect(response.body.status).toEqual(404)
      expect(response.body.message).toEqual("Job with id: 0 not found")
    });
  });

  afterAll(async function() {
    await db.end();
  });
});