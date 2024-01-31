import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());

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