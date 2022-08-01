require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

//controllers
const pageController = require('./controllers/pages/page_controller')
const userController = require('./controllers/users/user_controller')


//Set view engine
app.set('view engine', 'ejs')

//apply middleware
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

//page routes
app.get('/', pageController.showHome)
app.get('/food', pageController.showListings)
app.get('/food/:listing_id', pageController.showIndividualListing)

//user routes
app.get('/users/register', userController.showRegistrationForm)
app.post('/users/register', userController.register)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})