var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')


/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products=>{
    res.render('admin/admin-viewproducts', { products, admin: true })
  }))
  
});

router.get('/addproducts', function (req, res) {
  res.render('admin/addproducts')
})

router.post('/addproducts', (req, res) => {
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


router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id
  productHelper.delProduct(proId).then(()=>{
    res.redirect('/admin')
  })
  
  
})
router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelper.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
  
  
})

router.post('/editproduct/:id',(req,res)=>{
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
