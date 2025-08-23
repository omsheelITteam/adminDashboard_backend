const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const newsDashboard = require("../config/newsDashboard");
// const writersLogin = require("../../../../backend/src/config/writersLogin");
const streamifier = require("streamifier");
const transporter = require("../config/adminEmail");
const cloudinary = require("../config/cloudinary");
const { connectRedis, redisClient } = require("../config/redisClient");
const { v4: uuidv4 } = require("uuid");
// const newsDashboard = require('../../../../WriterDashboard/Backend/src/config/writersLogin')
const {
  EMAIL_VERIFICATION,
  REGISTRATION_SUCCESSFULL,
  ACCOUNT_APPROVED_SUCCESSFULLY,
  ACCOUNT_REJECTED,
} = require("../emailTemplates/emailTemplates");

const registerAdmin = async (req, res) => {
  try {
    const {
      adminName,
      adminEmail,
      adminMobile,
      adminPassword,
      adminBio,
      adminPublicProfile,
      adminImage,
      Role,
    } = req.body;
    if (
      !adminName ||
      !adminEmail ||
      !adminMobile ||
      !adminPassword ||
      !adminImage ||
      !adminBio ||
      !adminPublicProfile
    ) {
      return res.json({ success: false, message: "All Fields required" });
    }
    if (!validator.isEmail(adminEmail)) {
      return res.json({ success: false, message: "Invalid Email" });
    }
    if (adminPassword.length < 8) {
      return res.json({ success: false, message: "Choose a strong Password" });
    }
    const existingAdmin = await newsDashboard.query(
      ` select * from adminsDashboard where email=$1;`,
      [adminEmail]
    );
    if (existingAdmin.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Existing Admin" });
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const token = jwt.sign(
      { email: adminEmail },
      process.env.JWT_ADMIN_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "adminProfiles" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload();
    const imageUrl = result.secure_url;
    let otp = "";
    for (let i = 0; i < 6; i++) otp += Math.floor(Math.random() * 10);
    await connectRedis();

    // Save OTP
    await redisClient.set(`otp:${adminEmail}`, otp, { EX: 300 });
    const adminPayload = {
      id: uuidv4(),
      adminName,
      adminEmail,
      adminMobile,
      hashedPassword,
      imageUrl,
      Role,
    };
    await redisClient.set(
      `pending_admin:${adminEmail}`,
      JSON.stringify(adminPayload),
      {
        EX: 300,
      }
    );

    // Send OTP Email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: adminEmail,
      subject: "Your OTP Code",
      html: EMAIL_VERIFICATION.replace("{resetCode}", otp),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to email. Verify to complete registration.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyAdminEmail = async (req, res) => {
  const { code } = req.body;
  const token = req.cookies?.adminToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY);
    const email = decoded.email;

    const redisOtp = await redisClient.get(`otp:${email}`);
    if (!redisOtp || redisOtp !== code) {
      return res.json({ success: false, message: "Invalid or OTP expired" });
    }

    const adminData = await redisClient.get(`pending_admin:${email}`);
    if (!adminData) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Register again." });
    }

    const admin = JSON.parse(adminData);
    const insert = await newsDashboard.query(
      ` INSERT INTO ADMINSDASHBOARD (id, Name, email, mobile,password, adminImage, role) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *;`,
      [
        admin.id,
        admin.adminName,
        admin.adminEmail,
        admin.adminMobile,
        admin.hashedPassword,
        admin.imageUrl,
        admin.Role || "admin", // Default to 'admin' if Role is not provided
      ]
    );

    await redisClient.del(`otp:${email}`);
    await redisClient.del(`pending_admin:${email}`);
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: adminEmail,
      subject: "Welcome to MyStartupNEWS",
      html: REGISTRATION_SUCCESSFULL,
    });
    return res.status(200).json({
      success: true,
      message: "Email verified. Admin registered successfully",
      writer: insert.rows[0],
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Details are missing" });
    }

    const adminResult = await newsDashboard.query(
      `SELECT * FROM adminsDashboard WHERE Email=$1`,
      [email]
    );

    if (adminResult.rows.length === 0) {
      return res.json({
        success: false,
        message: "Admin doesn't exist with this email",
      });
    }
    const adminData = adminResult.rows[0];

    const isMatch = await bcrypt.compare(password, adminData.password); // ✅ Correct here

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: adminData.id },
      process.env.JWT_ADMIN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    // loginAdmin.js
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.json({ success: true, message: "Loggedout Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const addNewWriter = async (req, res) => {
  try {
    const result = await writersLogin.query(
      `SELECT * FROM writers WHERE status = 'pending';`
    );

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending writers found",
      });
    }

    return res.status(200).json({
      success: true,
      writers: result.rows,
    });
  } catch (error) {
    console.error("Error fetching pending writers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching writers",
      error: error.message,
    });
  }
};

