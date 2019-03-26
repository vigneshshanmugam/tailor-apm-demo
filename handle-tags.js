const agent = require("elastic-apm-node");

module.exports = function handleTag(req, tag) {
  if (tag.name === "apm-rum") {
    const transaction = agent.currentTransaction;

    const { traceId, sampled } = transaction;
    const parentId = transaction.ensureParentId();

    return `
    <script>
      elasticApm.init({
        serviceName: "tailor",
        pageLoadTransactionName: "Tailor-frontend",
        pageLoadTraceId: '${traceId}',
        pageLoadSpanId: '${parentId}',
        pageLoadSampled: ${sampled}
      });
    </script>
    `;
  }

  return "";
};
