/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "_clone_xXeC",
        "name": "on_sale",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
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
      },
      {
        "hidden": false,
        "id": "json3493151348",
        "maxSize": 1,
        "name": "stock_quantity",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "_clone_gVtw",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "_clone_w0lX",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3203191690",
    "indexes": [],
    "listRule": "",
    "name": "stocks",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "WITH\n  sold_quantity AS (\n    -- 1. Hitung total kuantitas yang terjual untuk setiap item 'waste'\n    SELECT\n      s.waste,\n      SUM(s.quantity) AS total_sold\n    FROM\n      sale AS s\n    GROUP BY\n      s.waste\n  )\n-- 2. Gabungkan data master 'wastes' dengan data penjualan\nSELECT\n  w.id AS id,\n  w.name AS name,\n  w.description AS description,\n  w.images AS images,\n  w.price_per_kg AS price_per_kg,\n  w.category AS category,\n  w.on_sale AS on_sale,\n  w.user AS user,\n  \n  -- 3. Hitung sisa stok\n  (\n    w.quantity - COALESCE(sq.total_sold, 0)\n  ) AS stock_quantity,\n  \n  w.created AS created,\n  w.updated AS updated\nFROM\n  wastes AS w\n  LEFT JOIN sold_quantity AS sq ON w.id = sq.waste;",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3203191690");

  return app.delete(collection);
})