const updateWriterStatus = async (req, res) => {
  const { writerId, status } = req.body;

  if (!writerId || !["approved", "rejected"].includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid Writer Id or status",
    });
  }

  try {
    // Update status in original writers table
    const result = await newsDashboard.query(
      `UPDATE writersregistertable SET status = $1 WHERE id = $2 RETURNING *;`,
      [status.toLowerCase(), writerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Writer not found",
      });
    }

    const updatedWriter = result.rows[0];
    console.log(updatedWriter.writerimage);

    if (status.toLowerCase() === "approved") {
      const {
        name,
        email,
        writerImage, // this is the writerImage
        writerid, // this is the UUID or custom ID you want as writerIdCard
      } = updatedWriter;
      // const writerImg=writerImage

      const exists = await newsDashboard.query(
        `SELECT 1 FROM writersDashboard WHERE email = $1;`,
        [email]
      );

      if (exists.rowCount === 0) {
        await newsDashboard.query(
          `INSERT INTO writersDashboard 
            (id, writerName, email, writerImage, points)
           VALUES ($1, $2, $3, $4, $5);`,
          [
            writerId,
            updatedWriter.name,
            updatedWriter.email,
            updatedWriter.writerimage,
            100,
          ]
        );
      }
    }
    if (status.toLowerCase() == "approved") {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: updatedWriter.email,
        subject: "Welcome to MystartupNEWS",
        html: ACCOUNT_APPROVED_SUCCESSFULLY,
      });
    } else {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: updatedWriter.email,
        subject: "Welcome to MystartupNEWS",
        html: ACCOUNT_REJECTED,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Writer ${status.toLowerCase()} successfully`,
      writer: updatedWriter,
    });
  } catch (error) {
    console.error("Error updating writer status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating writer status",
      error: error.message,
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    // console.log("Looking up writer with ID:", req.adminId);
    const result = await newsDashboard.query(
      "SELECT * FROM adminsDashboard WHERE id = $1",
      [req.adminId]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Writer not found" });
    }

    return res.json({ success: true, adminData: result.rows[0] });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const uploadLiveVideo = async (req, res) => {
  try {
    const { liveVideo } = req.body; // for YouTube links
    const liveVideoFile = req.file; // for local file uploads

    let finalVideoUrl;

    // CASE 1: YouTube Link (skip Cloudinary)
    if (liveVideo && liveVideo.startsWith("http")) {
      finalVideoUrl = liveVideo;
    }

    // CASE 2: Local File Upload to Cloudinary
    else if (liveVideoFile) {
      const MAX_SIZE = 20 * 1024 * 1024;
      if (liveVideoFile.size > MAX_SIZE) {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 20MB limit",
        });
      }
      const streamUpload = (file) => {
        return new Promise((resolve, reject) => {
          const isVideo = file.mimetype.startsWith("video/");

          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "adminLiveVideos",
              resource_type: isVideo ? "video" : "image",
            },
            (error, result) => (result ? resolve(result) : reject(error))
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(liveVideoFile);
      finalVideoUrl = result.secure_url;
    }

    // No file or URL provided
    else {
      return res.status(400).json({
        success: false,
        message: "Provide either a file or a video URL",
      });
    }

    // Save to PostgreSQL with UUID
    const newId = uuidv4();
    const query = ` INSERT INTO adminLiveVideo (id, videolink) VALUES ($1, $2) RETURNING *`;
    const dbResult = await newsDashboard.query(query, [newId, finalVideoUrl]);

    return res.json({
      success: true,
      message: "Live video saved successfully",
      data: dbResult.rows[0],
    });
  } catch (error) {
    console.error("Error in uploadLiveVideo:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadMagazine = async (req, res) => {
  try {
    const { title, description, magazine } = req.body; // magazine can be a URL
    const magazineFile = req.file; // uploaded PDF file

    if (!title || !description) {
      return res.json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!magazine && !magazineFile) {
      return res.json({
        success: false,
        message: "Upload a PDF file or provide a magazine URL",
      });
    }

    let finalMagazineUrl;
    let coverImageUrl;

    // Case 1: Magazine as URL
    if (magazine && magazine.startsWith("http")) {
      const result = await cloudinary.uploader.upload(magazine, {
        folder: "adminMagazineFiles",
        resource_type: "raw", // PDFs are uploaded as raw
      });

      finalMagazineUrl = result.secure_url;
      coverImageUrl = cloudinary.url(result.public_id + ".jpg", {
        page: 1,
        width: 400,
        crop: "fill",
      });
    }

    // Case 2: PDF File Upload
    else if (magazineFile) {
      const MAX_SIZE = 10 * 1024 * 1024;
      if (magazineFile.size > MAX_SIZE) {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 10MB limit",
        });
      }
      if (magazineFile.mimetype !== "application/pdf") {
        return res.json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }

      const streamUpload = (file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "adminMagazineFiles",
              resource_type: "image", // PDFs are uploaded as raw
              format: "pdf",
            },
            (error, result) => (result ? resolve(result) : reject(error))
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(magazineFile);
      finalMagazineUrl = result.secure_url;
      coverImageUrl = cloudinary.url(result.public_id + ".jpg", {
        page: 1,
        width: 400,
        crop: "fill",
      });
    }

    // TODO: Save to PostgreSQL
    await newsDashboard.query(
      `INSERT INTO magazineTable (title, description, magazine, magazinecoverpic) VALUES ($1, $2, $3, $4)`,
      [title, description, finalMagazineUrl, coverImageUrl]
    );

    return res.json({
      success: true,
      message: "Magazine uploaded successfully",
      title,
      description,
      magazineUrl: finalMagazineUrl,
      coverImageUrl,
    });
  } catch (error) {
    console.error("Error in uploadMagazine:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing magazine",
      error: error.message,
    });
  }
};

const uploadDailyPulse = async (req, res) => {
  try {
    const { Title, description } = req.body;
    const dailyPulseImages = req.files; // multiple files from multer

    if (!Title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!dailyPulseImages || dailyPulseImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    let uploadedImageUrls = [];

    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "dailyPulseImages",
            resource_type: "image",
          },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    // Upload all images sequentially (to avoid Cloudinary rate limit issues)
    for (const file of dailyPulseImages) {
      const result = await streamUpload(file);
      uploadedImageUrls.push(result.secure_url);
    }

    // Save Title, description, and images to DB
    const newId = uuidv4();
    const query = `
      INSERT INTO dailyPulse (id, title, description, images)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const dbResult = await newsDashboard.query(query, [
      newId,
      Title,
      description,
      JSON.stringify(uploadedImageUrls),
    ]);

    return res.json({
      success: true,
      message: "Daily Pulse uploaded successfully",
      data: dbResult.rows[0],
    });
  } catch (error) {
    console.error("Error uploading Daily Pulse images:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New passwords do not match" });
    }

    // Get user from DB
    const result = await newsDashboard.query(
      "SELECT * FROM adminsDashboard WHERE id = $1",
      [req.adminId]
    );
    const admin = result.rows[0];

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await newsDashboard.query(
      "UPDATE adminsDashboard SET password = $1 WHERE id = $2",
      [hashedPassword, req.adminId]
    );

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllWriters = async (req, res) => {
  try {
    const result = await newsDashboard.query(`SELECT * FROM writersDashboard`);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No writers found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Writers fetched successfully",
      writers: result.rows,
    });
  } catch (error) {
    console.error("Error fetching all writers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all writers",
      error: error.message,
    });
  }
};

