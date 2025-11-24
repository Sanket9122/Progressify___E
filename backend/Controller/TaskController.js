const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/ProjectModels');
const teamMember = require('../models/TeamMember');
const { sendTaskAssignmentEmail } = require('../Services/emailService');

// controller for assigning the task to available team members

const assignTasks = asyncHandler(async (req, res) => {
    try {
        //Team members with no pending tasks
        const membersWithPendingTasks = await Task.find({ Status: Pending }).distinct('assignedTo');

        //exclude those team members who don't get any tasks {$ne : Project Manager}
        const availableMembers = await teamMember.find({
            _id: { $nin: membersWithPendingTasks },
            role: { $ne: 'Project Manager' }
        });

        //find all the tasks with high prirority

        const highPriorityTask = await Task.findOne({
            status: ' In_queue',
            assignedTo: null,
        }).sort({ priority: -1, createdAt: 1 });
        // If no high priority task is found, return a message
        if (!highPriorityTask) {
            return res.status(404).json({ message: 'No high priority tasks available for assignment.' });
        }

        // assign the task to the first available member 
        if (availableMembers.length > 0 && highPriorityTask) {
            const memberToAssign = availableMembers[0];    ///// assigning the first availble member
            highPriorityTask.assignedTo = memberToAssign._id;
            highPriorityTask.status = 'Pending'; // Update task status to 'Pending'
            await highPriorityTask.save();

            //Log assignment details 
            console.log(`Task ${highPriorityTask._id} assigned to member ${memberToAssign._id}`);

            //send email remainder
            const project = await Project.findById(highPriorityTask.projectId);
            if (project && memberToAssign.email) {
                await sendTaskAssignmentEmail(
                    memberToAssign.email,
                    queuedTask.name,
                    project.name,
                    new Date(queuedTask.dueDate).toLocaleDateString() // Format date for email
                );
            }
            return res.status(200).json({
                message: `Task ${highPriorityTask.name} assigned to ${memberToAssign.name}`,
                task: highPriorityTask,
                member: memberToAssign
            });
        }
    }
    catch (error) {
        console.error('Error during automatic task assignment ;', error);
    }
    return null;
});

// create a new task
// POST /api/tasks
//@access Private

