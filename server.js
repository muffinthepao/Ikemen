const express = require('express')
const app = express()
const port = 3000

//controllers
const pageController = require('./controllers/pages/page_controller')

//Set view engine
app.set('view engine', 'ejs')

//apply middleware
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', pageController.showHome)
app.get('/food', pageController.showFood)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})