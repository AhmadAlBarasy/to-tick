const List = require('../models/listModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { isLoggedIn } = require('./authController');

 exports.sendAPIResponse = (req, res, next) => {
	res.status(req.statusCode).json({
		status : req.statusMessage,
		data : req.data,
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
	req.statusMessage = 'success';
	req.statusCode = 200;
	req.data = lists;
	next();
});

exports.createList = catchAsync(async(req, res, next) => {
    const list = await List.create({...req.body,
		user : req.user.id});
	if (req.baseUrl.startsWith('/api')){
		req.statusMessage = 'success';
		req.statusCode = 201;
		req.data = list;
		return next();
	}
	res.redirect('/lists');
});

exports.getList = catchAsync(async(req, res, next) => {
    const list = await List.findOne({_id : req.params.id, user : req.user});
    if (!list) {
        return next(new AppError(404, 'List not found.'));
    }
	req.statusMessage = 'success';
	req.statusCode = 200;
	req.data = list;
	next();
});

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
	req.statusMessage = 'success';
	req.statusCode = 200;
	req.data = list;
	next();
});

exports.deleteList = catchAsync(async(req, res, next) => {
	const list = await List.findOneAndDelete({_id : req.params.id, user : req.user.id});
	if (!list) {
		return next(new AppError(404, "List not found."));
	}
	req.statusMessage = 'success';
	req.statusCode = 204;
	req.data = null;
	next();
});

exports.createTask = catchAsync(async (req, res, next) => {
	const list = await List.findOne({_id : req.params.id, user : req.user.id});
	if (!list){
		return next(new AppError(404, 'List not found.'));
	}
	list.tasks.push(req.body);
	await list.save();
	req.statusMessage = 'success';
	req.statusCode = 201;
	req.data = list;
	next();
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
	req.statusMessage = 'success';
	req.statusCode = 200;
	req.data = list;
	next();
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
	req.statusMessage = 'success';
	req.statusCode = 200;
	req.data = list;
	next();
});

exports.handleViewPost = catchAsync(async (req, res, next) => {
	if (req.body.createTask) {
		let feedback;
		if (!req.body.taskText) {
			feedback = "new Task can't be empty.";
		}
		else {
			req.list.tasks.push(req.body);
			await req.list.save();
		}
		res.render(`list`, {
			isLoggedIn : req.isLoggedIn,
			list : req.list,
			feedback,
		});
	}
	else if (req.body.saveChanges) {
		for (let task in req.body) {
			const index = findTaskIndex(req.list, task);
			if (index === -1){
				continue;
			}
			req.list.tasks[index].done = Array.isArray(req.body[task]) ? true : false;
			await req.list.save();
		}
		res.render(`list`, {
			isLoggedIn : req.isLoggedIn,
			list : req.list,
		});
	}
	else if (req.body.deleteTask) {
		const index = findTaskIndex(req.list, req.body.deleteTask);
		req.list.tasks.splice(index, 1);
		await req.list.save();
		res.render(`list`, {
			isLoggedIn : req.isLoggedIn,
			list : req.list,
		});
	}
});