import axios from 'axios'
import { Parser } from 'htmlparser2'
import webScrapperModel from '../models/webscrapperModel.js'

class WebScrapper{

    static postDetails = async (req,res) => {

        const  {url}  = req.body;
  
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is missing' });
        }
    
        try {
            const details = await getWebsiteDetails(url);
            const newData = new webScrapperModel({
                domain: url,
                wordCount: details.wordCount,
                web_links: details.links,
                media_links: details.mediaUrls
            })
            await newData.save()
            res.status(200).json({newData});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the website details' });
        }

        async function getWebsiteDetails(url) {
            const response = await axios.get(url);
            const htmlContent = response.data;
        
            const wordCount = countWords(htmlContent);
            const links = await getAllWebsiteLinks(url);
            const mediaUrls = await getAllMediaUrls(url);
        
            return {
                wordCount,
                links,
                mediaUrls
            };
        }
          
        function countWords(content) {
            const words = content.split(/\s+/); // Split by whitespace characters
            return words.length;
        }
          
        async function getAllWebsiteLinks(domainUrl) {
            const response = await axios.get(domainUrl);
            const html = response.data;
        
            const links = [];
            const parser = new Parser({
                onopentag(name, attribs) {
                if (name === 'a' && attribs.href) {
                    const href = attribs.href;
                    if (href.startsWith('/') || href.startsWith(domainUrl)) {
                    links.push(href);
                    }
                }
                }
            }, { decodeEntities: true });
        
            parser.write(html);
            parser.end();
        
            return links;
        }
          
        async function getAllMediaUrls(domainUrl) {
            const response = await axios.get(domainUrl);
            const html = response.data;
        
            const mediaUrls = [];
            const parser = new Parser({
                onopentag(name, attribs) {
                if (name === 'img' && attribs.src) {
                    mediaUrls.push(attribs.src);
                } else if ((name === 'video' || name === 'audio') && attribs.src) {
                    mediaUrls.push(attribs.src);
                }
                }
            }, { decodeEntities: true });
        
            parser.write(html);
            parser.end();
        
            return mediaUrls;
        }
    }

    static getAllInsights = async (req,res) => {
        try {
            const data = await webScrapperModel.find();

            if (!data) {
                res.status(200).json({ success: false, message: "no such data in database" });
            }
            res.status(200).json({ success: true, message: "success", data:data });
        }catch (err) {
            res.status(500).send({success:false,message: err.message,});
        }
    }

    static updateInsights = async (req,res) => {
        try{
            const dataId = req.params.id;
            const data = await webScrapperModel.findById(dataId);
            if(!data){
                return res.status(200).json({ success: false, message: `Data with ID ${dataId} not found` });
            }

            if(req.body.fav){
                data.fav=req.body.fav
            }
            await data.save();
            return res.status(200).json({data})
        } catch(err){
            res.status(500).send({success:false,message: err.message,});
        }
        
    }

    static deleteInsights = async (req,res) => {
        try{
            const dataId = req.params.id
            const data = await webScrapperModel.findById(dataId);
        
            if(!data){
                return res.status(200).json({ success: false, message: `Data with ID ${dataId} not found` });
            }

            await webScrapperModel.findByIdAndDelete(dataId);
            res.status(200).json({ success: true, message: `Data with ID ${dataId} deleted successfully` });
        }catch(err){
            res.status(500).send({success:false,message: err.message,});
        }
    }
} 

export default WebScrapper
  
  
  
  
  
  
  
  