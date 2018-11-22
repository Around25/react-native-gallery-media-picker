/**
   * @param array
   * @param property
   * @param nestedProperty
   * @param value
   */
export const existsInArray = (array, property, nestedProperty, value) => {
    return array.map( (object) => {
      return object[property][nestedProperty];
    } ).indexOf(value);
  }