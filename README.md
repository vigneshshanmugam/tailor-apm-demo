# tailor-apm-demo

Running tailor with Elastic APM (Node.js &amp; Browser agent)

### Usage

```
DEBUG=false node index.js
```

### Visuazling the APM data

The instrumented data from the browser is sent to the APM-Server which is then sent to the Elasticsearch nodes and then visualized with the help of Kibana. You can learn more about it here - https://www.elastic.co/solutions/apm

#### UI with Autoinstrumentation and Custom Traces

![Tailor APM with Open tracing](https://raw.githubusercontent.com/vigneshshanmugam/tailor-apm-demo/master/kibana-apm.png)
