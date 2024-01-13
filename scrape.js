import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB();

puppeteer.use(StealthPlugin());

const defaultTimeout = 30000;


// Function to observe and copy color to the database
async function observeAndCopyColor(page) {
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    const lockSelector = 'path[data-v-41856078].fa-primary';
    console.log('Lock Selector Found:', !!lockSelector);
    const containerSelector = 'div.round-history-inner';
    console.log('Container Selector Found:', !!containerSelector);
    const svgSelector = `${containerSelector} svg`;
    console.log('SVG Selector Found:', !!svgSelector);

    while(true) {
        try {
            console.log('Waiting for the selector');
            await page.waitForSelector(lockSelector, { hidden: true, timeout: defaultTimeout }); 
            page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

            const svgElements = await page.$$(svgSelector);
            console.log('FirstSVG is: ', svgElements[1]);
            const firstSVG = svgElements[1];

            if (firstSVG) {
                const colorNumber = await getColorNumber(page, firstSVG);

                if (colorNumber != null ) {
                    await saveColorToDB(colorNumber);
                } else {
                    console.log('color number is null');
                }
            } else {
                console.log ('The color element was not found');
            }
            await page.waitForTimeout(defaultTimeout);

        } catch (error) {
            if (error.message.includes('Target closed') || error.message.includes('Waiting for selector')) {
                console.error('Error: ${error.message}. Reloading page now...', error);
                await page.reload();
            } else {
                console.error('An error occured while observing colors', error);
                process.exit(1);
            }
        }
    }
}

// Get color number from the SVG element
async function getColorNumber(page, svgElement) {
    const firstClass = await page.evaluate(svg => svg.getAttribute('class'), svgElement);
    const match = firstClass.match(/field-icon-(\d+)$/);
    return match ? match[1] : null;
}

// Save color to the DynamoDB
async function saveColorToDB(colorNumber) {
    const params = {
        TableName: 'ColorsStorage',
        Item: {
            colorNumber: parseInt(colorNumber),
            timestamp: new Date().toISOString(),
        }
    }
    await dynamoDB.put(params).promise();
}

// Main function
(async () =>{
    try {
        const browser = await puppeteer.launch({ executablePath: executablePath(), headless: "new" });
        const page = await browser.newPage();

        await page.goto('https://bandit.camp/wheel');
        console.log("Landed on the website");

        await observeAndCopyColor(page);
        console.log('Function executed');

    } catch (error) {
        console.error('Error:', error);
    }
})();
