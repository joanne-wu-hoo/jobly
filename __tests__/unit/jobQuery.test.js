/** Unit test for sqlForJobQuery */

const sqlForJobQuery = require("../../helpers/jobQuery")

function cleanWhiteSpace(string) {
  return string.replace(/[\r\n\s]+/gm, " ").trim();
}

describe("jobQuery()", function() {
  it("should generate valid sql if no queries provided", function(){
    let { finalQuery, values } = sqlForJobQuery({});

    expect(cleanWhiteSpace(finalQuery)).toEqual(cleanWhiteSpace(
      `SELECT id, 
        title, 
        salary, 
        equity, 
        company_handle, 
        date_posted 
      FROM jobs 
      ORDER BY date_posted DESC`
    ));

    expect(values).toEqual([]);
  });

  it("should generate valid sql if one query is provided", function(){
    let { finalQuery, values } = sqlForJobQuery({search: "t"});

    expect(cleanWhiteSpace(finalQuery)).toEqual(cleanWhiteSpace(
      `SELECT id, 
        title, 
        salary, 
        equity, 
        company_handle, 
        date_posted 
      FROM jobs 
      WHERE (title ILIKE $1)
      ORDER BY date_posted DESC`
    ));

    expect(values).toEqual(['%t%']);
  }); 

  
  it("should generate valid sql if all queries are provided", function(){
    let { finalQuery, values } = sqlForJobQuery({search: "t", min_salary: 100, min_equity: .5});

    expect(cleanWhiteSpace(finalQuery)).toEqual(cleanWhiteSpace(
      `SELECT id, 
        title, 
        salary, 
        equity, 
        company_handle, 
        date_posted 
      FROM jobs 
      WHERE (title ILIKE $1)
      AND (salary >= $2)
      AND (equity >= $3)
      ORDER BY date_posted DESC`
    ));

    expect(values).toEqual(['%t%', 100, .5]);
  });
});