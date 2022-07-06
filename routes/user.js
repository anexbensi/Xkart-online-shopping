const e = require('express');
const { response } = require('express');
var express = require('express');
const { ConnectionPoolClosedEvent } = require('mongodb');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
var userHelper = require('../helpers/user-helpers')

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}




/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  console.log(user)
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelper.getAllProducts().then((products => {
    res.render('./user/index', { products, user,cartCount });
  }))
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('./user/login', { 'loginErr': req.session.userLoginErr })
  }

})

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.user = response.user
      req.session.user.loggedIn = true

      res.redirect('/')
    }
    else {
      req.session.userLoginErr = true
      res.redirect('/login')

    }
  })

})

router.get('/signup', (req, res) => {
  res.render('./user/signup')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalAmount = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(products)

  res.render('./user/cart', { "user": req.session.user, products,totalAmount})

})

router.post('/signup', (req, res) => {
  userHelpers.doSignUp(req.body).then((response) => {
    let name = req.body.name
    console.log("Name:", response.name)
    res.render('./user/signupconfirm', { name })

  })
})

router.get('/logout', (req, res) => {
  req.session.user=null
  res.redirect('/')
})

router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
  console.log("session is ", req.params.id, "  ", req.session.user)
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.redirect('/')
  })
}
)

router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then((response)=>{
    res.json(response)
    
  })

} )

router.post('/remove-product-cart',(req,res)=>{
  userHelpers.removeProductFromCart(req.body).then((response)=>{
    res.json(response)

  })
})

router.get('/checkout',verifyLogin,async (req,res)=>{
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(total)
  res.render('./user/checkout-page',{"user": req.session.user, total})
})

router.post('/checkout',verifyLogin,async (req,res)=>{
  let products = await userHelpers.getCartProductList(req.body.userId)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment']==='COD'){
    res.json({codSuccess:true})
    }else{
      userHelpers.generateRazorPay(orderId,totalPrice).then((response)=>{
        res.json(response)

      })
    }
  })
})

router.get('/order-confirmed',verifyLogin, (req,res)=>{
   res.render('./user/order-confirmed',{"user": req.session.user})
})

router.get('/orders',verifyLogin,async (req,res)=>{
  let products = await userHelpers.getUserOrders(req.session.user._id)
    res.render('./user/orders',{'user':req.session.user,products})
  
  
})

router.get('/view-ordered-products/:id',verifyLogin,async (req,res)=>{
  var orderId= req.params.id
  let products = await userHelpers.getOrderProducts(orderId)
  console.log(products)
  res.render('./user/vieworderedproducts',{"user": req.session.user,products}) 
})



router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then((response)=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("Payment Successfull");
      res.json({status:true})

    })

  }).catch((err)=>{
    console.log(err)
    res.json({status:false,errMsg:''})
  })
})


module.exports = router;
