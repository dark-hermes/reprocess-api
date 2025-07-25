/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3478179827")

  // remove field
  collection.fields.removeById("text3703245907")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1931227443",
    "max": null,
    "min": 0,
    "name": "price_per_kg",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3478179827")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3703245907",
    "max": 8,
    "min": 1,
    "name": "unit",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1931227443",
    "max": null,
    "min": 0,
    "name": "price_per_unit",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
