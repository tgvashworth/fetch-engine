/* tslint:disable */
/// <reference path="../.d.test.ts" />

const tapeResults = require("tape").getHarness()._results;

tapeResults.on("done", function (): void {
  const payload = {
    total: tapeResults.count,
    passed: tapeResults.pass,
    failed: tapeResults.fail,
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `http://localhost:5001?id=${location.hash.slice(1)}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(payload));
});

var $target = document.createElement('div');
$target.style.fontFamily = "monospace";
$target.style.fontSize = "10px";
document.body.appendChild($target);

['log', 'error', 'info'].forEach(k => {
  var original = console[k];
  console[k] = function (...args) {
    var $line = document.createElement('div');
    $line.textContent = [...args].join(' ');
    if (k === "error") {
      $line.style.backgroundColor = "#f99";
    }
    $target.appendChild($line);
    original.call(console, ...args);
  };
});
