const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const wordmarkPath = path.join(ROOT, 'INSUMOS', 'MARCA', 'wordmark.svg');
const wordmark = fs.existsSync(wordmarkPath) ? fs.readFileSync(wordmarkPath, 'utf8') : '';

const pastas = [
  { nome: '01_HABILITACAO_JURIDICA',   rotulo: 'Habilitação jurídica',           link: 'https://www.dropbox.com/scl/fo/b2uek8cc6iv5w1eognfci/ADhF1wy2LL_A91g88iC0O1Y?rlkey=hlqe5yudpn4u73egcon27g05n&dl=0' },
  { nome: '02_REGULARIDADE_FISCAL',    rotulo: 'Regularidade fiscal',            link: 'https://www.dropbox.com/scl/fo/hls70vxsudjrccott8txq/AJKLGPZNLRk31iG7uVc3LUs?rlkey=j96524ih3n1no09n3xey4712p&dl=0' },
  { nome: '03_QUALIFICACAO_TECNICA',   rotulo: 'Qualificação técnica',           link: 'https://www.dropbox.com/scl/fo/072s5fqo1froa961p7v75/AGBOt73yVKS7oSD4ZdaOuLQ?rlkey=1lg0bs0gupfg3d0f7nier8pwp&dl=0' },
  { nome: '04_QUALIFICACAO_ECONOMICA', rotulo: 'Qualificação econômico-financeira', link: 'https://www.dropbox.com/scl/fo/yxy3g7b61hlmpkp9m6czq/ACR4jDmRTxFGWkiUDByi3Gk?rlkey=xh9tpb1m7lcray3vkbraesknl&dl=0' },
  { nome: '05_DECLARACOES_ASSINADAS',  rotulo: 'Declarações assinadas',          link: 'https://www.dropbox.com/scl/fo/bo3kvxto9wxv93nma7tqr/AHZiUBV3nLAQ8gYMmkKerTg?rlkey=vd1ghzyf85lv41nljw7wdzujv&dl=0' },
  { nome: '06_PROPOSTA_TECNICA',       rotulo: 'Proposta técnica',               link: 'https://www.dropbox.com/scl/fo/uwf457jpbq6et7s5ovwhj/AI7qJ4nTURdI9rIMr_oc3Yw?rlkey=ip0loxlbmluj9maaj1dwvfr3p&dl=0' },
];

const demo = [
  { rotulo: 'DEMO · vídeo em baixa resolução', formato: '.mp4 — preview rápido', link: 'https://www.dropbox.com/scl/fi/c1s0p4un3vnpm4jx64jz2/DEMO-CATEDRAL-BAIXA.mp4?rlkey=qutz0rz7jyduk1doyyxqit6i6&dl=0' },
  { rotulo: 'DEMO · vídeo em alta resolução',  formato: '.mov — entrega final',  link: 'https://www.dropbox.com/scl/fi/yjf26lxswxaeg2wypxmhw/DEMO-CATTEDRAL-_ALTA.mov?rlkey=p4wf8082677pkzvo2frx423qp&dl=0' },
  { rotulo: 'DEMO · áudio em alta resolução',  formato: '.wav — trilha original', link: 'https://www.dropbox.com/scl/fi/lf9tbk6oja5s433kfihq5/DEMO-CATTEDRAL-_ALTA.wav?rlkey=i9j6ttj9gq5xtyjreajrgqeo9&dl=0' },
];

const linhas = pastas.map((p, i) => `
  <tr>
    <td class="num">${String(i+1).padStart(2,'0')}</td>
    <td>
      <div class="folder">${p.nome}</div>
      <div class="rot">${p.rotulo}</div>
    </td>
    <td class="link"><a href="${p.link}">${p.link}</a></td>
  </tr>
`).join('');

