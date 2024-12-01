const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const uri = "mongodb+srv://coffeeMaster:5R0poB4Rp9BVvdEm@cluster0.wr4sb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        console.log("Connected to MongoDB!");

        // Create a database name and collection name
        const coffeeDB = client.db('coffeeDB').collection('coffee');

        // POST: Save data to the database
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeDB.insertOne(newCoffee);
            res.send(result);
        });
        //GET: get the all data from database
        app.get('/coffees', async (req, res) => {
            const cursor = coffeeDB.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        //GET: get the single data  
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const result = await coffeeDB.findOne(filter)
            res.send(result)
        })
        //PUT: get the data for update from database
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please update this id from database', id);
            const updateid = {
                _id: new ObjectId(id)
            };
            const options = {
                upsert: true
            }
            const updateCoffee = req.body;
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    chef: updateCoffee.chef,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo
                }
            }
            const result = await coffeeDB.updateOne(updateid, coffee, options)
            res.send(result)

        })
        //DELETE: get the data id and delete from database
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete this id from database', id);
            const deletedId = {
                _id: new ObjectId(id)
            };
            const result = await coffeeDB.deleteOne(deletedId)
            res.send(result)
        })
        // GET: Root endpoint
        app.get('/', (req, res) => {
            res.send('Hello World! this is Jubayer');
        });


        // Create a database name and collection name for new users
        const usersDB = client.db('coffeeDB').collection('users');
        // POST: get Users data from register form and post to database
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await usersDB.insertOne(newUser)
            res.send(result)
        })
        // GET: geting the Users data from database
        app.get('/users', async (req, res) => {
            const cursor = usersDB.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        //GET: get the single data from database
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            }
            const result = await usersDB.findOne(filter);
            res.send(result)
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});