module.exports = (db, collection) => new Promise((resolve, reject) => {

  const map = function() {
    for (var key in this) {
      emit(key, null)
    }
  }

  const reduce = (prev, next) => null

  db.collection(collection).mapReduce(map, reduce, {
    out: collection + '_keys'
  }, (err, collection_props) => {
    if (err) reject(err)

    collection_props
    .find()
    .toArray()
    .then(props => {

      db.collection(collection).aggregate([
        {
          $project: props.map(prop => ({[prop._id]: {$type: `$${prop._id}`}})).reduce((prev, next) => Object.assign(prev, next))
        }, {
          $limit: 1
        }
      ])
      .toArray()
      .then(props => props[0])
      .then(resolve)
      .catch(reject)

    })
    .catch(reject)
  })

})
