on('ready', () => {
  const getTurnOrderFromSelectedTokens = (selectedTokens) => selectedTokens.map(
    // eslint-disable-next-line no-underscore-dangle
    (selectedToken) => {
      // eslint-disable-next-line no-underscore-dangle
      const characterId = getObj('graphic', selectedToken._id).attributes.represents;
      const output = {
        // eslint-disable-next-line no-underscore-dangle
        id: selectedToken._id,
        pr: getCharacterInitiative(characterId),
        custom: '',
        _pageid: Campaign().get('playerpageid')
      }
      // log(`turnData >>>>>>>>>${JSON.stringify(output, null, 4)}`)
      return output
    }
  );

  const getCharacterInitiative = (characterId) => {
    const ref = getAttrByName(characterId, 'REF');
    const combatSense = parseInt(getAttrByName(characterId, 'Skill_combat_sense_level'), 10);
    const roll = Math.ceil(Math.random()*10);
    log(`roll: ${roll}, ref: ${ref} cs: ${combatSense}`)
    return roll + ref + combatSense;
  };

  const getTurnOrder = () => JSON.parse(Campaign().get('turnorder'))
  const setTurnOrder = (order) => Campaign().set('turnorder', JSON.stringify(order))

  const setInitiatives = (selectedTokens) => {
    const newTurns = getTurnOrderFromSelectedTokens(selectedTokens);
    const currentTurns = getTurnOrder();
    const carryOverTurns = currentTurns.filter(
      (turn) => newTurns.every(
        (newTurn) => newTurn.id !== turn.id
      )
    );
    const nextTurnOrder = [...newTurns, ...carryOverTurns].sort((a, b) => b.pr - a.pr);
    // log(`current >>>>>>>>>>>\n${JSON.stringify(currentTurns, null, 4)}\n<<<<<<<<<<`);
    // log(`next >>>>>>>>>>>\n${JSON.stringify(nextTurnOrder, null, 4)}\n<<<<<<<<<<`);
    setTurnOrder(nextTurnOrder);
  }

  on('chat:message', (msg) => {
    if (msg && msg.type === 'api' && /^!i\+/i.test(msg.content)) {
      // log(`msg.selected >>>>>>>>>>> ${JSON.stringify(msg.selected, null, 4)}`);
      // log(`first character >>>>>>>>>>> ${JSON.stringify(getCharacterById(characterIds[0]), null, 4)}`);
      setInitiatives(msg.selected);
    }
  });
});