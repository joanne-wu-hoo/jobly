const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Company {

  /** register new company 
   * - return {handle, name, num_employees, description, logo_url}
   * - or throw a 400 error
   *  NOTE: used in POST/companies
   */

  static async create({ handle, name, num_employees, description, logo_url }) {
    const companyExist = await db.query("SELECT handle FROM companies WHERE handle=$1", [handle])

    if (companyExist.rows.length > 0) {
      throw new ExpressError(`Company ${handle} already exists`, 400)
    }

    const result = await db.query(
      `INSERT INTO companies (
                    handle,
                    name,
                    num_employees,
                    description,
                    logo_url)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]);

    return result.rows[0];
  }

  /** given a company handle, 
   * - return {handle, name, num_employees, description, logo_url}
   * - or throw a 404 error
   * NOTE: Used in GET/companies
   */
  static async get(handle) {
    const result = await db.query(
      `SELECT handle,
                name,
                num_employees,
                description,
                logo_url
            FROM companies
            WHERE handle = $1`,
      [handle]
    )

    let company = result.rows[0];

    if (!company) {
      throw new ExpressError(`Company with handle: ${handle} not found`, 404);
    }

    return company;
  }

  /** given:
   * - items: an object with keys of data table columns and values of updated values 
   * - handle: a company's handle
   * return:
   * - {handle, name, num_employees, description, logo_url}
   * - or throw a 404 error
   * 
   * NOTE: Used in PATCH/companies/:handle
   */
  static async update(items, handle) {
    const { query, values } = sqlForPartialUpdate('companies', items, 'handle', handle);

    const result = await db.query(query, values);

    let company = result.rows[0];

    if (!company) {
      throw new ExpressError(`Company with handle: ${handle} not found`, 404);
    }
    return {
      handle: company.handle,
      name: company.name,
      num_employees: company.num_employees,
      description: company.description,
      logo_url: company.logo_url,
    };
  }

  /** given a company handle, delete company from database, and return deletion confirmation message
   * NOTE: Used in DELETE/companies/:handle
   */
  static async delete(handle) {
    const result = await db.query(
      `DELETE FROM companies
               WHERE handle = $1 
               RETURNING handle`,
      [handle]);

    if (result.rows.length === 0) {
      throw new ExpressError(`Company with handle: ${handle} not found`, 404);
    }
  }

  /** given req.query (an object with  key/value pairs search term, minEmployees, and maxEmployees)
   * query database and return [companyData, companyData...] 
   * where companyData = {handle, name, num_employees, description, logo_url}
   * 
   * NOTE: Used in GET/companies, query string parameters search, minEmployees, maxEmployees
   */
  static async query({ search, min_employees, max_employees }) {
    let minEmployees = min_employees;
    let maxEmployees = max_employees;

    if (minEmployees > maxEmployees) {
      // console.log("min employees > max employees");
      throw new ExpressError("Bad request, min_employees should be less than max_employees", 400);
    }

    let baseQuery =
      `SELECT handle, 
            name, 
            num_employees, 
            description, 
            logo_url 
         FROM companies
        `
    let whereClause = [];
    let idx = 1;
    let values = [];

    if (search !== undefined) {
      let searchTerm = `%${search}%`;
      whereClause.push(`(name ILIKE $${idx} OR handle ILIKE $${idx})`);
      values.push(searchTerm);
      idx++;
    }

    if (minEmployees !== undefined) {
      whereClause.push(`(num_employees >= $${idx})`);
      values.push(minEmployees);
      idx++;
    }

    if (maxEmployees !== undefined) {
      whereClause.push(`(num_employees <= $${idx})`);
      values.push(maxEmployees);
      idx++;
    }

    let finalQuery = (whereClause.length === 0)
      ? baseQuery
      : baseQuery + " WHERE " + whereClause.join(" AND "); 

    let result = await db.query(finalQuery, values);
    return result.rows;
  }

}


// async function test() {  
//     let res = await Company.query({minEmployees: 100, maxEmployees: 2});
// }

// test()


module.exports = Company