routerAdd(
  'GET',
  '/api/generate-recommendations/{wasteId}',
  (e) => {
    const wasteId = e.request.pathValue('wasteId');
    const GEMINI_API_KEY = "AIzaSyDeTvMtw3bQuDaKNzkkdgCMceTkG8JBDDU";

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    let wasteRecord;
    try {
      wasteRecord = e.app.findRecordById('wastes', wasteId);
    } catch (err) {
      return e.json(404, { error: 'Waste record not found.' });
    }

    const prompt = `
      You are a circular economy expert. Based on the following waste data:
      - Name: ${wasteRecord.getString('name')}
      - Quantity: 1 - ${wasteRecord.getFloat('quantity')} kg (You can decide the quantity for the best recommendations)
      - Reference Price per kg: IDR  ${wasteRecord.getFloat('price_per_kg')}

      Provide 3 waste processing recommendations (reuse, reduce, recycle).
      For each recommendation, include 'category', 'description', 'benefit', quantity_kg, 'point' (10-100), and insight.
      The calculation of points is based on 0,01 of price per kg, with multiplier by difficulty level:
      - Easy: 1x
      - Medium: 1.5x
      - Hard: 2x
      The insight should be a short explanation of the recommendation. For example:
      "You just saved 1 kg of waste from going to landfill, which is equivalent to reducing CO2 emissions by 1.5 kg."
      Provide the answer ONLY in a valid JSON array format like this:

      [
        {
          "category": "reuse",
          "description": "...",
          "benefit": "...",
          "point": ...,
          "quantity_kg": ...,
          "insight": "..."
        },
        {
          "category": "reduce",
          "description": "...",
          "benefit": "...",
          "point": ...,
          "quantity_kg": ...,
          "insight": "..."
        },
        {
          "category": "recycle",
          "description": "...",
          "benefit": "...",
          "point": ...,
          "quantity_kg": ...,
          "insight": "..."
        }
      ]
    `;

    const geminiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
      GEMINI_API_KEY;

    const response = $http.send({
      url: geminiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      }),
      timeout: 20,
    });

    return e.json(response.statusCode, response.json);
  },
);

routerAdd(
  'GET',
  '/api/waste-insight/{wasteId}',
  (e) => {
    const wasteId = e.request.pathValue('wasteId');
    const GEMINI_API_KEY = "AIzaSyDeTvMtw3bQuDaKNzkkdgCMceTkG8JBDDU";

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    let wasteRecord;
    try {
      wasteRecord = e.app.findRecordById('wastes', wasteId);
    } catch (err) {
      return e.json(404, { error: 'Waste record not found.' });
    }

    const prompt = `
      You are an expert in industrial waste valorization and the circular economy. Your role is to identify business opportunities for a company looking to purchase and process waste.

      Based on the following waste data:

      Name: ${wasteRecord.getString('name')}

      Quantity: ${wasteRecord.getFloat('quantity')} kg

      Reference Purchase Price per kg: IDR ${wasteRecord.getFloat('price_per_kg')}

      Provide the 3 most profitable waste utilization recommendations from a business perspective. Focus on Reuse, Recycle, and Upcycle.

      For each recommendation, include:

      category: "reuse", "recycle", or "upcycle".

      opportunity_description: A brief explanation of the business process and its output.

      potential_end_product: The specific product that can be sold to the market.

      business_benefit: The primary benefit for the company (e.g., creating a new product, saving on raw material costs, entering a new market).

      estimated_value_add: A score between 10-100 representing the profit potential. This score is based on the estimated selling price of the final product minus the purchase and processing costs. You can logically assume the costs and selling price.

      strategic_insight: A brief, business-relevant insight. Example: "This product targets the growing market of environmentally conscious consumers."

      Provide the answer ONLY in a valid JSON array format like this:


      [
        {
          "category": "reuse",
          "opportunity_description": "...",
          "potential_end_product": "...",
          "business_benefit": "...",
          "estimated_value_add": 75,
          "strategic_insight": "..."
        },
        {
          "category": "recycle",
          "opportunity_description": "...",
          "potential_end_product": "...",
          "business_benefit": "...",
          "estimated_value_add": 60,
          "strategic_insight": "..."
        },
        {
          "category": "upcycle",
          "opportunity_description": "...",
          "potential_end_product": "...",
          "business_benefit": "...",
          "estimated_value_add": 90,
          "strategic_insight": "..."
        }
      ]
    `;

    const geminiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
      GEMINI_API_KEY;

    const response = $http.send({
      url: geminiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
        },
      }),
      timeout: 20,
    });

    return e.json(response.statusCode, response.json);
  },
);

