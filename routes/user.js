const e = require('express');
const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var userHelper = require('../helpers/user-helpers')

const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}




/* GET home page. */
router.get('/', function (req, res, next) {
  let user=req.session.user
  console.log(user)
  productHelper.getAllProducts().then((products=>{
  res.render('./user/index', { products,user});
}))});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('./user/login',{'loginErr':req.session.loginErr})
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
      req.session.loginErr=true
      res.redirect('/login')

    }
  })
  
})

router.get('/signup',(req,res)=>{
  res.render('./user/signup')
})

router.get('/cart',verifyLogin,(req,res)=>{
  
  
    res.render('./user/cart')

})

router.post('/signup',(req,res)=>{
  userHelpers.doSignUp(req.body).then((response)=>{
    let name = req.body.name
    console.log("Name:",response.name)
    res.render('./user/signupconfirm',{name})
    
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  console.log("session is ",req.params.id,"  ",req.session.user)
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
}
)




module.exports = router;
