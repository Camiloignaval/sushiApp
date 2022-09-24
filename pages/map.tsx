import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
// const ScriptLoaded = require("../../docs/ScriptLoaded").default;

import React, { useCallback, useRef, useState } from "react";
import { Navbar } from "../components/ui";

const MapPage = () => {
  const mapContainerStyle = {
    height: "calc(100vh)",
    width: "calc(100vw)",
  };

  const [path, setPath] = useState([
    { lat: -33.49452073393333, lng: -70.73177757034262 },
    { lat: -33.4969364416283, lng: -70.73411645652193 },
    { lat: -33.513388801381225, lng: -70.74189611566437 },
    { lat: -33.52415352788414, lng: -70.75098038740417 },
    { lat: -33.545381215622406, lng: -70.75705358027155 },
    { lat: -33.570388312582615, lng: -70.777518708152 },
    { lat: -33.552611902801914, lng: -70.80242390084511 },
    { lat: -33.5341937254556, lng: -70.80063766785712 },
    { lat: -33.526918952939575, lng: -70.79951489368759 },
    { lat: -33.51806928218032, lng: -70.83309607605747 },
    { lat: -33.49555810717046, lng: -70.82646149592979 },
    { lat: -33.49655870677757, lng: -70.80092017326949 },
    { lat: -33.474254788544485, lng: -70.75820368376311 },
    { lat: -33.47536160690769, lng: -70.73906547216492 },
    { lat: -33.47795831756953, lng: -70.7417193041732 },
    { lat: -33.48545003022266, lng: -70.73360470173378 },
    { lat: -33.49281341166146, lng: -70.73605439281835 },
  ]);
  const polygonRef = useRef(null);

  const center = { lat: -33.5183808601021, lng: -70.76766249137242 };

  const onLoad = useCallback((polygon: any) => {
    polygonRef.current = polygon;
    polygon.getPath();
  }, []);
  return (
    <>
      <Navbar></Navbar>
      <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={13.5}
        center={center}
      >
        <Polygon
          path={path}
          onLoad={onLoad}
          options={{
            fillColor: "#000",
            fillOpacity: 0.4,
            strokeColor: "#000",
            strokeOpacity: 1,
            strokeWeight: 1,
          }}
        />
      </GoogleMap>
    </>
  );
};

export default MapPage;
