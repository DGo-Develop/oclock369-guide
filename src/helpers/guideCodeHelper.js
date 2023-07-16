const bwipjs = require('bwip-js');
const sharp = require('sharp');
const QRCode = require('qrcode');

class GuideHelper {
    async generateBarcode(barcodeValue) {
        const buffer = await new Promise((resolve, reject) => {
            bwipjs.toBuffer(
                {
                    bcid: 'code128', // Tipo de código de barras
                    text: barcodeValue, // Valor del código de barras
                    scale: 3, // Escala de la imagen del código de barras
                    height: 10, // Altura de la imagen del código de barras
                },
                (error, png) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(png);
                    }
                }
            );
        });

        // Convierte la imagen del código de barras a base64
        const base64Image = await sharp(buffer).toBuffer({ resolveWithObject: true });
        const base64Url = `data:image/png;base64,${base64Image.data.toString('base64')}`;

        return base64Url;

    }

    async generateQRCode(data) {
        try {
            return new Promise((resolve, reject) => {
                bwipjs.toBuffer({
                    bcid: 'qrcode',
                    text: data,
                    scale: 3,
                    height: 10,
                    width: 10,
                    includetext: false,
                    parsefnc: true
                }, (err, png) => {
                    if (err) {
                        reject(err);
                    } else {
                        const base64Image = png.toString('base64');
                        const dataUri = `data:image/png;base64,${base64Image}`;
                        resolve(dataUri);
                    }
                });
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new GuideHelper();
