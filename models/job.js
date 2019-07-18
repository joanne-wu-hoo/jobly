const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

// NOTE: jobData is of form { title, salary, equity, company_handle, date_posted }

class Job {
  // create, update, get, query, delete

  /** register new job 
   * - return {job: jobData }
   * - or throw a 400 error if user is trying to create a duplicate job 
   *  NOTE: used in POST/jobs
   */
  static async create() {
      // const companyExist = await db.query("SELECT handle FROM companies WHERE handle=$1", [handle])

      // if(companyExist.rows.length > 0){
      //     throw new ExpressError(`Company ${handle} already exists`, 400)
      // }
      
      // const result = await db.query(
      //     `INSERT INTO companies (
      //             handle,
      //             name,
      //             num_employees,
      //             description,
      //             logo_url)
      //         VALUES ($1, $2, $3, $4, $5)
      //         RETURNING handle, name, num_employees, description, logo_url`,
      //     [handle, name, num_employees, description, logo_url]);
                  
      // return result.rows[0];
  }

  /** given:
   * - items: an object with keys of data table columns and values of updated values 
   * - id: a job's id
   * return:
   * - { title, salary, equity, company_handle, date_posted }
   * - or throw a 404 error
   * 
   * NOTE: Used in PATCH/job/:id
   */
  static async update(items, id){
    const { query, values } = sqlForPartialUpdate('jobs', items, 'id', id);

    const result = await db.query(query, values);

    let job = result.rows[0];

    if (!job){
        throw new ExpressError(`Job with id: ${id} not found`, 404);
    }
    return {
        // handle: company.handle,
        // name: company.name,
        // num_employees: company.num_employees,            
        // description: company.description,
        // logo_url: company.logo_url, 
    };
  }

  /** given a job id, 
   * - return { title, salary, equity, company_handle, date_posted }
   * - or throw a 404 error
   * NOTE: Used in GET/jobs
   */
  static async get(id) {
    // const result = await db.query(
    //   `SELECT handle,
    //             name,
    //             num_employees,
    //             description,
    //             logo_url
    //         FROM companies
    //         WHERE handle = $1`,
    //   [handle]
    // )

    // let company = result.rows[0];

    // if (!company) {
    //   throw new ExpressError(`Company with handle: ${handle} not found`, 404);
    // }

    // return company;
  }    

}

  
  
module.exports = Company