on('ready', () => {
  const getLocation = () => {
    const LOCATIONS = {
      skull: [1, 2, 3],
      'right eye': [4],
      'left eye': [5],
      face: [6, 7, 8],
      neck: [9, 10],
      'right chest': [11, 12, 13, 14, 15, 16, 17],
      'left chest': [18, 19, 20, 21, 22, 23, 24],
      'right stomach': [25, 26, 27, 28],
      'left stomach': [29, 30, 31, 32],
      'right hip bone': [33, 34, 35],
      'left hip bone': [36, 37, 38],
      'right shoulder': [39, 40],
      'right upper arm': [41, 42, 43],
      'right elbow': [44],
      'right forearm': [45, 46, 47],
      'right hand': [48, 49],
      'left shoulder': [50, 51],
      'left upper arm': [52, 53, 54],
      'left elbow': [55],
      'left forearm': [56, 57, 58],
      'left hand': [59, 60],
      'right groin': [61, 62],
      'right hip joint': [63, 64],
      'right thigh': [65, 66, 67, 68, 69, 70, 71, 72],
      'right knee': [73, 74],
      'right shin': [75, 76, 77, 78],
      'right foot': [79, 80],
      'left groin': [81, 82],
      'left hip joint': [83, 84],
      'left thigh': [85, 86, 87, 88, 89, 90, 91, 92],
      'left knee': [93, 94],
      'left shin': [95, 96, 97, 98],
      'left foot': [99, 100]
    };
    const hitNumber = Math.ceil(Math.random() * 100);
    const hitLocation = Object.keys(LOCATIONS).filter(
      (location) => LOCATIONS[location].indexOf(hitNumber) > -1
    )[0]
    log(`|||||||||||||||||||||||||||||||||||> ${hitLocation}`);
    return hitLocation;
  };
  const hitMe = (hitsString) => {
    const HIT_LOCATION = 'Hit Location'
    let times = parseInt(hitsString, 10);
    const locations = [];
    times = isNaN(times) ? 1 : times;
    // eslint-disable-next-line no-restricted-globals
    const plural = times>1 ? 's' : ''
    log(`${HIT_LOCATION}${plural}`, `for ${times} hit${plural}`);
    sendChat(`${HIT_LOCATION}${plural}`, `<b style="display:block; border-bottom: 1px solid;">for ${times} hit${plural}</b>`)
    for (let i = times; i--; i >= 0) {
      locations.push(getLocation())
    }
    sendChat(`${HIT_LOCATION}${plural}`, `${locations.join('<br>')}<br>`)

  }
  on('chat:message', (msg) => {
    if (msg && msg.type === 'api' && /^!hit me.*/i.test(msg.content)) {
      // log(`|||||||||||||||||||||||||||||||||||> ${msg.content.substring(7)}`);
      hitMe(msg.content.substring(7))
    }
  })
});