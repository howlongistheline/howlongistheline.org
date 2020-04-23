import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import bodyParser from 'body-parser';

// For requests with content-type JSON:
WebApp.connectHandlers.use('/api', bodyParser.json());
// // For requests with content-type application/x-www-form-urlencoded
// WebApp.connectHandlers.use('/path', bodyParser.urlencoded());
// // Then your handler:
// WebApp.connectHandlers.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     API.handleRequest(res, req);
// });

WebApp.connectHandlers.use('/test', async (req, res, next) => {
    console.log("API Call")
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    const result = {
        sucess: true,
        data: {
            test: "test"
        }
    };
    res.end(JSON.stringify(result));
})

WebApp.connectHandlers.use('/api/v1/nearme', async (req, res, next) => {
    console.log("API Call /nearme", req.body);
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    const { lat, long } = req.body;
    const response = await Meteor.call('locations.findnearby', { lat, long });
    res.end(JSON.stringify(response));
})
