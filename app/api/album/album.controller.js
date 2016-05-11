"use strict";
var ctrl = require('../default.controller.js');
var Photo = require('../photo/photo.model.js');
var Album = require('./album.model.js');

function addPhotoFilePath(album, field, size = '') {
    if(album[field]) {
        if(album[field] instanceof Array) {
            album[field].map((p) => {p.filepath = "assets/images/"+size+"/"+p.filename;})
        }
        else {
            album[field].filepath = "assets/images/"+size+"/"+album[field].filename;
        }
    }

    return album;
}

module.exports = {
    // Gets a list of Albums
    index: function index(req, res) {
      return Album.find().lean().populate('cover','filename').exec()
        .then(function(albums) { // Return all albums data
            albums.map(function(a) {
                a = addPhotoFilePath(a, 'cover','240');
            });

            return albums;
        })
        .then(ctrl.respondWithResult(res))
        .catch(ctrl.handleError(res));
    },

    // Gets a single Album from the DB
    show: function show(req, res) {
      return Album.findById(req.params.id).lean()
        .populate('cover','filename')
        .populate('photos','name filename ratio')
        .exec()
        .then(ctrl.handleEntityNotFound(res))
        .then(function(album) { // Add cover filepath
            addPhotoFilePath(album, 'cover','2000');

            return album;
        })
        .then(function(album) { // Return all album data
            addPhotoFilePath(album, 'photos','520');

            return album;
        })
        .then(ctrl.respondWithResult(res))
        .catch(ctrl.handleError(res));
    },

    // Creates a new Album in the DB
    create: function create(req, res) {
      return Album.create(req.body)
        .then(ctrl.respondWithResult(res, 201))
        .catch(ctrl.handleError(res));
    },

    // Updates an existing Album in the DB
    update: function update(req, res) {
      if (req.body._id) {
        delete req.body._id;
      }
      return Album.findById(req.params.id).exec()
        .then(ctrl.handleEntityNotFound(res))
        .then(ctrl.saveUpdates(req.body))
        .then(ctrl.respondWithResult(res))
        .catch(ctrl.handleError(res));
    },

    // Deletes a Album from the DB
    destroy: function destroy(req, res) {
      return Album.findById(req.params.id).exec()
        .then(ctrl.handleEntityNotFound(res))
        .then(ctrl.removeEntity(res))
        .catch(ctrl.handleError(res));
    }
};
