const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IN  = 'C:/Users/fazol/Downloads/WhatsApp Image 2026-05-07 at 16.20.04.jpeg';
const OUT = path.join(ROOT, 'MATERIAL_INSCRICAO', '04_QUALIFICACAO_ECONOMICA', 'COMPROVANTE_GARANTIA_PROPOSTA_1pct.pdf');

(async () => {
  const jpgBytes = fs.readFileSync(IN);
  const pdf = await PDFDocument.create();
  const img = await pdf.embedJpg(jpgBytes);

  // A4 retrato (595 x 842 pt). Encaixar a imagem com margem.
  const pageW = 595, pageH = 842, margin = 36;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const ratio = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * ratio, h = img.height * ratio;
  const x = (pageW - w) / 2, y = (pageH - h) / 2;

  const page = pdf.addPage([pageW, pageH]);
  page.drawImage(img, { x, y, width: w, height: h });

  pdf.setTitle('Comprovante de garantia de proposta — Concorrência 002/2026');
  pdf.setAuthor('ADA — Ateliê Digital Analógico');
  pdf.setSubject('TED Banrisul · R$ 20.350,39 · Conta Calção 04.146692.0-6');

  fs.writeFileSync(OUT, await pdf.save());
  console.log('PDF gerado em:', OUT);
})();
