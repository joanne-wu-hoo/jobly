/**
 * Generate a SQL query and array of parameters based on a request body with key/value pairs for search, min_salary, and min_equity:
 *
 * Returns object containing a DB query as a string, and array of string values to be updated
 *
 */

function sqlForJobQuery({search, min_salary, min_equity}) {
  let baseQuery = 
    `SELECT id,
      title,
      salary,
      equity,
      company_handle,
      date_posted
    FROM jobs`;

  let whereClause = [];
  let idx = 1;
  let values = [];

  if (search !== undefined) {
    let searchTerm = `%${search}%`;
    whereClause.push(`(title ILIKE $${idx})`);
    values.push(searchTerm);
    idx++;
  }

  if (min_salary !== undefined) {
    whereClause.push(`(salary >= $${idx})`);
    values.push(min_salary);
    idx++;
  }

  if (min_equity !== undefined) {
    whereClause.push(`(equity >= $${idx})`);
    values.push(min_equity);
    idx++;
  }

  let orderByClause = " ORDER BY date_posted DESC"

  let finalQuery = (whereClause.length === 0) 
    ? baseQuery + orderByClause
    : baseQuery + " WHERE " + whereClause.join(" AND ") + orderByClause;
  
  return {finalQuery, values}
}

module.exports = sqlForJobQuery;
