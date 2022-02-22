const express=require('express')
const router=express.Router()
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')
const {createProduct,getAllProducts,updateProduct,deleteProduct,getSingleProduct,createProductReview,allReviews,deleteReview}=require('../controllers/productController')

router.route('/products').get(getAllProducts)
router.route('/admin/product/new')
      .post(isAuthenticatedUser,authorizeRoles('admin'),createProduct)

router.route('/admin/product/:id')
    .put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)

router.route('/product/:id').get(getSingleProduct)

router.route('/product/review').put(isAuthenticatedUser,createProductReview)

router.route('/reviews').get(allReviews).put(isAuthenticatedUser,deleteReview)


module.exports=router