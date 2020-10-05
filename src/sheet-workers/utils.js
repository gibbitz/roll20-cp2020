const nameToSelector = (name) => name
  .replace(/\s|\/|\(|\)/g, '-')
  .replace(/\.|:/, '')
  .replace('&', 'and')
  .toLowerCase();

const nameToAttrName = (name) => nameToSelector(name).replace(/-/g, '_');

const makeInt = (number, fallback = 0) => parseInt(number, 10) || fallback;
