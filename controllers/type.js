const User = require('../models/User')
const Model = require('../models/Model')
const Type = require('../models/Type')

module.exports = {
    createType: async (req, res, next) => {
        const {name} = req.body;
        let type = await Type.create({
            name
        })
        await type.save()

        res.status(200).json({ message: 'Type created successfully!', type })
    },
    getModelsFromOneType: async (req,res,next) => {
        let {type} = req.params
        let typeDb = await Type.find({name: type}).populate('models');
        res.status(200).json({message: "Models fetched successfully!", models: typeDb[0].models})
    }
}