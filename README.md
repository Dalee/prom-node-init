# Prom node init

Just a bit of automatization for hapi node projects.

- Starts server on port 7070 which exposes metrics, route - /metrics (default settings)

- Probes default metrics with using prom-client

- Probes gc stats with prometheus-gc-stats

Example from glue manifest:

```js
{
    plugin: {
        register: 'prom-node-init',
        options: {
            defaultMetrics: { timeout: 5000 },
            port: 7070, // override port
            metricRoute: '/mymetrics' // override route
        }
    }
}
```
