const Template = require('../models/Template');

// Create Template
exports.createTemplate = async (req, res) => {
    const template = new Template(req.body);
    try {
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Templates
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 