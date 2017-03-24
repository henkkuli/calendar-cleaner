import path = require('path');
import url = require('url');
import express = require('express');
import http = require('http');
import https = require('https');
import WebSocket = require('ws');
import icalendar = require('icalendar');
import { Filter, Rewriter, execRules } from './filters';

const port = process.env.PORT | 8000;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, './static')));

app.get('/api/:userid/:authtoken/sample', (req, res) => {
    // Get parameters
    const userid = req.param('userid') as string;
    const authtoken = req.param('authtoken') as string;

    // Build uri for original data request
    const requestUrl =
        `https://mycourses.aalto.fi/calendar/export_execute.php?userid=${encodeURIComponent(userid)}&authtoken=${encodeURIComponent(authtoken)}&preset_what=all&preset_time=monthnow `;

    // Do the request and proxy it back to user
    https.get(requestUrl, (httpRes) => {
        if (httpRes.statusCode !== 200) {
            res.end();
            httpRes.resume();
            return;
        }

        // TODO: Add characterset utf-8 header

        httpRes.on('data', (chunk) => res.write(chunk));
        httpRes.on('end', () => res.end());
    });
});

app.get('/api/:userid/:authtoken/filter', (req, res) => {
    try {
        // Get parameters
        const userid = req.param('userid') as string;
        const authtoken = req.param('authtoken') as string;
        const rules = JSON.parse(req.query['rules'] as string) as (Filter | Rewriter)[];

        // Build uri for original data request
        const requestUrl =
            `https://mycourses.aalto.fi/calendar/export_execute.php?userid=${encodeURIComponent(userid)}&authtoken=${encodeURIComponent(authtoken)}&preset_what=all&preset_time=monthnow `;

        // Do the request and proxy it back to user
        https.get(requestUrl, (httpRes) => {
            if (httpRes.statusCode !== 200) {
                res.end();
                httpRes.resume();
                return;
            }

            // TODO: Add characterset utf-8 header

            // Read all data
            var data = '';
            httpRes.setEncoding('utf-8');
            httpRes.on('data', chunk => data += chunk);

            // When data is read, filter and send it to the requester
            httpRes.on('end', () => {
                try {
                    const ical = icalendar.parse_calendar(data);

                    const allEvents = ical.events() as any[];

                    // Remove all old events
                    ical.components = [];

                    // Apply filter to each event
                    const filteredEvents = allEvents.map(event => {
                        const summary = event.getProperty('SUMMARY');
                        const newSummary = execRules(summary.value, rules);
                        if (newSummary === undefined)
                            return undefined;

                        // Update summary
                        summary.value = newSummary;

                        return event;
                    }).filter(event => event !== undefined);

                    // Now add them back
                    ical.addComponents(filteredEvents);

                    res.end(ical.toString());
                } catch (e) {
                    res.end(String(e));
                }
            });
        });
    } catch (e) {
        res.end(String(e));
    }
});

server.listen(port);
