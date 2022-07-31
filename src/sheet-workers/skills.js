const {
  stats,
  skills: pickupSkills,
  specialAbilities,
  compoundSkills
} = data;
const skills = [...pickupSkills, ...specialAbilities, ...compoundSkills];
const potentialCompoundSkills = [...compoundSkills, ...specialAbilities];

const prepareSkillEvents = () => {
  const calcSkillEventList = [
    'change:Wound_Level', // TODO: change case?
    'change:Stun_Level', // TODO: change case?
    'change:role',
    'sheet:opened'
  ];
  const statKeys = Object.keys(stats) || [];

  statKeys.forEach((stat) => {
    calcSkillEventList.push(`change:${stat}_Base`);
    calcSkillEventList.push(`change:${stat}_Mod`);
  });

  potentialCompoundSkills.forEach((skill) => {
    const skillAttrName = `Skill_${nameToAttrName(skill.skillName)}`;
    calcSkillEventList.push(`change:${skillAttrName}_name`);
  });

  skills.forEach((skill) => {
    const skillAttrName = `Skill_${nameToAttrName(skill.skillName)}`;
    calcSkillEventList.push(`change:${skillAttrName}_level`);
    calcSkillEventList.push(`change:${skillAttrName}_ip`);
  });

  return calcSkillEventList.join(' ').toLowerCase();
}

const prepareSkillAttributes = () => {
  const attrNames = [];
  skills.forEach((skill) => {
    if (skill.skillName) {
      const attrName = `Skill_${nameToAttrName(skill.skillName)}`;
      attrNames.push(`${attrName}_level`);
      attrNames.push(`${attrName}_ip`);
      attrNames.push(`${attrName}_name`);
    }
  });
  return attrNames
};

const buildMaTable = (skill) => (skill.martialArtBonuses
  ? Object.keys(skill.martialArtBonuses)
    .reduce(
      (moves, moveName) => (
        `${moves}|${moveName},${skill.martialArtBonuses[moveName]}`
      ),
      'none,0'
    )
  : '');

const resolveSkill = (skill, skillAttrs) => {
  const subSkillName = skillAttrs[`Skill_${nameToAttrName(skill.skillName)}_name`]
  return subSkillName ? skills.filter((subSkill) => {
    return subSkill.skillName === subSkillName;
  })[0] : skill;

}

const calculateAttributes = (skillAttrs, characterStats) => {
  const attrsToSet = {};
  skills.forEach((skill) => {
    if (skill.skillName) {
      const currentSkill = resolveSkill(skill, skillAttrs)
      if (currentSkill && currentSkill.ipMultiplier) {
        const { ipMultiplier, baseAttribute } = currentSkill;
        const skillAttrName = `Skill_${nameToAttrName(skill.skillName)}`;
        const skillLevel = skillAttrs[`${skillAttrName}_level`]
        const skillIp = skillAttrs[`${skillAttrName}_ip`]
        if (skillIp && skillLevel) {
          const level = makeInt(skillLevel);
          const ip = makeInt(skillIp);
          const ipx = makeInt(ipMultiplier) || 1;
          const stat = makeInt(characterStats[baseAttribute]) || 0;
          attrsToSet[`${skillAttrName}_stat`] = baseAttribute;
          attrsToSet[`${skillAttrName}_ma_roll_table`] = buildMaTable(skill);
          attrsToSet[`${skillAttrName}_next_level`] = ((level + 1) * ipx * 10) - ip;
          attrsToSet[`${skillAttrName}_roll_total`] = level + stat;
        }
      }
    }
  });
  console.log('%%%%%%%%%%%%%% ', attrsToSet)
  return attrsToSet;
}

on(prepareSkillEvents(), () => {
  updateStats((statsAttrs) => {
    getAttrs(prepareSkillAttributes(), (skillAttrs) => {
      setAttrs(calculateAttributes(skillAttrs, statsAttrs), null, () => updateWeapons());
    });
  });
})
