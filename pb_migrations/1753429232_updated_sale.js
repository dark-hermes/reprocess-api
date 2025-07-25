/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3259410357")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date457172035",
    "max": "",
    "min": "",
    "name": "approved_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file1402582597",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "receipt",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3259410357")

  // remove field
  collection.fields.removeById("date457172035")

  // remove field
  collection.fields.removeById("file1402582597")

  return app.save(collection)
})
