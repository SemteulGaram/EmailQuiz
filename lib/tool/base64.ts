export function decode (b64: string): string {
  return (Buffer.from(b64, 'base64')).toString();
  /* browser options
  return decodeURIComponent(Array.prototype.map.call(atob(b64), (c: string) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  */
}

export function encode (str: string): string {
  return (Buffer.from(str)).toString('base64');
  /* browser options
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  }));
  */
}
