import expressApp from "express";
import axios from "axios";
import mongoose from "mongoose";

const app = express();

mongoose.connect('mongodb://BanditCamp');

app.get('/api/numbers', async (req, res) => {
    
    try {
        const numbers = mongoose.connection.collection('wofColor').find().limit(100).toArray;
        res.json(numbers);
    } catch (error) {
        console.error('Failed to fetch numbers from the db', error);
        res.status(500).json({ error:'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server is listening on port ${PORT}`);
});