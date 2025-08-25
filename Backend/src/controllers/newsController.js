// import newsDashboard from "../config/newsDashboard.js"
const newsDashboard=require("../config/newsDashboard")

const updateNewsStatus = async (req, res) => {
  const { news_id } = req.params;
  const { status } = req.body;

  if (!news_id || !status) {
    return res
      .status(400)
      .json({ success: false, message: "Missing news ID or status" });
  }

  try {
    // Step 1: Find the writer who has this news_id in their newsuploaded array
    const result = await newsDashboard.query(
     ` SELECT * FROM writersdashboard WHERE newsuploaded::jsonb @> $1;`,
      [JSON.stringify([{ news_id }])]
    );

    if (!result.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    const writer = result.rows[0];
    const newsArray = writer.newsuploaded || [];

    // Step 2: Find the news index
    const index = newsArray.findIndex(
      (news) => String(news.news_id) === String(news_id)
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "News not found in writer record" });
    }

    const newsItem = newsArray[index];
    const existingStatus = newsItem.status;

    // Step 3: Prevent double updates
    if (existingStatus === "approved" || existingStatus === "rejected") {
      return res.status(403).json({
        success: false,
        message: `News already ${existingStatus} and cannot be modified`,
      });
    }

    // Step 4: Update status
    newsItem.status = status;
    newsItem.updatedAt = new Date().toISOString();

    let points = 0;

    // Step 5: Assign points only if approved
    if (status === "approved") {
      const category = (newsItem.category || "").toLowerCase();
      const description = newsItem.description || "";
      const duration = newsItem.duration || 0;

      const wordCount = description.trim().split(/\s+/).length;

      if (
        ["article", "featurewritten", "Press Release"].includes(category) &&
        wordCount >= 750
      ) {
        points = 150;
      } else if (category === "video" && duration >= 2) {
        points = 250;
      }
    }

    newsItem.points = points;

    // Step 6: Recalculate total points from all approved news
    // const totalpoints = newsArray
    //   .filter((n) => n.status === "approved")
    //   .reduce((sum, n) => sum + (n.points || 0), 0);

    // // Step 7: Update writer record
    // await newsDashboard.query(
    //  ` UPDATE writersdashboard SET newsuploaded = $1, points = $2 WHERE id = $3;`,
    //   [JSON.stringify(newsArray), totalpoints, writer.id]
    // );

    
    let updatedWriterPoints = writer.points || 0;
    if (status === "approved") {
      updatedWriterPoints += points;
    }

    // Step 7: Update writer record
    await newsDashboard.query(
     ` UPDATE writersdashboard SET newsuploaded = $1, points = $2 WHERE id = $3`,
      [JSON.stringify(newsArray), updatedWriterPoints, writer.id]
    );
    await newsDashboard.query(
      `UPDATE newsTable
       SET status = $2,
           points = $3
       WHERE id = $1 AND status = 'pending'`,
      [news_id, status, points]
    );
    return res.json({
      success: true,
      message: "News status updated successfully",
      updatedNews: newsItem,
      totalpoints:updatedWriterPoints,
    });
  } catch (err) {
    console.error("updateNewsStatus error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllwritersNews = async (req, res) => {
  
  try {
   

    const result = await newsDashboard.query(
      `SELECT newsuploaded FROM writersDashboard `
    );

    // const allNews = result.rows[0]?.newsuploaded || [];
    const allNews = result.rows.flatMap(row => row.newsuploaded || []);

    return res.status(200).json({
      success: true,
      message: "News fetched successfully",
      news: allNews,
    });
  } catch (error) {
    console.error("This error from getAllNews:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      errorMessage: "This error from getAllNews",
    });
  }
};


// const getNewsByCategory = async (req, res) => {
//   const { category } = req.body;

//   try {
//     if (!category) {
//       return res.json({
//         success: false,
//         message: `No category provided`,
//       });
//     }

//     // Allowed categories
//     const validCategories = [
//       "article",
//       "pressRelease",
//       "featureWritten",
//       "technology",
//       "health",
//       "magazines",
//       "videos",
//       "awards",
//       "incubator",
//       "msme",
//       "education",
//       "travel"
//     ];

//     if (!validCategories.includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message:` Invalid category: ${category}`,
//       });
//     }

//     const queryText = `SELECT * FROM newsTable WHERE LOWER(category) = LOWER($1);`
//     const result = await newsDashboard.query(queryText, [category]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message:` No news found in category: ${category}`,
//       });
//     }

//     // Return all matching news
//     return res.json({
//       success: true,
//       data: result.rows,
//     });

//   } catch (error) {
//     console.error(error.message, "This error is from getNewsByCategory");
//     return res.json({
//       success: false,
//       message: error.message,
//       errorMessage:` This error is from getNewsByCategory`,
//     });
//   }
// };



