const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const input = process.argv[2];
  const output = input.replace(/\.docx$/i, '.pdf');
  const { value: html } = await mammoth.convertToHtml({ path: input });
  const fullHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 20mm 18mm; }
    body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #111; }
    h1 { font-size: 18pt; margin: 0 0 6mm 0; }
    h2 { font-size: 14pt; margin: 6mm 0 3mm 0; }
    h3 { font-size: 12pt; margin: 4mm 0 2mm 0; }
    p { margin: 0 0 3mm 0; text-align: justify; }
    ul, ol { margin: 0 0 3mm 5mm; padding: 0; }
    li { margin-bottom: 1.5mm; }
    a { color: #0a3a8a; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #888; padding: 2mm; }
  </style></head><body>${html}</body></html>`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ path: output, format: 'A4', printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' } });
  await browser.close();
  console.log('OK ->', output);
})();
