function nameToSelector(name) {
  return name
    .replace(/\s|\/|\(|\)/g, '-')
    .replace('.', '')
    .replace('&', 'and')
    .toLowerCase();
}

function nameToAttrName(name) {
  return nameToSelector(name)
    .replace(/\-/g, '_');
}

function makeInt(number, fallback) {
  return parseInt(number, 10) || (fallback || 0);
}

/**
 * Updates the character stats to update the display
 */
function updateStats(callback) {
  var statKeys = Object.keys(data.stats);
  var statAttrs = [];
  statKeys.forEach(function(statKey) {
    statAttrs = statAttrs.concat([`${statKey}_Base`, `${statKey}_Mod`]);
  });
  var fetchAttrs = statAttrs.concat(['Wound_Level', 'Stun_Level']);
  getAttrs(fetchAttrs, function(attrs) {
    var updatedStatAttrs = {};

    var damageIndex = Math.floor(Math.max(attrs.Wound_Level, attrs.Stun_Level));
    var isSerious = damageIndex === 1;
    var isCritical = damageIndex === 2;
    var isMortal = damageIndex >= 3;

    var woundDivisor = isCritical ? 2 : isMortal ? 3 : 1;
    var woundRefMod = isSerious ? 2 : 0;

    statKeys.forEach(function(stat) {
      var defaultAttrValue = makeInt(attrs[`${stat}_Base`])
        + makeInt(attrs[`${stat}_Mod`]);
      if (['INT', 'REF', 'CL'].indexOf(stat) > -1 && damageIndex) {
        if(stat === 'REF') {
          updatedStatAttrs[stat] = Math.round((defaultAttrValue - woundRefMod)/woundDivisor);
          updatedStatAttrs[`${stat}_Damage_Mod`] = updatedStatAttrs[stat] - defaultAttrValue;
        } else {
          updatedStatAttrs[stat] = Math.round(defaultAttrValue/woundDivisor);
          updatedStatAttrs[`${stat}_Damage_Mod`] = updatedStatAttrs[stat] - defaultAttrValue;
        }
      } else {
        updatedStatAttrs[stat] = defaultAttrValue;
        updatedStatAttrs[`${stat}_Damage_Mod`] = '';
      }
    });
    console.log('>>>>', updatedStatAttrs);
    setAttrs(updatedStatAttrs, callback);
  });
}

/**
 * Convenience util to fetch all Character Stats/Attributes
 */
function getStats(callback) {
  updateStats();
  var statKeys = Object.keys(data.stats);
  var outputStats = {};
  getAttrs(statKeys, function(stats) {
    callback(stats);
  });
}
