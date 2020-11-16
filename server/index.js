const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express()

const PORT = 4000;

const {SESSION_SECRET, CONNECTION_STRING} = process.env

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
})

app.use(
    sesion({
        resave: true,
        saveUnintialized: false,
        secret: SESSION_SECRET
    })
)

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))