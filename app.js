import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
//import encrypt from 'mongoose-encryption' 
import md5 from 'md5'

dotenv.config()

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema( {
    email: String,
    password: String
})

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })

    newUser.save()
    res.render('secrets')
})

app.post('/login', async (req, res) => {
    const userName = req.body.username
    const password = md5(req.body.password)

    try {

        const resultUser = await User.findOne({email: userName}).exec()
        if(resultUser.password === password) {
            res.render('secrets')
        } else {
            res.send('<h2>Senha ou e-mail incorretos</h2>')
        }
    } catch (error) {
        console.log('Erro no sistema', error)
    }
})


app.listen(4000, () => {
    console.log('Servidor Rodando na porta 4000')
})