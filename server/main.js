const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'NU@#NES$SPORTS_P_B-_-A1ACBDSW2@#',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nunesdb'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados');
});

const perPage = 5;

app.get('/', (req, res) => {
    res.redirect('/page/1');
});

app.get('/page/:page', (req, res) => {
    let page = parseInt(req.params.page, 10) || 1;

    db.query('SELECT COUNT(*) as count FROM produtos', (err, countResult) => {
        if (err) {
            req.session.message = { type: 'error', text: `Erro ao contar registros: ${err}` };
            console.error('Erro ao contar registros', err);
            return res.status(500).render('error', { error: { status: 500, message: "Erro interno do servidor." } });
        }

        let totalRecords = countResult[0].count;
        let totalPages = Math.ceil(totalRecords / perPage);

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        let sql = 'SELECT * FROM produtos LIMIT ? OFFSET ?';
        db.query(sql, [perPage, (page - 1) * perPage], (err, results) => {
            if (err) {
                req.session.message = { type: 'error', text: `Erro ao buscar registros paginados: ${err}` };
                console.error('Erro ao buscar registros paginados', err);
                return res.status(500).render('error', { error: { status: 500, message: "Erro interno do servidor." } });
            }

            res.render('index', {
                items: results,
                current: page,
                pages: totalPages
            });
        });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    let post = { nome: req.body.nome, codigo: req.body.codigo, descricao: req.body.descricao, preco: req.body.preco.replace('R$ ', '').replace(',', '.') };
    let sql = 'INSERT INTO produtos SET ?';
    db.query(sql, post, (err, result) => {
        if (err) {
            req.session.message = { type: 'error', text: `Erro ao adicionar registro: ${err}` };
            console.error('Erro ao adicionar registro', err);
            return res.redirect('/add');
        }

        req.session.message = { type: 'success', text: 'Produto adicionado com sucesso!' };
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    let sql = 'SELECT * FROM produtos WHERE id = ?';

    console.log('ID para edição:', id);

    if (isNaN(id)) {
        req.session.message = { type: 'error', text: `Erro: ID fornecido não é um número. Id fornecido: ${id}` };
        console.error('Erro: ID fornecido não é um número. Valor de ID:', id);
        return next();
    }

    db.query(sql, [id], (err, results) => {
        if (err) {
            req.session.message = { type: 'error', text: `Erro ao buscar registro para edição: ${err}` };
            console.error('Erro ao buscar registro para edição:', err);
            return res.status(500).render('error', { error: { status: 500, message: "Erro interno do servidor." } });
        }
        if (results.length > 0) {
            res.render('edit', { item: results[0], message: req.session.message });
            req.session.message = null;
        } else {
            return res.status(404).render('error', { error: { status: 500, message: "ID inválido." } });
        }
    });
});

app.post('/update/:id', (req, res) => {
    let id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(404).render('error', { error: { status: 500, message: "ID inválido." } });
    }

    let sql = 'UPDATE produtos SET nome = ?, codigo = ?, descricao = ?, preco = ? WHERE id = ?';

    let updatedData = [
        req.body.nome,
        req.body.codigo,
        req.body.descricao,
        parseFloat(req.body.preco.replace('R$ ', '').replace(',', '.')),
        id
    ];

    db.query(sql, updatedData, (err, result) => {
        if (err) {
            req.session.message = { type: 'error', text: `Erro ao atualizar registro: ${err}` };
            console.error('Erro ao atualizar registro', err);
            return res.status(500).render('error', { error: { status: 500, message: "Erro interno do servidor." } });
        }
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    let id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        req.session.message = { type: 'error', text: 'ID inválido.' };
        return res.status(404).render('error', { error: { status: 500, message: "ID inválido." } });
    }

    let sql = 'DELETE FROM produtos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            req.session.message = { type: 'error', text: `Erro ao deletar registro: ${err}` };
            console.error('Erro ao deletar registro', err);
            return res.status(500).render('error', { error: { status: 500, message: "Erro interno do servidor." } });
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});