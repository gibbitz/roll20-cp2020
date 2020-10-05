/**
 * Updates the character stats to update the display
 */
const updateStats = (callback) => {
  const { stats } = data;
  const statKeys = Object.keys(stats);
  const getExistngStats = (callback) => {
    let fetchAttrs = ['Wound_Level', 'Stun_Level', 'HL'];
    statKeys.forEach((statKey) => {
      fetchAttrs = [...fetchAttrs, `${statKey}_Base`, `${statKey}_Mod`];
    });
    getAttrs(fetchAttrs, callback);
  }

  const calculateDefaultStat = ({
    stat,
    defaultAttrValue,
    damageIndex,
    woundDivisor,
    woundRefMod
  }) => {
    const outputAttrs = {};
    if (['INT', 'REF', 'CL'].indexOf(stat) > -1 && damageIndex) {
      if (stat === 'REF') {
        outputAttrs[stat] = Math.round((defaultAttrValue - woundRefMod) / woundDivisor);
        outputAttrs[`${stat}_Damage_Mod`] = outputAttrs[stat] - defaultAttrValue;
      } else {
        outputAttrs[stat] = Math.round(defaultAttrValue / woundDivisor);
        outputAttrs[`${stat}_Damage_Mod`] = outputAttrs[stat] - defaultAttrValue;
      }
    } else {
      outputAttrs[stat] = defaultAttrValue;
      if (['INT', 'REF', 'CL'].indexOf(stat) > -1) {
        outputAttrs[`${stat}_Damage_Mod`] = '';
      }
    }
    return outputAttrs;
  }

  const calculateBodyStats = (defaultAttrValue) => {
    const { bodyTypes } = data
    const outputAttrs = {};
    outputAttrs.Lift = defaultAttrValue * 40;
    outputAttrs.Carry = defaultAttrValue * 10;
    const bodyTypeNames = Object.keys(bodyTypes);
    const bodyType = bodyTypeNames.filter(
      type => (
        bodyTypes[type].body.indexOf(defaultAttrValue) > -1
      )
    );
    outputAttrs.Damage_Bonus = bodyTypes[bodyType]
      ? bodyTypes[bodyType].damageModifier
      : 0;
    outputAttrs.BTM = bodyTypes[bodyType]
      ? bodyTypes[bodyType].btm
      : 0;
  }

  const calculateStats = ({
    attrs,
    damageIndex,
    woundDivisor,
    woundRefMod
  }) => {
    let updatedStatAttrs = {};
    statKeys.forEach((stat) => {
      const defaultAttrValue = makeInt(attrs[`${stat}_Base`])
        + makeInt(attrs[`${stat}_Mod`]);

      updatedStatAttrs = {
        ...updatedStatAttrs,
        ...calculateDefaultStat({
          stat,
          attrs,
          defaultAttrValue,
          damageIndex,
          woundDivisor,
          woundRefMod
        })
      };

      if (stat === 'BODY') {
        updatedStatAttrs = { ...updatedStatAttrs, ...calculateBodyStats(stat, attrs) };
      }
      if (stat === 'MA') {
        updatedStatAttrs.Run = defaultAttrValue * 3;
        updatedStatAttrs.Leap = Math.round(updatedStatAttrs.Run / 4);
      }
      if (stat === 'EMP') {
        const empValue = defaultAttrValue - Math.floor((attrs.HL || 1) / 10);
        updatedStatAttrs.Hum = empValue * 10;
        updatedStatAttrs[stat] = empValue;
      }
    });
    return updatedStatAttrs;
  };

  getExistngStats((attrs) => {
    // const damageIndex = Math.floor(Math.max(attrs.Wound_Level, attrs.Stun_Level));
    // const Serious = damageIndex === 1 ? 2 : 0;
    // const Critical = damageIndex === 2 ? damageIndex : 1;
    // const Mortal = damageIndex >= 3 ? damageIndex : Critical;
    // const statParams = {
    //   attrs,
    //   damageIndex,
    //   woundDivisor: Mortal || Critical,
    //   woundRefMod: Serious
    // };

    /* eslint-disable-next-line camelcase */
    const { Wound_Level, Stun_Level } = attrs;
    const {
      damageIndex,
      Wound_Divisor: woundDivisor,
      Wound_Ref_Mod: woundRefMod
    } = calculateHealthStatus({ Wound_Level, Stun_Level });
    const attrsToSet = calculateStats({
      attrs,
      damageIndex,
      woundDivisor,
      woundRefMod
    });
    setAttrs(attrsToSet, {}, () => callback(attrsToSet));
  });
}

/**
 * Convenience util to fetch all Character Stats/Attributes
 */
const getStats = (callback) => {
  updateStats((updatedStats) => {
    callback(updatedStats);
  });
}
