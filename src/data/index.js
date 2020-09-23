const skills = require('./skills.json')
const specialAbilities = require('./special-abilities.json')
const compoundSkills = require('./compound-skills.json')
const roles = require('./roles.json')
const fumbles = require('./fumbles.json')
const hitLocations = require('./hit-locations.json')
const bodyTypes = require('./body-types.json')

const stats = {
  INT: 'intelligence',
  REF: 'reflexes',
  TECH: 'technical aptitude',
  CL: 'cool',
  ATT: 'attractiveness',
  LUCK: 'luck',
  MA: 'movement allowance',
  BODY: 'body type',
  EMP: 'empathy'
}

const woundLevels = [
  'LIGHT',
  'SERIOUS',
  'CRITICAL',
  'MORTAL 0',
  'MORTAL 1',
  'MORTAL 2',
  'MORTAL 3',
  'MORTAL 4',
  'MORTAL 5',
  'MORTAL 6'
]

const deckTypes = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Portable', label: 'Portable' },
  { value: 'Portable Cellular', label: 'Portable Cellular' },
  { value: 'Cyberlimb Deck', label: 'Cyberlimb Deck' },
  { value: 'Combat Deck', label: 'Combat Deck' },
  { value: 'Cellular', label: 'Cellular' },
  { value: 'Cellular Cyberlimb Deck', label: 'Cellular Cyberlimb Deck' },
  { value: 'Cellular Combat Deck', label: 'Cellular Combat Deck' }
]

const iceClasses = [
  { value: 'Intrusion', label: 'Intrusion' },
  { value: 'Decryption', label: 'Decryption' },
  { value: 'Detection/Alarm', label: 'Detection/Alarm' },
  { value: 'Anti-system', label: 'Anti-system' },
  { value: 'Evasion/Stealth', label: 'Evasion/Stealth' },
  { value: 'Protection', label: 'Protection' },
  { value: 'Anti-IC', label: 'Anti-IC' },
  { value: 'Anti-Personel', label: 'Anti-Personel' },
  { value: 'Controllers', label: 'Controllers' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Demon', label: 'Demon' },
]

const weaponTypes = [
  { value: 'Archery', label: 'Bow' },
  { value: 'Heavy Weapons', label: 'Heavy Weapons' },
  { value: 'Melee', label: 'Melee' },
  { value: 'Handgun', label: 'Pistol' },
  { value: 'Rifle', label: 'Rifle' },
  { value: 'Submachinegun', label: 'Submachinegun' }
]

const weaponConcealabilities = [
  { value: 'Not concealable', label: 'Not concealable' },
  { value: 'Long Coat', label: 'Long Coat' },
  { value: 'Pocket', label: 'Pocket' },
  { value: 'Jacket', label: 'Jacket' }
]

const weaponReliabilities = [
  { value: 'standard', label: 'standard' },
  { value: 'very reliable', label: 'very reliable' },
  { value: 'unreliable', label: 'unreliable' }
]

const genders = [
  {value:'m', label:'Male'},
  {value:'f', label:'Female'},
  {value:'mf', label:'Male presenting Female'},
  {value:'fm', label:'Female presenting Male'},
  {value:'a', label:'Androgynous'}
]

const siblingAge = [
  {value:'younger', label:'Younger'},
  {value:'older', label:'Older'},
  {value:'twin', label:'Twin'}
]

module.exports = {
  data: {
    bodyTypes,
    compoundSkills,
    fumbles,
    genders,
    hitLocations,
    roles,
    siblingAge,
    skills,
    specialAbilities,
    stats,
    weaponConcealabilities,
    weaponReliabilities,
    weaponTypes,
    woundLevels,
    deckTypes,
    iceClasses
  }
}
