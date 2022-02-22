const express=require('express')
const router=express.Router()
const {registerUser,loginUser,logOut,forgetPassword,
    resetPassword,getUserDetails,updatePassword,updateProfile,
    getAllUsers,getSingleUser,updateUserRole,deleteUser}=require('../controllers/usersController')
    
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')




router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logOut)
router.route('/password/forget').post(forgetPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticatedUser,getUserDetails)
router.route('/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/me/update').put(isAuthenticatedUser,updateProfile)
router.route('/admin/allusers').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getSingleUser)
                               .put(isAuthenticatedUser,authorizeRoles('admin'),updateUserRole)
                               .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)




module.exports=router