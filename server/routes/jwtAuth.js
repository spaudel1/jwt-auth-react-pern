const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')

const jwtGenerator = require('../utils/jwtgenerator')
const authorization = require('../middleware/authorization')


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    // Check if user exists
    const user = await pool.query('Select * from users WHERE user_email = $1', [email])

    if (user.rows.length !== 0) {
      return res.status(403).send('User already exists')
    }

    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const bcryptPassword = await bcrypt.hash(password, salt)

    // Insert user into database
    const newUser = await pool.query(
      'Insert into users (user_name, user_email, user_password) values ($1, $2, $3) returning *',
      [name, email, bcryptPassword])

    // generate JWT token
    const token = jwtGenerator(newUser.rows[0].user_id)
    res.json({ token })

  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await pool.query('Select * from users WHERE user_email = $1', [email])
    if (user.rows.length === 0) {
      res.status(401).json('Password or Email is incorrect')
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password)
    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect')
    }
    const token = jwtGenerator(user.rows[0].user_id)
    res.json({ token })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})


router.get('/is-verify', authorization, async(req, res)=>{
  try {
    res.json(true)
  }catch(err){
    console.log(err.message)
  }
})

module.exports = router

