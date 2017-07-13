'use strict';

const { send } = require('micro');
const { router, get, post } = require('microrouter');
const { upload } = require('micro-upload');
const { readFileSync } = require('fs');

const GeoService = require('./geo-service.js');
const geoService = new GeoService();

const processImage = async (req, res) => {
    return upload(async (request, response) => {
        if(!request.files) return send(response, 400, { error: 'Please provide an image for processing' });
        
        try {
            const file = request.files.image;
            const geoData = await geoService.extractAndProcessExifDataFrom(file.data);

            send(response, 200, geoData);
        }
        catch(err) {
            return send(response, 500, { error: err.message });
        }
    })(req, res);
};

const uploadForm = (req, res) => send(res, 200, readFileSync('upload.html', 'utf-8'));
const greeting = (req, res) => send(res, 200, { state: 'up and running' });
const notFound = (req, res) => send(res, 404, { error: 'Not found' });

module.exports = router(
    post('/', processImage),
    get('/', greeting),
    get('/upload', uploadForm),
    get('/*', notFound)
);