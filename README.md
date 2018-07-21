[![Build Status](https://travis-ci.org/indatawetrust/mongodb-get-props.svg?branch=master)](https://travis-ci.org/indatawetrust/mongodb-get-props)

#### install

#### usage
```js
;(async () => {
  
  const MongoClient = require('mongodb').MongoClient;

  const uri = 'mongodb://localhost:27017/db'

  const client = await MongoClient.connect(uri,{ useNewUrlParser: true });

  // database and collection name
  await getProps(client.db('project'), 'user')

})();
```
