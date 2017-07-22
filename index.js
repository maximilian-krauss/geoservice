'use strict';

// native
const { readFileSync } = require('fs');

// packages
const { send } = require('micro');
const { router, get, post } = require('microrouter');
const { upload } = require('micro-upload');
const visualize = require('micro-visualize');
const microCors = require('micro-cors');
const cors = microCors({ allowMethods: ['POST'] });

// ours
const geoService = new (require('./geo-service.js'));

const processImage = async (req, res) => {
    if (!req.files) return send(res, 400, { error: 'Please provide an image for processing' });

    try {
        const file = req.files.image;
        const geoData = await geoService.extractAndProcessExifDataFrom(file.data);

        return send(res, 200, geoData);
    }
    catch (err) {
        return send(res, 500, { error: err.message });
    }
};

const uploadForm = (req, res) => send(res, 200, readFileSync('upload.html', 'utf-8'));
const greeting = (req, res) => send(res, 200, { state: 'up and running' });
const notFound = (req, res) => send(res, 404, { error: 'Not found' });

module.exports = router(
    cors(
        visualize(
            upload(
                post('/', processImage)))),
    visualize(get('/', greeting)),
    visualize(get('/upload', uploadForm)),
    visualize(get('/*', notFound))
);