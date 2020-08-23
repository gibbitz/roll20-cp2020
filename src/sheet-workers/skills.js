
var stats = data.stats;
var pickupSkills = data.skills;
var specialAbilities = data.specialAbilities;
var compoundSkills = data.compoundSkills;
var skills = pickupSkills.concat(specialAbilities, compoundSkills);
var potentialCompoundSkills = compoundSkills.concat(specialAbilities);
var calcSkillEvents = [
  'change:Wound_Level',
  'change:Stun_Level',
  'sheet:opened'
];
var statKeys = Object.keys(stats) || [];

statKeys.forEach(function(stat) {
  calcSkillEvents.push(`change:${stat}_Base`);
  calcSkillEvents.push(`change:${stat}_Mod`);
});

potentialCompoundSkills.forEach(function(skill) {
  var skillAttrName = `Skill_${window.nameToAttrName(skill.skillName)}`;
  calcSkillEvents.push(`change:${skillAttrName}_name`);
});

skills.forEach(function(skill) {
  var skillAttrName = `Skill_${window.nameToAttrName(skill.skillName)}`;
  calcSkillEvents.push(`change:${skillAttrName}_level`);
  calcSkillEvents.push(`change:${skillAttrName}_ip`);
});

calcSkillEvents = calcSkillEvents.join(' ').toLowerCase();

on(calcSkillEvents, function(eventInfo) {
  updateStats(function() {
    getStats(function(stats) {
      var attrsToFetch = [];
      skills.forEach(function(skill) {
        if(skill.skillName){
          var attrName = `Skill_${nameToAttrName(skill.skillName)}`;
          attrsToFetch.push(`${attrName}_level`);
          attrsToFetch.push(`${attrName}_ip`);
          attrsToFetch.push(`${attrName}_name`)
        }
      });
      getAttrs(attrsToFetch, function(skillAttrs) {
        var attrsToSet = {};
        skills.forEach(function(skill, index) {
          if(skill.skillName) {
            var subSkillName = skillAttrs[`Skill_${nameToAttrName(skill.skillName)}_name`]
            var subSkill = subSkillName ? skills.filter(function(subSkill) {
              return subSkill.skillName === subSkillName;
            })[0] : {}
            var skillAttrName = `Skill_${nameToAttrName(skill.skillName)}`;
            var skillLevel = skillAttrs[`${skillAttrName}_level`]
            var skillIp = skillAttrs[`${skillAttrName}_ip`]
            if( skillIp && skillLevel) {
              var level = makeInt(skillLevel);
              var ip = makeInt(skillIp);
              var ipx = makeInt(
                (subSkill ? subSkill.ipMultiplier : skill.ipMultiplier),
                1
              );
              var stat = makeInt(
                Object.keys(subSkill).length > 0
                  ? stats[subSkill.baseAttribute]
                  : stats[skill.baseAttribute]
              );
              if (!isNaN(stat)) console.log(skill.skillName, stat, skill.baseAttribute)
              stat = isNaN(stat) ? 0 : stat;
              attrsToSet[`${skillAttrName}_next_level`] = ((level + 1) * ipx * 10) - ip;
              attrsToSet[`${skillAttrName}_roll_total`] = level + stat;
            }
          }
        });
        // TODO: Not all skills are showing -- need to cover compound skills
        setAttrs(attrsToSet)
      });
    });
  });
})
