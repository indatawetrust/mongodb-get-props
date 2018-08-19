const _ = require('lodash');

module.exports = (db, collection) =>
  new Promise((resolve, reject) => {
    const objFilter = obj =>
      _.pickBy(obj, (value, key) => {
        return !(['null', null, 'missing', 'undefined', undefined].indexOf(value) > -1);
      });

    const customizer = (objValue, srcValue) => {
      return _.isUndefined(objValue) != -1 ? srcValue : objValue;
    };

    const defaults = _.partialRight(_.assignInWith, customizer);

    const map = function() {
      for (var key in this) {
        if (this[key]) {
          emit(key, this['_id']);
        }
      }
    };

    const reduce = (prev, next) => null;

    const objectid = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

    db.collection(collection).mapReduce(map, reduce, {
      out: collection + '_keys',
    }, (err, collection_props) => {
      if (err) reject(err);

      collection_props
        .find()
        .limit(1000)
        .toArray()
        .then(props => {
          if (props.length) {
            db
              .collection(collection)
              .aggregate([
                {
                  $match: {
                    $or: [
                      {
                        _id: {
                          $in: props
                            .filter(prop => objectid.test(prop.value))
                            .map(prop => prop.value),
                        },
                      },
                      props
                        .map(prop => ({[prop._id]: {$exists: true}}))
                        .reduce((prev, next) => Object.assign(prev, next)),
                    ],
                  },
                },
                {
                  $project: props
                    .map(prop => ({[prop._id]: {$type: `$${prop._id}`}}))
                    .reduce((prev, next) => Object.assign(prev, next)),
                },
                {
                  $limit: 1000
                }
              ])
              .toArray()
              .then(props => {
                return defaults(...props.map(objFilter));
              })
              .then(resolve)
              .catch(reject);
          } else {
            resolve({});
          }
        })
        .catch(reject);
    });
  });
