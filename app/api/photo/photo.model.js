"use strict";
var mongoose = require('mongoose');

var photoSchema = mongoose.Schema(
    {
        name: {type: String, index: true},
        filename: String,
        date: Date,
        import_date: {type: Date, default: Date.now},
        modif_date: {type: Date, default: Date.now},
        ratio: Number,
        tags: {type: [String], index: true},
        description: String,
        exif: {}
    },
    {
        collection: 'photos'
    }
);

module.exports = mongoose.model('Photo', photoSchema);
