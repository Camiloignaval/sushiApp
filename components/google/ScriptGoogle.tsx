import Script from "next/script";
import React from "react";

export const ScriptGoogle = () => {
  return (
    <Script
      type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw&language=es&libraries=places"
    />
  );
};
