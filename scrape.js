import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB();

puppeteer.use(StealthPlugin());

const defaultTimeout = 30000;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Function to observe and copy color to the database
async function observeAndCopyColor(page) {
   
    const lockSelector = 'path[data-v-41856078].fa-primary';
    const containerSelector = 'div.round-history-inner';
    const svgSelector = `${containerSelector} svg`;

    while(true) {
        try {
            await page.waitForSelector(lockSelector, { hidden: true, timeout: defaultTimeout }); 
            
            const svgElements = await page.$$(svgSelector);
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
        await client.connect();
        const page = await browser.newPage();

        await page.goto('https://bandit.camp/wheel');
        console.log("Landed on the website");

        await page.waitForSelector('button[data-v-0c79b5ba]');
        const loginButton = await page.$('button[data-v-0c79b5ba]');

        if (loginButton) {
            await loginButton.click();
            console.log("Login button clicked");

            // Wait for a Steam login popup
            const popupTarget = new Promise(resolve => browser.once('targetcreated', resolve));

            const popupTargetValue = await popupTarget;
            const popupPage = await popupTargetValue.page();

            if (popupPage) {
                await page.bringToFront();
                await page.waitForSelector('.link.primary500--text.font-weight-bold');
                const clickHereLink = await page.$('.link.primary500--text.font-weight-bold');
            
                if (clickHereLink) {

                    await page.evaluate(() => {
                        const clickHereLink = document.querySelector('.link.primary500--text.font-weight-bold');
                        if (clickHereLink) {
                          clickHereLink.click();
                        } else {
                          console.log("Click here element not found");
                        }
                      });
                    
                    // Type a username into the email input field
                    await page.waitForSelector('.newlogindialog_TextField_2KXGK input[type="text"]')
                    await page.type('.newlogindialog_TextField_2KXGK input[type="text"]', username); 
                    
                    // Type password into password input field
                    await page.waitForSelector('.newlogindialog_TextField_2KXGK input[type="password"]');
                    await page.type('.newlogindialog_TextField_2KXGK input[type="password"]', password); 
                    
                    //Click "Sign in" on Steam login page
                    await page.click('.newlogindialog_SubmitButton_2QgFE');
        
                    await page.waitForNavigation();
                } else {
                    console.log("Click here element not found")
                }

                const signInButton = await page.$('#imageLogin');
                await signInButton.click();

                await page.waitForNavigation();
                await page.goto('https://bandit.camp/wheel');
                console.log('before executing the function');

                await observeAndCopyColor(page);
                console.log('Function executed');

            } else {
                console.log ("Click here link not found");
            }
        } else {
            console.log("Popup page not created or login button is not clicked");
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();