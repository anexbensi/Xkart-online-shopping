var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')


const verifyAdminLogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.render('admin/login')
  }
}



/* GET users listing. */
router.get('/',verifyAdminLogin, function (req, res, next) {
  productHelpers.getAllProducts().then((products=>{
    res.render('admin/admin-viewproducts', { products, admin: true })
  }))
  
});

router.get('/addproducts',verifyAdminLogin, function (req, res) {
  res.render('admin/addproducts',{admin: true })
})

router.post('/addproducts',verifyAdminLogin, (req, res) => {
  console.log(req.body)
  console.log(req.files.image)
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image
    console.log(id)
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/addproducts")
      }
      else {
        console.log(err)
      }
    })

  })
})


router.get('/delete-product/:id',verifyAdminLogin,(req,res)=>{
  
  let proId = req.params.id
  productHelper.delProduct(proId).then(()=>{
    res.redirect('/admin')
  })
  
  
})
router.get('/edit-product/:id',verifyAdminLogin,async(req,res)=>{
  let product = await productHelper.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{ product, admin: true })
  
  
})

router.post('/editproduct/:id',verifyAdminLogin,(req,res)=>{
  productHelper.updateProduct(req.params.id,req.body).then(()=>{
    let id = req.params.id
    res.redirect('/admin')
    if(req.files.image){
      let image = req.files.image
      image.mv('./public/product-images/' + id + '.jpg')

    }
  })
})






module.exports = router;
