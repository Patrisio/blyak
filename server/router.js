require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('./dbConfig');
const passport = require('passport');
const initializePassport = require('./passportConfig');
const {check, validationResult} = require('express-validator');
const auth = require('./middleware/auth.middleware');

initializePassport(passport);

const router = express.Router();

router.get('/home', auth, (req, res) => {
  res.json({status: 'success'});
});

router.get('/iframe/:id', (req, res) => {
  console.log('Request iframe Id:', req.params.id);
  res.send({ status: 'success' });
});

router.get('/project/:projectId/getMessagesHistoryByProject', (req, res) => {
  const { projectId } = req.params;

  pool.query(
    `SELECT * FROM chat_h WHERE project_id = $1`, [projectId],
    async (err, results) => {
      if (err) throw err;
      
      res.json(results.rows);
    }
  );
});

router.get('/project/:projectId/chat/:clientId/getMessagesHistory', (req, res) => {
  const { projectId, clientId } = req.params;

  pool.query(
    `SELECT messages_history FROM chat_h WHERE project_id = $1 AND client_id = $2`, [projectId, clientId],
    async (err, results) => {
      if (err) throw err;
      console.log(results.rows);
      res.json(results.rows[0].messages_history);
    },
  );
});

router.post('/login', [
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при входе в систему'
      });
    }

    const { email, password } = req.body;

    pool.query(
      `SELECT * FROM accounts
       WHERE email = $1`, [email],
      async (err, results) => {
        if (err) throw err;

        if (results.rows.length === 0) {
          return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const user = results.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        );
    
        res.json({ token, userId: user.id, projects: user.project });
      }
    );
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

router.post('/chat/:clientId/:projectId/message', async (req, res) => {
  const { projectId, clientId } = req.params;
  const data = req.body;

  pool.query(
    `SELECT * FROM chat_h WHERE client_id = $1`, [clientId],
    async (err, results) => {
      if (err) throw err;

      if (results.rows.length === 0) {
        pool.query(
          `INSERT INTO chat_h (client_id, project_id, messages_history)
          VALUES ($1, $2, $3)
          RETURNING project_id, messages_history`, [clientId, projectId, [data]],
          (err, results) => {
            if (err) throw err; 
            res.status(200).json({status: 'success'});
          }
        );
      } else {
        pool.query(
          `UPDATE chat_h SET messages_history = array_append(messages_history, $1) WHERE client_id = '${clientId}'`,
          [data],
          (err, results) => {
            if (err) throw err;
            res.status(200).json({status: 'success'});
          }
        );
      }
    }
  );
});

router.post('/register', async (req, res) => {
  const { email, password, username, project, phone } = req.body;

  const errors = [];

  if (!email || !password) {
    errors.push({ message: 'Заполните, пожалуйста, все поля в форме' });
  }

  if (password.length < 6) {
    errors.push({ message: 'Пароль должен быть длиннее 6 символов' });
  }

  if (errors.length > 0) {
    res.json(errors);
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      `SELECT * FROM accounts
       WHERE email = $1`, [email], 
       (err, results) => {
         console.log('TOP');
          if (err) {
            throw err;
          };

          if (results.rows.length > 0) {
            errors.push({ message: 'Email already registered' });
            res.json(errors);
          } else {
            pool.query(
              `INSERT INTO accounts (username, phone, password, email, project)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id, password`, [username, phone, hashedPassword, email, [project]],
              (err, results) => {
                if (err) throw err; 
                res.status(201).json({message: 'Пользователь создан'});
              }
            );
          }
       }
    );
  }
});

router.get('/api/:projectId/widget.js', (req, res) => {
  const { projectId } = req.params;

  fs.readFile('./public/widget.js', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var result = data;
    let formattedFile = result.replace(/project_id/g, projectId);
  
    res.send(formattedFile);
  });
});

module.exports = router;