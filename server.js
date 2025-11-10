require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Rotas
const mainRoutes = require('./routes/mainRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura view engine e pasta de views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'adm1234', // use variável ambiente
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

// Montar rotas
app.use('/', mainRoutes);          // páginas públicas
app.use('/admin', adminRoutes);    // administração (ex: /admin/seguranca)
app.use('/usuarios', userRoutes);  // rotas de usuários

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// midleware JSON

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

