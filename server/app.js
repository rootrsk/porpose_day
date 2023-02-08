const express = require("express")
const cors = require("cors")
const jwt = require('jsonwebtoken')
const User = require("./userModal")
const env = require("dotenv")
env.config()
require("./dbConfig")
const app = express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3001
app.get("/",(req,res)=>{
    res.json({
        message:"welcome to proposeal api"
    })
})

app.post('/login',async(req,res)=>{
    try {
        console.log(req.body)
        const {username,password} = req.body
        let user = await User.findOne({username})
        if(!user){
            user = await new User(req.body)
            const token = await jwt.sign({id:user._id},process.env.JWT_SECRET)
            await user.save()
            return res.json({
                message:'New Account Created Successfully',
                token,
                user
            }) 
        }
        if(user.password !== password){
            return res.json({
                error:"Username or Password is incorrect"
            })
        }
        const token = await jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({
            message:"Loggedin Successfully",
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({
            error:'Something went wrong.'
        })
    }
})

app.patch("/update-user-details",async(req,res)=>{
    
    try {
        const token = req.headers.authorization
        console.log(token)
        console.log(req.body)
        if(!token)
            return res.json({
                error:"Need to Login Again"
            })
        const {id} = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(id)
        if(!user){
            return res.json({
                error:"Guess you have a login problem"
            })
        }
        await User.findByIdAndUpdate(id,req.body)
        res.json({
            token,
            id
        })
    } catch (error) {
        console.log(error)
        res.json({
            error:'Something went wrong.'
        })
    }
})

app.patch("/update-proposal-status",async(req,res)=>{
    
    try {
        const token = req.body.token
        console.log(token)
        console.log(req.body)
        if(!token)
            return res.json({
                error:"Link Expired"
            })
        const {id,theOne} = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(id)
        if(!user){
            return res.json({
                error:"Link Expired"
            })
        }
        user.proporsals = user.proporsals.concat({
            by:theOne,
            proposal:req.body.proposal || "",
            terms_and_conditons: req.body.terms_and_conditons || ""
        })
        await user.save()
        res.json({
            user,
            id
        })
    } catch (error) {
        console.log(error)
        res.json({
            error:'Something went wrong.'
        })
    }
})
app.post("/generate-proposal-link",async(req,res)=>{
    
    try {
        const token = req.headers.authorization
        console.log(token)
        console.log(req.body)
        if(!token){
            return res.json({
                error:"Need to Login Again"
            })
        }
            
        const {id} = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(id)
        if(!user){
            return res.json({
                error:"Guess you have a login problem"
            })
        }
        const urlToken = await jwt.sign({
            id,theOne: req.body.theOne
        },process.env.JWT_SECRET)
        // await User.findByIdAndUpdate(id,req.body)
        res.json({
            token:urlToken,
            id
        })
    } catch (error) {
        console.log(error)
        res.json({
            error:'Something went wrong.'
        })
    }
})

app.get("/get-proposal",async(req,res)=>{
    try {
        const token = req.headers.authorization
        console.log(token)
        const {id,theOne} = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(id)
        if(!user){
            return res.json({
                error:"Link Expired"
            })
        }
        res.json({
            id,theOne,user
        })
    } catch (error) {
        res.json({
            error:'Something went wrong.'
        })
    }
})
app.listen(port,()=>{
    console.log("Server started at port: "+ port)
})