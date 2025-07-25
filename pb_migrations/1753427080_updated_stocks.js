/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3203191690")

  // update collection data
  unmarshal({
    "viewQuery": "WITH\n  sold_quantity AS (\n    -- 1. Hitung total kuantitas yang terjual untuk setiap item 'waste'\n    SELECT\n      s.waste,\n      SUM(s.quantity) AS total_sold\n    FROM\n      sale AS s\n    GROUP BY\n      s.waste\n  )\n-- 2. Gabungkan data master 'wastes' dengan data penjualan\nSELECT\n  w.id AS id,\n  w.name AS name,\n  w.description AS description,\n  w.images AS images,\n  w.price_per_kg AS price_per_kg,\n  w.category AS category,\n  w.on_sale AS on_sale,\n  w.user AS user,\n  w.id AS waste_id,\n  \n  -- 3. Hitung sisa stok\n  (\n    w.quantity - COALESCE(sq.total_sold, 0)\n  ) AS stock_quantity,\n  \n  w.created AS created,\n  w.updated AS updated\nFROM\n  wastes AS w\n  LEFT JOIN sold_quantity AS sq ON w.id = sq.waste;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_1jpx")

  // remove field
  collection.fields.removeById("_clone_3sNJ")

  // remove field
  collection.fields.removeById("_clone_ze2G")

  // remove field
  collection.fields.removeById("_clone_ZXQ0")

  // remove field
  collection.fields.removeById("_clone_eULu")

  // remove field
  collection.fields.removeById("_clone_xXeC")

  // remove field
  collection.fields.removeById("_clone_uF1w")

  // remove field
  collection.fields.removeById("_clone_gVtw")

  // remove field
  collection.fields.removeById("_clone_w0lX")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_BlkP",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_d8Ff",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_IK3e",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "images",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_BGBr",
    "max": null,
    "min": 0,
    "name": "price_per_kg",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_pcZn",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "organic",
      "anorganic"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_KbSY",
    "name": "on_sale",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_6I5j",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3478179827",
    "hidden": false,
    "id": "relation4201259714",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "waste_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_5QEj",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_d7CO",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3203191690")

  // update collection data
  unmarshal({
    "viewQuery": "WITH\n  sold_quantity AS (\n    -- 1. Hitung total kuantitas yang terjual untuk setiap item 'waste'\n    SELECT\n      s.waste,\n      SUM(s.quantity) AS total_sold\n    FROM\n      sale AS s\n    GROUP BY\n      s.waste\n  )\n-- 2. Gabungkan data master 'wastes' dengan data penjualan\nSELECT\n  w.id AS id,\n  w.name AS name,\n  w.description AS description,\n  w.images AS images,\n  w.price_per_kg AS price_per_kg,\n  w.category AS category,\n  w.on_sale AS on_sale,\n  w.user AS user,\n  \n  -- 3. Hitung sisa stok\n  (\n    w.quantity - COALESCE(sq.total_sold, 0)\n  ) AS stock_quantity,\n  \n  w.created AS created,\n  w.updated AS updated\nFROM\n  wastes AS w\n  LEFT JOIN sold_quantity AS sq ON w.id = sq.waste;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_1jpx",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_3sNJ",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_ze2G",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "images",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_ZXQ0",
    "max": null,
    "min": 0,
    "name": "price_per_kg",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_eULu",
    "maxSelect": 1,
    "name": "category",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "organic",
      "anorganic"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_xXeC",
    "name": "on_sale",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_uF1w",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_gVtw",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_w0lX",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_BlkP")

  // remove field
  collection.fields.removeById("_clone_d8Ff")

  // remove field
  collection.fields.removeById("_clone_IK3e")

  // remove field
  collection.fields.removeById("_clone_BGBr")

  // remove field
  collection.fields.removeById("_clone_pcZn")

  // remove field
  collection.fields.removeById("_clone_KbSY")

  // remove field
  collection.fields.removeById("_clone_6I5j")

  // remove field
  collection.fields.removeById("relation4201259714")

  // remove field
  collection.fields.removeById("_clone_5QEj")

  // remove field
  collection.fields.removeById("_clone_d7CO")

  return app.save(collection)
})
