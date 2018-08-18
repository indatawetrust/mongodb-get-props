import test from 'ava';
import getProps from './index'
var faker = require('faker')

const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb://localhost:27017'

test('#test', async t => {

  // connect mongo
  const client = await MongoClient.connect(uri, {useNewUrlParser: true})

  // create random data
  const datas = []
  const props = []
  const dbName = faker.database.collation()
  const collectionName = faker.database.collation()

  for (let i = 0; i < 5; i++) {

    let prop = faker.database.column()

    if (props.indexOf(prop) == -1)
      props.push(prop)
    else
      i--
    }

  for (let i = 0; i < 5; i++) {

    datas.push(props.map(key => ({[key]: faker.lorem.text()})).reduce((prev, next) => Object.assign(prev, next)))

  }

  t.deepEqual(Array(5).fill({n: 1, ok: 1}), (await Promise.all(datas.map(async data => {

    return await client.db(dbName).collection(`test-${collectionName}`).insertOne(data)

  }))).map(message => {

    delete message.result.electionId
    delete message.result.opTime

    return message.result

  }))

  props.push('_id')

  t.deepEqual(props.sort((prev, next) => prev > next), (Object.keys(await getProps(client.db(dbName), `test-${collectionName}`))).sort((prev, next) => prev > next))

});
