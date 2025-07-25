/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3483485606")

  // update collection data
  unmarshal({
    "viewQuery": "-- 1. Buat tabel virtual (CTE) untuk menghitung total poin per pengguna\nWITH user_points AS (\n    SELECT\n        p.user_id,\n        SUM(p.point) AS total_points\n    FROM (\n        -- Ambil poin dari 'actions'\n        SELECT\n            w.user AS user_id,\n            a.point\n        FROM actions AS a\n        LEFT JOIN wastes AS w ON a.waste = w.id\n        WHERE w.user IS NOT NULL\n\n        UNION ALL\n\n        -- Ambil poin dari 'sale'\n        SELECT\n            s.user AS user_id,\n            s.point\n        FROM sale AS s\n        WHERE s.user IS NOT NULL\n    ) AS p\n    GROUP BY\n        p.user_id\n)\n\n-- 2. Mulai dari tabel 'users' dan gabungkan (LEFT JOIN) dengan data poin\nSELECT\n    u.id AS id,\n    u.id AS user_id,\n    \n    -- 3. Jika pengguna tidak punya poin (NULL), tampilkan 0\n    COALESCE(up.total_points, 0) AS total_points\nFROM\n    users AS u\nLEFT JOIN\n    user_points AS up ON u.id = up.user_id;"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3483485606")

  // update collection data
  unmarshal({
    "viewQuery": "WITH all_points AS (\n    -- Ambil poin dari 'actions', relasi user ada di dalam 'waste'\n    SELECT\n        w.user AS user_id,\n        a.point AS point\n    FROM actions AS a\n    LEFT JOIN wastes AS w ON a.waste = w.id\n\n    UNION ALL\n\n    -- Ambil poin dari 'sale' secara langsung\n    SELECT\n        s.user AS user_id,\n        s.point AS point\n    FROM sale AS s\n)\n\nSELECT\n    -- Gunakan user_id sebagai 'id' unik untuk view ini\n    p.user_id AS id,\n    \n    -- Ambil data username dari tabel 'users'\n    u.id AS user_id,\n    \n    -- Jumlahkan semua poin untuk setiap pengguna\n    SUM(p.point) AS total_points\nFROM \n    all_points AS p\nLEFT JOIN \n    users AS u ON p.user_id = u.id\nWHERE\n    p.user_id IS NOT NULL\nGROUP BY\n    p.user_id,\n    u.id"
  }, collection)

  return app.save(collection)
})
