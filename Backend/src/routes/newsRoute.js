const express=require('express')
const newsRoute=express.Router()
const {getNewsByCategory, getNewsBySlug,getMagazine,getLiveVideo,getDailyPulse,getAllNews,getNewsOnCategory,getCategoryNewsById,getMagazineById,getSearchResults}=require('../controllers/newsController')
newsRoute.get("/get-news-bycategory",getNewsByCategory)
newsRoute.get("/get-news-byslug",getNewsBySlug)
newsRoute.get("/get-magazine",getMagazine)
newsRoute.get("/get-live-video",getLiveVideo)
newsRoute.get("/get-daily-pulse",getDailyPulse)
newsRoute.get('/get-all-news',getAllNews)
newsRoute.get('/get-news-on-category/:category',getNewsOnCategory)
newsRoute.get("/get-news-categoryby-id/:id",getCategoryNewsById)
newsRoute.get("/get-magazine/:id", getMagazineById);
newsRoute.get("/getNewsbySearch",getSearchResults)

module.exports=newsRoute