const e = require('express');
const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var userHelper = require('../helpers/user-helpers')




/* GET home page. */
router.get('/', function (req, res, next) {
  let user=req.session.user
  console.log(user)
  productHelper.getAllProducts().then((products=>{
  res.render('./user/index', { products,user});
}))});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn==true){
    res.redirect('/')
  }else{
    res.render('./user/login')
  }
 
})

router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      
      res.redirect('/')
    }
    else
    {
      
      res.redirect('/login')

    }
  })
  
})

router.get('/signup',(req,res)=>{
  res.render('./user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignUp(req.body).then((response)=>{
    console.log(response)
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})




module.exports = router;
