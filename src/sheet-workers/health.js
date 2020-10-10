const { woundLevels: damageStatuses } = data;

const changeEvents = [
  'change:Damage_Indicator',
  'change:BODY_Mod',
  'change:BODY_Base',
  'sheet:opened'
].join(' ').toLowerCase();

const makeFloatOrZero = (string) => (string ? parseFloat(string) : 0);
const makeIntOrZero = (string) => (string ? parseInt(string, 10) : 0);

const getHealthAttributes = (callback) => {
  const healthAttrs = [
    'BODY_Base',
    'BODY_Mod',
    'Damage_Indicator',
    'Stun_Level',
    'Wound_Level'
  ];
  getAttrs(healthAttrs, callback)
};

/* eslint-disable camelcase */
const calculateDamageIndexAttrs = ({ damageIndAttr, Wound_Level, Stun_Level }) => {
  let stunValue = makeFloatOrZero(Stun_Level);
  let woundValue = makeFloatOrZero(Wound_Level);

  if (damageIndAttr <= woundValue) {
    stunValue = damageIndAttr;
    woundValue = damageIndAttr;
  } else if (damageIndAttr > woundValue && damageIndAttr <= stunValue) {
    woundValue = damageIndAttr;
  } else if (damageIndAttr <= stunValue || damageIndAttr > stunValue) {
    stunValue = damageIndAttr;
  }
  return { stunValue, woundValue };
};

const calculateHealthStatus = ({ damageIndAttr, Wound_Level = 0, Stun_Level = 0 }) => {
  const damageIndex = Math.floor(Math.max(
    makeFloatOrZero(Wound_Level),
    makeFloatOrZero(Stun_Level)
  ));
  const Serious = 1;
  const Critical = 2;
  const Mortal = 3;
  const isSerious = damageIndex === Serious;
  const isCritical = damageIndex === Critical;
  const isMortal = damageIndex >= Mortal;
  let divisor = isCritical ? 2 : 1;
  divisor = isMortal ? 3 : divisor;
  const refMod = isSerious ? 2 : 0;
  const status = damageStatuses[Math.floor(damageIndAttr || damageIndex)];
  const mortalIndex = isMortal
    ? parseInt(status.replace('MORTAL ', ''), 10)
    : 0;
  return {
    damageIndex,
    isCritical,
    isMortal,
    isSerious,
    mortalIndex,
    status,
    Wound_Divisor: divisor,
    Wound_Ref_Mod: refMod
  }
}

const calculateDamage = ({ damageIndAttr, Wound_Level, Stun_Level }) => {
  const {
    stunValue,
    woundValue
  } = calculateDamageIndexAttrs({ damageIndAttr, Wound_Level, Stun_Level });
  const {
    isCritical,
    isMortal,
    isSerious,
    mortalIndex,
    Wound_Divisor,
    Wound_Ref_Mod
  } = calculateHealthStatus({ damageIndAttr, Wound_Level: woundValue, Stun_Level: stunValue });
  const stunIndex = Math.floor(stunValue);
  const woundIndex = Math.floor(woundValue);

  return {
    stunValue,
    woundValue,
    stunIndex,
    woundIndex,
    mortalIndex,
    isCritical,
    isMortal,
    isSerious,
    Wound_Divisor,
    Wound_Ref_Mod
  };
}

on(changeEvents, (eventInfo) => {
  const { sourceAttribute } = eventInfo
  const damageIndAttr = sourceAttribute === 'damage_indicator'
    ? makeFloatOrZero(
      eventInfo.newValue === '0'
        ? eventInfo.previousValue
        : eventInfo.newValue
    )
    : undefined;
  getHealthAttributes((attrs) => {
    const {
      BODY_Mod,
      BODY_Base,
      Wound_Level,
      Stun_Level
    } = attrs
    const bodyAttr = makeIntOrZero(BODY_Mod + BODY_Base);
    const {
      stunValue,
      woundValue,
      stunIndex,
      mortalIndex,
      Wound_Divisor,
      Wound_Ref_Mod
    } = calculateDamage({ damageIndAttr, Wound_Level, Stun_Level });

    setAttrs({
      Stun_Level: stunValue,
      Wound_Level: woundValue,
      Stun_Save: bodyAttr - stunIndex,
      Death_Save: bodyAttr - mortalIndex,
      Wound_Divisor,
      Wound_Ref_Mod
    })
  })
})

on('clicked:clearDamage', () => {
  setAttrs({ Damage_Indicator: 0 }, null);
})
