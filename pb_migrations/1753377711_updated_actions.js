/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2484833797")

  // remove field
  collection.fields.removeById("text1125644311")

  // remove field
  collection.fields.removeById("text1552613407")

  // remove field
  collection.fields.removeById("bool2790239036")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2484833797")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1125644311",
    "max": 0,
    "min": 0,
    "name": "quest",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1552613407",
    "max": 0,
    "min": 0,
    "name": "benefit",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2790239036",
    "name": "finished",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
