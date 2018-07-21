module.exports = (db, collection) => new Promise((resolve, reject) => {
  db.collection(collection).mapReduce(function() {
    for (var key in this) {
      emit(key, null)
    }
  }, (prev, next) => null, {
    out: collection + '_keys'
  }, (err, collection_props) => {
    if (err)
      reject(err)

    collection_props.find().toArray().then(props => resolve(props.map(({_id}) => _id)))
  })
})
