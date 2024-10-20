const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://lingarajvpatil:APPU96329@cluster0.qttsn.mongodb.net/todo-app")
const { auth, JWT_SECRET } = require("./auth");

app.use(express.json());

app.post("/signup",async(req,res)=>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    await UserModel.create({
        email: email,
        name: username,
        password: password
    })
    
    res.json({
        message: "You are signed up!"
    })
})

app.post("/login",async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const response = await UserModel.findOne({
        email: email,
        password: password,
    });
    if(response){
        const token = jwt.sign(
            { id: response._id.toString() },
            JWT_SECRET,
            {expiresIn: "1h"}
        )
        res.json({
            token
        })
    }
    else{
        res.status(403).json({
            message: "incorrect creds"
        })
    }
})

app.post("/todo",auth,async(req,res)=>{
    const title = req.body.title;
    await TodoModel.create({
        title: title,
        userId: req.userId
    })
    res.json({
        msg: "todos added"
    })
})

app.get("/todos",auth,async(req,res)=>{
    try{
        const todos = await TodoModel.find({userId:req.userId})
        res.json(todos);
    }
    catch (error){
        res.status(500).json({
            message:"error occured while fetching todos"
        })
    }
    
})

app.delete("/todo/:id", auth, async (req, res) => {
    try {
        const todoId = req.params.id;
        const deletedTodo = await TodoModel.findOneAndDelete({ _id: todoId, userId: req.userId });

        if (!deletedTodo) {
            return res.status(411).json({
                message: "todo not found"
            }); 
        }

        res.status(200).json({
            message: "todo deleted successfully"
        });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).json({
            message: "An error occurred while deleting the todo."
        });
    }
});

app.listen(3000);