const createTask = asyncHandler(async (req, res) => {
    const { name, description, projectId, priority, dueDate } = req.body;
    //Basic Validation
    if (!name || !projectId || !dueDate) {
        return res.status(400).json({ message: 'Please provide all required fields: name, projectId, and dueDate.' });
    }
    //verify projectid existed

    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
        res.status(400);
        throw new Error('Project not found:');
    }

    // Handle priority conversion from string to number
    const priorityMap = { high: 3, medium: 2, low: 1 };
    let numericPriority = 2; // Default to medium
    if (typeof priority === 'string') {
        numericPriority = priorityMap[priority.toLowerCase()] || 2;
    } else if (typeof priority === 'number' && [1, 2, 3].includes(priority)) {
        numericPriority = priority;
    }

    const task = await Task.create({
        name, 
        description, 
        projectId,
        priority: numericPriority,
        dueDate,
        status: 'In_queue', // new tasks are in the queue
        assignedTo: null,  /// task are unassigned initially
    });
    if (task) {
        res.status(201).json({
            _id: task._id,
            name: task.name,
            description: task.description,
            projectId: task.projectId,
            priority: task.priority,
            dueDate: task.dueDate,
            status: task.status,
            ceatedAt: task.createdAt,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid task data');
    }
});

//Get All Tasks
//GET /api/tasks
//@access Private 
//query params : projectId , status(optional filters) , assignedTo 

const getTasks = asyncHandler(async (req, res) => {
    const { projectId, status, assignedTo } = req.query;
    const filter = () => {

    };
    if (projectId) {
        filter.projectId = projectId; /// filter by projectId
    }
    if (status) {
        filter.status = status;   // filter by status
    }
    if (assignedTo) {
        filter.assignedTo = assignedTo;   // filter by assignedTo
    }
    const tasks = await Task.find(filter).populate('projectId', 'name').populate('assignedTo', 'name email role');
    res.status(200).json(tasks);
});

//get single task by id 
//GET /api/tasks/:id
//@access Private

const getTaskById = asyncHandler(async (req, res) => {
    const taskId = req.params._id;
    const task = await Task.findById(taskId)
        .populate('projectId', 'name')
        .populate('assignedTo', 'name email role');

    if (task) {
        res.status(200).json(task);
    }
    else {
        res.status(400).json({
            message: 'Task not found'
        })
    }
});

//update the task by id 
//PUT /api/tasks/:id
//@access Private
const updateTask = asyncHandler(async (req, res) => {
    const { name, description, projectId, priority, dueDate, status, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (task) {
        // Only allow updating projectId if task is in queue
        if (projectId && String(projectId) !== String(task.projectId)) {
            if (task.status !== 'in_queue' && task.status !== 'blocked') {
                res.status(400);
                throw new Error('Project can only be changed for tasks in queue or blocked.');
            }
            const newProjectExists = await Project.findById(projectId);
            if (!newProjectExists) {
                res.status(404);
                throw new Error('New project not found.');
            }
            task.projectId = projectId;
        }

        // Handle assignedTo changes (manual assignment via update)
        if (assignedTo !== undefined && String(assignedTo) !== String(task.assignedTo)) {
            if (assignedTo === null) {
                // Manually unassigning
                task.assignedTo = null;
                task.status = 'in_queue';
            } else {
                // Manually assigning
                const memberExists = await TeamMember.findById(assignedTo);
                if (!memberExists) {
                    res.status(404);
                    throw new Error('Assigned team member not found.');
                }
                task.assignedTo = assignedTo;
                task.status = 'pending'; // Set to pending upon manual assignment
                const project = await Project.findById(task.projectId);
                if (project && memberExists.email) {
                    await sendTaskAssignmentEmail(
                        memberExists.email,
                        task.name,
                        project.name,
                        new Date(task.dueDate).toLocaleDateString()
                    );
                }
            }
        }

        // Status change logic - for general update, markTaskComplete should be used for completion
        if (status && status !== task.status) {
            if (status === 'completed') {
                // Advise using the dedicated complete endpoint for full completion logic
                res.status(400);
                throw new Error('Please use the dedicated /api/tasks/:id/complete endpoint to mark a task as completed.');
            }
            task.status = status;
        }

        // Handle priority conversion from string to number
        if (priority) {
            const priorityMap = { high: 3, medium: 2, low: 1 };
            if (typeof priority === 'string') {
                task.priority = priorityMap[priority.toLowerCase()] || task.priority;
            } else if (typeof priority === 'number' && [1, 2, 3].includes(priority)) {
                task.priority = priority;
            }
        }

        task.name = name || task.name;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();

        res.status(200).json({
            _id: updatedTask._id,
            name: updatedTask.name,
            description: updatedTask.description,
            projectId: updatedTask.projectId,
            assignedTo: updatedTask.assignedTo,
            status: updatedTask.status,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
            completedAt: updatedTask.completedAt,
            updatedAt: updatedTask.updatedAt,
        });
    } else {
        res.status(404);
        throw new Error('Task not found.');
    }
});

//Mark a task as completed
//PUT /api/tasks/:id/complete
//@access Private

const markTaskCompleted = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        if (task.status === 'completed') {
            res.status(400);
            throw new Error('Task is already marked as completed.');
        }
        task.status = 'completed';
        task.completedAt = new Date(); // Set completedAt to current date
        task.assignedTo = null; // Unassign the task when completed
        const completedTaskId = await task.save();
        res.status(200).json({
            _id: completedTaskId._id,
            name: completedTaskId.name,
            description: completedTaskId.description,
            projectId: completedTaskId.projectId,
            assignedTo: completedTaskId.assignedTo,
            status: completedTaskId.status,
            message: 'Task marked as completed successfully.',
            completedAt: completedTaskId.completedAt,
        });
        await assignTasks();
    }
    else {
        res.status(404);
        throw new Error('Task not found.');
    }
});

//Manually assign task to a team member 
//PUT /api/tasks/:id/assign
//@access Private

const assignTasktoMember = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    const { memberId } = req.body
    if (!memberId) {
        res.status(404)
            .json({
                message: ' please provide memberId to assign the task'
            });
    }
    if (!task) {
        res.status(404)
            .json({
                message: 'Task not found.'
            })
    }
    const teamMember = await TeamMember.findById(memberId);
    if (!teamMember) {
        res.status9404
            .json({
                message: 'Team member not found'
            })
    }
    if(task.status === 'completed'){
        res.status(400)
        .json({
            message : ' cannot assign a completed task to a team member'
        })
    }
    //update the task assignment and status 
    task.assignedTo = memberId;
    task.status = 'pending' ;   /// update the utask status to pending after assignment

    const updatedTask = await task.save();

    //send email notification to the team member fo manual assignment

    const project = await Project.findById(updatedTask.projectId);
    if(project && teamMember.email){
        await sendTaskAssignmentEmail(
           teamMember.email,
            updatedTask.name,
            project.name,
            new Date(updatedTask.dueDate).toLocaleDateString()
        );
    }
    res.status(200).json({
        _id: updatedTask._id,
        name: updatedTask.name,
        assignedTo: updatedTask.assignedTo,
        status: updatedTask.status,
        message: 'Task assigned successfully.',
    });
});

//Delete a task
//DELETE /api/tasks/:id
//@access Private

const deleteTask = asyncHandler(async(req,res)=>{
    const task = await Task.findById(req.params.id);
    if(!task){
        res.status(404).json({
            message :'Task not found'
        })
    }
    await Task.deleteone({ _id: req.params.id });
    res.status(200).json({
        message: 'Task deleted successfully',
    });
});


//exporting all the functions 

module.exports =  {
    assignTasks,
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    markTaskCompleted,
    assignTasktoMember,
    deleteTask
};