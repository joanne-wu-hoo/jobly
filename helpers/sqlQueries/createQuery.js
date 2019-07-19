function sqlForCreateQuery(table, keys) {
    query = 
        `INSERT INTO ${table} (
            ${keys.join(", ")}
        )
        VALUES (
            ${keys.map((x, i) => `$${i+1}`).join(", ")}
        )
        RETURNING *`
    return query
}

module.exports = sqlForCreateQuery