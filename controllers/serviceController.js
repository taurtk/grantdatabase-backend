const Service = require('../models/Service');

// Request Service
exports.requestService = async (req, res) => {
    const service = new Service(req.body);
    try {
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate('userId grantId');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 