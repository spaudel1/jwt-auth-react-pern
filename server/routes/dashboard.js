const router = require('express').Router()

const pool = require('../db')
const authorization = require('../middleware/authorization')

router.get('/', authorization, async (req, res) => {
  try {
    const user = await pool.query('Select user_name from users where user_id = $1', [req.user])
    res.json({ user })
  } catch (err) {
    console.log(err.message)
    res.status(500).json('Server error')
  }
})

module.exports = router
