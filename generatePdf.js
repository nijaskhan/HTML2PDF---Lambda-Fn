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

        const page = await browser.newPage();

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>PDF Content</title>
            </head>
            <body>
                <div style="text-align: center; margin-top: 50px;">
                <div style="width: 730px; height: 560px; float: left;font-family:sans-serif">
                <div style="width: 130px; float: left; background: #d3d3d3; height: 450px; display: flex; justify-content: center; align-items: center;">
                    <p style="color: #222; transform: rotate(180deg); writing-mode: vertical-lr; font-size: 36px;">
                        Sam Marino
                    </p>
                </div>
                <div style="width: 300px; float: left; background: #dedede; height: 450px; background-size: cover; background: url(https://s3-ap-southeast-1.amazonaws.com/staragent-userfiles/demo/models/compcard/18e31918-b623-401c-9d20-3577f66c6494.jpg)" >
                </div>
                <div style="width: 300px; float: left; background: #bcbcbc; height: 450px; background-size: cover; background: url(https://s3-ap-southeast-1.amazonaws.com/staragent-userfiles/demo/models/compcard/29d2e86d-fccb-44f9-b763-b1802b83ea5f.jpg)" >
                </div>
                <div style="clear: both"></div>
                <div style="width: 100%; height: 110px; background: #e9e9e9;">
                    <div style="width: 58%; height: 110px; float: left; font-size: 11px; padding-left: 25px; padding-top: 22px;" >
                        <div style="margin-right: -15px; margin-left: -15px;">
                            <div style="width: 25%;float:left">
                                <span style="color: #000; font-weight: bold;">Height</span><br>
                                34 cm<br><br>
                                <span style="color: #000; font-weight: bold;">Weight</span><br>
                                81 kg
        
                            </div>
                            <div style="width: 25%; float: left">
                                <span style="color: #000; font-weight: bold;">Chest</span><br>
                                83.00 cm
                                <br><br>
                                <span style="color: #000; font-weight: bold;">Waist</span>
                                <br>
                                72.00 cm
                            </div>
        
                            <div style="width: 25%; float: left">
                                <span style="color: #000; font-weight: bold;">Shoulder</span><br>
                                50.00 cm<br><br>
                                <span style="color: #000; font-weight: bold;">Hips</span><br>
                                53.00 cm
                            </div>
                            <div style="width: 25%; float: left">
                                <span style="color: #000; font-weight: bold;">Hair</span><br>
                                Brown Wavy
                                <br><br>
                                <span style="color: #000; font-weight: bold;">Eyes</span>
                                <br>
                                Brown cm
                            </div>
        
                        </div>
        
                    </div>
                    <div style="width: 38%; height: 110px;float:left">
                        <div style="margin-right: -15px; margin-left: -15px;">
                            <div style="width: 66.66666667%; margin: 0px; margin-top: 5px; font-size: 12px; float: left" >
                                <p style="font-size: 14px;margin-bottom: 8px;">The Humming Bird Agency</p>
                                <p style="margin:0">702.430.9122</p>
                                <p style="margin:0">george@staragent.co</p>
                                <p style="margin:0">www.hummingbird.com</p>
                            </div>
                            <div style="width: 33.33333333%; margin-top: 5px; float: left" id="divAglogo">
                                <img src="https://s3-ap-southeast-1.amazonaws.com/staragent-userfiles/demo/logo/9cd2afbe-f0d0-4244-bc25-c9b2b90e3a36.png" style="width:100%">
                            </div>
                        </div>
                    </div>
                </div>
        
            </div>
                </div>
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