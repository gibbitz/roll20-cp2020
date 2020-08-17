
debugger
var damageLevels = data.woundLevels;
changeEvents = ['change:Damage_Indicator', 'sheet:opened'].join(' ').toLowerCase();
function makeFloatOrZero(string) {
  return string ? parseFloat(string) : 0;
}
function makeIntOrZero(string) {
  return string ? parseInt(string, 10) : 0;
}
on(changeEvents, function(eventInfo) {
  getAttrs(['Wound_Level', 'Stun_Level', 'Damage_Indicator', 'BODY_Mod', 'BODY_Base'], function(attrs) {

    console.log(eventInfo)
    var damageIndAttr = makeFloatOrZero(
      eventInfo.newValue === '0'
        ? eventInfo.previousValue
        : eventInfo.newValue
    );

    var woundLevelAttr = makeFloatOrZero(attrs.Wound_Level);
    //- var damageIndAttr = makeFloatOrZero(attrs.Damage_Indicator);
    var stunLevelAttr = makeFloatOrZero(attrs.Stun_Level);
    var stunIndAttr = makeFloatOrZero(attrs.Stun_Indicator);
    var bodyAttr = makeIntOrZero(attrs.BODY_Mod + attrs.BODY_Base);
    var stunValue = stunLevelAttr;
    var woundValue = woundLevelAttr;

    if (damageIndAttr <= woundLevelAttr) {
      stunValue = woundValue = damageIndAttr;
    } else if (damageIndAttr > woundLevelAttr && damageIndAttr <= stunLevelAttr) {
      woundValue = damageIndAttr;
    } else if (damageIndAttr <= stunLevelAttr || damageIndAttr > stunLevelAttr) {
      stunValue = damageIndAttr;
    }
    var damageIndex = Math.max(stunValue, woundValue);
    var isSerious = damageIndex === 1;
    var isCritical = damageIndex === 2;
    var isMortal = damageIndex >= 3;
    var stunIndex = Math.floor(stunValue);
    var woundIndex = Math.floor(woundValue);
    var status = damageLevels[woundIndex]
    var mortalIndex = status.indexOf('MORTAL ') >=0
      ? parseInt(status.replace('MORTAL ', ''), 10)
      : 0;


    console.log({
      Stun_Level: stunValue,
      Wound_Level: woundValue,
      Stun_Save: `${bodyAttr} - ${stunIndex}`,
      Death_Save: `${bodyAttr} - ${mortalIndex}`,
      Wound_Divisor: isCritical ? 2 : isMortal ? 3 : 1,
      Wound_Ref_Mod: isSerious ? 2 : 0
    })
    setAttrs({
      Stun_Level: stunValue,
      Wound_Level: woundValue,
      Stun_Save: bodyAttr - stunIndex,
      Death_Save: bodyAttr - mortalIndex,
      Wound_Divisor: isCritical ? 2 : isMortal ? 3 : 1,
      Wound_Ref_Mod: isSerious ? 2 : 0
    })
  })
})
