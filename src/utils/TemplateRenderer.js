const fs = require('fs').promises;
const path = require('path');
const Logger = require('./logger');

class TemplateRenderer {
    static logger = new Logger('guide-controller');

    static async loadHTMLTemplate(name) {
        TemplateRenderer.logger.info('Loading HTML template...');
        const filePath = path.join(__dirname, '..', 'infraestructure', 'resources', 'guide_html', `${name}.html`);
        try {
            let fileContent = await fs.readFile(filePath, 'utf8');

            fileContent = await this.replaceCSSLinks(fileContent);
            fileContent = await this.replaceImgSrc(fileContent);

            TemplateRenderer.logger.info('HTML template loaded successfully.');
            return fileContent;
        } catch (error) {
            TemplateRenderer.logger.error(`Error loading HTML template: ${error.message}`);
            throw error;
        }
    }

    static async replaceCSSLinks(fileContent) {
        const linkRegex = /<link rel="stylesheet" href="([^"]+)">/g;
        let match;
        let newFileContent = fileContent;
        while ((match = linkRegex.exec(fileContent)) !== null) {
            const cssHref = match[1];
            const cssPath = path.join(__dirname, '..', 'infraestructure', 'resources', 'guide_html', cssHref);
            const cssContent = await fs.readFile(cssPath, 'utf8');
            newFileContent = newFileContent.replace(match[0], `<style type="text/css">${cssContent}</style>`);
        }
        return newFileContent;
    }

    static async replaceImgSrc(fileContent) {
        const imgRegex = /<img src="([^"{}]+)"([^>]*)>/g;
        let match;
        let newFileContent = fileContent;
        while ((match = imgRegex.exec(fileContent)) !== null) {
            const imgSrc = match[1];
            const imgPath = path.join(__dirname, '..', 'infraestructure', 'resources', 'guide_html', imgSrc);
            const imgData = await fs.readFile(imgPath, { encoding: "base64" });
            const mimeType = this.getMimeType(imgPath);
            const dataUri = `data:${mimeType};base64,${imgData}`;
            newFileContent = newFileContent.replace(match[0], `<img src="${dataUri}"${match[2]}>`);
        }
        return newFileContent;
    }

    static replacePlaceholders(html, dataArray) {
        TemplateRenderer.logger.info('Replacing placeholders in HTML template...');
        let newHtml = html;

        dataArray.forEach(data => {
            for (const key in data) {
                newHtml = newHtml.replace(new RegExp(`{${key}}`, "g"), data[key]);
            }
        });

        TemplateRenderer.logger.info('Placeholders replaced successfully.');
        return newHtml;
    }

    static getMimeType(filepath) {
        const ext = path.extname(filepath);
        switch (ext) {
            case '.css':
                return 'text/css';
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg';
            case '.png':
                return 'image/png';
            default:
                throw new Error(`Unsupported file extension: ${ext}`);
        }
    }
}

module.exports = TemplateRenderer;
