const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
// accept raw HTML bodies (up to 10 MB)
app.use(bodyParser.text({ type: '*/*', limit: '10mb' }));

app.post('/convert', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  const wk = spawn('wkhtmltopdf', ['-', '-']);
  wk.stdin.write(req.body);
  wk.stdin.end();
  wk.stdout.pipe(res);
  wk.stderr.on('data', chunk => console.error('wkhtmltopdf:', chunk.toString()));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PDF service listening on port ${PORT}`));