routerAdd(
  'GET',
  '/api/tracks',
  (e) => {
    const currentUser = e.auth;

    if (!currentUser) {

      return e.json(401, { "message": "Access denied. You must be logged in." });
    }

    const actionsFilter = `waste.user = "${currentUser.id}"`;
    const actions = e.app.findRecordsByFilter('actions', actionsFilter);

    const salesFilter = `user = "${currentUser.id}"`;
    const sales = e.app.findRecordsByFilter('sale', salesFilter);

    $apis.enrichRecords(e, actions, "waste.user");
    $apis.enrichRecords(e, sales, "waste", "user");

    const formattedActions = actions.map((record) => {
      const waste = record.expandedOne("waste");
      const user = waste ? waste.expandedOne("user") : null;
      return {
        id: record.get("id"),
        user: user ? user.get("username") : null,
        waste: waste ? waste.get("name") : null,
        quantity: record.getFloat("quantity"),
        point: record.getFloat("point"),
        category: 'action',
        created: record.get("created"),
      };
    });

    const formattedSales = sales.map((record) => {
      const waste = record.expandedOne("waste");
      const user = record.expandedOne("user");
      return {
        id: record.get("id"),
        user: user ? user.get("username") : null,
        waste: waste ? waste.get("name") : null,
        quantity: record.getFloat("quantity"),
        point: record.getFloat("point"),
        category: 'sale',
        created: record.get("created"),
      };
    });

    const allTransactions = [...formattedActions, ...formattedSales];
    allTransactions.sort((a, b) => new Date(b.created) - new Date(a.created));

    return e.json(200, allTransactions);
  },
  $apis.requireAuth()
);


routerAdd(
  'GET',
  '/api/tracks/monthly',
  (e) => {
    const currentUser = e.auth;

    if (!currentUser) {
      return e.json(401, { "message": "Access denied. You must be logged in." });
    }

    const currentYear = new Date().getFullYear();

    const actionsFilter = `waste.user = "${currentUser.id}" && created >= "${currentYear}-01-01 00:00:00"`;
    const actions = e.app.findRecordsByFilter('actions', actionsFilter);

    const salesFilter = `user = "${currentUser.id}" && created >= "${currentYear}-01-01 00:00:00"`;
    const sales = e.app.findRecordsByFilter('sale', salesFilter);

    const allTransactions = [...actions, ...sales];

    const monthlyPoints = new Map();

    allTransactions.forEach(record => {
      const createdDate = new Date(record.get("created"));
      const month = createdDate.getMonth();
      const key = `${currentYear}-${month}`;
      const points = record.getFloat("point");

      monthlyPoints.set(key, (monthlyPoints.get(key) || 0) + points);
    });


    const result = [];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const key = `${currentYear}-${monthIndex}`;
      
      result.push({
        label: `${monthNames[monthIndex]} ${currentYear}`,
        year: currentYear,
        month: monthIndex + 1, 
        points: monthlyPoints.get(key) || 0 
      });
    }

    return e.json(200, result);
  },
  $apis.requireAuth()
);


routerAdd(
  'POST',
  '/api/actions/validate',
  (e) => {
    // 1. Ambil data dari body request
    const data = new DynamicModel({
      actionId: "",
      userDescription: "",
    });
    e.bindBody(data);

    // Validasi input dasar
    if (!data.actionId || !data.userDescription) {
      return e.json(400, { "error": "actionId and userDescription are required." });
    }
    if (data.userDescription.trim().split(/\s+/).length < 20) {
      return e.json(400, { "error": "Description must be at least 20 words." });
    }

    let actionRecord;
    try {
      actionRecord = e.app.findRecordById('actions', data.actionId);
    } catch (err) {
      return e.json(404, { "error": "Actions record not found." });
    }

    const originalTask = actionRecord.get('description');

    const GEMINI_API_KEY = "AIzaSyDeTvMtw3bQuDaKNzkkdgCMceTkG8JBDDU";
    if (!GEMINI_API_KEY) {
      throw new InternalServerError('API key for Gemini is not set.');
    }

    const prompt = `
      You are a validation AI.
      A user was given this task: "${originalTask}"
      The user submitted this report of what they did: "${data.userDescription}"

      Is the user's report a logical and relevant description for completing the task?
      Your answer must be ONLY the word "true" or "false".
    `;

    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY;
    const response = $http.send({
      url: geminiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      timeout: 20,
    });

    let isValid = false;
    try {
      const resultText = response.json.candidates[0].content.parts[0].text.trim().toLowerCase();
      if (resultText === 'true') {
        isValid = true;
      }
    } catch (err) {
      return e.json(500, { "error": "There was an error processing the AI response." });
    }

    return e.json(200, { "isValid": isValid });
  },
  $apis.requireAuth()
);

