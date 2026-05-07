const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('file://' + path.resolve('index_v2.html'), {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: path.resolve('../../INSUMOS/DOCUMENTOS_PREGÃO/OUTROS/portfolio-ada-v2.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });

  await browser.close();
  console.log('PDF v2 gerado em INSUMOS/DOCUMENTOS_PREGÃO/OUTROS/portfolio-ada-v2.pdf');
})();
