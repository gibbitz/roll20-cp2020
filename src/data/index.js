const skills = require('./skills.json')
const specialAbilities = require('./special-abilities.json')
const compoundSkills = require('./compound-skills.json')
const roles = require('./roles.json')

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

module.exports = {
  data: {
    skills,
    specialAbilities,
    compoundSkills,
    roles,
    stats,
    woundLevels
  }
}
