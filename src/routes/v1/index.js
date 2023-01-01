const { Router } = require('express');
const { logger, APP_DOMAIN, ...env } = require('../../config');
const errors = require('../../utils/errors');

const notifier = require('../../services/Notification');
const auth = require('../../middlewares/authenticator');
const checkValidID = require('../../middlewares/checkValidID');

const UserController = require('../../controllers/User.controller');
const AuthController = require('../../controllers/Auth.controller');

// const testRules = require('../validators/test.rule');
const rules = require('../../validators');
const ServiceController = require('../../controllers/Service.controller');
const CategoryController = require('../../controllers/Category.controller');
const ItemController = require('../../controllers/Item.controller');

const dependencies = {
  logger, env, APP_DOMAIN, errors, notifier
};
const router = new Router();

// const testController = new TestController(dependencies);
const userRoutes = new UserController(dependencies);
const authController = new AuthController(dependencies);
const serviceController = new ServiceController(dependencies);
const categoryController = new CategoryController(dependencies);
const itemController = new ItemController(dependencies);

router
  .post('/auth/login', rules('login'), authController.login)
  .patch('/auth/change-password', [auth.verifyAllUserToken], rules('changePassword'), authController.changePassword)
  .post('/auth/register', rules('createUser'), userRoutes.createUser)
  .post('/auth/add-staff', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('createUser'), userRoutes.createStaff)
  .post('/user/verify', [auth.verifyAllUserToken], authController.verifySMSCode)
  .get('/users/', [auth.verifyAllUserToken, auth.verifySuperAdmin], userRoutes.getAllUsers)
  .get('/users/me', [auth.verifyAllUserToken], userRoutes.me)
  .get('/user/verification', auth.verifyAllUserToken, authController.generateSMSCode)

  .get('/users/:user_id', [checkValidID, auth.verifyAllUserToken, auth.verifySuperAdmin], userRoutes.getUsersById)
  .patch('/users/:user_id/suspend', [checkValidID, auth.verifyAllUserToken, auth.verifySuperAdmin], userRoutes.suspendUser)

  .post('/services', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('createService'), serviceController.createService)
  .get('/services', serviceController.getAllServices)
  .get('/services/:service_id', serviceController.getServiceById)
  .patch('/services/:service_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('updateService'), serviceController.updateService)
  .delete('/services/:service_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], serviceController.deleteService)

  .post('/categories', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('createCategory'), categoryController.createCategory)
  .get('/categories', categoryController.getAllCategories)
  .get('/categories/:category_id', categoryController.getCategoryById)
  .patch('/categories/:category_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('updateCategory'), categoryController.updateCategory)
  .post('/categories/:category_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('addItemToCategory'), categoryController.addItemToCategory)
  .delete('/categories/:category_id/remove-item', [auth.verifyAllUserToken, auth.verifySuperAdmin], categoryController.removeItemFromCategory)
  .delete('/categories/:category_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('removeItemFromCategory'), categoryController.deleteCategory)

  .post('/items', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('createItem'), itemController.createItem)
  .get('/items', itemController.getAllItems)
  .patch('/items/:item_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], rules('createItem'), itemController.updateItem)
  .delete('/items/:item_id', [auth.verifyAllUserToken, auth.verifySuperAdmin], itemController.deleteItem)

  .put('/users/:user_id', [checkValidID, auth.verifyAllUserToken, auth.verifyMe], rules('updateUser'), userRoutes.updateUser);
module.exports = router;
