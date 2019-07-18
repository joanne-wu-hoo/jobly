/** Company Routes */

const express = require("express");
const Company = require("../models/Company");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");

// NOTE: companyData, referenced in doc strings below, is of form {handle, name, num_employees, description, logo_url}

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
 * - returns JSON of added company: {companies: [companyData, ...]}
 */
const createCompanySchema = require("../schemas/companies/createCompanySchema.json");

router.post("/", async function(req, res, next) {
    const result = jsonschema.validate(req.body, createCompanySchema);

    if (!result.valid) {
        let listOfErrors = result.errors.map(error => error.stack);
        let error = new ExpressError(listOfErrors, 400);
        return next(error);
    }

    try {
        let companies = await Company.create(req.body);
        return res.json({ companies });
    } catch(err) {
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

/** PATCH /companies/[handle] updates existing company based on complete or partial data
 *  - returns JSON for requested company: {company: companyData}
 * - or throws 404
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

/** DELETE /companies/[handle] deletes existing company based on handle
 *  - returns delete message on success: {message: "Company deleted"}
 * - or throws 404*/
router.delete("/:handle", async function(req, res, next) {
    try {
        await Company.delete(req.params.handle);
        return res.json({message: "Company deleted"});
    } catch(err) {
        return next(err);      
    }
});

module.exports = router;
