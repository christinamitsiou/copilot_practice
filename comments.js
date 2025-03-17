// Create web server
// Start server
// Serve static files
// Serve dynamic files
// Serve RESTful API
// Create a new comment
// Update a comment
// Delete a comment
// Get all comments
// Get a comment
// Get comments by user
// Get comments by post

// Load modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var comments = require('./comments');

// Define variables
var port = 3000;
var server = http.createServer();
var public_dir = path.join(__dirname, 'public');

// Start server
server.listen(port, function() {
  console.log('Server is running at http://localhost:' + port);
});

// Serve static files
server.on('request', function(req, res) {
  var req_url = url.parse(req.url, true);
  var pathname = req_url.pathname;
  var query = req_url.query;

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(path.join(public_dir, 'index.html')).pipe(res);
  } else if (req.method === 'GET' && pathname === '/comments') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(comments.getComments()));
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
});

// Serve dynamic files
server.on('request', function(req, res) {
  var req_url = url.parse(req.url, true);
  var pathname = req_url.pathname;
  var query = req_url.query;

  if (req.method === 'GET' && pathname === '/comments') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(comments.getComments()));
  } else if (req.method === 'POST' && pathname === '/comments') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      var comment = querystring.parse(data);
      comments.addComment(comment);
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(comment));
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
}   );
