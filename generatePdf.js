const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async (event) => {
    try {
        const browser = await puppeteer.launch({
            executablePath: await chromium.executablePath,
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const requestBody = JSON.parse(event.body);
        const content = requestBody.content;

        const page = await browser.newPage();

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>PDF Content</title>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;

        await page.setContent(htmlContent);

        const pdfBuffer = await page.pdf({
            printBackground: true,
            landscape: true,
            width: 450,
            height: 500,
        });

        await browser.close();

        return {
            statusCode: 200,
            body: pdfBuffer.toString('base64'),
            isBase64Encoded: true,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename=generated.pdf',
            },
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};