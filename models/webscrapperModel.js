import mongoose from "mongoose";

//DEFINING SCHEMA
const webScrapperSchema=new mongoose.Schema({
    domain:{type:String,required:true},
    wordCount:{type:Number,required:true},
    web_links:{type:[String]},
    media_links:{type:[String]},
    fav:{type:String,default:false}
})

//CREATING MODEL
const webScrapperModel = mongoose.model("webScrapper",webScrapperSchema);
export default  webScrapperModel