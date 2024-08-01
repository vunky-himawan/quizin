/**
 * @function decode
 * @description Mengkodekan string ke string biasa.
 * @param {string} str - String yang akan dikodekan.
 * @returns {string} - String yang dikodekan.
 */
export const decode = (str: string) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};
