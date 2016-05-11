"use strict";
var _ = require('lodash');

module.exports = {
    respondWithResult: function(res, statusCode) {
        statusCode = statusCode || 200;

        return function(entity) {
            if (entity) {
                res.status(statusCode).json(entity);
            }
        };
    },

    saveUpdates: function(updates) {
        return function(entity) {
            var updated = _.assign(entity, updates);
            updated.markModified('tags');

            return updated.save()
                .then(updated => {
                    return updated;
                });
        };
    },

    removeEntity: function(res) {
      return function(entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
      };
    },

    handleEntityNotFound: function(res) {
        return function(entity) {
            if (!entity) {
                res.status(404).end();
                    return null;
            }
            return entity;
        };
    },

    handleError: function(res, statusCode) {
        statusCode = statusCode || 500;
        return function(err) {
            res.status(statusCode).send(err);
        };
    }
}
