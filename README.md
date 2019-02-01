# Prom node init

Just a bit of automatization for hapi node projects.

- Starts server on port 7070 which exposes metrics, route - /metrics

- Probes default metrics with using prom-client

- Probes gc stats with prometheus-gc-stats

Example from glue manifest:

```js
{
    plugin: {
        register: '@dalee/prom-node-init',
        options: {
            defaultMetrics: { timeout: 5000 },
        }
    }
}
```
