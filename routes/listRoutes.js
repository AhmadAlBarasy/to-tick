const express = require('express');
const listController = require('../controllers/listController');
const {protect} = require('../controllers/authController');

const listRouter = express.Router();

// to make all the preceeding routes protected from non-logged in users

listRouter.use(protect);
listRouter.route('/lists/create').post(listController.createList);
listRouter.route('/lists/:id/tasks/').post(listController.createTask);
listRouter.route('/lists/:id/tasks/:taskId').patch(listController.updateTask).delete(listController.deleteTask);
listRouter.route('/lists/:id')
    .get(listController.getList)
    .patch(listController.updateList)
    .delete(listController.deleteList);
listRouter.route('/lists').get(listController.getAllLists);
module.exports = listRouter;