const getStatsBySkill = (skills) => {
  const skillSet = data.skills.filter(
    skillData => skills.indexOf(skillData.skillName) > -1
  );
  const output = {}
  skillSet.forEach(skillData => {
    output[skillData.skillName] = skillData.baseAttribute
  });
  return output;
}

const updateWeapons = () => {
  const WEAPON_REPEATER = 'repeating_weapons'
  const WEAPON = 'weapon';
  const getWeaponValue = (id, key = '') => (
    `${WEAPON_REPEATER}_${id}${key ? (`_${WEAPON}_${key}`) : ''}`
  );
  const prepWeaponAttrsToFetch = (ids) => {
    const weaponAttrsToFetch = [];
    ids.forEach(id => {
      weaponAttrsToFetch.push(getWeaponValue(id, 'type'));
      weaponAttrsToFetch.push(getWeaponValue(id, 'rof'));
      weaponAttrsToFetch.push(getWeaponValue(id, 'blast_radius'));
    });
    return weaponAttrsToFetch;
  };
  const prepSkillAndStatAttrsToFetch = (weaponValues) => {
    const skillAttrsToFetch = [];
    Object.keys(weaponValues).forEach(key => {
      const weaponSkillName = `Skill_${weaponValues[key]}_level`
      if (key.indexOf(`${WEAPON}_type`) > -1 && !skillAttrsToFetch[weaponSkillName]) {
        skillAttrsToFetch.push(weaponSkillName);
      }
    });
    return skillAttrsToFetch;
  };
  const prepAttrToSet = ({
    ids,
    skillLevels,
    statValues,
    weaponValues
  }) => {
    console.log('____', skillLevels);
    let attrsToSet = {};
    ids.forEach((id) => {
      const type = weaponValues[getWeaponValue(id, 'type')];
      const rof = weaponValues[getWeaponValue(id, 'rof')];
      const blastRadius = weaponValues[getWeaponValue(id, 'blast_radius')];
      // const statName = statNames[Object.keys(statNames)[index]];
      const statName = getStatsBySkill([type])[type]
      const isRanged = [
        'Handgun',
        'Rifle',
        'Submachinegun',
        'Heavy',
        'Bow'
      ].indexOf(type) > -1 ? 1 : 0;
      attrsToSet = {
        ...attrsToSet,
        [getWeaponValue(id, 'is_melee')]: type === 'Melee' ? 1 : 0,
        [getWeaponValue(id, 'is_ranged')]: isRanged,
        [getWeaponValue(id, 'is_full_auto')]: parseInt(rof.split('|').pop(), 10) > 2 ? 1 : 0,
        [getWeaponValue(id, 'is_explosive')]: !!blastRadius ? 1 : 0,
        [getWeaponValue(id, 'skill_level')]: makeInt(skillLevels[`Skill_${type}_level`]),
        [getWeaponValue(id, 'stat')]: statName,
        [getWeaponValue(id, 'stat_level')]: statValues[statName]
      };
    });
    console.table('____///', attrsToSet);
    return attrsToSet;
  };
  getSectionIDs(WEAPON_REPEATER, ids => {
    getAttrs(prepWeaponAttrsToFetch(ids), weaponValues => {
      updateStats((statValues) => {
        getAttrs(
          prepSkillAndStatAttrsToFetch(weaponValues),
          (skillLevels) => {
            setAttrs(prepAttrToSet({
              ids,
              skillLevels,
              statValues,
              weaponValues
            }));
          }
        );
      });
    });
  });
};

// on('change:repeating_weapons:weapon_type', (eventInfo) => {
//   const skillAttrName = `Skill_${eventInfo.newValue}`;
//   const attrsToGet = [
//     `${skillAttrName}_name`,
//     `${skillAttrName}_level`
//   ];

//   getAttrs(attrsToGet, attrs => {
//     const baseAttrName = eventInfo.triggerName.replace('_weapon_type', '');
//     const attrsToSet = {
//       [`${baseAttrName}_weapon_skill`]: eventInfo.newValue,
//       [`${baseAttrName}_weapon_skill_level`]: attrs[`${skillAttrName}_level`],
//       [`${baseAttrName}_weapon_stat`]: getStatsBySkill([eventInfo.newValue])[eventInfo.newValue]
//     };
//     // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', eventInfo, attrsToSet);
//     setAttrs(attrsToSet);
//   })
// });

on('sheet:opened change:repeating_weapons', updateWeapons);
