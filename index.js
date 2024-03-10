// var express=require("express")
// var bodyparser=require("body-parser")
// var mongoose=require("mongoose")

// const app=express()

// app.use(bodyparser.json())
// app.use(express.static('registrationform'))
// app.use(bodyparser.urlencoded({
//     extended:true
// }))
// mongoose.connect('mongodb://localhost:27017/Database')
// var db=mongoose.connection
// db.on('error',()=> console.log("Eroor in connecting to database"))
// db.once('open',()=> console.log("connect to Database")) 

// app.post("/index.html",(req,res) => {
//     var name=req.body.name
//     var email=req.body.email
//     var password=req.body.password

//     var data={
//         "name":name,
//         "email":email,
//         "password":password
//         }
//         db.collection('users').insertone(data,(err,collection) => {
//             if(err){
//                 throw err;
//             }
//             console.log("Record Inserted succesfully")
//         })
//         return res.redirect('signup.html')
// })
// app.get("/index.html",(req,res) => {
//     res.set({
//         "Allow-acces-allow-origin":'*'
//     })
//     return res.redirect('index.html')
// }).listen(3000);

// console.log("listining on port 3000 ")




const express = require("express");
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const dotenv = require("dotenv")

const app=express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.fjxlu7t.mongodb.net/registrationFormDB`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const registrationSchema = new mongoose.Schema ({
    name : String,
    email : String,
    password : String
});


const registration = mongoose.model("Registration",registrationSchema);

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/index.html");
})
app.post("/register", async (req,res) => {
    try{
        const{name,email,password}= req.body;

        const exitstingUser = await registration.findOne({email : email});
      // check for existing user
        if(!exitstingUser){
            const registrationData = new registration ({
                name,
                email,
                password
            });
            await registrationData.save(); 
           return res.redirect("/success");
        }
        else{
            console.log("user already exist");
        return res.redirect("/error");
        }
        
        const registrationData = new registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    catch(error){
        console.log(error);
      return res.redirect("/error");

    }
})
// app.post("/",(req,res) =>{
//     res.sendFile(__dirname +"signup.html");
// })
app.get("/success",(req,res) => {
        res.sendFile(__dirname +"/success.html");
})

app.get("/error",(req,res) => {
        res.sendFile(__dirname +"/error.html");
})
app.listen(port,() => {
    console.log(`server is running on port ${port}`);
} )