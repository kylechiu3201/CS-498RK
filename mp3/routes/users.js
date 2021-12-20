var secrets = require('../config/secrets');
const User = require('../models/user');
const Task = require('../models/task');

module.exports = function (router) {

    var usersRoute = router.route('/users');
    var usersGet = router.route('/users/:id');



    usersRoute.get(function(req, res) {
        var where = req.query.where;
        var sort = req.query.sort;
        var select = req.query.select;
        var skip = req.query.skip;
        var limit = req.query.limit;
        var count = req.query.count;
        var selectedFields = { _id: 1, name: 1, email: 1, pendingTasks: 1, dateCreated: 1 };
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
                selectedFields.email = (select.email === undefined) ? 1 : select.email;
                selectedFields.pendingTasks = (select.pendingTasks === undefined) ? 1 : select.pendingTasks;
                selectedFields.dateCreated = (select.dateCreated === undefined) ? 1 : select.dateCreated;

                select = (((selectedFields._id === 1) ? '_id ' : '-_id ')+((selectedFields.name === 1) ? 'name ' : '')+
                    ((selectedFields.email === 1) ? 'email ' : '')+((selectedFields.pendingTasks === 1) ? 'pendingTasks ' : '')+
                    ((selectedFields.dateCreated === 1) ? 'dateCreated ' : '')).slice(0, -1).split(' ');
            } catch(err) {
                error.message = '"select" data is not properly formatted JSON';
                error.data = select;
                res.status(400);
                res.send(error);
                return;
            }
        }
        else
            select = '_id name email pendingTasks dateCreated';
        skip = (skip && parseInt(skip, 10).toString() === skip) ? parseInt(skip, 10) : undefined;
        limit = (limit && parseInt(limit, 10).toString() === limit) ? parseInt(limit, 10) : undefined;

        // Finds all queries that match 'where' and sorts, skips, limits, and selects based on the given parameters
        User.find(where, function(err, users) {
            if(err)  {
                error.message = 'Error while processing "where" JSON query';
                error.data = where;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            var data = users;
            if(count === 'true')
                data = users.length;
            response = { message: 'OK', data: data };
            res.status(200);
            res.send(response);
        }).sort(sort).skip(skip).limit(limit).select(select);
    });



    usersRoute.post(function(req, res) {
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        var newUser = new User(req.body);
        newUser.dateCreated = new Date(newUser.dateCreated);
        if(newUser.dateCreated === 'Invalid Date' || isNaN(newUser.dateCreated))
            newUser.dateCreated = new Date();
        if(newUser.pendingTasks === undefined || newUser.pendingTasks === null || newUser.pendingTasks === '')
            newUser.pendingTasks = [];
        const name = newUser.name, email = newUser.email;
        var pendingTasks = newUser.pendingTasks;

        // Requres name and email to be defined
        if(name === undefined || name === null || name === '' || email === undefined || email === null || email === '') {
            error.message = 'Name and/or email was not specified';
            error.data = newUser;
            res.status(400);
            res.send(error);
            return;
        }

        // If email is unique, add to database
        User.findOne({ email: email }, function(err, foundUser) {
            if(foundUser !== undefined && foundUser !== null) {
                error.message = 'User with specified email already exists';
                error.data = foundUser;
                res.status(409);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find user by email';
                error.data = email;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                // Link pendingTasks field to database tasks
                pendingTasks.forEach(function(taskID) {
                    Task.findOneAndUpdate({_id: taskID}, {assignedUser: newUser._id, assignedUserName: newUser.name}, function(err, foundTask) {
                        // Task does not exist or it's completed
                        if(foundTask === undefined || foundTask === null || foundTask.completed === true) {
                            // Remove task from pendingTasks
                            newUser.pendingTasks = newUser.pendingTasks.filter(function(task) { return task !== taskID});

                            User.findOneAndUpdate({ _id: newUser._id }, {$pull: {pendingTasks: taskID}}, function(err, foundUser) {
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
                        }
                        else if(err) {
                            error.message = 'Server error while trying to find task by ID';
                            error.data = taskID;
                            res.status(500);
                            res.send(error);
                            return handleError(err);
                        }
                        else {
                            // Task exists
                        }
                    });
                });
                
                newUser.save(function(err) {
                    if(err) {
                        error.message = 'Server error while trying to add new user to database';
                        error.data = newUser;
                        res.status(500);
                        res.send(error);
                        return handleError(err);
                    }
                });

                response.message = 'Created';
                response.data = newUser;
                res.status(201);
                res.send(response);
            }
        });
    });



    usersGet.get(function(req, res) {
        const userID = req.params.id;
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        // If in database, returns the user
        User.findOne({ _id: userID }, function (err, foundUser) {
            if(foundUser === undefined || foundUser === null) {
                error.message = 'User with specified ID does not exist';
                error.data = userID;
                res.status(404);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find user by ID';
                error.data = userID;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                response.message = 'OK';
                response.data = foundUser;
                res.status(200);
                res.send(response);
            }
        });
    });



    usersGet.put(function(req, res) {
        const userID = req.params.id;
        var suppliedUser = new User(req.body);
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        // User data is missing
        if(suppliedUser === undefined || suppliedUser === null || suppliedUser === '') {
            error.message = 'No new user data was given';
            error.data = suppliedUser;
            res.status(404);
            res.send(error);
            return;
        }
        suppliedUser.dateCreated = new Date(suppliedUser.dateCreated);
        if(suppliedUser.dateCreated === 'Invalid Date' || isNaN(suppliedUser.dateCreated))
            suppliedUser.dateCreated = new Date();
        if(suppliedUser.pendingTasks === undefined || suppliedUser.pendingTasks === null || suppliedUser.pendingTasks === '')
            suppliedUser.pendingTasks = [];

        // Requires name and email to be defined
        if(suppliedUser.name === undefined || suppliedUser.email === undefined) {
            error.message = 'Name and/or email was not specified';
            error.data = suppliedUser;
            res.status(404);
            res.send(error);
            return;
        }
        
        // If user ID found, update user with provided user data
        User.findOneAndUpdate({ _id: userID }, {name: suppliedUser.name,
                email: suppliedUser.email,
                pendingTasks: suppliedUser.pendingTasks,
                dateCreated: suppliedUser.dateCreated}, function(err, foundUser) {
            if(foundUser === undefined || foundUser === null) {
                error.message = 'User with specified ID does not exist';
                error.data = userID;
                res.status(404);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find user by ID';
                error.data = userID;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                var OGTasks = foundUser.pendingTasks;
                var ret_data = new User({ name: suppliedUser.name,
                    email: suppliedUser.email,
                    pendingTasks: suppliedUser.pendingTasks,
                    dateCreated: suppliedUser.dateCreated
                });

                // Unlinks original pendingTasks field from database tasks
                Task.updateMany({_id: {$in: OGTasks}}, {assignedUser: "", assignedUserName: "unassigned"}, function(err, foundTask) {
                    if(foundTask === undefined || foundTask === null) {
                        // Task does not exist
                    }
                    else if(err) {
                        error.message = 'Server error while trying to find task by ID';
                        error.data = foundTask._id;
                        res.status(500);
                        res.send(error);
                        return handleError(err);
                    }
                    else {
                        // Task exists
                    }
                });

                // Links new tasks to database tasks
                Task.updateMany({_id: {$in: ret_data.pendingTasks}}, {assignedUser: userID, assignedUserName: ret_data.name}, function(err, foundTask) {
                    if(foundTask === undefined || foundTask === null) {
                        // Task does not exist
                    }
                    else if(err) {
                        error.message = 'Server error while trying to find task by ID';
                        error.data = foundTask._id;
                        res.status(500);
                        res.send(error);
                        return handleError(err);
                    }
                    else {
                        // Task exists
                    }
                });

                // Links new tasks to database tasks
                ret_data.pendingTasks.forEach(function(taskID) {
                    Task.findOneAndUpdate({_id: taskID}, {assignedUser: userID, assignedUserName: ret_data.name}, function(err, foundTask) {
                        // Task does not exist or it's completed
                        if(foundTask === undefined || foundTask === null || foundTask.completed === true) {
                            // Remove task from pendingTasks
                            foundUser.pendingTasks = foundUser.pendingTasks.filter(function(task) {return task !== taskID});
                            ret_data.pendingTasks = foundUser.pendingTasks;

                            User.findOneAndUpdate({ _id: userID }, {$pull: {pendingTasks: taskID}}, function(err, foundUser) {
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
                        }
                        else if(err) {
                            error.message = 'Server error while trying to find task by ID';
                            error.data = taskID;
                            res.status(500);
                            res.send(error);
                            return handleError(err);
                        }
                        else {
                            // Task exists
                        }
                    });
                });

                response.message = 'OK';
                response.data = ret_data;
                response.data._id = userID;
                res.status(200);
                res.send(response);
            }
        });
    });



    usersGet.delete(function(req, res) {
        const userID = req.params.id;
        var response = { message: undefined, data: undefined };
        var error = { message: undefined, data: undefined };

        // If user ID found, delete it
        User.findOneAndDelete({ _id: userID }, function (err, foundUser) {
            if(foundUser === undefined || foundUser === null) {
                error.message = 'User with specified ID does not exist';
                error.data = userID;
                res.status(404);
                res.send(error);
            }
            else if(err) {
                error.message = 'Server error while trying to find user by ID';
                error.data = userID;
                res.status(500);
                res.send(error);
                return handleError(err);
            }
            else {
                var OGTasks = foundUser.pendingTasks;

                // Unlinks original pendingTasks field from database tasks
                Task.updateMany({_id: {$in: OGTasks}}, {assignedUser: "", assignedUserName: "unassigned"}, function(err, foundTask) {
                    if(foundTask === undefined || foundTask === null) {
                        // Task does not exist
                    }
                    else if(err) {
                        error.message = 'Server error while trying to find task by ID';
                        error.data = foundTask._id;
                        res.status(500);
                        res.send(error);
                        return handleError(err);
                    }
                    else {
                        // Task exists
                    }
                });

                response.message = 'OK';
                response.data = foundUser;
                res.status(200);
                res.send(response);
            }
        });
    });

    return router;
}
