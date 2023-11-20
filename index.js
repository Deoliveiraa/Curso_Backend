const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Verifica se o token está presente nos cabeçalhos da requisição ou na sessão
  const token = req.header('x-auth-token') || req.session.token;

  // Se não houver token, retorna um erro de não autorizado
  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, 'seuSegredo'); // Substitua 'seuSegredo' pelo segredo real usado na assinatura do token
    req.user = decoded.user; // Adiciona o usuário decodificado ao objeto de requisição
    req.session.token = token; // Armazena o token na sessão para referência futura, se necessário
    next(); // Avança para a próxima middleware
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
