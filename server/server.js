import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use('/pictures', express.static(path.join(__dirname, '../client/src/pictures')));

mongoose.connect('mongodb://localhost:27017/BanditCamp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/api/numbers', async (req, res) => { 
    try {
        const numbers = await mongoose.connection.collection('wofColor').find().sort({$natural: -1}).limit(10000).toArray();
        res.json(numbers);
    } catch (error) {
        console.error('Failed to fetch numbers from the db', error);
        res.status(500).json({ error:'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});