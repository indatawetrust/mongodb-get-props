[![Build Status](https://travis-ci.org/indatawetrust/mongodb-get-props.svg?branch=master)](https://travis-ci.org/indatawetrust/mongodb-get-props)

#### install
```
npm i mongodb-get-props --save
```

#### usage
```js
const getProps = require('mongodb-get-props')

;(async () => {

  const MongoClient = require('mongodb').MongoClient;

  const uri = 'mongodb://localhost:27017/db'

  const client = await MongoClient.connect(uri,{ useNewUrlParser: true });

  // database and collection name
  await getProps(client.db('project'), 'song')

  // sample output
  {
    __v: 'int',
    _id: 'objectId',
    artist_name: 'string',
    created_at: 'date',
    track_name: 'string',
    updated_at: 'date'
  }

})();
```
