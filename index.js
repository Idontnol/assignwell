const express=require('express');
const sqlite3=require('sqlite3');
const {open}=require('sqlite');
const path=require('path');
const cloudinary=require('cloudinary');
const bodyParser = require('body-parser');

console.log(cloudinary.api_key);
const dbPath=path.join(__dirname,'posts.db')
require('dotenv').config();

const app=express();
app.use(bodyParser.json({ limit: '50mb' })); //increase the limit of uploading data using body-parser
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());

let db=null;
const dbConnection=async()=>{
    try{
        db=await open({filename:dbPath,driver:sqlite3.Database});
    }
    catch(e){
        console.log(e)
    } 
}
dbConnection();

const PORT= process.env.PORT || 3001;

app.get('/',async(req,res)=>{
    res.status(200).json({"msg": "it's working"});
})

app.get('/posts',async(req,res)=>{
    try{
        const response=await db.get(`select * from posts`);
        res.status(200).json({posts:response});
    }
    catch(e){
        res.status(400).json({"error message":e.message});
    }
    
})

app.post('/createpost',async(req,res)=>{
    console.log(req.body);
    const {title,descript,tag}=req.body;
    const file = req.body.img;
    console.log(title,descript,tag);
    console.log(file);
    try{
        const uploadResponse= await cloudinary.uploader.upload(`data:image/jpeg;base64,${file}`,{folder:"dribbleUsers"});
        console.log(uploadResponse,"cloud");
        const profileUrl=uploadResponse.secure_url;
        const public_id=uploadResponse.public_id;
        console.log(profileUrl,"proUrl");
        console.log(title,descript,tag);
    const insertQuery = `INSERT INTO posts (title, descript, tag, img) VALUES (?, ?, ?, ?)`;
        const response = await db.run(insertQuery, title, descript, tag,profileUrl);
        res.json({"msg":"post inserted successfully"});
    }
    catch(e){
        res.json({"error message":e.message});
    }
})


app.listen(PORT,()=>{
    console.log("listening on port"+PORT);
});