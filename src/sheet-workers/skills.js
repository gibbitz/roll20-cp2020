
var stats = data.stats;
var pickupSkills = data.skills;
var specialAbilities = data.specialAbilities;
var skills = pickupSkills.concat(specialAbilities);
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
          attrsToFetch.push(`${attrName}_level`)
          attrsToFetch.push(`${attrName}_ip`)
        }
      });

      getAttrs(attrsToFetch, function(skillAttrs) {
        var attrsToSet = {};
        skills.forEach(function(skill) {
          if(skill.skillName) {
            var skillAttrName = `Skill_${nameToAttrName(skill.skillName)}`;
            var skillLevel = skillAttrs[`${skillAttrName}_level`]
            var skillIp = skillAttrs[`${skillAttrName}_ip`]
            if( skillIp && skillLevel) {
              var level = makeInt(skillLevel);
              var ip = makeInt(skillIp);
              var ipx = makeInt(skill.ipMultiplier, 1);
              var stat = makeInt(stats[skill.baseAttribute]);
              stat = isNaN(stat) ? 0 : stat;
              attrsToSet[`${skillAttrName}_next_level`] = ((level + 1) * ipx * 10) - ip;
              attrsToSet[`${skillAttrName}_roll_total`] = level + stat;
              console.log(`total: ${level}(level) + ${stat}(${skill.baseAttribute})`);
            }
          }
        });
        // TODO: Not all skills are showing -- need to cover compound skills
        setAttrs(attrsToSet)
      });
    });
  });
})
