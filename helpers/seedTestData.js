const Company = require("../models/company");
const Job = require("../models/job");
const db = require("../db");

g = {}

async function beforeEachSeedData() {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");
    g.c1 = await Company.create({
        handle: "test-company",
        name: "Test Company",
        num_employees: 12345,
        description: "test",
        logo_url: "test.jpg"
    });

    g.c2 = await Company.create({
        handle: "company-test",
        name: "Company Test",
        num_employees: 1,
        description: "test",
        logo_url: "test.jpg"
    });

    g.c3 = await Company.create({
        handle: "test-company2",
        name: "Test Company2",
        num_employees: 12,
        description: "test",
        logo_url: "test.jpg"
    });

    g.j1 = await Job.create({
        title: "test-job",
        salary: 100,
        equity: .5,
        company_handle: "test-company"
    });

    g.j2 = await Job.create({
        title: "test-job2",
        salary: 200,
        equity: .75,
        company_handle: "test-company",
        date_posted: "2018-01-01"
    });
}

async function afterEachTearDownData() {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM jobs");
}


function cleanDate(date) {
    return JSON.parse(JSON.stringify(date))
} 

module.exports = {
    g,
    beforeEachSeedData,
    afterEachTearDownData,
    cleanDate
}