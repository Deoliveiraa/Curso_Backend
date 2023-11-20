const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  // You can implement your logic for username validation here
  return true; // For now, returning true. Modify as needed.
}

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the records
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: 'Invalid username' });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Create a JWT token
    const token = jwt.sign({ user: username }, 'seuSegredo', { expiresIn: '1h' });

    // Return the token
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the book with the provided ISBN exists
  if (books[isbn]) {
    // Add the review to the book
    books[isbn].reviews.push(review);
    return res.json({ message: 'Review added successfully' });
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check if the book with the provided ISBN exists
  if (books[isbn]) {
    // Filter and delete reviews based on the session username
    books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== req.user);

    return res.json({ message: 'Review deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
