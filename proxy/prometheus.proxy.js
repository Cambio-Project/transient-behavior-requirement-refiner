const express = require('express');
const axios = require('axios');
const cors = require('cors');
const stream = require("stream");
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
const isPodman = process.argv.indexOf('--podman') > -1;

// Configure axios to automatically decompress the response
axios.defaults.decompress = true;

async function errorStreamToString(stream, res, statusCode) {
    /**
     * This function will attempt to convert the stream to a string
     * and then parse the string as JSON. If the stream is not a JSON
     * response, it will return an error.
     */
    try {
        const { default: getStream } = await import('get-stream');

        // Convert the stream to a string
        const body = await getStream(stream);

        // Attempt to parse the string as JSON
        const jsonResponse = JSON.parse(body);
        console.log('Streamed error response:', jsonResponse);

        // Send the parsed JSON as the response
        return res.status(statusCode).send(jsonResponse);
    } catch (err) {
        // Log and respond with the error
        console.error('Error handling the error stream:', err);
        return res.status(statusCode).send({ error: 'Error processing the error response' });
    }
}

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.all('/proxy', async (req, res) => {

    if (
        !req.headers['x-target-url']
        || req.headers['x-target-url'] === undefined
    ) {
      return res.status(400).send({error: 'Target URL is required'});
    }

    // Extracting target URL and basic auth credentials from headers
    let targetUrl;
    if (isDocker) {
        targetUrl = req.headers['x-target-url'].replace('localhost', 'host.docker.internal');
    } else if (isPodman) {
        targetUrl = req.headers['x-target-url'].replace('localhost', 'host.container.internal');
    }
    else {
      targetUrl = req.headers['x-target-url'];
    }

    const authHeader = req.headers['authorization']; // Basic Auth Header

    console.log(`Proxying request to ${targetUrl}`);

    try {
        // Forwarding the request to the target URL
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: { ...req.headers, 'Authorization': authHeader, "Content-Type": "application/json"},
            responseType: 'stream'
        });

        // Sending back the response from the target URL
        response.data.pipe(res);
    } catch (error) {
        // Handling errors
        if (error.response) {
            if (error.response.data instanceof require('stream').Readable) {
                // Handle the stream response with the handleErrorStream function
                return await errorStreamToString(error.response.data, res, error.response.status);
            } else {
                // Handle non-stream response
                return res.status(error.response.status).send(error.response.data);
            }
        } else {
            return res.status(500).send({ error: error.message });
        }
    }
});

app.listen(port, () => {
    let mode = '';
    if (isDocker) {
        mode = 'docker';
    } else if (isPodman) {
        mode = 'podman';
    } else {
        mode = 'host';
    }
    console.log(`Proxy server running at http://localhost:${port} (mode: ${mode})`);
});
