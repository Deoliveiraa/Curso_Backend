const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Import Axios
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Implement user registration logic here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the list of books available in the shop using async-await and Axios
public_users.get('/', async function (req, res) {
  try {
    // Check if the user is authenticated (using the isValid function from your auth_users module)
    if (!isValid(req)) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // If the user is authenticated, fetch the list of books using Axios
    const response = await axios.get('https://your-books-api-url'); // Replace with the actual API endpoint

    // Return the list of books from the API response
    return res.status(200).json({ books: response.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao obter a lista de livros" });
  }
});

// Other routes...

module.exports.general = public_users;
