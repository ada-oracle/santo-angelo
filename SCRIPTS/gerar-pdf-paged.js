// Gera PDF a partir de HTML que usa Paged.js (polyfill).
// Uso: node SCRIPTS/gerar-pdf-paged.js <caminho-html> [saida.pdf]
// Default: PAINEL/ROTEIRO/index.html → INSUMOS/DOCUMENTOS_PREGÃO/OUTROS/roteiro.pdf

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const inputArg = process.argv[2] || 'PAINEL/ROTEIRO/index.html';
  const outputArg = process.argv[3] || 'INSUMOS/DOCUMENTOS_PREGÃO/OUTROS/roteiro.pdf';

  const inputAbs = path.resolve(inputArg);
  const outputAbs = path.resolve(outputArg);
  fs.mkdirSync(path.dirname(outputAbs), { recursive: true });

  const fileUrl = 'file:///' + inputAbs.replace(/\\/g, '/');
  console.log('→ Abrindo', fileUrl);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--allow-file-access-from-files', '--font-render-hinting=none']
  });
  const page = await browser.newPage();

  // Espera Paged.js terminar de paginar antes do PDF
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction(() => window.PagedPolyfill || document.querySelector('.pagedjs_pages'), { timeout: 60000 });
  await page.waitForFunction(() => {
    const pages = document.querySelectorAll('.pagedjs_page');
    return pages.length > 0;
  }, { timeout: 60000 });
  // pequeno delay extra pra garantir layout final
  await new Promise(r => setTimeout(r, 1500));

  await page.pdf({
    path: outputAbs,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await browser.close();
  console.log('✓ PDF gerado:', outputAbs);
})();
