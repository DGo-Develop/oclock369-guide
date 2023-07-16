const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const Logger = require('./logger');

class PDFGenerator {
  static logger = new Logger('pdf-generator');

  static async generateImageFromHtml(html, imageSize) {
    PDFGenerator.logger.info('Generating image from HTML...');
    let browser;
    try {
      browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'], timeout: 60000 });
      const page = await browser.newPage();
      await page.setViewport({
        width: imageSize.width,
        height: imageSize.height,
        deviceScaleFactor: 1,
      });

      await page.setContent(html);
      const screenshotBuffer = await page.screenshot({ encoding: 'binary' });

      const resizedImageBuffer = await sharp(screenshotBuffer)
        .resize(imageSize.width, imageSize.height)
        .jpeg({ quality: 100 })
        .toBuffer();

      PDFGenerator.logger.info('Image generated successfully.');
      return resizedImageBuffer;
    } catch (error) {
      PDFGenerator.logger.error(`Image generation error: ${error.message}`);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  static generatePDFWithImage(imageBuffer) {
    PDFGenerator.logger.info('Generating PDF with image...');
    return new Promise((resolve, reject) => {
      const pdfDoc = new PDFDocument({ autoFirstPage: false });
      const chunks = [];
      const numberOfImages = 3;

      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer.toString('base64'));
        PDFGenerator.logger.info('PDF generated successfully.');
      });

      pdfDoc.on('error', (error) => {
        PDFGenerator.logger.error(`PDF generation error: ${error.message}`);
        reject(error);
      });

      pdfDoc.addPage({ size: 'letter', layout: 'portrait' });
      const imageSize = { width: pdfDoc.page.width, height: pdfDoc.page.height / numberOfImages };

      for (let i = 0; i < numberOfImages; i++) {
        pdfDoc.image(imageBuffer, 0, i * imageSize.height, {
          fit: [imageSize.width, imageSize.height],
          valign: 'top'
        }).stroke();
      }

      pdfDoc.end();
    });
  }
}

module.exports = PDFGenerator;
