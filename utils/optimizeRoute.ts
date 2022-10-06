import { toast } from "react-hot-toast";
const GOOGLE_MAPS_API_KEY = process.env.API_KEY_GOOGLE;

export const optimizeRoute = async (waypoints: string[]) => {
  try {
    const wayPoints = waypoints.map((placeId) => ({
      location: { placeId: placeId },
      stopover: true,
    }));

    const directionsService = new window.google.maps.DirectionsService();
    const resp = await directionsService.route({
      origin: {
        placeId:
          "EhpEZXNpcmUgMjkwMCwgTWFpcMO6LCBDaGlsZSIxEi8KFAoSCbFHAS_OwmKWEYjH62N6qeJCENQWKhQKEgnrvQ3hz8JilhHPZ_2m_Zd-IQ",
      },
      destination: {
        placeId:
          "EhpEZXNpcmUgMjkwMCwgTWFpcMO6LCBDaGlsZSIxEi8KFAoSCbFHAS_OwmKWEYjH62N6qeJCENQWKhQKEgnrvQ3hz8JilhHPZ_2m_Zd-IQ",
      },
      travelMode: window.google.maps.TravelMode.DRIVING,
      waypoints: wayPoints,
      optimizeWaypoints: true,
    });

    const toReturn = resp.routes[0].legs;
    return toReturn;
    // &waypoints=via%3ACharlestown%2CMA%7Cvia%3ALexington%2CMA&departure_time=now
    //   const url = `https://maps.googleapis.com/maps/api/directions/json?${origin}&${destination}&waypoints=${JSON.stringify(
    //     wayPoints
    //   )}&key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw`;
    //   console.log(url);
  } catch (error) {
    toast.error("Ha ocurrido un error calculando ruta");
    return null;
  }
};
