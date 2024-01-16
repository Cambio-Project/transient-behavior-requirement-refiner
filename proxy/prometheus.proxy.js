const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// handle arguments
const showHelp = () => {
console.log('Usage: node proxy.js [--docker]');
  console.log('  --docker: proxy to host.docker.internal instead of localhost');
  process.exit(1);
}
if (process.argv.indexOf('-h') > -1 || process.argv.indexOf('--help') > -1) {
  showHelp();
}
const isDocker = process.argv.indexOf('--docker') > -1;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.all('/proxy', async (req, res) => {
    // Extracting target URL and basic auth credentials from headers
    let targetUrl;
    if (isDocker) {
      targetUrl = req.headers['x-target-url'] = req.headers['x-target-url'].replace('localhost', 'host.docker.internal');
    }
    else {
      targetUrl = req.headers['x-target-url'];
    }

    const authHeader = req.headers['authorization']; // Basic Auth Header

    if (!targetUrl) {
      return res.status(400).send({error: 'Target URL is required'});
    }

    console.log(`Proxying request to ${targetUrl}`);

    try {
        // Forwarding the request to the target URL
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: { ...req.headers, 'Authorization': authHeader },
            responseType: 'stream'
        });

        // Sending back the response from the target URL
        response.data.pipe(res);
    } catch (error) {
        // Handling errors
        if (error.response) {
            // Forwarding the error response from the target server
            return res.status(error.response.status).sendStatus(error.response.status);
        } else {
            return res.status(500).send({ error: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port} (docker mode: ${isDocker})`);
});
