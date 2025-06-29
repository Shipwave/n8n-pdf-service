const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
// only treat text/html bodies as HTML
app.use(bodyParser.text({ type: 'text/html', limit: '10mb' }));

app.post('/convert', (req, res) => {
  console.log('▶ Received HTML length:', req.body?.length);
  res.setHeader('Content-Type', 'application/pdf');

  const wk = spawn('wkhtmltopdf', ['--quiet', '-', '-']);
  let stderr = '';

  wk.stderr.on('data', d => {
    stderr += d.toString();
    console.error('wkhtmltopdf stderr:', d.toString());
  });

  wk.on('error', err => {
    console.error('Failed to start wkhtmltopdf:', err);
    return res.status(500).send(`Spawn error: ${err.message}`);
  });

  wk.on('close', code => {
    console.log(`wkhtmltopdf exited with code ${code}`);
    if (code !== 0 && !res.headersSent) {
      return res.status(500).send(`PDF gen error: ${stderr}`);
    }
  });

  // write HTML into wkhtmltopdf and pipe PDF back
  wk.stdin.write(req.body || '');
  wk.stdin.end();
  wk.stdout.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PDF service listening on port ${PORT}`));
