const REPEATING_CYBERWARE = 'repeating_augmentation';
const humanityStats = [
  'EMP_Base',
  'HL',
  'HUM'
];
const getHumanityStats = (callback) => {
  const humanityStatsToGet = [...humanityStats];
  getSectionIDs(REPEATING_CYBERWARE, (ids) => {
    ids.forEach((id) => {
      humanityStatsToGet.push(`${REPEATING_CYBERWARE}_${id}_aug_hl`);
    });
    getAttrs(humanityStatsToGet, (attrs) => {
      callback(attrs)
    });
  });
};

const updateHumanityStats = ({ sourceAttribute, newValue }) => (attrs) => {
  let HL = 0;
  Object.keys(attrs).forEach((attrName) => {
    if ([...humanityStats, sourceAttribute].indexOf(attrName) === -1) {
      console.log('MOD____>>>>', sourceAttribute, ': ', newValue, ' ', attrName, ': ', attrs[attrName])
      HL += parseInt(attrs[attrName], 10);
    }
  });
  HL += parseInt(newValue, 10) || 0;
  const HUM = (attrs.EMP_Base * 10) - HL
  const EMP = Math.ceil(HUM / 10);

  console.log('-> -> ->', { HUM, HL, EMP });
  setAttrs({ HUM, HL, EMP });
};

const updateHumanity = (eventInfo) => {
  getHumanityStats(updateHumanityStats(eventInfo));
};

on(`sheet:opened change:${REPEATING_CYBERWARE}`, updateHumanity);
