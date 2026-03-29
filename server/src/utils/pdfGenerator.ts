import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDFBuffer = async (templateData: any): Promise<Buffer> => {
    // 1. Resolve template path
    const templatePath = path.join(__dirname, '../templates/invoice.ejs');

    // 2. Render HTML
    const htmlContent = await ejs.renderFile(templatePath, templateData);

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Essential for some environments
    });

    const page = await browser.newPage();

    // 4. Inject HTML into page
    await page.setContent(htmlContent as string, { waitUntil: 'networkidle0' });

    // 5. Build PDF Output
    const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true, // Captures CSS colors/backgrounds accurately
        margin: {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px'
        }
    });

    await browser.close();

    // Convert Uint8Array to NodeJS Buffer
    return Buffer.from(pdfUint8Array);
};
