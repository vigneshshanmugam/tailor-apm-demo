"use strict";

const agent = require("elastic-apm-node").start({
  serviceName: "tailor-backend",
  logLevel: "error",
  disableInstrumentations: ["http"],
  captureSpanStackTraces: false
});
const Tracer = require("elastic-apm-node-opentracing");
const http = require("http");
const Tailor = require("node-tailor");
const serveFragment = require("./fragment");
const handleTag = require("./handle-tags");

const tailor = new Tailor({
  templatesPath: __dirname + "/templates",
  pipeAttributes: attributes => {
    const timingGroups = attributes["timing-group"]
      ? attributes["timing-group"].split(",")
      : [];
    const { id, primary } = attributes;
    return { timingGroups, id, primary: !!(primary || primary === "") };
  },
  pipeInstanceName: "TailorPipe",
  maxAssetLinks: 3,
  tracer: new Tracer(agent),
  handleTag,
  handledTags: ["fragment", "apm-rum"]
});

/** Tailor Server */
http
  .createServer((req, res) => {
    agent.setTransactionName(req.url);
    if (req.url === "/favicon.ico") {
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      return res.end("");
    }
    return tailor.requestHandler(req, res);
  })
  .listen(8080, () => console.log("Tailor started at port 8080"));
/** Fragment Header */
http
  .createServer(serveFragment("Header", "http://localhost:8081", 1))
  .listen(8081, () => console.log("Fragment Header started at port 8081"));

/** Fragment Primary */
http
  .createServer(serveFragment("Primary", "http://localhost:8082", 2))
  .listen(8082, () => console.log("Fragment Primary started at port 8082"));

/** Fragment Footer */
http
  .createServer(serveFragment("Footer", "http://localhost:8083", 3, true))
  .listen(8083, () => console.log("Fragment Footer started at port 8083"));

process.on("uncaughtException", err => console.error(err));
tailor.on("error", (request, err) => console.error(err));
