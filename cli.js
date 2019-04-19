#! /usr/bin/env node
const argv = require('yargs').argv;

const {db, c} = argv;

if (!db || !c) {
  process.exit();
}

const getProps = require('.');
(async () => {
  const MongoClient = require('mongodb').MongoClient;

  const uri = `mongodb://localhost:27017/${db}`;

  const client = await MongoClient.connect(uri, {useNewUrlParser: true});

  getProps(client.db(db), c)
    .then(props => {
      console.log(JSON.stringify(props));

      process.exit();
    })
    .catch(error => {
      console.log(error);

      process.exit();
    });
})();
