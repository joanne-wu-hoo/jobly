/** Job Routes */

const express = require("express");
// const Company = require("../models/Company");
const Job = require("../models/Job");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");

/** POST/jobs 
 * - creates a new job
 * - returns JSON of {job: jobData}
 */
router.post("/", async function(req, res, next) {
  // try {
  //     let companies = await Company.query(req.query)
  //     return res.json({companies})
  // } catch(err) {
  //     return next(err)
  // }
});

/** GET/jobs 
 * - return JSON of {jobs: [job, ...]}
 */
router.get("/", async function(req, res, next) {
  // try {
  //     let companies = await Company.query(req.query)
  //     return res.json({companies})
  // } catch(err) {
  //     return next(err)
  // }
});

module.exports = router;
