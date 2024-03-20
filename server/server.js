import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

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

function combineGapResults(newGapResults, existingGapResults) {
    const combinedData = Object.fromEntries(
      Object.entries(existingGapResults).map(([key, value]) => {
        const newGapData = newGapResults[String(value.number)] || {};
        const combinedGapData = { ...value.gap };
  
        for (const gapKey in newGapData) {
          if (combinedGapData[gapKey]) {
            combinedGapData[gapKey] += newGapData[gapKey];
          } else {
            combinedGapData[gapKey] = newGapData[gapKey];
          }
        }
  
        return [key, { ...value, gap: combinedGapData }];
      })
    );
  
    return combinedData;
}
  
async function findGapOccurrences(values) {
    const nums = [1, 3, 5, 10, 20];
    const gapOccurrences = {};
    
    const numbers = values.map(obj => parseInt(obj.value));

    for (let num of nums) {
        gapOccurrences[num] = {};
        let currentGap = 0;
        for (let i = 0; i < values.length; i++) {
            if (numbers[i] === num) {
                if (currentGap > 0) {
                    if (gapOccurrences[num][currentGap]) {
                        gapOccurrences[num][currentGap]++;
                    } else {
                        gapOccurrences[num][currentGap] = 1;
                    }
                }
                currentGap = 0;
            } else {
                currentGap++;
            }
        }
    }
    return gapOccurrences;
}

app.get('/api/draws', async (req, res) => {
    try {
        const {count} = req.query;
        const countNum = parseInt(count);
        if (isNaN(countNum) || countNum <= 0) {
            return res.status(400).json({ error: 'Invalid input: the number must be a positive integer' });
        }
    
        const draws = await database.collection(collectionName)
            .find({}, { projection: { _id: 1, value: 1 } })
            .sort({timestamp: -1})
            .limit(countNum)
            .toArray();
        res.json(draws);
    } catch (error) {
        console.error('Error fetching draws:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/num', async (req, res) => {
    try {
        const {selectedNumber} = req.query;
        const valuesArray = await database.collection(collectionName)
        .find({}, { projection: {value: 1 } })
        .sort({ timestamp: -1 })
        .toArray();
        const values = valuesArray.map(doc => doc.value);
        const gapOccurrences = await findGapOccurrences(values, selectedNumber);

        res.json(gapOccurrences);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/numbers', async (req, res) => { 
    try {
        const numbers = await database.collection(collectionName)
        .find({}, { projection: { _id: 1, value: 1 } })
        .sort({timestamp: -1})
        .toArray();

        res.json(numbers);
    } catch (error) {
        console.error('Failed to fetch numbers from the db', error);
        res.status(500).json({ error:'Internal server error' });
    }
});

app.get('/api/number', async (req, res) => { 
    try {
        const number = await database.collection(collectionName)
        .find({}, { projection: { _id: 1, value: 1 } })
        .sort({timestamp: -1})
        .limit(1)
        .next()
        res.json(number);
    } catch (error) {
        console.error('Failed to fetch number from the db', error);
        res.status(500).json({ error:'Internal server error' });
    }
});

app.get('/api/total', async (req, res) => { 
    try {
        const total = await database.collection(collectionName).countDocuments();
        res.json(total);
    } catch (error) {
        console.error('Failed to fetch number from the db', error);
        res.status(500).json({ error:'Internal server error' });
    }
});

app.get('/api/recalculate', async (req, res) => {
    try {
        const gapResultsDB = await database.collection('gapResults').find({}).toArray(); 
        const totalNumbersDB = await database.collection(collectionName).countDocuments();
        let processedCount = 0; // Initialize processedCount with 0

        // Get the processed count if the document exists
        const processedTotalCount = await database.collection('gapResultsTotalCount').findOne({}, { projection: { processedCount: 1 } });

        // If processedTotalCount is not null, update processedCount
        if (processedTotalCount !== null) {
            processedCount = processedTotalCount.processedCount;
        }


        const numsDifference = totalNumbersDB - processedCount;
        
        if (numsDifference > 10000) {
            // renew the processedCount in the processedTotalCount db: add the numsDifference to total:
            processedCount = totalNumbersDB;
            await database.collection('gapResultsTotalCount').updateOne({}, { $set: { processedCount: processedCount } }, { upsert: true });
            // get the values from the maim db
            const values = await database.collection(collectionName)
                .find({}, { projection: { value: 1 } })
                .sort({timestamp: -1})
                .toArray();

            // recalculated the occurences with all numbers
            const gapResults = await findGapOccurrences(values);  //I get an object here

            // update the db with gaps:
            for (const number of Object.keys(gapResults)) {

                if (processedTotalCount !== null) {
                // If document exists, update the gap numbers
                    const existingDoc = await processedTotalCount.findOne({ number: parseInt(number) });
                    existingDoc.gap = gapResults[number];
                    await processedTotalCount.replaceOne({ _id: existingDoc._id }, existingDoc);
                } else {
                // If document doesn't exist, create a new one
                    const newDoc = {
                    number: parseInt(number),
                    gap: gapResults[number]
                    };
                    await database.collection('gapResults').insertOne(newDoc);
                }
            }
            res.json(gapResults);
        } else {
            // extract the difference values from the db
            const differenceValues = await database.collection(collectionName)
            .find({}, { projection: { value: 1 } })
            .sort({timestamp: -1})
            .limit(numsDifference)
            .toArray();
            // Calculate gaps for the difference
            const newDifferenceGapResults = await findGapOccurrences(differenceValues);
            // Combine with existing gapresults
            const combinedGapResults = (gapResultsDB.length === 0) ? {} : combineGapResults(newDifferenceGapResults, gapResultsDB);
            res.json(combinedGapResults);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
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