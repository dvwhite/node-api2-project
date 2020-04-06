const express = require("express");
const router = express.Router();
const {
  find,
  findId,
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

// POST	/api/post
// Creates a post using the information sent inside the request body.
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
  } catch (err) {
    res.status(500).json({
      error: "There was an error while saving the post to the database",
      response: err,
    });
  }
});

// POST	/api/posts/:id/comments
// Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/:id/comments", async (req, res) => {
  // Check for missing fields
  const required = ["text", "post_id"];
  const isValidProps = validateProperties(req, res, required);
  if (!isValidProps) {
    return;
  }

  // Validate the id
  // This validates that req.body.post_id matches req.params.id
  const isValidId = await validateId(req, res, "post_id");
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

// GET	/api/posts
// Returns an array of all the post objects contained in the database.
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

// GET	/api/posts/:id
// Returns the post object with the specified id.
router.get("/:id", async (req, res) => {
  // Validate the id
  // This validates that req.body.post_id matches req.params.id
  const isValidId = await validateId(req, res, "id");
  if (!isValidId) {
    return;
  }

  findById(req.params.id)
    .then((dbRes) => {
      res.status(200).json(dbRes);
    })
    .catch((err) => {
      res.status(500).json({
        error: "The post information could not be retrieved.",
        response: err,
      });
    });
});

// GET	/api/posts/:id/comments
// Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id/comments", async (req, res) => {
  // Validate the id
  // This validates that req.body.post_id matches req.params.id
  const isValidId = await validateId(req, res, "id");
  if (!isValidId) {
    return;
  }

  try {
    findPostComments(req.params.id)
      .then((dbRes) => {
        res.status(200).json(dbRes);
      })
      .catch((err) => err);
  } catch (err) {
    res.status(500).json({
      error: "The comments information could not be retrieved.",
      response: err,
    });
    return;
  }
});

// DELETE	/api/posts/:id
// Removes the post with the specified id and returns the deleted post object. 
/// You may need to make additional calls to the database in order to satisfy this requirement.
router.delete("/:id", async (req, res) => {
  // Validate the id
  // This validates that req.body[id] matches req.params.id
  const isValidId = await validateId(req, res, "id");
  if (!isValidId) {
    return;
  } else {
    // Grab the post before removal so it can be returned
    try {
      const postToDel = await findId(+req.params.id)
      const dbRes = await remove(+req.params.id);
      if (Number(dbRes) === Number(1)) {
        res.status(200).json(postToDel);
      }  
    } catch(err) {
      res.status(500).json({
        error: "The post could not be removed.",
        response: err,
      });
    }
  }
});

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body.
// Returns the modified document, NOT the original.
router.put('/:id', async (req, res) => {
  // Check for missing fields
  const required = ["title", "contents"];
  const isValidProps = validateProperties(req, res, required);
  if (!isValidProps) {
    return;
  }

  // Validate the id
  // This validates that req.body.post_id matches req.params.id
  const isValidId = await validateId(req, res, "id");
  if (!isValidId) {
    return;
  } else {
    try {
      // Update the post
      const post = await update(Number(req.params.id), req.body);
      console.log("post:", post)
      // Get the updated post
      const editedPost = await findId(Number(req.params.id));
      console.log("edited:", editedPost);
      res.status(200).json(editedPost);
    } catch(err) {
      res.status(500).json({
        error: "The post information could not be modified.",
        response: err,
      });
    }
  }
})

module.exports = router;
