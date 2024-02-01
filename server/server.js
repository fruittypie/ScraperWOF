import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';

const app = express();
const server = http.createServer(app); // Create HTTP server using Express 
const io = new Server(server);  // Attach socket.io to the HTTP server

app.use(cors());

const mongoURI = 'mongodb://localhost:27017/BanditCamp';
const dbName = 'BanditCamp';
const collectionName = 'wofColor';

let database
let client;

const connectToDB = async () => {
    try {
        client = new MongoClient(mongoURI);
        await client.connect();
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

app.get('/api/numbers', async (req, res) => { 
    try {
        const numbers = await database.collection(collectionName).find().sort({$natural: -1}).limit(10000).toArray();

        res.json(numbers);
    } catch (error) {
        console.error('Failed to fetch numbers from the db', error);
        res.status(500).json({ error:'Internal server error' });
    } finally {
        if (client) {
            client.close();
        }
    }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB();
});