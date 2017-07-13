'use strict'

const { get } = require('request-promise-native');

class GoogleMapsService {

    _fetchDataFromGoogle(latitude, longitude) {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false`;
        return get(apiUrl);
    }

    async resolveAddressFrom(latitude, longitude) {
        const response = await this._fetchDataFromGoogle(latitude, longitude);
        const googleData = JSON.parse(response);
        
        if(googleData.status !== 'OK') throw new Error(`Request to google address resolution failed with ${googleData.status}`);
        if(googleData.results.length === 0) throw new Error('Address resolution return no results');

        return googleData.results[0].formatted_address;
    }
}

module.exports = GoogleMapsService;