const getNewsByCategory = async (req, res) => {
  const { category } = req.query; // <- read from query instead of body

  try {
    if (!category) {
      return res.status(400).json({
        success: false,
        message: `No category provided`,
      });
    }

    // Allowed categories
    const validCategories = [
      "article",
      "pressRelease",
      "featureWritten",
      "technology",
      "health",
      "magazines",
      "videos",
      "awards",
      "incubator",
      "msme",
      "education",
      "travel",
    ];

    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category: ${category}`,
      });
    }

    const queryText = `SELECT * FROM newsTable WHERE LOWER(category) = LOWER($1);`;
    const result = await newsDashboard.query(queryText, [category]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No news found in category: ${category}`,
      });
    }

    return res.json({
      success: true,
      news: result.rows, 
    });

  } catch (error) {
    console.error(error.message, "Error in getNewsByCategory");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllNews = async (req, res) => {
  try {
    // Fetch all rows where status is approved (case-insensitive)
    const result = await newsDashboard.query(
      `SELECT * FROM newsTable WHERE LOWER(status) = 'approved' ORDER BY createdAt DESC`
    );

    // All rows from the table
    const allNews = result.rows;

    return res.status(200).json({
      success: true,
      message: "News fetched successfully",
      news: allNews,
    });
  } catch (error) {
    console.error("This error from getAllNews:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      errorMessage: "This error from getAllNews",
    });
  }
};


// const getNewsOnCategory = async (req, res) => {
//   const { category } = req.params;

//   try {
//     // Query to fetch news by category and active status
//     const newsQuery = `
//       SELECT *
//       FROM newsTable
//       WHERE  TRIM(category) ILIKE $1 = LOWER($1)
//         AND LOWER(status) = 'approved'
//       ORDER BY "createdat" DESC
//     `;

//     const newsResult = await newsDashboard.query(newsQuery, [category]);

//     return res.status(200).json({
//       success: true,
//       news: newsResult.rows,
//       message: "News fetched successfully by category",
//     });

//   } catch (error) {
//     console.error("Error fetching news by category:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



// const getNewsBySlug = async (req, res) => {
//   const { slug } = req.body;
//   try {
//     if (!slug) {
//       return res.json({ success: false, message: `No slug found` });
//     }
//     const queryText = `SELECT * FROM newsTable WHERE slug = $1;`
//     const result = await newsDashboard.query(queryText, [slug]);

//     if (result.rows.length === 0) {
//       // Slug not found
//       return res.status(404).json({
//         success: false,
//         message: "No news found with this slug",
//       });
//     }

//     // Slug found, return data
//     return res.json({
//       success: true,
//       data: result.rows[0], // or result.rows if multiple
//     });

//   } catch (error) {
//     console.log(error, "This error from getNewsByslug");
//     return res.json({
//       success: false,
//       message: error.message,
//       errorMessage: "This error from getNewsByslug",
//     });
//   }
// };


// const getNewsBySlug = async (req, res) => {
//   const { slug } = req.body;
//   try {
//     if (!slug) {
//       return res.json({ success: false, message: "No slug found" });
//     }

    
//     const updateQuery = `
//       UPDATE newsTable
//       SET count = count + 1
//       WHERE slug = $1
//       RETURNING *;
//     `;
//     const result = await newsDashboard.query(updateQuery, [slug]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No news found with this slug",
//       });
//     }

//     const news = result.rows[0];

  
//     const relatedQuery = `
//       SELECT *
//       FROM newsTable
//       WHERE category = $1
//         AND slug != $2
//         AND status = 'approved'
//       ORDER BY createdAt DESC
//       LIMIT 4;
//     `;
//     const relatedResult = await newsDashboard.query(relatedQuery, [
//       news.category,
//       slug,
//     ]);

   
//     return res.json({
//       success: true,
//       message: "News and related news fetched successfully",
//       news,
//       relatedNews: relatedResult.rows,
//     });
//   } catch (error) {
//     console.error("This error from getNewsBySlug:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error at getNewsBySlug",
//     });
//   }
// };

const getNewsOnCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const newsQuery = `
      SELECT *
      FROM newsTable
      WHERE TRIM(LOWER(category)) = LOWER($1)
        AND LOWER(status) = 'approved'
      ORDER BY "createdat" DESC
    `;

    const newsResult = await newsDashboard.query(newsQuery, [category]);

    return res.status(200).json({
      success: true,
      news: newsResult.rows,
      message: "News fetched successfully by category",
    });
  } catch (error) {
    console.error("Error fetching news by category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getNewsBySlug = async (req, res) => {
  try {
    // Decode slug from query params
    const slug = decodeURIComponent(req.query.slug || "");

    if (!slug) {
      return res.status(400).json({ success: false, message: "No slug found" });
    }

    // Increment view count and fetch the news
    const updateQuery = `
      UPDATE newsTable
      SET count = count + 1
      WHERE slug = $1
      RETURNING *;
    `;
    const result = await newsDashboard.query(updateQuery, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No news found with this slug",
      });
    }

    const news = result.rows[0];

    // Fetch related news
    const relatedQuery = `
      SELECT *
      FROM newsTable
      WHERE category = $1
        AND slug != $2
        AND status = 'approved'
      ORDER BY createdAt DESC
      LIMIT 4;
    `;
    const relatedResult = await newsDashboard.query(relatedQuery, [
      news.category,
      slug,
    ]);

    return res.json({
      success: true,
      message: "News and related news fetched successfully",
      news,
      relatedNews: relatedResult.rows || [],
    });
  } catch (error) {
    console.error("This error from getNewsBySlug:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error at getNewsBySlug",
    });
  }
};