/**
 * Fungsi ini akan dipanggil setiap kali ada record 'actions'
 * yang dibuat atau diperbarui.
 */
async function checkAndAwardBadges(dao, e) {
  const actionRecord = e.record;

  // 1. Hanya proses jika aksi baru saja ditandai selesai (finished: true)
  const isNewlyFinished = actionRecord.get("finished") && !e.originalRecord?.get("finished");
  if (!isNewlyFinished) {
    return; // Keluar jika tidak ada perubahan status ke "finished"
  }

  // 2. Dapatkan data user dan kategori waste dari relasi
  let wasteRecord;
  try {
    // Ambil data 'waste' yang berelasi dengan 'action' ini
    wasteRecord = await dao.findRecordById("wastes", actionRecord.get("waste"));
  } catch (err) {
    console.error("Error finding waste record:", err);
    return; // Keluar jika waste tidak ditemukan
  }
  
  const userId = wasteRecord.get("user");
  const wasteCategory = wasteRecord.get("category"); // "organic" atau "inorganic"
  
  if (!userId) return; // Keluar jika tidak ada user yang terkait

  // 3. Hitung total aksi yang sudah selesai untuk kategori ini oleh user tersebut
  const filter = `waste.user.id = "${userId}" && waste.category = "${wasteCategory}" && finished = true`;
  const finishedActions = await dao.findRecordsByFilter("actions", filter);
  const count = finishedActions.length;

  // 4. Tentukan nama badge berdasarkan jumlah dan kategori
  let badgeNameToAward = null;
  if (wasteCategory === "organic") {
    if (count >= 50) badgeNameToAward = "Earth Steward Master";
    else if (count >= 10) badgeNameToAward = "Earth Steward Adept";
    else if (count >= 1) badgeNameToAward = "Earth Steward Novice";
  } else if (wasteCategory === "inorganic") {
    if (count >= 50) badgeNameToAward = "Future Forger Master";
    else if (count >= 10) badgeNameToAward = "Future Forger Adept";
    else if (count >= 1) badgeNameToAward = "Future Forger Novice";
  }

  if (!badgeNameToAward) return; // Tidak ada badge baru untuk diberikan

  // 5. Berikan badge jika user belum memilikinya
  try {
    const badgeRecord = await dao.findFirstRecordByData("badges", "name", badgeNameToAward);
    const badgeId = badgeRecord.id;

    // Cek apakah user sudah punya badge ini
    const existingUserBadge = await dao.findFirstRecordByFilter(
      "user_badges",
      `user.id = "${userId}" && badge.id = "${badgeId}"`
    );

    if (existingUserBadge) {
      console.log(`User ${userId} already has badge ${badgeNameToAward}.`);
      return; // User sudah punya, tidak perlu diberi lagi
    }

    // Jika belum punya, buat record baru di 'user_badges'
    const userBadgesCollection = await dao.findCollectionByNameOrId("user_badges");
    const newBadgeRecord = new Record(userBadgesCollection, {
      user: userId,
      badge: badgeId,
    });
    
    await dao.saveRecord(newBadgeRecord);
    console.log(`Awarded badge "${badgeNameToAward}" to user ${userId}.`);

  } catch (err) {
    console.error("Error awarding badge:", err);
  }
}

// Jalankan fungsi di atas setelah record 'actions' DIBUAT
onRecordAfterCreate("actions", (e) => {
  checkAndAwardBadges($app.Dao(), e);
});

// Jalankan fungsi di atas setelah record 'actions' DIPERBARUI
onRecordAfterUpdate("actions", (e) => {
  checkAndAwardBadges($app.Dao(), e);
});