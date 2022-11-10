const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xbsa3bq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('awesomeClicks').collection('services');
        const reviewCollection = client.db('awesomeClicks').collection('reviews');


        app.get('/topics', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const topics = await cursor.limit(3).toArray();
            res.send(topics);
        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //reviews api
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });
        app.get('/serviceReview', async (req, res) => {
            let query = {};
            console.log(req.query.id);
            if (req.query.id) {
                query = {
                    service: req.query.id
                }
            }
            console.log(query);
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })


    }
    finally {

    }

}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Awesome clicks server is running')
})

app.listen(port, () => {
    console.log(`Awesome clicks server running on ${port}`);
})