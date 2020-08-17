# roll20-cp2020
This is the source for a character sheet for The Cyberpunk 2020 RPG intended for use on [Roll20.net](https://wiki.roll20.net/Category:Character_Sheet_Documentation)'s platform.

## Cyberpunk 2020
Cyberpunk 2020 is a rollplaing game system developed by [R Talisorian Games](https://rtalsoriangames.com/cyberpunk) and released in 1990 that evolved form the Cyberpunk RPG released in 1988 based on the sci-fi genre popularized by authors like William Gibson, Bruce Sterling and Walter Jon Williams and films like _Blade Runner_ and _The Terminator_. Cyberpunk 2020 featured improved combat rules and updated and expanded equipment and skills. The rule system focuses on Comparisons of randomized character based values (_rolls_) against  difficulty levels or other character's rolls in order to determine the acomplishments of players. Compared to other systems this combination of attributes, skill and chance combined with the adversarial direction of combat aligned with my worldview better than percentage based rule systems (_Top Secret SI_) or D20 systems (_Dungeons & Dragons_, Palladiums games) and made the game popular in this space.

## Why Make This Now?
It's 2020, choomba. I wanted to run a campaign this year to commemorate the coming of the year that the game was set in and planned a quite complicated system on my own platform. It was taking too long and I decided to build for this platform in the interest of getting the game started before 2021.

Also due to the popularity of the upcoming [Cyberpunk2077](https://www.cyberpunk.net/us/en/) videogame and the impending release of the [Cyberpunk Red RPG](https://rtalsoriangames.com/2019/05/30/the-cyberpunk-red-faq/) many streamers have been streaming this game and complaining about the game system. As a defender of the system, I feel obligated to make it easier for n00bs to pick it up, which I can hopefully accomplish through this character sheet.

## Features
A note on the features here. Many of these features are tricky to develop on the Roll20 platform due to securtiy precautions. Within the platform DOM related methods are unavailable and some limited functionality is provided to calculate values for gameplay. Features like health meters and UI tabs are created by hacking form controls and CSS. For that reason this sheet and it's features are only currently supported in Google Chrome.

### Design
Based on "dark-mode" designs for the temporarily abandoned personal platform for this gaming system, the layout is flexbox based with informative text and focus driven by value. The layout features several tab-hidden sections for character equipment (outfit), weapons, skills, and backstory.

### Skills
Skills are arranged in under _*learn*_ and _*use*_ tabs allowing the player to focus on what they need when leveling up versus when using the skills. 

Under the _use_ tab, a button to roll a skill check is included in the skill row. If the user doesn't have a specific skill, there are buttons provided to roll or save provided for each attribute in the _stats_ section.

Under the _learn_ tab, fields to change a skill level and keep track of _Improvement Points_ are provided, including a field that auto calculates the number of points required to attain the next level of a skill taking into account the _IP Multiplier_

Skills are then organized into _Special Ability_, _Career Skills_ and _Pickup Skills_. 

_Special Ability_ and _Career Skills_ are determined by the selected character _Role_ which is drawn from nearly all available roles in the published material for the game. 

_Pickup Skills_ can be selected from the remaining skills under the _learn_ tab and only skills with a level appear in the _use_ tab. Custom skills can also be added with a clear text field at the bottom of the list.

Like the names, roll associations and ip multipliers, descriptions for all the skills gleaned from the source materials are provided in both learn and use mode to reduce lookup time to determine what can be done using the skill.

### Damage & Armor
The Sheet supports wound/stun management as described in the original game through a series of boxes that give a stun indicator on the first click and a wound indicator on the second click. As the wound level increses damage modifiers are accessed and the character's stats are modified as necessary.

## Contributing
I'm happy to accept PRs to improve on this sheet. But in order to do this, you're going to need to run it. Developing a sheet on Roll20 requires a pro membership. Within reason, I am willing to run changes in my own sandbox, provided that the changes look like they will work and seem reasonable.

### Installation
The sheet is built with [Pug](https://pugjs.org/api/getting-started.html) and [Sass](https://sass-lang.com/) and as such requires compiling via [nodejs](https://nodejs.org/en/). After installing nodejs, run this usual script to install dependencies:

```bash
npm i
```

After the dependencies are installed, developing the sheet is a combination of running a node process and uploading the output HTML and CSS files to a Roll20 character sheet sandbox. 

When built the application will write cp2020.html and cp2020.css to `./dist`.

```bash
npm run build
```

Running the watcher will do this continuously as changes are made to Pug, Sass (scss), javascript and JSON files. Helpful for iterative development of new features.

```bash
npm run watch
```