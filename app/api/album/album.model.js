"use strict";
var mongoose = require('mongoose');

var albumSchema = mongoose.Schema(
    {
        name: String,
        date: Date,
        description: String,
        tags: [String],
        photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
        cover: {type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}
    },
    {
        collection: 'albums'
    }
);

module.exports = mongoose.model('Album', albumSchema);
