const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

(async () => {
  const args = process.argv.slice(2);
  const output = args[0];
  const inputs = args.slice(1);
  const merged = await PDFDocument.create();
  for (const f of inputs) {
    const bytes = fs.readFileSync(f);
    const src = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  fs.writeFileSync(output, await merged.save());
  console.log('OK ->', output, '(' + inputs.length + ' arquivos)');
})();
