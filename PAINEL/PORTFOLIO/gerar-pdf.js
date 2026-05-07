const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('file://' + path.resolve('index.html'), {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: path.resolve('../../INSUMOS/DOCUMENTOS_PREGÃO/OUTROS/portfolio-ada.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });

  await browser.close();
  console.log('PDF gerado: INSUMOS/DOCUMENTOS_PREGÃO/OUTROS/portfolio-ada.pdf');
})();
