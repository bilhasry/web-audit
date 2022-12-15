import { getDOMSize, getResourceSummary } from '../../utils/dataFormatter';

export default function handler(req,res) {
    const fs = require('fs');
    const lighthouse = require('lighthouse');
    const chromeLauncher = require('chrome-launcher');

    (async () => {
    let report = {
        firstUrl: null,
        secondUrl: null
    };
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port};
    const runnerResult = await lighthouse(req.body.first, options);
    // `.report` is the HTML report as a string
    const reportJSON = JSON.parse(runnerResult.report);
    
    report.firstUrl = {
        url: req.body.first,
        domSize: getDOMSize(reportJSON["audits"]),
        resource: getResourceSummary(reportJSON["audits"])
    };

    const runnerSecondResult = await lighthouse(req.body.second, options);
    // `.report` is the HTML report as a string
    const reportSecondJSON = JSON.parse(runnerSecondResult.report);

    report.secondUrl = {
        url: req.body.second,
        domSize: getDOMSize(reportSecondJSON["audits"]),
        resource: getResourceSummary(reportSecondJSON["audits"])
    };

    await chrome.kill();
    res.status(200).json(report)
    
    })();
}