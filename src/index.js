import { collectDefaultMetrics, register } from 'prom-client';
import gcStats from 'prometheus-gc-stats';
import http from 'http';
import os from 'os';

/**
 * @param {Object} server
 * @param {Object} options
 * @param {Function} next
 * @return {*}
 */
function metricPlugin(server, options, next) {
    const {
        defaultMetrics = {},
        metricRoute = '/metrics',
        port = 7070,
        log = console.log // eslint-disable-line no-console
    } = options;
    collectDefaultMetrics(defaultMetrics);
    gcStats(register)();
    createMetricExporter(metricRoute, port, log);

    return next();
}

/**
 * @param {string} metricRoute
 * @param {int} port
 * @param {Function} log
 */
function createMetricExporter(metricRoute, port, log) {
    try {
        const metricServer = http.createServer((req, res) => {
            if (req.method === 'GET' && req.url === metricRoute) {
                res.writeHead(200);
                res.end(register.metrics());
                return;
            }

            res.writeHead(404);
            res.end();
        });

        metricServer.listen(port, () => {
           log('info', `Metric server started: ${os.hostname()}:${port}`);
        });
    } catch (err) {
       log('error', err);
    }
}

metricPlugin.attributes = {
    name: 'metricPlugin'
};

export default metricPlugin;