// const getWriterById = async (req, res) => {
//   const { writerId } = req.params;

//   if (!writerId) {
//     return res.status(400).json({ success: false, message: "Writer ID is required" });
//   }

//   try {
//     const result = await newsDashboard.query(
//       `SELECT * FROM writersDashboard WHERE id = $1`,
//       [writerId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Writer not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       writer: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Error fetching writer by ID:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
const getWriterById = async (req, res) => {
  const { id } = req.params; // not writerId

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Writer ID is required" });
  }

  try {
    const result = await newsDashboard.query(
      `SELECT * FROM writersDashboard WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Writer not found" });
    }

    return res.status(200).json({
      success: true,
      writer: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching writer by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// const getNewsbyIdAdmin = async (req, res) => {
//   const { news_id } = req.params;
//   const adminId = req.adminId; // assuming adminAuth middleware sets this

//   if (!news_id || !adminId) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing admin ID or news ID",
//     });
//   }

//   try {
//     // Fetch news uploaded by this admin
//     const result = await writersLogin.query(
//       `SELECT newsuploaded FROM writersdashboard WHERE admin_id = $1`,
//       [adminId]
//     );

//     if (!result.rows.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No news found for this admin",
//       });
//     }

//     const newsArray = result.rows[0]?.newsuploaded || [];
//     const news = newsArray.find(
//       (item) => String(item.id || item.news_id) === String(news_id)
//     );

//     if (!news) {
//       return res.status(404).json({
//         success: false,
//         message: "News not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "News retrieved successfully",
//       news,
//     });
//   } catch (error) {
//     console.error("Error in getNewsbyIdAdmin:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// const getNewsbyId = async (req, res) => {
//   const { news_id } = req.params;
//   // const writerId = req.writerId;

//   if (!news_id ) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing writer ID or news ID",
//     });
//   }

//   try {
//     // const result = await writersLogin.query(
//     //   `SELECT newsuploaded FROM writersdashboard WHERE id = $1`,
//     //   [writerId]
//     // );

//     const newsArray = result.rows[0]?.newsuploaded || [];

//     const news = newsArray.find(
//       (item) => String(item.id || item.news_id) === String(news_id)
//     );

//     if (!news) {
//       return res.status(404).json({
//         success: false,
//         message: "News not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "News retrieved successfully",
//       news,
//     });
//   } catch (error) {
//     console.error("Error in getNewsbyId:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
const getNewsbyId = async (req, res) => {
  const { news_id } = req.params;

  if (!news_id) {
    return res.status(400).json({
      success: false,
      message: "Missing news ID",
    });
  }

  try {
    // Directly search inside jsonb array for given news_id
    const result = await newsDashboard.query(
      `SELECT news
       FROM writersdashboard, jsonb_array_elements(newsuploaded) AS news
       WHERE (news->>'news_id')::text = $1`,
      [news_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.json({
      success: true,
      message: "News retrieved successfully",
      news: result.rows[0].news, // this is a JSON object
    });
  } catch (error) {
    console.error("Error in getNewsbyId:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.adminId;

    if (!adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: writerId missing" });
    }
    const { adminBio, publicProfile } = req.body;
    // console.log(writerMobile, writerBio, publicProfile);

    // Update text fields
    await newsDashboard.query(
      `UPDATE adminsDashboard SET  bio = $1, adminpublicprofile = $2 WHERE id = $3`,
      [adminBio, publicProfile, adminId]
    );

    // Upload and update image if provided
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "adminProfiles",
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
              ],
            },
            (error, result) => (result ? resolve(result) : reject(error))
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      const imageURL = result.secure_url;

      await newsDashboard.query(
        `UPDATE adminsDashboard SET adminimage = $1 WHERE id = $2`,
        [imageURL, adminId]
      );
    }

    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// const getLatestNews = async (req, res) => {
//   try {
//     const newsQuery = await newsDashboard.query(
//       `SELECT *
//        FROM writersdashboard
//        WHERE status = 'approved'
//        ORDER BY createdAt DESC
//        LIMIT 8`
//     );

//     return res.json({
//       success: true,
//       message: "Latest approved news fetched successfully",
//       news: newsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching latest news:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const getLatestNews = async (req, res) => {
//   try {
//     const newsQuery = await newsDashboard.query(
//       `
//       SELECT n.*
//       FROM writersdashboard w,
//            LATERAL jsonb_array_elements(w.newsuploaded) AS n
//       WHERE n->>'status' = 'approved'
//       ORDER BY (n->>'createdAt')::timestamp DESC
//       LIMIT 8;
//       `
//     );

//     return res.json({
//       success: true,
//       message: "Latest approved news fetched successfully",
//       news: newsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching latest news:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

const getLatestNews = async (req, res) => {
  try {
    const newsQuery = await newsDashboard.query(`
      SELECT *
      FROM newsTable
      WHERE LOWER(status) ='approved'
      ORDER BY "createdat" DESC
      LIMIT 8;
    `);

    return res.json({
      success: true,
      message: "Latest approved news fetched successfully",
      news: newsQuery.rows,
    });
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// const getLatestNews = async (req, res) => {
//   try {
//     const newsQuery = await newsDashboard.query(`
//       SELECT n.*
//       FROM writersdashboard w,
//            LATERAL jsonb_array_elements(w.newsuploaded) AS n
//       WHERE n->>'status' = 'approved'
//       ORDER BY (n->>'createdAt')::timestamptz DESC
//       LIMIT 8;
//     `);

//     return res.json({
//       success: true,
//       message: "Latest approved news fetched successfully",
//       news: newsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching latest news:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const getPopularNews = async (req, res) => {
//   try {
//     const popularNewsQuery = await newsDashboard.query(
//       `SELECT *
//        FROM writersdashboard
//        WHERE status = 'approved'
//        ORDER BY count DESC
//        LIMIT 4`
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Popular news fetched successfully",
//       data: popularNewsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching popular news:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error at getPopularNews",
//     });
//   }
// };

// const getPopularNews = async (req, res) => {
//   try {
//     const popularNewsQuery = await newsDashboard.query(
//       `
//       SELECT n.*
//       FROM writersdashboard w,
//            LATERAL jsonb_array_elements(w.newsuploaded) AS n
//       WHERE n->>'status' = 'approved'
//       ORDER BY (n->>'count')::int DESC
//       LIMIT 4;
//       `
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Popular news fetched successfully",
//       news: popularNewsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching popular news:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error at getPopularNews",
//     });
//   }
// };

const getPopularNews = async (req, res) => {
  try {
    const popularNewsQuery = await newsDashboard.query(`
      SELECT *
      FROM newsTable
      WHERE LOWER(status)='approved'
      ORDER BY "count"::int DESC
      LIMIT 4;
    `);

    return res.status(200).json({
      success: true,
      message: "Popular news fetched successfully",
      news: popularNewsQuery.rows,
    });
  } catch (error) {
    console.error("Error fetching popular news:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error at getPopularNews",
    });
  }
};

// const getRecentNews = async (req, res) => {
//   try {
//     const newsQuery = await newsDashboard.query(
//       `SELECT *
//        FROM writersdashboard
//        WHERE status = 'approved'
//        ORDER BY createdAt DESC
//        LIMIT 8 OFFSET 8`
//     );

//     return res.json({
//       success: true,
//       message: "Recent approved news fetched successfully",
//       data: newsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching recent news:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

const getRecentNews = async (req, res) => {
  try {
    const newsQuery = await newsDashboard.query(`
      SELECT *
      FROM newsTable
      WHERE LOWER(status)='approved'
      ORDER BY "createdat" DESC
      LIMIT 8 OFFSET 8;
    `);

    return res.status(200).json({
      success: true,
      message: "Recent approved news fetched successfully",
      data: newsQuery.rows,
    });
  } catch (error) {
    console.error("Error fetching recent news:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error at getRecentNews",
    });
  }
};

// const getRecentNews = async (req, res) => {
//   try {
//     const newsQuery = await newsDashboard.query(
//       `
//       SELECT n.*
//       FROM writersdashboard w,
//            LATERAL jsonb_array_elements(w.newsuploaded) AS n
//       WHERE n->>'status' = 'approved'
//       ORDER BY (n->>'createdAt')::timestamp DESC
//       LIMIT 8 OFFSET 8;
//       `
//     );

//     return res.json({
//       success: true,
//       message: "Recent approved news fetched successfully",
//       data: newsQuery.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching recent news:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

module.exports = {
  registerAdmin,
  verifyAdminEmail,
  loginAdmin,
  logoutAdmin,
  addNewWriter,
  updateWriterStatus,
  getAdminProfile,
  uploadLiveVideo,
  uploadMagazine,
  uploadDailyPulse,
  changePassword,
  getAllWriters,
  getWriterById,
  getNewsbyId,
  updateAdminProfile,
  getLatestNews,
  getPopularNews,
  getRecentNews,
};
