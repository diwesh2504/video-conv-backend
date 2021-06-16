const express=require('express')
const multer=require('multer');
const cors=require('cors')
const ffmpeg=require('fluent-ffmpeg');
const app=express();
const fs=require('fs');
ffmpeg.setFfmpegPath("D:/python/GUVI/Full Stack/FFMpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("D:/python/GUVI/Full Stack/FFMpeg/bin");

app.use(express.json());
app.use(cors());

var file_output_name=""

    function fileFilter (req, file, cb) {
        if(file.originalname.endsWith('.pdf')){
            cb(null,false)
            return cb(new Error('Incorrect file format'))
        }else{
            cb(null,true)
        }
      }  
var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './uploads');  
    },  
    filename: function (req, file, callback) { 
       file_output_name=file.originalname 
      callback(null, file.originalname);  
    }
  });  
var upload = multer({ storage,fileFilter}).single("myfile")
app.post("/upload",(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.status(404).json({"Message":"Incorrect File Format,Try Again!"})
        }else{
            res.redirect("/convert")
        }
    })
})
app.get("/convert",(req,res)=>{
    console.log(file_output_name)
    try {
        ffmpeg("uploads/"+ file_output_name)
    .format('hls')
    .on("end", function (stdout, stderr) {
      console.log("Finished");
      })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
    })
    .saveToFile("uploads/converted.m3u8");
    res.json({"message":"file converted,Click Back to convert another file"})
    } catch (error) {
        res.json({"err":error.message})
    }
    
})  
app.listen(process.env.PORT||4040,()=>{
    console.log("SERVER ON")
})