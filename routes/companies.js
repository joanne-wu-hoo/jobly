/** Company Routes */

const express = require("express");
const Company = require("../models/Company");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");

// NOTE: companyData, referenced in doc strings below, looks like: 
//       {handle, name, num_employees, description, logo_url}

/** GET /companies returns JSON with info for all companies
 * - accepts three possible query strings: search, min_employees, max_employees
 * - returns JSON: {companies: [companyData, ...]}
 */
router.get("/", async function(req, res, next) {
    try {
        let companies = await Company.query(req.query)
        return res.json({companies})
    } catch(err) {
        return next(err)
    }
});

/** POST /companies adds company to DB
 * - returns JSON for added company: {company: [companyData, ...]}
 */
const createCompanySchema = require("../schemas/companies/createCompanySchema.json");

router.post("/", async function(req, res, next) {
    const result = jsonschema.validate(req.body, createCompanySchema);

    // JSON validator errors
    if (!result.valid) {
        let listOfErrors = result.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }

    try {
        let company = await Company.create(req.body);
        return res.json({ company });
    } catch(err) {
        // 404 (trying to access company that does not exist)
        return next(err);
    }
});

/** GET /companies/[handle] 
 * - return JSON for requested company: {company: companyData}
 * - or throws 404
 */

router.get("/:handle", async function(req, res, next) {
    try {
        company = await Company.get(req.params.handle);
        return res.json({company})
    } catch(err) {
        return next(err)  
    }
});

/** PATCH /companies/[handle] 
 * - given company handle and complete or partial data to update, update data in db
 * - return JSON for updated company: {company: companyData}
 * - or throw 404
 */
const updateCompanySchema = require("../schemas/companies/updateCompanySchema.json");

router.patch("/:handle", async function(req, res, next) {
    const result = jsonschema.validate(req.body, updateCompanySchema);

    if (!result.valid) {
        let listOfErrors = result.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }

    try {
        let company = await Company.update(req.body, req.params.handle);
        return res.json({ company });
    } catch(err) {
        return next(err);
    }
});

/** DELETE /companies/[handle] 
 * - given company handle, delete company from db
 * - return delete message {message: "Company deleted"}
 * - or throw 404
 */
router.delete("/:handle", async function(req, res, next) {
    try {
        await Company.delete(req.params.handle);
        return res.json({message: "Company deleted"});
    } catch(err) {
        return next(err);      
    }
});

module.exports = router;
