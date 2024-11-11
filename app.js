const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'saep'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexão com o MySQL realizada com sucesso!');
});

// Rotas
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/Cadastro', (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    const sql = 'INSERT INTO email (email, senha) VALUES (?, ?)';
    
    db.query(sql, [email, senha], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.send('Email já cadastrado!');
            } else {
                console.log(err);
                res.send('Erro ao cadastrar o email!');
            }
        } else {
            // Email cadastrado com sucesso, redireciona para a home
            res.redirect('/home.html');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
