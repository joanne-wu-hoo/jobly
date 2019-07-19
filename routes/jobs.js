/** Job Routes */

const express = require("express");
// const Company = require("../models/Company");
const Job = require("../models/Job");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");

// NOTE: jobData is of form { id, title, salary, equity, company_handle, date_posted }

/** POST/jobs 
 * - creates a new job
 * - returns JSON of {job: jobData}
 */

const createJobSchema = require("../schemas/jobs/createJobSchema.json");

router.post("/", async function(req, res, next) {
  const result = jsonschema.validate(req.body, createJobSchema);

  // JSON validator errors
  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
      let job = await Job.create(req.body)
      return res.json({job})
  } catch(err) {
      // 500 (server error)
      return next(err)
  }
});

/** GET/jobs 
 * - return JSON of {jobs: [jobData, ...]}
 */
router.get("/", async function(req, res, next) {
  try {
      let jobs = await Job.query(req.query)
      return res.json({jobs})
  } catch(err) {
      return next(err)
  }
});

/** GET/jobs/:id
 * - return JSON of {job: jobData }
 */
router.get("/:id", async function(req, res, next) {
  try {
      let jobs = await Job.get(req.params.id);
      return res.json({jobs})
  } catch(err) {
      return next(err)
  }
});

/** PATCH/jobs/:id
 * - return JSON of {job: jobData}
 */
const updateJobSchema = require("../schemas/jobs/updateJobSchema.json");

router.patch("/:id", async function(req, res, next) {
  const result = jsonschema.validate(req.body, updateJobSchema);

  // JSON validator errors
  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
      let job = await Job.update(req.body, req.params.id);
      return res.json({job})
  } catch(err) {
      // 404 (trying to update job that does not exist)
      return next(err)
  }
});

/** DELETE/jobs/:id
 * - return JSON of { message: "Job deleted" }
 */
router.delete("/:id", async function(req, res, next) {
  try {
      await Job.delete(req.params.id);
      return res.json({ message: "Job deleted" });
  } catch(err) {
      return next(err)
  }
});

module.exports = router;
