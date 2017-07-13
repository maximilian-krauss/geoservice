# geoservice
Extracts location data from images

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/maximilian-krauss/geoservice)


Small service to extract GPS location data from images. 

## How to use
Deploy the service or run it local with `npm start`. 

Send an multi-part HTTP post to `http://localhost:3000` or the now instance. Your request should look like this:

```
curl -X POST \
  http://localhost:3000/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'image=@/Users/max/path/to/your/image.jpg'
```

and the response would look like this:

```
{
  "longitude": 4.378936111111111,
  "latitude": 51.09654166666667,
  "geohash": "u154etudu",
  "urls": {
    "googleMaps": "https://maps.google.com/?q=51.09654166666667,4.378936111111111",
    "geohash": "http://geohash.org/u154etudu"
  },
  "address": "Van Leriuslaan 14-22, 2850 Boom, Belgium"
}
```
