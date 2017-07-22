'use strict';

const Exif = require('exif').ExifImage;
const geohashLib = require('ngeohash');
const googleMapsService = new (require('./google-maps-service'))();

class GeoService {

    static convertDMSToDD(degree, direction) {
        const [ days, minutes, seconds ] = degree;
        let result = days + (minutes / 60) + seconds / (60 * 60);
        result = parseFloat(result);

        if (direction == "S" || direction == "W") {
            result *= -1;
        }

        return result;
    }

    async convertGeoData(exifData) {
        const gps = exifData.gps;
        const exifLongitude = gps.GPSLongitude;
        const exifLatitude = gps.GPSLatitude;

        if (!exifLatitude || !exifLongitude) throw new Error('Exif data does not contain gps metrics');

        const longitude = GeoService.convertDMSToDD(exifLongitude, gps.GPSLongitudeRef);
        const latitude = GeoService.convertDMSToDD(exifLatitude, gps.GPSLatitudeRef);
        const geohash = geohashLib.encode(latitude, longitude, 9);

        return {
            longitude,
            latitude,
            geohash,
            urls: {
                googleMaps: `https://maps.google.com/?q=${latitude},${longitude}`,
                geohash: `http://geohash.org/${geohash}`
            }
        };
    };

    loadExifDataFrom(pathOrBuffer) {
        return new Promise((resolve, reject) => {
            try {
                new Exif({ image : pathOrBuffer }, function (error, exifData) {
                    if(error) return reject(error);

                    resolve(exifData);
                });
            }
            catch(error) {
                return reject(error);
            }
        });
    };

    async resolveAddressFromGoogleWith(geoData) {
        return Object.assign(
            {}, 
            geoData, 
            { 
                address: await googleMapsService.resolveAddressFrom(geoData.latitude, geoData.longitude)
            });
    }

    extractAndProcessExifDataFrom(pathOrBuffer) {
        return this
            .loadExifDataFrom(pathOrBuffer)
            .then(this.convertGeoData)
            .then(this.resolveAddressFromGoogleWith);
    };

}

module.exports = GeoService;