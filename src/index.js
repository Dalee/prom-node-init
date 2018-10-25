const promClient = require('prom-client');
const gcStats = require('prometheus-gc-stats');
const http = require('http');
const os = require('os');

/**
 * @param {Object} server
 * @param {Object} options
 * @param {Object} [options.defaultMetrics] - @see https://www.npmjs.com/package/prom-client
 * @param {Function} next
 * @return {*}
 */
function metricPlugin(server, options, next) {
    const { defaultMetrics = {} } = options;

    promClient.collectDefaultMetrics(defaultMetrics);
    gcStats(promClient.register)();
    createMetricExporter();

    return next();
}

/**
 * Starts server.
 */
function createMetricExporter() {
    const port = 7070;
    http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/metrics') {
            res.writeHead(200);
            res.end(promClient.register.metrics());
            return;
        }

        res.writeHead(404);
        res.end();
    }).listen(port, () => {
        console.log('info', `Metric server started: ${os.hostname()}:${port}`); // eslint-disable-line no-console
    }).on('error', function (err) {
        console.log('error', err); // eslint-disable-line no-console
    });
}

metricPlugin.attributes = {
    name: 'metricPlugin'
};

module.exports = metricPlugin;
