const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await Blog.deleteMany({})
  response.status(204).end()
})

module.exports = router