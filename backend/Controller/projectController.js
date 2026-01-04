const asyncHandler = require ('express-async-handler');
const Project = require('../models/ProjectModels');
const Task = require('../models/Task');
// controller to get all projects  , with optional limit 
const getProjects = asyncnHandler(async (req ,res) =>{
    const limit = parseInt(req.query.limit , 10) || 0;

    const projects = await Project.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('creator', 'name email');
    res.status(200).json(projects);
});
// controller to create a new project 


const createProject  = asyncHandler(async (req, res) => {
    const { name, description, schedule } = req.body;

    if (!name || !description || !schedule) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const project = await Project.create({
        name,
        description,
        schedule,
        creator: req.user._id, // Assuming req.user is set by auth middleware
    });

    res.status(201).json(project);
});

/// access the project by id 
 const accessprojectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).populate('creator', 'name email');

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
});

// controller to update a project by id 

const updateProjectById = asyncHandler(async (req, res) => {
    const { name, description, schedule, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Only allow the creator to update the project
    if (project.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.schedule = schedule || project.schedule;
    project.status = status || project.status;

    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
});

// controller to delete a project by id 


const deleteProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Only allow the creator to delete the project
    if (project.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.remove();

    res.status(200).json({ message: 'Project deleted successfully' });
});

module.exports =  {
    getProjects,
    createProject,
    accessprojectById,
    updateProjectById,
    deleteProjectById
};