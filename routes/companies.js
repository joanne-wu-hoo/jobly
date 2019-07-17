/** Company Routes */

const express = require("express");
const Company = require("../models/Company");
const router = new express.Router();

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
router.post("/", async function(req, res, next) {
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
router.patch("/:handle", async function(req, res, next) {
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
