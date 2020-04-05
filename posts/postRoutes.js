const express = require("express");
const router = express.Router();
const db = require("./../data/db");

// Helpers
const { getMissingFields } = require("./../utils/utils");

// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post("/", (req, res) => {
  const actual = Object.keys(req.body);
  const required = ["title", "contents"];
  const missingProperties = getMissingFields(required, actual);

  if (missingProperties.length > 0) {
    res.status(400).json({
      errorMessage: "Please provide the " + missingProperties + " for the post",
    });
  }

  // // Commented out - returns an empty object
  // const id = db.insert(req.body)
  // res.status(200).json(id)

  // This works despite API documentation indicating
  // that it returns an object instead of a promise
  db.insert(req.body).then(dbRes => {
    res.status(200).json(dbRes);
  });
});

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.

// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => console.error(err.response));
});

// GET	/api/posts/:id	Returns the post object with the specified id.

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.

module.exports = router;
