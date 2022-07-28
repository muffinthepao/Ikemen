const express = require('express')
const app = express()
const port = 3000

//Set view engine
app.set('view engine', 'ejs')

//apply middleware
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('./pages/index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})