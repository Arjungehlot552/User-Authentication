const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express(); 

//convert data into json format

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Set ejs as a view engine
// app.set("views" ,path.join(__dirname , "views"));
app.set("view engine" , "ejs");

//static file
app.use(express.static("public"))

app.get('/' , (req,res)=>{
    res.render("login")
});

app.get('/signup' , (req,res)=>{
    res.render("signup")
});

//Register user
app.post("/signup" , async (req,res)=>{

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check Validator = if the user alredy axist in the database
    const existinguser = await collection.findOne({name: data.name});

    if(existinguser){
        res.send(`
            <script>
                alert("User already exists. Please choose a different username.");
                window.location.href = '/signup'; // Redirect to the signup page
            </script>
        `);
    }else{
        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password , saltRounds);
        
        //Replace the hash password with original password
        data.password = hashedPassword; 

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
})

//Login user
app.post("/login" , async (req,res)=>{
   try{
       const check = await collection.findOne({name: req.body.username});
       if(!check){
        res.send(`
        <script>
        alert("User not Found");
        window.location.href = '/'; // Redirect to the login page
       </script>
    `);
        }
        //compare the hash password from the databse with the original password
        const isPasswordMatch = await bcrypt.compare(req.body.password , check.password);
        if(isPasswordMatch){
            res.render("home", { message: "You are logged in successfully!", messageType: "success" })
        }else{
            res.send("Password is incorrect");
        }
    
    }catch{
         res.send("Wrong Datails")
   }
})


app.listen(8080 , ()=>{
    console.log("Server is listening on port 8080") 
})
