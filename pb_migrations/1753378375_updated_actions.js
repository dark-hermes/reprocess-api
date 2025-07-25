/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2484833797")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool2790239036",
    "name": "finished",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2484833797")

  // remove field
  collection.fields.removeById("bool2790239036")

  return app.save(collection)
})