const linhasDemo = demo.map((d, i) => `
  <tr>
    <td class="num">${String(i+1).padStart(2,'0')}</td>
    <td>
      <div class="folder">${d.rotulo}</div>
      <div class="rot">${d.formato}</div>
    </td>
    <td class="link"><a href="${d.link}">${d.link}</a></td>
  </tr>
`).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Índice de pastas · Concorrência 002/2026 — Catedral Angelopolitana</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&family=Syne:wght@400;600&family=Cormorant+Garamond:ital,wght@1,300&display=swap" rel="stylesheet" />
<style>
  body{
    --page-bg:#FFFFFF; --sec-bg:#F2F2F2; --card-bg:#E6E6E6;
    --accent:#000; --ink:#000; --ink-mid:rgba(0,0,0,.55);
    --ink-faint:rgba(0,0,0,.35); --border:rgba(0,0,0,.12);
    --mono:'DM Mono', monospace; --sans:'Syne', sans-serif; --serif:'Cormorant Garamond', serif;
    --fs-micro:11px; --fs-xs:12px; --fs-sm:13px; --fs-base:14px;
    --fs-md:16px; --fs-lg:18px; --fs-xl:22px; --fs-2xl:28px;
    --ls-wide:.08em; --ls-wider:.14em; --ls-widest:.20em;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#fff;font-family:var(--sans);font-weight:400;color:var(--ink)}
  .page{
    width:210mm; min-height:297mm; background:var(--page-bg);
    padding:24mm 22mm 22mm 22mm; display:flex; flex-direction:column;
  }
  .ada-header{padding-bottom:10mm;border-bottom:1px solid var(--ink)}
  .ada-wm{display:block;width:60mm;height:auto;color:var(--ink)}
  .ada-wm svg{width:100%;height:auto}
  .ada-tagline{margin-top:6mm;font-family:var(--mono);font-size:var(--fs-xs);
    letter-spacing:var(--ls-wide);text-transform:uppercase;color:var(--ink-mid);}
  .ada-meta{margin-top:4mm;display:flex;flex-wrap:wrap;gap:6mm;
    font-family:var(--mono);font-size:var(--fs-micro);
    letter-spacing:var(--ls-widest);text-transform:uppercase;color:var(--ink-faint);}
  .ada-meta strong{color:var(--ink);font-weight:400;margin-right:4px}

  .content{flex:1;padding:18mm 0 14mm;font-family:var(--sans);font-size:11pt;line-height:1.55;color:var(--ink)}
  .content h1{font-family:var(--mono);font-weight:300;font-size:var(--fs-2xl);
    line-height:1.15;text-transform:uppercase;letter-spacing:var(--ls-wider);
    text-align:center;margin:0 0 6mm;color:var(--ink);}
  .content .sub{font-family:var(--mono);font-size:var(--fs-xs);
    letter-spacing:var(--ls-wider);text-transform:uppercase;
    color:var(--ink-mid);text-align:center;margin:0 0 14mm;}
  .content .lede{text-align:justify;margin:0 0 10mm;font-size:11pt;color:var(--ink)}
  .content h2.sec{font-family:var(--mono);font-weight:400;font-size:var(--fs-md);
    letter-spacing:var(--ls-wider);text-transform:uppercase;
    margin:14mm 0 4mm;padding-top:6mm;border-top:1px solid var(--ink);color:var(--ink);}

  table{width:100%;border-collapse:collapse;margin-top:4mm}
  th,td{padding:4mm 3mm;vertical-align:top;border-bottom:1px solid var(--border);text-align:left}
  thead th{
    font-family:var(--mono);font-weight:400;font-size:var(--fs-micro);
    letter-spacing:var(--ls-widest);text-transform:uppercase;
    color:var(--ink-mid);border-bottom:1px solid var(--ink);
  }
  td.num{font-family:var(--mono);font-size:11pt;color:var(--ink-mid);width:14mm}
  td .folder{font-family:var(--mono);font-size:10.5pt;letter-spacing:var(--ls-wide);text-transform:uppercase;color:var(--ink)}
  td .rot{font-family:var(--sans);font-size:10.5pt;color:var(--ink-mid);margin-top:1mm}
  td.link{font-family:var(--mono);font-size:8.5pt;word-break:break-all;color:var(--ink)}
  td.link a{color:var(--ink);text-decoration:underline}

  .nota{margin-top:10mm;padding:5mm 6mm;border:1px solid var(--ink);
    font-family:var(--mono);font-size:var(--fs-xs);
    letter-spacing:var(--ls-wide);color:var(--ink);line-height:1.7}
  .nota strong{display:block;letter-spacing:var(--ls-widest);text-transform:uppercase;font-size:var(--fs-micro);margin-bottom:2mm}

  .ada-footer{margin-top:auto;padding-top:8mm;border-top:1px solid var(--ink);
    display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;
    font-family:var(--mono);font-size:var(--fs-micro);
    letter-spacing:var(--ls-wide);color:var(--ink-mid);line-height:1.6;}
  .ada-footer .col{flex:1 1 30%}
  .ada-footer strong{display:block;color:var(--ink);font-weight:400;
    text-transform:uppercase;letter-spacing:var(--ls-widest);
    font-size:var(--fs-micro);margin-bottom:2mm;}

  @page{size:A4;margin:0}
</style>
</head>
<body>

<div class="page">

  <header class="ada-header">
    <div class="ada-wm">${wordmark}</div>
    <div class="ada-tagline">Ateliê Digital Analógico · Plataforma criativa · Desde 2015</div>
    <div class="ada-meta">
      <span><strong>Razão social</strong> Tatiane G L da Silva Produção Cultural</span>
      <span><strong>CNPJ</strong> 20.420.653/0001-37</span>
      <span><strong>CNAE</strong> 5911-1/02</span>
    </div>
  </header>

  <main class="content">
    <h1>Índice de pastas — material de inscrição</h1>
    <div class="sub">Concorrência Eletrônica nº 002/2026 · Município de Santo Ângelo/RS</div>

    <p class="lede">Este documento reúne os <strong>links de compartilhamento</strong> das seis pastas que organizam o material de inscrição da ADA — Ateliê Digital Analógico na Concorrência Eletrônica nº 002/2026 (projeção mapeada na Catedral Angelopolitana de Santo Ângelo). Cada link aponta para a pasta correspondente no Dropbox da empresa, em modo de visualização.</p>

    <table>
      <thead>
        <tr><th>#</th><th>Pasta</th><th>Link de compartilhamento</th></tr>
      </thead>
      <tbody>
        ${linhas}
      </tbody>
    </table>

    <h2 class="sec">DEMO — peça audiovisual de 2 a 3 min</h2>
    <p class="lede">Os arquivos abaixo compõem o <strong>DEMO</strong> exigido pelo edital (item 5.3 do ETP), apresentado em duas resoluções de vídeo e a trilha sonora original isolada em alta resolução. O DEMO é avaliado pela Comissão como amostra prospectiva da linha conceitual e da capacidade técnica para o filme final.</p>

    <table>
      <thead>
        <tr><th>#</th><th>Arquivo</th><th>Link de compartilhamento</th></tr>
      </thead>
      <tbody>
        ${linhasDemo}
      </tbody>
    </table>

    <div class="nota">
      <strong>Observação</strong>
      Os links são públicos (modo somente leitura) e permanecem ativos durante toda a vigência do certame. Em caso de necessidade de acesso a arquivos editáveis ou versões em outra resolução, solicitar diretamente à ADA pelos contatos abaixo.
    </div>
  </main>

  <footer class="ada-footer">
    <div class="col">
      <strong>Sede</strong>
      Rua Engenheiro Francisco Azevedo, 711<br>
      Jardim Vera Cruz · São Paulo/SP<br>
      CEP 05.030-010
    </div>
    <div class="col">
      <strong>Contato</strong>
      ada.art.br
    </div>
    <div class="col">
      <strong>Constituição</strong>
      Fundada em 10/06/2014<br>
      CNAE 5911-1/02 · Produção de filmes para publicidade
    </div>
  </footer>

</div>
</body>
</html>`;

(async () => {
  const tmpHtml = path.join(ROOT, '_indice_dropbox.tmp.html');
  fs.writeFileSync(tmpHtml, html, 'utf8');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  const out = path.join(ROOT, 'MATERIAL_INSCRICAO', 'INDICE_PASTAS_DROPBOX.pdf');
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  fs.unlinkSync(tmpHtml);
  console.log('PDF gerado em:', out);
})();
