const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const input = process.argv[2];
  const output = input.replace(/\.(jpe?g|png|webp)$/i, '.pdf');
  const buf = fs.readFileSync(input);
  const ext = path.extname(input).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  const dataUrl = `data:image/${mime};base64,${buf.toString('base64')}`;
  const html = `<!doctype html><html><head><style>
    @page { size: A4; margin: 0; }
    html,body { margin:0; padding:0; }
    .page { width: 210mm; height: 297mm; display:flex; align-items:center; justify-content:center; background:#fff; }
    img { max-width: 190mm; max-height: 277mm; object-fit: contain; }
  </style></head><body><div class="page"><img src="${dataUrl}"></div></body></html>`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: output, format: 'A4', printBackground: true, margin: 0 });
  await browser.close();
  console.log('OK ->', output);
})();
