/** Unit test for sqlForPartialUpdate */

const sqlForPartialUpdate = require("../../helpers/sqlQueries/partialUpdate")

describe("partialUpdate()", function() {
  it("should generate a proper partial update query with just 1 field", function () {
    let table = "users";
    let items = {
      name: "joanne",
    };
    let key = "id";
    let id = 1;

    expect(sqlForPartialUpdate(table, items, key, id)).toEqual({ 
      query:'UPDATE users SET name=$1 WHERE id=$2 RETURNING *',
      values: [ 'joanne', 1 ] 
    });
  });

  it("should generate a proper partial update query with multiple fields", function () {
    let table = "users";
    let items = {
      name: "joanne",
      fav_food: "tacos",
      likes: "altoids"
    };
    let key = "id";
    let id = 1;

    expect(sqlForPartialUpdate(table, items, key, id)).toEqual({ 
      query:'UPDATE users SET name=$1, fav_food=$2, likes=$3 WHERE id=$4 RETURNING *',
      values: [ 'joanne', 'tacos', 'altoids', 1 ] 
    });
  });

  it("should remove keys that begin with an underscore", function () {
    let table = "users";
    let items = {
      name: "joanne",
      fav_food: "tacos",
      _likes: "altoids"
    };
    let key = "id";
    let id = 1;

    expect(sqlForPartialUpdate(table, items, key, id)).toEqual({ 
      query:'UPDATE users SET name=$1, fav_food=$2 WHERE id=$3 RETURNING *',
      values: [ 'joanne', 'tacos', 1 ] 
    });
  });
  

});
