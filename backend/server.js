//TODO: Fix redundant code

const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();

const cors = require ('cors');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const port = process.env.SERVER_PORT;
const mongoUrl = process.env.MONGO_URL;
const mongodbName = process.env.MONGO_DB_NAME;
const mongoCollectionName = process.env.MONGO_COLLECTION_NAME;
const secretKey = process.env.SECRET_KEY;
const baseUrl = process.env.BASE_URL; 
const frontendPort = process.env.FRONTEND_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `${baseUrl}:${frontendPort}`);
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
})

app.post('/api/v1/login', async (req, res) => {

    const response = await getUserInfo(req);
    console.log(response);
    if(response && response.password === req.body.password){
        const token = generateToken(response.name, response.email);
        res
            .status(200)
            .json({
                ...response,
                token
            });
    }
    else{
        res
            .status(401)
            .json({
                error: "Invalid credentials",
                token: null
            })
    }
});

app.post('/api/v1/signup', async (req, res) => {
    const name = req?.body?.name;
    const email = req?.body?.email;
    const password = req?.body?.password;

    const doesUserExist = await getUserInfo(req);

    console.log(doesUserExist);

    if(doesUserExist){
        res
            .status(400)
            .json({
                error: "User already exists",
                token: null
            });
    }
    else {
        const timestamp = Date.now();
        let months = [];
        let index=0;
        while(index<12){
            months.push({ budget: null, total: null, expenses: {} });
            index+=1;
        }
        const userData = {
            name,
            email,
            password,
            months,
            timestamp
        }

        const createUser = async() => {
            const client = new MongoClient(mongoUrl);
            try{
                await client.connect();
                const db = client.db(mongodbName);
                const collection = db.collection(mongoCollectionName);
                
    
                await collection.insertOne(userData);
                const token = generateToken(name, email);
                res
                    .status(200)
                    .json({
                        email,
                        token
                })
            }
            catch(error){
                console.log(error)
            }
        }

        createUser();
    }

});

app.post('/api/v1/get-user-info', async (req, res) => {

    let response = await getUserInfo(req);
    console.log(response);
    if(response){
        res
            .status(200)
            .json(response);
    }
    else {
        res
            .status(404)
            .json({
                data:{
                    error: "User not found"
                }
            })
    }
});

app.post('/api/v1/update-user-info', async (req, res) => {
    console.log(req.body);
    const client = new MongoClient(mongoUrl);
    try{
        await client.connect();
        const db = client.db(mongodbName);
        const collection = db.collection(mongoCollectionName);
        console.log(req?.body?.email);
        let email = req?.body?.email
        const query = {email};
        const updatedValues = [...req?.body.months];
        collection.updateOne(
            query, // Filter by email
            { $set: { months: updatedValues } } // Update the entire months array
          ).then(result => {
            console.log('Document updated successfully');
            res.json(result);
            // Close the connection
            client.close();
          })
          .catch(error => {
            console.error('Error updating document:', error);
            res.json(error);
            // Close the connection
            client.close();
          });
    }
    catch(error){
        console.log(error);
    }
})

app.post('/api/v1/refresh-token', async (req, res) => {
    const token = generateToken(req.body.name, req.body.email);
    res.status(200)
        .json({
            token
        });
})

const generateToken = (name, email) => {
    const token = jwt.sign({id: name, username: email}, secretKey, {expiresIn: '1m'});
    return token;
}

const getUserInfo = async (req) => {
    const client = new MongoClient(mongoUrl);
    try{
        await client.connect();
        const db = client.db(mongodbName);
        const collection = db.collection(mongoCollectionName);
        console.log(req?.body?.email);
        let email = req?.body?.email
        const query = {email};
        const document = await collection.findOne(query);
        client.close();
        if(document && document.email === email){
            console.log(document);
            return document;
        }
        else{
            return null;
        }
    }
    catch(error){
        console.log(error);
    }
}

app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            error: err
        });
    }
    else{
        next(err);
    }
}) 



app.listen(port, () => {
    console.log(`API served at port ${port}`);
})
