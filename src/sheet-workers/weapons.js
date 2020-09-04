
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

on("sheet:opened", eventInfo => {
  getSectionIDs("repeating_weapons", ids => {
    const attrsToGet = ids.map(id => `repeating_weapons_${id}_weapon_type`);
    getAttrs(attrsToGet, values => {
      const skillsToGetLevels = [];
      const skillsToGetStats = Object.keys(values).map(key => {
        skillsToGetLevels.push(`Skill_${values[key]}_level`);
        return values[key];
      });
      const statNames = getStatsBySkill(skillsToGetStats);
      getAttrs(skillsToGetLevels, (skillLevels) => {
        const weaponSkillsToSet = {};
        ids.forEach((id, index) => {
          const rowBase = `repeating_weapons_${id}_weapon`;
          weaponSkillsToSet[`${rowBase}_skill_level`] = skillLevels[Object.keys(skillLevels)[index]]
          weaponSkillsToSet[`${rowBase}_weapon_stat`] = statNames[Object.keys(statNames)[index]]
        });
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', weaponSkillsToSet);
        setAttrs(weaponSkillsToSet);
      });
    });
  });
});
