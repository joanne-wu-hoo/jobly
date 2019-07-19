const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/sqlQueries/partialUpdate");
const sqlForCreateQuery = require("../helpers/sqlQueries/createQuery");
const bcrypt = require("bcrypt");


class User {

    /** register new user 
     * - given dataObj: { username, password, first_name, last_name, email, photo_url, is_admin } where password is a plain text password
     * - return: { username, password, first_name, last_name, email, photo_url, is_admin } where password is a hashed password
     *  NOTE: used in POST/jobs (dataObj = req.body)
     */
    static async create(dataObj) {
        const hashedPassword = await bcrypt.hash(dataObj.password, BCRYPT_WORK_FACTOR);
        dataObj.password = hashedPassword;

        const queryString = sqlForCreateQuery('users', Object.keys(dataObj));
        const result = await db.query(queryString, Object.values(dataObj));
                     
        return result.rows[0];
    }

    /** update user 
     * given: 
     * - items: object with key/value pairs for username, first_name, last_name, email, photo_url
     * - username: username of user to update
     * return: 
     * - JSON for updated user {username, first_name, last_name, email, photo_url}
     * - or throw a 404 error 
     * NOTE: used in PATCH/users/:username
     */
    static async update(items, username){
        const { query, values } = sqlForPartialUpdate('users', items, 'username', username);
        const result = await db.query(query, values);

        let user = result.rows[0];

        if (!user){
            throw new ExpressError(`User with username ${username} not found`, 404);
        }

        return {
            username: user.username,
            first_name: user.first_name, 
            last_name: user.last_name,
            email: user.email,
            photo_url: user.photo_url
        };
    }

    /** delete user
     * - given: username, delete user from db OR throw a 404 error
     * NOTE: used in DELETE/users/:username
     */
    static async delete(username){
        const result = await db.query(
            `DELETE FROM users
            WHERE username = $1
            RETURNING username`,
            [username]
        );

        if (result.rows.length === 0){
            throw new ExpressError(`User with username: ${username} not found`, 404);
        }
    }

    /** get info for all users 
     * - return: [{username, first_name, last_name, email}, ...]
     * NOTE: used in GET/users
     */
    static async get_all(){
        const results = await db.query(
            `SELECT username,
                first_name,
                last_name,
                email
            FROM users`
        );

        return results.rows;
    }

    /** get requested user info 
     * - given: username
     * - return: {username, first_name, last_name, email}
     * - or throw 404 error
     * NOTE: used in GET/users/:username 
     */
    static async get(username){
        const result = await db.query(
            `SELECT username,
                first_name,
                last_name,
                email
            FROM users 
            WHERE username = $1`,
            [username]
        );

        return result.rows[0];
    }
}



// let x = {
//     "username": "gabe",
//     "password": "secrets",
//     "first_name": "gabriel",
//     "last_name": "mickey",
//     "email": "email@gmail.com",
//     "photo_url": "http://something.com",
//     "is_admin": true
// }

// async function test() {
//     console.log('result', await User.create(x))
// }

// test()

module.exports = User