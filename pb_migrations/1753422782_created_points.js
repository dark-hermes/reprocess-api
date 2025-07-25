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
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2809058197",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json4021202239",
        "maxSize": 1,
        "name": "total_points",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_3483485606",
    "indexes": [],
    "listRule": null,
    "name": "points",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "WITH all_points AS (\n    -- Ambil poin dari 'actions', relasi user ada di dalam 'waste'\n    SELECT\n        w.user AS user_id,\n        a.point AS point\n    FROM actions AS a\n    LEFT JOIN wastes AS w ON a.waste = w.id\n\n    UNION ALL\n\n    -- Ambil poin dari 'sale' secara langsung\n    SELECT\n        s.user AS user_id,\n        s.point AS point\n    FROM sale AS s\n)\n\nSELECT\n    -- Gunakan user_id sebagai 'id' unik untuk view ini\n    p.user_id AS id,\n    \n    -- Ambil data username dari tabel 'users'\n    u.id AS user_id,\n    \n    -- Jumlahkan semua poin untuk setiap pengguna\n    SUM(p.point) AS total_points\nFROM \n    all_points AS p\nLEFT JOIN \n    users AS u ON p.user_id = u.id\nWHERE\n    p.user_id IS NOT NULL\nGROUP BY\n    p.user_id,\n    u.id",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3483485606");

  return app.delete(collection);
})
