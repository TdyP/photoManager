"use strict";

var ctrl = require('../default.controller.js');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = Promise.promisifyAll(require('fs'));
var Photo = require('./photo.model');
var Album = require('../album/album.model');
var im = Promise.promisifyAll(require('imagemagick'));

function addFilepath(photo, size = '2000') {
    var addField = (p) => {p.filepath = "assets/images/"+size+"/"+p.filename}; // Add public path to photo data

    if(photo instanceof Array) {
        photo.map(addField(p));
    }
    else {
        addField(photo);
    }

    return photo;
}

module.exports = {
    // Gets a list of Photos
    index: function index(req, res) {
      var filters = {};

      if(req.query.q) {
        filters = {
          $or: [
            {
              name: {
                $regex: req.query.q,
                $options: 'i' // Case insensitive
              }
            },
            {
              tags: {
                $in: [req.query.q]
              }
            }
          ]
        };
      }

      return Photo.find(filters).lean().exec()
        .then((photos) => {
            photos.map((p) => addFilepath(p,520));
            return ctrl.respondWithResult(res)(photos);
        })
        .catch(ctrl.handleError(res));
    },

    // Gets a single Photo from the DB
    show: function show(req, res) {
      return Photo.findById(req.params.id).lean().exec()
        .then(ctrl.handleEntityNotFound(res))
        .then((photo) => {
            addFilepath(photo);

            return photo;
        })
        .then(ctrl.respondWithResult(res))
        .catch(ctrl.handleError(res));
    },

    // Creates a new Photo in the DB
    create: function create(req, res) {
        var file = req.files[0];
        let destPath = process.env.APP_PATH+'/public/assets/images/orig/'+file.originalname;
        req.body.filename = file.originalname;
        if(req.body.name === undefined)
            req.body.name = file.originalname;

        // Move file
        let prom = fs.renameAsync(process.env.APP_PATH+'/'+file.path,destPath) // Move file
        .then(function() { // Create 240px preview
            return im.resizeAsync({
                srcPath: destPath,
                dstPath: process.env.APP_PATH+'/public/assets/images/240/'+file.originalname,
                width: 240
            });
        })
        .then(function() { // Create 520px preview
            return im.resizeAsync({
                srcPath: destPath,
                dstPath: process.env.APP_PATH+'/public/assets/images/520/'+file.originalname,
                width: 520
            });
        })
        .then(function() { // Create 2000px preview
            return im.resizeAsync({
                srcPath: destPath,
                dstPath: process.env.APP_PATH+'/public/assets/images/2000/'+file.originalname,
                width: 2000
            });
        })
        .then(function() { // Extract exif
            return im.readMetadataAsync(destPath);
        })
        .then(function(metaData) { // Save data in DB
            req.body.ratio = metaData.exif.exifImageWidth/metaData.exif.exifImageLength;

            req.body.exif = {
              date: metaData.exif.dateTimeOriginal,
              make: metaData.exif.make,
              model: metaData.exif.model,
              aperture: eval(metaData.exif.fNumber),
              exposure_time: eval(metaData.exif.exposureTime),
              ISO: metaData.exif.isoSpeedRatings,
              focal_length: eval(metaData.exif.focalLength),
              size: metaData.exif.exifImageWidth+'x'+metaData.exif.exifImageLength
            };

            return Photo.create(req.body)
        });

        if(req.body.album !== undefined) {
          prom.then(function(savedPhoto) { // Add photo to album
            return Album.findByIdAndUpdate(req.body.album, {
              $push: {photos: savedPhoto._id}
            });
          });
        }

        return prom.then(ctrl.respondWithResult(res, 201))
            .catch(ctrl.handleError(res));
    },

    // Updates an existing Photo in the DB
    update: function update(req, res) {
      if (req.body._id) {
        delete req.body._id;
      }
      return Photo.findById(req.params.id).exec()
        .then(ctrl.handleEntityNotFound(res))
        .then(ctrl.saveUpdates(req.body))
        .then(ctrl.respondWithResult(res))
        .catch(ctrl.handleError(res));
    },

    // Deletes a Photo from the DB
    destroy: function destroy(req, res) {
      return Photo.findById(req.params.id).exec()
        .then(ctrl.handleEntityNotFound(res))
        .then(ctrl.removeEntity(res))
        .then(function() {
            return Album.update(
                {},
                {
                    $pull: {photos: req.params.id}
                })
            .exec();
        })
        .then(function(delRes) {
            console.log('delres',delRes);
        })
        .catch(ctrl.handleError(res));
    }
};
