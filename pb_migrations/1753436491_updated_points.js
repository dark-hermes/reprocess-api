/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3483485606")

  // update collection data
  unmarshal({
    "viewQuery": "-- 1. Buat tabel virtual (CTE) untuk menghitung total poin per pengguna\nWITH user_points AS (\n  SELECT\n    p.user_id,\n    SUM(p.point) AS total_points\n  FROM\n    (\n      -- Ambil poin dari 'actions' HANYA JIKA finished = true\n      SELECT\n        w.user AS user_id,\n        a.point\n      FROM\n        actions AS a\n        LEFT JOIN wastes AS w ON a.waste = w.id\n      WHERE\n        w.user IS NOT NULL AND a.finished = true -- Ditambahkan kondisi\n      UNION ALL\n      -- Ambil poin dari 'sale' HANYA JIKA paid_at tidak null\n      SELECT\n        s.user AS user_id,\n        s.point\n      FROM\n        sale AS s\n      WHERE\n        s.user IS NOT NULL AND s.paid_at IS NOT NULL -- Ditambahkan kondisi\n    ) AS p\n  GROUP BY\n    p.user_id\n)\n-- 2. Mulai dari tabel 'users' dan gabungkan (LEFT JOIN) dengan data poin\nSELECT\n  u.id AS id,\n  u.id AS user_id,\n  -- 3. Jika pengguna tidak punya poin (NULL), tampilkan 0\n  COALESCE(up.total_points, 0) AS total_points\nFROM\n  users AS u\n  LEFT JOIN user_points AS up ON u.id = up.user_id;"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3483485606")

  // update collection data
  unmarshal({
    "viewQuery": "-- 1. Buat tabel virtual (CTE) untuk menghitung total poin per pengguna\nWITH user_points AS (\n    SELECT\n        p.user_id,\n        SUM(p.point) AS total_points\n    FROM (\n        -- Ambil poin dari 'actions'\n        SELECT\n            w.user AS user_id,\n            a.point\n        FROM actions AS a\n        LEFT JOIN wastes AS w ON a.waste = w.id\n        WHERE w.user IS NOT NULL\n\n        UNION ALL\n\n        -- Ambil poin dari 'sale'\n        SELECT\n            s.user AS user_id,\n            s.point\n        FROM sale AS s\n        WHERE s.user IS NOT NULL\n    ) AS p\n    GROUP BY\n        p.user_id\n)\n\n-- 2. Mulai dari tabel 'users' dan gabungkan (LEFT JOIN) dengan data poin\nSELECT\n    u.id AS id,\n    u.id AS user_id,\n    \n    -- 3. Jika pengguna tidak punya poin (NULL), tampilkan 0\n    COALESCE(up.total_points, 0) AS total_points\nFROM\n    users AS u\nLEFT JOIN\n    user_points AS up ON u.id = up.user_id;"
  }, collection)

  return app.save(collection)
})
