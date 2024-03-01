import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const server = http.createServer(app); // Create HTTP server using Express 

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
app.use(cors());

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.DB_COLLECTION_NAME;

let database
let client;

const connectToDB = async () => {
    try {
        client = new MongoClient(mongoURI);
        await client.connect();
        console.log('Connected to db');
        database = client.db(dbName);
        const wofColorCollection = database.collection(collectionName);
        
        // Create change stream on this collection
        const changeStream = wofColorCollection.watch();

        // set up emitted events listener
        changeStream.on('change', (next) => {
            if (next.operationType  === 'insert') {
                const newNumber = next.fullDocument.value;
                const timestamp = next.fullDocument.timestamp;

                io.emit('newNumber', { value: newNumber, timestamp: timestamp});
            }
        });
    } catch (error) {
        console.error('Error connecting to the db: ', error);
    }
};

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
  });
});

app.get('/api/draws', async (req, res) => {
    try {
        const {count} = req.query;
        const countNum = parseInt(count);
        if (isNaN(countNum) || countNum <= 0) {
            return res.status(400).json({ error: 'Invalid input: the number must be a positive integer' });
        }
    
        const draws = await database.collection(collectionName)
            .find()
            .sort({timestamp: -1})
            .limit(countNum)
            .toArray();
        
        res.json(draws);
    } catch (error) {
        console.error('Error fetching draws:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/numbers', async (req, res) => { 
    try {
        const numbers = await database.collection(collectionName)
        .find()
        .sort({timestamp: -1})
        .limit(10000)
        .toArray();

        res.json(numbers);
    } catch (error) {
        console.error('Failed to fetch numbers from the db', error);
        res.status(500).json({ error:'Internal server error' });
    }
});

server.on('close', () => {
    if (client) {
        client.close();
    }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB();
});