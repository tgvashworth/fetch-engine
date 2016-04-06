/* tslint:disable */
/// <reference path="../.d.test.ts" />

const id = location.hash.slice(1);

// Wrap the console

var $target = document.createElement('div');
$target.style.fontFamily = "monospace";
$target.style.fontSize = "10px";
document.body.appendChild($target);

function addLine(type, text) {
  var $line = document.createElement('div');
  $line.textContent = text;
  if (type === "error") {
    $line.style.backgroundColor = "#E81C4F";
    $line.style.color = "white";
  }
  if (type === "info") {
    $line.style.backgroundColor = "#1DA1F2";
    $line.style.color = "white";
  }
  $target.appendChild($line);
  window.scrollTo(0, document.body.clientHeight);
}

['log', 'error', 'info'].forEach(k => {
  var original = console[k];
  console[k] = function (...args) {
    addLine(k, [...args].join(' '));
    original.call(console, ...args);
  };
});

// Wait for tape to finish

const tapeResults = require("tape").getHarness()._results;
tapeResults.on("done", function (): void {
  const payload = {
    total: tapeResults.count,
    passed: tapeResults.pass,
    failed: tapeResults.fail,
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `http://localhost:5001?id=${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Origin", location.origin);
  xhr.send(JSON.stringify(payload));
  xhr.onerror = function () {
    console.error(`collector ${id} failed:`, xhr.status, xhr.responseText);
    console.error(xhr.getAllResponseHeaders());
  };
  xhr.onload = function () {
    console.info("collector load", xhr.status, xhr.responseText);
  };
});
