const http = require('http');
const open = require('open');

const hostname = '127.8.0.1';
const port = 80;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  res.write('hel');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  open(`http://${hostname}:${port}/`);
});


