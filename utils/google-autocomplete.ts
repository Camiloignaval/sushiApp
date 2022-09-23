const useGooglePlaceAutoComplete = () => {
  const initAutoComplete = async (input: any, callback: any) => {
    let autoComplete = new window.google.maps.places.Autocomplete(input, {
      // limit to North America for now
      componentRestrictions: { country: ["cl"] },
      fields: ["address_component", "geometry"],
      types: ["address"],
    });
    autoComplete.addListener("place_changed", callback);

    return autoComplete;
  };

  const getFullAddress = async (autoComplete: any) => {
    const place = autoComplete.getPlace();

    let address1;

    for (const component of place.address_components) {
      const componentType = component.types[0];

      if (componentType === "street_number") {
        address1 = component.long_name;
      }
      if (componentType === "route") {
        address1 = `${address1} ${component.long_name}`;
      }
    }
    let resAddress = {
      address1: address1,
    };

    return resAddress;
  };

  return {
    initAutoComplete,
    getFullAddress,
  };
};

export default useGooglePlaceAutoComplete;
