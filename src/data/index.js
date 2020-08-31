const skills = require('./skills.json')
const specialAbilities = require('./special-abilities.json')
const compoundSkills = require('./compound-skills.json')
const roles = require('./roles.json')
const fumbles = require('./fumbles.json')

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

const weaponTypes = [
  { value: 'Bow', label: 'Bow' },
  { value: 'Heavy Weapons', label: 'Heavy Weapons' },
  { value: 'Melee', label: 'Melee' },
  { value: 'Pistol', label: 'Pistol' },
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
    compoundSkills,
    fumbles,
    roles,
    skills,
    specialAbilities,
    stats,
    weaponTypes,
    weaponConcealabilities,
    weaponReliabilities,
    genders,
    siblingAge,
    woundLevels
  }
}
