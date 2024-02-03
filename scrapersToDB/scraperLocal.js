import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import  { MongoClient }  from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const database = client.db();
const collection = database.collection('wofColor');
const garbageCollection = database.collection("wofColorGarbage");

puppeteer.use(StealthPlugin());

const INTERVAL_DELAY = 1000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const containerSelector = 'div.round-history-inner';

const main = async () => {
    try {
        await client.connect();
        const browser = await puppeteer.launch({ 
            headless: 'new', 
            args: ["--no-sandbox"],
        });

        const page = await browser.newPage();

        const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
        await page.setUserAgent(customUA);

        await page.goto('https://bandit.camp/wheel');

        await delay(1000);

        await page.waitForSelector(containerSelector);
        
        let previousColors = [];
  
        setInterval(async () => {
            try {
                const svgColorsArray = await page.$$eval(`${containerSelector} svg`, svgs => {
                    // Extract numbers from class names and return as an array
                    return svgs.map(svg => {
                      const className = svg.getAttribute('class');
                      // Use a regular expression to extract the number from the class name
                      const match = className.match(/field-icon-(\d+)/);
                      // Return the extracted number or null if not found
                      return match ? match[1] : null;
                    }).filter(number => number !== null); // Filter out null values
                });
                
                if (previousColors.length == 0) {
                    addToMongoDB(svgColorsArray);
                    console.log('Added to db all 30 nums', svgColorsArray);
                } else {
                    const result = FindNewNumbers(previousColors, svgColorsArray);
                    if (result.length > 0) {
                        addToMongoDB(result);
                        addGarbageNumsToDB(svgColorsArray);
                    } else {
                        console.log('No new colors detected');
                    }
                   
                }
                previousColors = svgColorsArray.slice();
            } catch (error) {
                console.error('An error occured while observing colors', error);
                process.exit(1);
            }
        }, INTERVAL_DELAY);

        const pages = await browser.pages();
        pages.forEach((pg) => {
            if (pg !== page) {
                pg.close();
            }
        });

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

async function addToMongoDB(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const element = array[i];
        await collection.insertOne({ value: element, timestamp: new Date() });
    };
};

async function addGarbageNumsToDB(array) {
    const ArrayAsString = JSON.stringify(array);
    await garbageCollection.insertOne({ value: ArrayAsString, timestamp: new Date() });
};

function FindNewNumbers(oldArray, newArray) {
    const newArrayCopy = [...newArray];
    let maxLen = 0;
    let startIndexOfSequenceInNewArray = -1;

    for (let i = 0; i < oldArray.length; i++) {
        for (let j = 0; j < newArrayCopy.length; j++) {
            let len = 0;
            while (i + len < oldArray.length && j + len < newArrayCopy.length && oldArray[i + len] === newArrayCopy[j + len]) {
                len++;
                if (len > maxLen) {
                    maxLen = len;
                    startIndexOfSequenceInNewArray = j;
                }
            }
        }
    }

    if (maxLen > 0 && startIndexOfSequenceInNewArray > 0) {
        const newColors = newArrayCopy.slice(0, startIndexOfSequenceInNewArray);
        console.log('New colors are: ', newColors);
        return newColors;
    } else {
        return [];
    }
};

main();