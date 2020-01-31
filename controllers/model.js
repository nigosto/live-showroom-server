const User = require('../models/User')
const Model = require('../models/Model')
const Type = require('../models/Type')
const Material = require('../models/Material')
const fs = require('fs')
const nanoid = require('nanoid')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, 'content')
    },
    filename: function(req,file,cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({storage:storage}).single('file')

module.exports = {
    uploadModel: async (req, res, next) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            } 

            let type = await Type.find({name: req.body.type})

            let model = await Model.create({
                path: "http://" + req.hostname + ":9999/content/" +  req.file.originalname,
                type: type[0]._id,
                name: req.body.name
            })

            type[0].models.push(model._id)

            await type[0].save()
            await model.save()

            return res.status(200).send(req.file)
        })
    },
    getDefaultModels: async (req,res,next) => {
        let types = await Type.find().populate('models');
        let models = [];
        for(let i = 0; i < types.length; i++) {
            let material = await Material.findById(types[i].models[0].materials[0])
            models.push({path:types[i].models[0].path,type: types[i].name, name: types[i].models[0].name, material: material.path, image: types[i].models[0].image})
        }
        // types.forEach(async (t) => {
            
        // })
        res.status(200).json({message: "Default models successfully fetched!", models})
    },
    uploadImage: async (req,res,next) => {
        
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            } 

            let model = await Model.find({name: req.params.name})
            model[0].image = "http://" + req.hostname + ":9999/content/" +  req.file.originalname;
            await model[0].save()
            console.log(model[0])

            return res.status(200).send(req.file)
        })
    },
    getModelById: async (req,res, next) => {
        let {id} = req.params;
        let model = await Model.findById(id).populate('type').populate('materials');
        res.status(200).json({model})
    }
} 