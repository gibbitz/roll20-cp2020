
function getStatsBySkill(skills) {
  const skillSet = data.skills.filter(
    skillData => skills.indexOf(skillData.skillName) > -1
  );
  const output = {}
  skillSet.forEach(skillData => {
    output[skillData.skillName] = skillData.baseAttribute
  });
  return output;
}

function updateWeapons() {
  const WEAPON_REPEATER = 'repeating_weapons'
  const WEAPON = '_weapon';
  const getWeaponValue = (id, key='') =>
    `${WEAPON_REPEATER}_${id}${key ? WEAPON + '_' + key : ''}`;
  getSectionIDs(WEAPON_REPEATER, ids => {
    const attrsToGet  = []
    ids.forEach(id => {
      attrsToGet.push(getWeaponValue(id, 'type'))
      attrsToGet.push(getWeaponValue(id, 'rof'))
      attrsToGet.push(getWeaponValue(id, 'blast_radius'))
    });
    getAttrs(attrsToGet, values => {
      const skillsToGetLevels = [];
      const skillsToGetStats = Object.keys(values).map(key => {
        if(key.indexOf(`${WEAPON}_type`) > -1){
          skillsToGetLevels.push(`Skill_${values[key]}_level`);
          return values[key];
        }
      });
      const statNames = getStatsBySkill(skillsToGetStats);
      updateStats((statValues) => {
        getAttrs(skillsToGetLevels, (skillLevels) => {
          const attrsToSet = {};
          ids.forEach((id, index) => {
            const type = values[getWeaponValue(id, 'type')]
            const rof = values[getWeaponValue(id, 'rof')]
            const blastRadius = values[getWeaponValue(id, 'blast_radius')]
            const statName = statNames[Object.keys(statNames)[index]]
            attrsToSet[getWeaponValue(id, 'is_melee')] = type === 'Melee' ? 1 : 0;
            attrsToSet[getWeaponValue(id, 'is_ranged')] = [
              'Handgun',
              'Rifle',
              'Submachinegun',
              'Heavy',
              'Bow'
            ].indexOf(type) > -1 ? 1 : 0;
            attrsToSet[getWeaponValue(id, 'is_full_auto')] = parseInt(rof.split('|').pop(), 10) > 2 ? 1 : 0;
            attrsToSet[getWeaponValue(id, 'is_explosive')] = !!blastRadius ? 1 : 0;

            attrsToSet[getWeaponValue(id, 'skill_level')] = skillLevels[Object.keys(skillLevels)[index]]
            attrsToSet[getWeaponValue(id, 'stat')] = statName
            attrsToSet[getWeaponValue(id, 'stat_level')] = statValues[statName]
          });
          // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', attrsToSet);
          setAttrs(attrsToSet);
        });
      });
    });
  });
}

on('change:repeating_weapons:weapon_type', function(eventInfo) {
  const skillAttrName = `Skill_${eventInfo.newValue}`
  const attrsToGet = [
    `${skillAttrName}_name`,
    `${skillAttrName}_level`
  ];

  getAttrs(attrsToGet, attrs => {
    const attrsToSet = {};
    const baseAttrName = eventInfo.triggerName.replace('_weapon_type', '')
    attrsToSet[`${baseAttrName}_weapon_skill`] = eventInfo.newValue;
    attrsToSet[`${baseAttrName}_weapon_skill_level`] = attrs[`${skillAttrName}_level`];
    attrsToSet[`${baseAttrName}_weapon_stat`] = getStatsBySkill([eventInfo.newValue])[eventInfo.newValue];
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', eventInfo, attrsToSet);
    setAttrs(attrsToSet);
  })
});

on("sheet:opened change:repeating_weapons", updateWeapons);
