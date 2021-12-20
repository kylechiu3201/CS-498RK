var secrets = require('../config/secrets');
const User = require('../models/user');
const Task = require('../models/task');

module.exports = function (router) {

    var tasksRoute = router.route('/tasks');
    var tasksGet = router.route('/tasks/:id');



    tasksRoute.get(function(req, res) {
        var where = req.query.where;
        var sort = req.query.sort;
        var select = req.query.select;
        var skip = req.query.skip;
        var limit = req.query.limit;
        var count = req.query.count;
        var selectedFields = { _id: 1, name: 1, description: 1, deadline: 1, completed: 1, 
            assignedUser: 1, assignedUserName: 1, dateCreated: 1
        };
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };
        
        // Processes all possible parameters and converts them into a usable format
        if(where !== undefined && where !== null && where !== '') {
            try {
                where = JSON.parse(where);
            } catch(err) {
                error.message = '"where" data is not properly formatted JSON';
                error.data = where;
                res.status(400);
                res.send(error);
                return;
            }
        }
        else
            where = {};
        if(sort !== undefined && sort !== null) {
            try {
                sort = JSON.parse(sort);
            } catch(err) {
                error.message = '"sort" data is not properly formatted JSON';
                error.data = sort;
                res.status(400);
                res.send(error);
                return;
            }
        }
        if(select !== undefined && select !== null) {
            try {
                select = JSON.parse(select);
                selectedFields._id = (select._id === undefined) ? 1 : select._id;
                selectedFields.name = (select.name === undefined) ? 1 : select.name;
                selectedFields.description = (select.description === undefined) ? 1 : select.description;
                selectedFields.deadline = (select.deadline === undefined) ? 1 : select.deadline;
                selectedFields.completed = (select.completed === undefined) ? 1 : select.completed;
                selectedFields.assignedUser = (select.assignedUser === undefined) ? 1 : select.assignedUser;
                selectedFields.assignedUserName = (select.assignedUserName === undefined) ? 1 : select.assignedUserName;
                selectedFields.dateCreated = (select.dateCreated === undefined) ? 1 : select.dateCreated;

                select = (((selectedFields._id === 1) ? '_id ' : '-_id ')+((selectedFields.name === 1) ? 'name ' : '')+
                    ((selectedFields.description === 1) ? 'description ' : '')+((selectedFields.deadline === 1) ? 'deadline ' : '')+
                    ((selectedFields.completed === 1) ? 'completed ' : '')+((selectedFields.assignedUser === 1) ? 'assignedUser ' : '')+
                    ((selectedFields.assignedUserName === 1) ? 'assignedUserName ' : '')+((selectedFields.dateCreated === 1) ? 'dateCreated ' : '')
                    ).slice(0, -1).split(' ');
            } catch(err) {
                error.message = '"select" data is not properly formatted JSON';
                error.data = select;
                res.status(400);
                res.send(error);
                return;
            }
        }
        else
            select = '_id name description deadline completed assignedUser assignedUserName dateCreated';
        skip = (skip && parseInt(skip, 10).toString() === skip) ? parseInt(skip, 10) : undefined;
        limit = (limit && parseInt(limit, 10).toString() === limit) ? parseInt(limit, 10) : undefined;

        // Finds all queries that match 'where' and sorts, skips, limits, and selects based on the given parameters
        Task.find(where, function(err, tasks) {
            if(err)  {
                error.message = 'Error while processing "where" JSON query';
                error.data = where;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            var data = tasks;
            if(count === 'true')
                data = tasks.length;
            response = { message: 'OK', data: data };
            res.status(200);
            res.send(response);
        }).sort(sort).skip(skip).limit(limit).select(select);
    });



    tasksRoute.post(function(req, res) {
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };
        var newTask = new Task(req.body);
        const name = newTask.name;
        newTask.deadline = new Date(newTask.deadline);
        if(newTask.deadline === 'Invalid Date' || isNaN(newTask.deadline))
            newTask.deadline = undefined;
        const deadline = newTask.deadline;
        newTask.dateCreated = new Date(newTask.dateCreated);
        if(newTask.dateCreated === 'Invalid Date' || isNaN(newTask.dateCreated))
            newTask.dateCreated = new Date();
        newTask.description = (newTask.description === undefined) ? "" : newTask.description;
        newTask.assignedUser = (newTask.assignedUser === undefined || newTask.assignedUser === null) ? "" : newTask.assignedUser;
        newTask.assignedUserName = (newTask.assignedUserName === undefined || newTask.assignedUserName === null ||
            newTask.assignedUserName === '') ? "unassigned" : newTask.assignedUserName;
        if(newTask.completed !== undefined) {
            newTask.completed = newTask.completed.toString().toLowerCase();
            if(newTask.completed !== true && newTask.completed !== false)
                newTask.completed = false;
        }
        else
            newTask.completed = false;
        newTask.dateCreated = new Date(newTask.dateCreated);
        if(newTask.dateCreated === 'Invalid Date' || isNaN(newTask.dateCreated))
            newTask.dateCreated = new Date();

        // Requires name and deadline to be defined
        if(name === undefined || name === null || name === '' || deadline === undefined || deadline === null || deadline === '') {
            error.message = 'Name and/or deadline was not specified';
            error.data = newTask;
            res.status(400);
            res.send(error);
            return;
        }
        newTask.save(function(err) {
            if (err) {
                error.message = 'Server error while trying to add new task to database';
                error.data = newTask;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
        });

        // Link database task to pendingTasks field of selected user if task is not completed
        if(newTask.completed === false) {
            User.findOneAndUpdate({ _id: newTask.assignedUser }, {$addToSet: {pendingTasks: newTask._id}}, function(err, foundUser) {
                if(foundUser === undefined || foundUser === null) {
                    // User does not exist
                }
                else if(err) {
                    error.message = 'Server error while trying to find user by ID';
                    error.data = newTask.assignedUser;
                    res.status(500);
                    res.send(error);
                    return handleError(err);
                }
                else {
                    // But if the assigned username doesn't match, then we should throw an error
                    if(newTask.assignedUserName !== foundUser.name && newTask.assignedUserName !== "unassigned") {
                        error.message = "Task assignedUserName does not match assignedUser's name";
                        error.data = newTask.assignedUserName;
                        res.status(400);
                        res.send(error);
                        return;
                    }
                    else {
                        newTask.assignedUserName = foundUser.name;
                    }
                }
            });
        }
        response.message = 'Created';
        response.data = newTask;
        res.status(201);
        res.send(response);
    });



    tasksGet.get(function(req, res) {
        const taskID = req.params.id;
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        // If in database, returns the task
        Task.findOne({ _id: taskID }, function (err, foundTask) {
            if(foundTask === undefined || foundTask === null) {
                error.message = 'Task with specified ID does not exist';
                error.data = taskID;
                res.status(404);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find task by ID';
                error.data = taskID;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                response.message = 'OK';
                response.data = foundTask;
                res.status(200);
                res.send(response);
            }
        });
    });



    tasksGet.put(function(req, res) {
        const taskID = req.params.id;
        var suppliedTask = new Task(req.body);
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        // Task data is missing
        if(suppliedTask === undefined || suppliedTask === null || suppliedTask === '') {
            error.message = 'No new task data was given';
            error.data = suppliedTask;
            res.status(404);
            res.send(error);
            return;
        }
        suppliedTask.deadline = new Date(suppliedTask.deadline);
        if(suppliedTask.deadline === 'Invalid Date' || isNaN(suppliedTask.deadline))
            suppliedTask.deadline = undefined;
        if(suppliedTask.completed !== undefined) {
            suppliedTask.completed = suppliedTask.completed.toString().toLowerCase();
            if(suppliedTask.completed !== true && suppliedTask.completed !== false)
                suppliedTask.completed = false;
        }
        else
            suppliedTask.completed = false;
        suppliedTask.dateCreated = new Date(suppliedTask.dateCreated);
        if(suppliedTask.dateCreated === 'Invalid Date' || isNaN(suppliedTask.dateCreated))
            suppliedTask.dateCreated = new Date();
        suppliedTask.description = (suppliedTask.description === undefined || suppliedTask.description === null) ? "" : suppliedTask.description;
        suppliedTask.assignedUser = (suppliedTask.assignedUser === undefined || suppliedTask.assignedUser === null) ? "" : suppliedTask.assignedUser;
        suppliedTask.assignedUserName = (suppliedTask.assignedUserName === undefined || suppliedTask.assignedUserName === null ||
            suppliedTask.assignedUserName === '') ? "unassigned" : suppliedTask.assignedUserName;

        // If name or deadline missing, throw error
        if(suppliedTask.name === undefined || suppliedTask.name === null || suppliedTask.name === '' ||
            suppliedTask.deadline === undefined || suppliedTask.deadline === null || suppliedTask.deadline === '') {
            error.message = 'Name and/or deadline was not specified';
            error.data = suppliedTask;
            res.status(404);
            res.send(error);
            return;
        }
        
        // If task ID found, update task with provided task data
        Task.findOneAndUpdate({ _id: taskID }, {name: suppliedTask.name,
            description: suppliedTask.description,
            deadline: suppliedTask.deadline,
            completed: suppliedTask.completed,
            assignedUser: suppliedTask.assignedUser,
            assignedUserName: suppliedTask.assignedUserName,
            dateCreated: suppliedTask.dateCreated}, function(err, foundTask) {
            if(foundTask === undefined || foundTask === null) {
                error.message = 'Task with specified ID does not exist';
                error.data = taskID;
                res.status(404);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find task by ID';
                error.data = taskID;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                var ret_data = new Task({ name: suppliedTask.name,
                    description: suppliedTask.description,
                    deadline: suppliedTask.deadline,
                    completed: suppliedTask.completed,
                    assignedUser: suppliedTask.assignedUser,
                    assignedUserName: suppliedTask.assignedUserName,
                    dateCreated: suppliedTask.dateCreated
                });
                var OGUser = foundTask.assignedUser;

                // Unlink database task from pendingTasks field of selected user
                User.findOneAndUpdate({ _id: OGUser }, {$pull: {pendingTasks: taskID}}, function(err, foundUser) {
                    if(foundUser === undefined || foundUser === null) {
                        // User does not exist
                    }
                    else if(err) {
                        error.message = 'Server error while trying to find user by ID';
                        error.data = OGUser;
                        res.status(500);
                        res.send(error);
                        return handleError(err);
                    }
                    else {
                        // User exists
                    }
                });

                // Link database task to pendingTasks field of selected user
                if(suppliedTask.completed === false) {
                    User.findOneAndUpdate({ _id: ret_data.assignedUser }, {$addToSet: {pendingTasks: taskID}}, function(err, foundUser) {
                        if(foundUser === undefined || foundUser === null) {
                            // User does not exist
                        }
                        else if(err) {
                            error.message = 'Server error while trying to find user by ID';
                            error.data = ret_data.assignedUser;
                            res.status(500);
                            res.send(error);
                            return handleError(err);
                        }
                        else {
                            // But if the assigned username doesn't match, then we should throw an error
                            if(suppliedTask.assignedUserName !== foundUser.name && suppliedTask.assignedUserName !== "unassigned") {
                                error.message = "Task assignedUserName does not match assignedUser's name";
                                error.data = suppliedTask.assignedUserName;
                                res.status(400);
                                res.send(error);
                                return;
                            }
                            else {
                                ret_data.assignedUserName = foundUser.name;
                                foundTask.assignedUserName = foundUser.name;
                                Task.findOneAndUpdate({_id: taskID}, {assignedUserName: foundUser.name}, function(err, foundUser) {
                                    if(foundUser === undefined || foundUser === null) {
                                        // User does not exist
                                    }
                                    else if(err) {
                                        error.message = 'Server error while trying to find task by ID';
                                        error.data = taskID;
                                        res.status(500);
                                        res.send(error);
                                        return handleError(err);
                                    }
                                    else {
                                        // User exists
                                    }
                                });
                            }
                        }
                    });
                }
                response.message = 'OK';
                response.data = ret_data;
                response.data._id = taskID;
                res.status(200);
                res.send(response);
            }
        });
    });



    tasksGet.delete(function(req, res) {
        const taskID = req.params.id;
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        // If task ID found, delete it
        Task.findOneAndDelete({ _id: taskID }, function (err, foundTask) {
            if(foundTask === undefined || foundTask === null) {
                error.message = 'Task with specified ID does not exist';
                error.data = taskID;
                res.status(404);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find task by ID';
                error.data = taskID;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                // Unlink database task from pendingTasks field of selected user
                User.findOneAndUpdate({ _id: foundTask.assignedUser }, {$pull: {pendingTasks: taskID}}, function(err, foundUser) {
                    if(foundUser === undefined || foundUser === null) {
                        // User does not exist
                    }
                    else if(err) {
                        error.message = 'Server error while trying to find user by ID';
                        error.data = foundTask.assignedUser;
                        res.status(500);
                        res.send(error);
                        return handleError(err);
                    }
                    else {
                        // User exists
                    }
                });

                response.message = 'OK';
                response.data = foundTask;
                res.status(200);
                res.send(response);
            }
        });
    });

    return router;
}
