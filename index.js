const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6owueqa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const carDetailsCollection = client.db('carPolli').collection('carCollections');

        const bookingsCollection = client.db('carPolli').collection('bookings');

        const usersCollection = client.db('carPolli').collection('users');


        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const categoryDetails = await carDetailsCollection.find(query).toArray();
            res.send(categoryDetails);
        })


        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        })


        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })


        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


    }

    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('car polli server is running')
})

app.listen(port, () => console.log(`car polli running on ${port}`))