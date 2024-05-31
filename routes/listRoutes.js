const express = require('express');
const listController = require('../controllers/listController');
const {protect} = require('../controllers/authController');

const listRouter = express.Router();

// to make all the preceeding routes protected from non-logged in users

listRouter.use(protect);
listRouter.route('/lists/create').post(listController.createList, listController.sendAPIResponse);
listRouter.route('/lists/:id/tasks/').post(listController.createTask, listController.sendAPIResponse);
listRouter.route('/lists/:id/tasks/:taskId')
    .patch(listController.updateTask, listController.sendAPIResponse)
    .delete(listController.deleteTask, listController.sendAPIResponse);
listRouter.route('/lists/:id')
    .get(listController.getList, listController.sendAPIResponse)
    .patch(listController.updateList, listController.sendAPIResponse)
    .delete(listController.deleteList, listController.sendAPIResponse);
listRouter.route('/lists').get(listController.getAllLists, listController.sendAPIResponse);
listRouter.route('*').all((req, res, next) => {
    res.status(404).json({
        status : "fail",
        message : "Page not found."
    });
});
module.exports = listRouter;