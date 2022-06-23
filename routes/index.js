var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: "Iphone 13 pro",
      category: "mobile",
      image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-silver-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1645552345849",
      description: "Best camera phone"
    },
    {
      name: "Samsung galaxy S3",
      category: "mobile",
      image: "https://images.samsung.com/is/image/samsung/ie-galaxy-s3-mini-i8190-gt-i8190rwn3ie-092-front-white?$720_576_PNG$",
      description: "Samsung is trust"
    },
    {
      name: "Oneplus 10 R",
      category: "mobile",
      image: "https://oasis.opstatics.com/content/dam/oasis/page/2022/operation/apr/in/10r-green.png",
      description: "Experience the software Oxygen OS"
    },
    {
      name: "Sony Experia Mark 2",
      category: "mobile",
      image: "https://www.notebookcheck.net/uploads/tx_nbc2/SonyXperia1-II.JPG",
      description: "Camera like DSLR"
    }

  ]
  res.render('index', { products, admin:true });
});

module.exports = router;
