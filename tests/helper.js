module.exports = {
  toHex: (values = [], groupSize = 8) => {
    const bytes = values.map(v => v.toString(16).padStart(2, '0').slice(-2));
    if (groupSize) {
      for (let idx = Math.floor(bytes.length / groupSize); idx >= 0; idx--) {
        bytes.splice((idx + 1) * groupSize, 0, '');
      }
    }
    return bytes.join(' ');
  },

  fromHex: (hex = '') => {
    return hex.replace(/[^0-9a-f]/ig, ' ').split(/\s/)
      .filter(v => v).map(hex => parseInt(hex, 16));
  }
};
