function camelToDash(str) {
  return str.replace(/([A-Z])/g, (m) => `-${m[0].toLowerCase()}`);
}

function dashToCamel(str) {
  return str.replace(/-([a-zA-Z])/g, (m) => `${m[1].toUpperCase()}`);
}

function updateTextNode(element, text) {
  while (element.firstChild) element.removeChild(element.firstChild);
  element.appendChild(document.createTextNode(text));
}

function humanReadableNumber(num) {
  num += '';
  let index = -1;
  let result = '';
  while (++index < num.length) {
    result =  ((((index%3) === 2) && (index + 1) !== num.length) ? ',' : '')
      + (num[num.length - index - 1]) + result;
  }
  return result;
}