// const getNewsBySlug = async (req, res) => {
//   // Accept slug from query parameters or body
//   const { slug } = req.query;

//   try {
//     if (!slug) {
//       return res.status(400).json({ success: false, message: "No slug found" });
//     }

//     // Increment view count and fetch the news
//     const updateQuery = `
//       UPDATE newsTable
//       SET count = count + 1
//       WHERE slug = $1
//       RETURNING *;
//     `;
//     const result = await newsDashboard.query(updateQuery, [slug]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No news found with this slug",
//       });
//     }

//     const news = result.rows[0];

//     // Fetch related news
//     const relatedQuery = `
//       SELECT *
//       FROM newsTable
//       WHERE category = $1
//         AND slug != $2
//         AND status = 'approved'
//       ORDER BY createdAt DESC
//       LIMIT 4;
//     `;
//     const relatedResult = await newsDashboard.query(relatedQuery, [
//       news.category,
//       slug,
//     ]);

//     return res.json({
//       success: true,
//       message: "News and related news fetched successfully",
//       news,
//       relatedNews: relatedResult.rows || [],
//     });
//   } catch (error) {
//     console.error("This error from getNewsBySlug:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error at getNewsBySlug",
//     });
//   }
// };


const getCategoryNewsById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Missing news ID",
    });
  }

  try {
    const query = `
      SELECT *
      FROM newsTable
      WHERE id = $1
        AND LOWER(status) = 'approved'
      LIMIT 1
    `;

    const result = await newsDashboard.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found or not approved",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News retrieved successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error in getCategoryNewsById:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



const getLiveVideo = async (req, res) => {
  try {
    const liveVideo = await newsDashboard.query(`SELECT videolink 
FROM adminLiveVideo
ORDER BY created_at DESC;
`);
    return res.json({
      success: true,
      message: "LiveVideo fetched successfully",
      data: liveVideo.rows,
    });
  } catch (error) {
    console.log(error, "This error is from getLiveVideo");
    return res.json({
      success: false,
      message: error.message,
      errorMessage: "This error is from getLiveVideo",
    });
  }
};

const getMagazine = async (req, res) => {
  try {
    const magazine = await newsDashboard.query(
     `SELECT * from magazineTable ORDER BY created_at DESC;`
    );
    if (magazine.rowCount === 0) {
      return res.json({ success: false, message: "No magazines found" });
    }
    return res.json({
      success: true,
      message: "Magazines Fetched Successfully",
      magazines: magazine.rows,
    });
  } catch (error) {
    console.log(error, "This error is from getMagazine");
    return res.json({
      success: false,
      message: error.message,
      errorMessage: "This error is from getMagazine",
    });
  }
};

const getMagazineById = async (req, res) => {
  const { id } = req.params; 

  if (!id) {
    return res.status(400).json({ success: false, message: "Magazine ID is required" });
  }

  try {
    const result = await newsDashboard.query(
      "SELECT * FROM magazineTable WHERE id = $1",
      [id] 
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Magazine not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Magazine fetched successfully",
      magazine: result.rows[0], // return single row
    });
  } catch (error) {
    console.error(error, "Error fetching magazine by ID");
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorMessage: error.message,
    });
  }
};



const getDailyPulse = async (req, res) => {
  try {
    const dailyPulse = await newsDashboard.query(
      `SELECT * FROM dailyPulse ORDER BY created_at DESC LIMIT 1;`
    );
    if (dailyPulse.rowCount === 0) {
      return res.json({ success: false, message: "No updates are available" });
    }
    return res.json({
      success: true,
      message: "DailyPulse fetched successfully",
      res: dailyPulse.rows,
    });
  } catch (error) {
    console.log(error, "This error is from getDailyPulse");
    return res.json({
      success: false,
      message: error.message,
      errorMessage: "This error is from getDailyPulse",
    });
  }
};

const getSearchResults = async (req, res) => {
  const { search } = req.query;

  try {
    if (!search || search.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchQuery = `%${search}%`;

    // Search in news table
    const newsQuery = `
      SELECT 
    id,
    title,
    description,
    category,
    writername,
    createdat
FROM newsTable
WHERE 
    title ILIKE '%' || $1 || '%' 
    OR description ILIKE '%' || $1 || '%'
    OR category ILIKE '%' || $1 || '%'
    OR writername ILIKE '%' || $1 || '%'
ORDER BY createdat DESC;

    `;
    const news = await newsDashboard.query(newsQuery, [searchQuery]);


    return res.status(200).json({
      news: news.rows,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateNewsStatus, getAllwritersNews, getNewsByCategory,getNewsBySlug,getLiveVideo,getMagazine,getDailyPulse,getAllNews,getNewsOnCategory,getCategoryNewsById,getMagazineById,getSearchResults };