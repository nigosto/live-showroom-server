const User = require('../models/User')
const Model = require('../models/Model')
const Type = require('../models/Type')
const Material = require('../models/Material')
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
    uploadMaterial: async (req, res, next) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }

            let model = await Model.find({name: req.body.model})
            
            let material = await Material.create({
                path: "https://" + req.hostname + "/content/" +  req.file.originalname,
                model: model[0]._id,
                name: req.file.originalname
            })

            model[0].materials.push(material._id);
            await model[0].save()
            await material.save()

            return res.status(200).send(req.file)
        })
    },
}