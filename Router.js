const express = require("express");
const router = express.Router();

const { BlogPosts } = require("./models");


function camelot() {
  return (
    "Well, Mercia's a temperate zone!" +
"He hasn't got shit all over him. Shh! Knights, I bid you welcome to your new home. Let us ride to Camelot! The nose? A newt?" +

"I'm not a witch." +
"The Knights Who Say Ni demand a sacrifice!" +
"Bloody Peasant!" +
"A newt?" +
"But you are dressed as one… Bloody Peasant! And the hat. She's a witch! Why?" + 
"The swallow may fly south with the sun, and the house martin or the plover may seek warmer climes in winter," + 
"yet these are not strangers to our land." +

"Look, my liege!" +
"Shut up! Will you shut up?!" +
"Burn her!"
  );
}

// seed some posts so initial GET requests will return something
BlogPosts.create("What do you mean? You don't vote for kings.", camelot(), "Mercia");
BlogPosts.create("Camelot! Burn her! What a strange person.", camelot(), "Knights of Ni");


router.get("/", (req, res) => {
  res.json(BlogPosts.get());
});


router.post("/", (req, res) => {
 
  const requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(
    req.body.title,
    req.body.content,
    req.body.author
  );
  res.status(201).json(item);
});


router.put("/:id", (req, res) => {
  const requiredFields = ["id", "title", "content", "author", "publishDate"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${
      req.params.id
    }) and request body id ``(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

// add endpoint for DELETE requests. These requests should
// have an id as a URL path variable and call
// `BlogPosts.delete()`
router.delete("/:id", (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post with id \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;