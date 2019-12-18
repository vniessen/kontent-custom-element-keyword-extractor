/*global CustomElement*/

export function getElementValue(elementCodename) {
  return new Promise((resolve, reject) => {
    try {
      CustomElement.getElementValue(elementCodename, value => {
        resolve(value);
      });
    } catch (error) {
      reject(error);
    }
  });
}
