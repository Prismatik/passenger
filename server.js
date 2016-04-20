const http = require('http');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const spawn = require('child_process').spawn;

const server = http.createServer();

server.on('request', (req, res) => {
  switch (req.url) {
    case '/':
      res.write(fs.readFileSync('./dist/index.html'));
      break;
    case '/app.js':
      res.write(fs.readFileSync('./dist/app.js'));
      break;
    case '/app.js.map':
      res.write(fs.readFileSync('./dist/app.js.map'));
      break;
  };
  res.end();
});

const io = require('socket.io')(server, { serveClient: false });

io.on('connection', conn => {
  const files = cares;
  conn.emit('files', files);
});

server.listen(3000);

// One-liner for current directory, ignores .dotfiles
const ignores = [
  /dist/,
  /node_modules/
];

const cares = {};

chokidar.watch('.', {ignoreInitial: true, ignored: ignores}).on('all', (event, filePath) => {
  switch (event) {
    case 'add':
      var content = fs.readFileSync(filePath, {encoding: 'utf8'});
      cares[filePath] = content;
      io.emit('file', {name: filePath, content: content});
      break;
    case 'change':
      var content = fs.readFileSync(filePath, {encoding: 'utf8'});
      cares[filePath] = content;
      io.emit('file', {name: filePath, content: content});
      break;
    case 'unlink':
      delete cares[filePath];
      break;
  }
});

switch (process.platform) {
  case 'darwin':
    spawn('./bin/darwin-ngrok', ['http', '3000'], {stdio: 'inherit'});
    break;
  case 'linux':
    spawn('./bin/linux-ngrok', ['http', '3000'], {stdio: 'inherit'});
    break;

};
