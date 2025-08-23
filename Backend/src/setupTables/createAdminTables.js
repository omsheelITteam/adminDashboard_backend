const newsDashboard = require("../config/newsDashboard");
// const newsDashboard = require("../../../../WriterDashboard/Backend/src/config/writersLogin");
// const writersLogin = require("../../../../backend/src/config/writersLogin");

async function adminsBlogTable() {
  await newsDashboard.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE TABLE IF NOT EXISTS adminsDashboard  
            ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  Name VARCHAR(100) NOT NULL,
        Email VARCHAR(100) UNIQUE NOT NULL,
      Mobile BIGINT UNIQUE NOT NULL,
      Password TEXT NOT NULL,
         adminImage TEXT NOT NULL,
         Role TEXT NOT NULL DEFAULT 'admin',
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )

`);

  console.log(`adminDashBoard Table created Successfully`);
}

async function writersDashboardTable() {
  await newsDashboard.query(`
    -- Create a sequence for writerIdCard
    CREATE SEQUENCE IF NOT EXISTS writer_id_seq START 1;

    -- Create the table
    CREATE TABLE IF NOT EXISTS writersDashboard (
      id SERIAL PRIMARY KEY,
      writerIdCard VARCHAR(10) UNIQUE NOT NULL DEFAULT LPAD(NEXTVAL('writer_id_seq')::text, 3, '0'),
      writerName VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      writerImage TEXT NOT NULL,
      newsUploaded JSONB DEFAULT '[]',
      points INT DEFAULT 0
    );
  `);

  console.log(`writersDashboard Table created Successfully`);
}

async function newsDashboardTable() {
  await newsDashboard.query(`
    CREATE TABLE IF NOT EXISTS newsTable (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      points INT,
      status TEXT DEFAULT 'pending',
      newsImage TEXT NOT NULL,
      description TEXT NOT NULL,
      slug TEXT NOT NULL,
      writerName TEXT NOT NULL
    );
  `);
  console.log(`newsTable created Successfully`);
}


async function adminLiveVideo() {
  await newsDashboard.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS adminLiveVideo (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      videoLink TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log(`Created videoTable for admin`);
}
async function adminmagazine() {
  await newsDashboard.query(` CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS magazineTable (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      Title TEXT NOT NULL,
        description TEXT NOT NULL,
        magazine TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `);
    console.log(`Created magazines Table for Admin`);
    
}

async function adminDailyPulse() {
  await newsDashboard.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS dailyPulse (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      images JSONB NOT NULL, -- store multiple image URLs as an array
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Created dailyPulse Table for admin");
  
}



module.exports = { adminsBlogTable, writersDashboardTable, newsDashboardTable,adminLiveVideo,adminmagazine,adminDailyPulse };