const List = require('../models/listModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const sendResponse = (res, statusMessage, statusCode, data) => {
	res.status(statusCode).json({
		status : statusMessage,
		data,
	});
}

const findTaskIndex = (list, taskId) => {
	const taskIndex = list.tasks.findIndex(task => task._id.toString() === taskId);
	return taskIndex;
};

exports.getAllLists = catchAsync(async(req, res, next) => {
    const lists = await List.find({user : req.user.id});
    if (!lists) {
        return next(new AppError(404, 'No results found'));
    }
    sendResponse(res, 'sucess', 200, lists);
});

exports.createList = catchAsync(async(req, res, next) => {
    const list = await List.create({...req.body, user : req.user.id});
    sendResponse(res, 'success', 201, list);
});

exports.getList = async(req, res, next) => {
    const list = await List.findOne({_id : req.params.id, user : req.user});
    if (!list) {
        return next(new AppError(404, 'List not found.'));
    }
    sendResponse(res, 'sucess', 200, list);
};

exports.updateList = catchAsync(async(req, res, next) => {
	if (req.body.user || req.body.coverPhoto) {
		return next(new AppError(401, `You can't change the user that the list belongs to, or the coverPhoto directly from the API.`));
	}
	if (req.body.tasks) {
	return next(new AppError(401, 'To add, update and remove tasks, use /api/v1/lists/id/tasks/taskID '));
	}
	const list = await List.findOneAndUpdate({
		_id : req.params.id,
		user : req.user.id
		},
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);
	if (! list) {
		return next(new AppError(404, 'List not found.'));
	}
	sendResponse(res, 'success', 200, list);
});

exports.deleteList = catchAsync(async(req, res, next) => {
	const list = await List.findOneAndDelete({_id : req.params.id, user : req.user.id});
	if (!list) {
		return next(new AppError(404, "List not found."));
	}
	sendResponse(res, 'success', 204, null);
});

exports.createTask = catchAsync(async (req, res, next) => {
	const list = await List.findOne({_id : req.params.id, user : req.user.id});
	if (!list){
		return next(new AppError(404, 'List not found.'));
	}
	list.tasks.push(req.body);
	await list.save();
	sendResponse(res, 'success', 201, list);
});

exports.updateTask = catchAsync(async (req, res, next) => {
	const list = await List.findOne({_id : req.params.id, user : req.user.id});
	if (!list){
		return next(new AppError(404, 'List not found.'));
	}
	const taskIndex = findTaskIndex(list, req.params.taskId);
	if (taskIndex === -1) {
		return next(new AppError(404, 'Task not found'));
	}
	Object.assign(list.tasks[taskIndex], req.body);
	await list.save();
	sendResponse(res, 'success', 200, list);
});

exports.deleteTask = catchAsync(async (req, res, next) => {
	const list = await List.findOne({_id : req.params.id, user : req.user.id});
	if (!list){
		return next(new AppError(404, 'List not found.'));
	}
	const taskIndex = findTaskIndex(list, req.params.taskId);
    if (taskIndex === -1) {
    	return next(new AppError(404, 'Task not found'));
    }
	list.tasks.splice(taskIndex, 1);
	await list.save();
	sendResponse(res, 'success', 200, list);
});