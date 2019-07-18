const Company = require("../../models/company");
const db = require("../../db");
const ExpressError = require("../../helpers/expressError");


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

    describe("Company CRUD methods", () => {
        // Create tests
        describe("Create a company", () => {
            it("should create a company", async function() {
                let company = {
                    handle: "google",
                    name: "Google",
                    num_employees: 12345,
                    description: "test",
                    logo_url: "test.jpg"
                } 
            expect(await Company.create(company)).toEqual({
                handle: "google",
                name: "Google",
                num_employees: 12345,
                description: "test",
                logo_url: "test.jpg"
                });
            });

            // TODO: test for bad request

            it("should throw an error if bad request", async function() {
                expect(Company.create({})).rejects.toThrowError();
            });
        });

        // Query tests
        describe("Get a company based on query paramaters", function() {
            it("should return all companies if no paramters provided", async function() {
                expect((await Company.query({})).length).toEqual(3)
            });

            it("should return filtered results based on search term", async function() {
                expect(await Company.query({search: "company-test"})).toEqual([{
                    handle: "company-test",
                    name: "Company Test",
                    num_employees: 1,
                    description: "test",
                    logo_url: "test.jpg"
                }])
            });

            it("should retun filtered results based on minEmployees", async function() {
                expect(await Company.query({min_employees: 100})).toEqual([{
                    handle: "test-company",
                    name: "Test Company",
                    num_employees: 12345,
                    description: "test",
                    logo_url: "test.jpg"
                }])                
            });

            it("should retun filtered results based on maxEmployees", async function() {
                expect(await Company.query({max_employees: 2})).toEqual([{
                    handle: "company-test",
                    name: "Company Test",
                    num_employees: 1,
                    description: "test",
                    logo_url: "test.jpg"
                }])                
            });

            it("should return filtered results based on multiple criteria", async function() {
                expect(await Company.query({search:"test-company", min_employees: 2, max_employees: 100})).toEqual([{
                    handle: "test-company2",
                    name: "Test Company2",
                    num_employees: 12,
                    description: "test",
                    logo_url: "test.jpg"
                }])                
            });            

            it("should throw error if minEmployees is greater than max employees", async function() {
                expect(Company.query({min_employees: 100, max_employees: 2})).rejects.toThrowError(ExpressError);
            });
        })

        // Delete tests
        describe("Delete a company", () => {
            it("should not error when deleting a real company", function() {
                expect(Company.delete("test-company")).resolves.toEqual(undefined);
            });

            it("should error when deleting a non-existant company", function(){
                expect(Company.delete("WRONG")).rejects.toThrow();
            })
        });

        // Update tests
        describe("Update a company", () => {
            it("should update a company", async function() {
                let handle = "test-company"
                let items = { 
                    name: "Google",
                    num_employees: 7
                }
                expect(Company.update(items, handle)).resolves.toEqual({
                    handle: "test-company",
                    name: "Google",
                    num_employees: 7,
                    description: "test",
                    logo_url: "test.jpg"
                });
            });

            it("should throw an error if user is trying to update a company that does not exist in db", async function() {
                let handle = "wrong"
                let items = { 
                    name: "Google",
                    num_employees: 7
                }
                expect(Company.update(items, handle)).rejects.toThrow();
            });

        });        

        // Get tests
        describe("Get a company", () => {
            it("should return requested company's info", function() {  
                expect(Company.get("test-company")).resolves.toEqual({
                    handle: "test-company",
                    name: "Test Company",
                    num_employees: 12345,
                    description: "test",
                    logo_url: "test.jpg"
                });
            });

            it("should error when requesting information for a non-existant company", function(){
                expect(Company.get("WRONG")).rejects.toThrow();
            });        
        }); 



    });

    afterAll(async function() {
        await db.end();
    });
});
