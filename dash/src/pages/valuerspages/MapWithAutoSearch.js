import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';

const MapWithAutoSearch = () => {
  const [center, setCenter] = useState({ lat: -1.224680, lng: 36.899250}); // Default center is San Francisco, CA
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const autocompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setSelectedPlace(place);
      }
    }
  };

  const onMapClick = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    setSelectedPlace({
      name: `Custom Location`,
      geometry: {
        location: {
          lat: () => latitude,
          lng: () => longitude,
        },
      },
    });

    // Clear previously set markers and add the new marker for the selected location
    setMarkers([
      {
        name: 'Custom Location',
        position: { lat: latitude, lng: longitude },
        icon: 'https://maps.google.com/mapfiles/kml/paddle/blu-circle.png', // Custom icon for selected place marker
      },
    ]);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCuOMviA2dyPVLhh63SgvOdkiUszmAXsdI" libraries={['places']}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={center}
        zoom={15}
        onClick={onMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon}
            onClick={() => setSelectedPlace(marker)}
          />
        ))}

        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `500px`,
              height: `50px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px',
              marginTop:"5px"
            }}
          />
        </Autocomplete>
      </GoogleMap>
      {selectedPlace && (
        <div style={{ marginTop: '10px' }}>
          <h2>Selected Location:</h2>
          <p>Name: {selectedPlace.name}</p>
          <p>Latitude: {selectedPlace.geometry.location.lat()}</p>
          <p>Longitude: {selectedPlace.geometry.location.lng()}</p>
        </div>
      )}
    </LoadScript>
  );
};

export default MapWithAutoSearch;
