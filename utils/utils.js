const { findId } = require('./../data/db');

/**
 * @function formatFieldsString: Create a string using the fields in an array
 * @param {*} fields: An array of fields
 * @returns {String}: The fields joined or returned directly (if only one)
 */
const formatFieldString = fields => {
  // Work around empty array
  if (fields.length < 1) return '';
  
  // If the length is one, use singular, e.g., "Missing a"
  if (fields.length === 1) {
    return fields[0];
    // Plural, e.g., "Missing a and b" or "Missing a, b, and c"
  } else {
    fields[fields.length - 1] = 'and ' + fields[fields.length - 1];
    // Separate with a space if two items, or a comma with > 3
    if (fields.length === 2) {
      return fields.join(' ');
    } else {
      return fields.join(', ');
    }
  }
}

/**
 * @function getMissingFields: Check which fields, if any, are missing in an array
 * @param {*} expectedFields: The fields expected by the API
 * @param {*} actualFields: The fields sent in the request.body
 * @returns {Array} fieldsNotFound: The fields not found, if any.
 */
const getMissingFields = (expectedFields, actualFields) => {
  const fieldsNotFound = [];
  while (expectedFields.length > 0) {
    fieldToValidate = expectedFields.pop();
    if (!actualFields.includes(fieldToValidate)) {
      fieldsNotFound.push(fieldToValidate);
    }
  }
  return formatFieldString(fieldsNotFound);
}

const validateProperties = (req, res, required) => {
  // Check for missing fields
  const actual = Object.keys(req.body);
  const missingProperties = getMissingFields(required, actual);
  // Return an error message if any are missing
  if (missingProperties.length > 0) {
    res.status(400).json({
      errorMessage: "Please provide the " + missingProperties + " for the post",
    });
    return;
  }
}

const validateId = (req, res) => {
  // Validate ids match
  if (req.body.post_id && (Number(req.params.id) !== Number(req.body.post_id))) {
    res
      .status(404)
      .json({
        message: `The post id of ${req.body.post_id} doesn't match the params id of ${req.params.id}`,
      });
    return;
  }

  // Validate that id exists
  // Get all ids from the db and make sure that req.params.id exists
  findIds()
    .then((dbRes) => {
      const ids = dbRes.map(post => post.id);
      if (!ids.includes(Number(req.params.id))) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
        return;
      }
    })
    .catch((err) => console.log(err));
}

module.exports = { validateProperties, validateId };
