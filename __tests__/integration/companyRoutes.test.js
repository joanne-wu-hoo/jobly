const Company = require("../../models/company");
const app = require("../../app");
const db = require("../../db");
const request = require("supertest");

describe("Company model tests", () => {
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

    /** GET/companies => {companies: [companyData, ...]} 
     * where companyData looks like: {handle, name, num_employees, description, logo_url}
     */
    describe("GET /companies", function () {
        test("returns info for all companies", async function () {
            let response = await request(app)
                .get("/companies");

            expect(response.body).toEqual({
                companies:
                [{
                    handle: "test-company",
                    name: "Test Company",
                    num_employees: 12345,
                    description: "test",
                    logo_url: "test.jpg"
                },
                {
                    handle: "company-test",
                    name: "Company Test",
                    num_employees: 1,
                    description: "test",
                    logo_url: "test.jpg"
                },
                {
                    handle: "test-company2",
                    name: "Test Company2",
                    num_employees: 12,
                    description: "test",
                    logo_url: "test.jpg"
                }]
            });
        });

        test("throws error if user tries to create a duplicate entry", async function () {
            // let response = await request(app)
            //     .get("/companies");

            // expect(response.body).toEqual({
            //     companies:
            //     [{
            //         handle: "test-company",
            //         name: "Test Company",
            //         num_employees: 12345,
            //         description: "test",
            //         logo_url: "test.jpg"
            //     },
            //     {
            //         handle: "company-test",
            //         name: "Company Test",
            //         num_employees: 1,
            //         description: "test",
            //         logo_url: "test.jpg"
            //     },
            //     {
            //         handle: "test-company2",
            //         name: "Test Company2",
            //         num_employees: 12,
            //         description: "test",
            //         logo_url: "test.jpg"
            //     }]
            // });
        });

        test("throws error if min_employees < max_exmployees", async function () {
            // let response = await request(app)
            //     .get("/companies");

            // expect(response.body).toEqual({
            //     companies:
            //     [{
            //         handle: "test-company",
            //         name: "Test Company",
            //         num_employees: 12345,
            //         description: "test",
            //         logo_url: "test.jpg"
            //     },
            //     {
            //         handle: "company-test",
            //         name: "Company Test",
            //         num_employees: 1,
            //         description: "test",
            //         logo_url: "test.jpg"
            //     },
            //     {
            //         handle: "test-company2",
            //         name: "Test Company2",
            //         num_employees: 12,
            //         description: "test",
            //         logo_url: "test.jpg"
            //     }]
            // });
        });


    });

    /** POST/companies => {company: {handle, name, num_employees, description, logo_url}} */
    describe("POST /companies", function () {
        test("adds company", async function () {
            let newCompanyInfo = {
                handle: "test-add-company",
                name: "Test Add Company",
                num_employees: 12345,
                description: "test add description",
                logo_url: "test-add.jpg"
            }

            let response = await request(app)
                .post("/companies")
                .send(newCompanyInfo);

            expect(response.body).toEqual({
                company: newCompanyInfo
            });
        });

        test("throws error if user provides malformed data", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });
    });

    /** GET/companies/[handle] =>  {company: {handle, name, num_employees, description, logo_url}} */
    describe("GET/companies/[handle]", function () {
        test("returns requested company info", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });

        test("throws error if user is requesting info for a company that does not exist", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });
    });

    /** PATCH/companies/[handle] =>  {company: {handle, name, num_employees, description, logo_url}} */
    describe("PATCH/companies/[handle]", function () {
        test("updates company info", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });

        test("throws error if user provides malformed data (too many fields)", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });

        test("throws error if user is trying to update a company that does not exist in the database", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });
    }); 
 
    /** DELETE/companies/[handle] =>  { message: "Company deleted" } */
    describe("DELETE/companies/[handle]", function () {
        test("deletes company info", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });

        test("throws error if user is trying to delete a company that does not exist in the database", async function () {
            // let newCompanyInfo = {
            //     handle: "test-add-company",
            //     name: "Test Add Company",
            //     num_employees: 12345,
            //     description: "test add description",
            //     logo_url: "test-add.jpg"
            // }

            // let response = await request(app)
            //     .post("/companies")
            //     .send(newCompanyInfo);

            // expect(response.body).toEqual({
            //     company: newCompanyInfo
            // });
        });
    });     

    afterAll(async function() {
        await db.end();
    });
});


