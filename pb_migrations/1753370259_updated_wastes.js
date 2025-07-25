/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3478179827")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool2887830107",
    "name": "on_sale",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3478179827")

  // remove field
  collection.fields.removeById("bool2887830107")

  return app.save(collection)
})
