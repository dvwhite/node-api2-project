const express = require("express");
const router = express.Router();
const {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
} = require("./../data/db");

// Helpers
const { validateProperties, validateId } = require("./../utils/utils");

// Endpoints

// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post("/", async (req, res) => {
  // Check for missing fields
  const required = ["title", "contents"];
  const isValidProps = validateProperties(req, res, required);
  if (!isValidProps) {
    return;
  }

  // Update the database
  try {
    const dbRes = await insert(req.body);
    res.status(201).json(dbRes);
  }
  catch(err) {
    res.status(500).json({
      error: "There was an error while saving the post to the database",
      response: err,
    });
  }
});

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/:id/comments", async (req, res) => {
  // Check for missing fields
  const required = ["text", "post_id"];
  const isValidProps = validateProperties(req, res, required);
  if (!isValidProps) {
    return;
  }

  // Validate the id
  // This validates that req.body.post_id matches req.params.id
  const isValidId = await validateId(req, res);
  console.log("isValidId:", isValidId)
  if (!isValidId) {
    return;
  }

  // Update the post comment
  insertComment(req.body)
    .then((dbRes) => {
      res.status(201).json(req.body);
    })
    .catch((err) => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
        response: err,
      });
    });
});

// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
  find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
        response: err,
      });
    });
});

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get("/:id", (req, res) => {
  // Check for invalid id
  const isValidId = validateId(req, res);
  if (!isValidId) {
    return;
  }

  findById(req.params.id)
    .then((dbRes) => {
      res.status(200).json(dbRes);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.


// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.

module.exports = router;
