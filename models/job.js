const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/sqlQueries/partialUpdate");
const sqlForJobQuery = require("../helpers/sqlQueries/jobQuery");

// NOTE: jobData is of form { id, title, salary, equity, company_handle, date_posted }

class Job {
  /** register new job 
   * - return { id, title, salary, equity, company_handle, date_posted } 
   *  NOTE: used in POST/jobs
   */
  static async create({ title, salary, equity, company_handle }) {
      const result = await db.query(
          `INSERT INTO jobs (
                  title,
                  salary,
                  equity,
                  company_handle)
              VALUES ($1, $2, $3, $4)
              RETURNING id, title, salary, equity, company_handle, date_posted`,
          [title, salary, equity, company_handle]);
                   
      return result.rows[0];
  }

  /** update job 
   * given:
   * - items: an object with keys of data table columns and values of updated values 
   * - id: a job's id
   * return:
   * - { id, title, salary, equity, company_handle, date_posted }
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
      id: job.id,
      title: job.title,
      salary: job.salary,
      equity: job.equity,
      company_handle: job.company_handle,
      date_posted: job.date_posted
    };
  }

  /** query jobs 
   * given req.query (an object with  key/value pairs search term, min_salary, and min_equity)
   * query database and return [jobData, jobData...] 
   * where jobData = { id, title, salary, equity, company_handle, date_posted }
   * 
   * NOTE: Used in GET/jobs, query string parameters search, min_salary, min_equity
   */

  static async query(queryObj) {
    let {finalQuery, values} = sqlForJobQuery(queryObj);

    let result = await db.query(finalQuery, values);
    return result.rows;
  }

  /** get a job
   * - given a job id, 
   * - return { id, title, salary, equity, company_handle, date_posted }
   * - or throw a 404 error
   * NOTE: Used in GET/jobs
   */
  static async get(id) {
    const result = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle,
              date_posted
            FROM jobs
            WHERE id = $1`,
      [id]
    )

    let job = result.rows[0];

    if (!job) {
      throw new ExpressError(`Job with id: ${id} not found`, 404);
    }

    return job;
  }    

  /** delete a job 
   * given a job id, delete job from database, and return deletion confirmation message
   * NOTE: Used in DELETE/jobs/:id
   */
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM jobs
               WHERE id = $1 
               RETURNING id`,
      [id]);

    if (result.rows.length === 0) {
      throw new ExpressError(`Job with id: ${id} not found`, 404);
    }
  }

}

  
  
module.exports = Job