'use strict';

const Exif = require('exif').ExifImage;
const geohashLib = require('ngeohash');


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

    convertGeoData(exifData) {
        return new Promise((resolve, reject) => {
            const gps = exifData.gps; 
            const exifLongitude = gps.GPSLongitude;
            const exifLatitude = gps.GPSLatitude;

            if(!exifLatitude || !exifLongitude) return reject(new Error('Exif data does not contain gps metrics'));

            const longitude = GeoService.convertDMSToDD(exifLongitude, gps.GPSLongitudeRef);
            const latitude = GeoService.convertDMSToDD(exifLatitude, gps.GPSLatitudeRef);
            const geohash = geohashLib.encode(latitude, longitude, 9);

            resolve({
                longitude,
                latitude,
                geohash,
                urls: {
                    googleMaps: `https://maps.google.com/?q=${latitude},${longitude}`,
                    geohash: `http://geohash.org/${geohash}`
                }
            });
        });
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

    extractAndProcessExifDataFrom(pathOrBuffer) {
        return this
            .loadExifDataFrom(pathOrBuffer)
            .then(exifData => this.convertGeoData(exifData));
    };

}

module.exports = GeoService;