/** User Routes */

const express = require("express");
const User = require("../models/User");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");

// NOTE: userData is of form { username, first_name, last_name, email }

/** POST/user 
 * - creates a new user
 * - returns JSON of {user: userData}
 */

const createUserSchema = require("../schemas/users/createUserSchema.json");

router.post("/", async function(req, res, next) {
  const result = jsonschema.validate(req.body, createUserSchema);

  // JSON validator errors
  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
        let user = await User.create(req.body);
        let userInfo = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        };
      return res.json({user: userInfo});
  } catch(err) {
      // 500 (server error)
      return next(err)
  }
});


/** GET/users 
 * - return JSON of {users: [userData, ...]}
 */
router.get("/", async function(req, res, next) {
    try {
        let users = await User.get_all();
        let allUserInfo = users.map(function(e) {
            return {
                username: e.username,
                first_name: e.first_name,
                last_name: e.last_name,
                email: e.email
            }
        });
        return res.json({users: allUserInfo})
    } catch(err) {
        return next(err)
    }
});

/** GET/users/:username
 * - return JSON of {user: userData }
 */
router.get("/:username", async function(req, res, next) {
    try {
        let user = await User.get(req.params.username);
        let userInfo = {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        };
        return res.json({user: userInfo})
    } catch(err) {
        return next(err)
    }
});

/** PATCH/users/:username
 * - return JSON of {user: userData}
 */
const updateUserSchema = require("../schemas/users/updateUserSchema.json");

router.patch("/:username", async function(req, res, next) {

  const result = jsonschema.validate(req.body, updateUserSchema);

  // JSON validator errors
  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
      let user = await User.update(req.body, req.params.username);
      let userInfo = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
        };
        return res.json({user: userInfo});
  } catch(err) {
      // 404 (trying to update user that does not exist)
      return next(err)
  }
});

/** DELETE/users/:username
 * - return JSON of { message: "User deleted" }
 */
router.delete("/:username", async function(req, res, next) {
    try {
        await User.delete(req.params.username);
        return res.json({ message: "User deleted" });
    } catch(err) {
        return next(err)
    }
});


module.exports = router;
