---
created: Thursday, February 10th 2022, 8:29:01 am
modified: Monday, March 21st 2022, 3:07:42 pm
---

Hey All. I'm using the dice roller plugin to create random tables, but I'm having a very hard time getting them to work. What I would like to create are several random tables that work together.

For instance, I want to roll a 1d%, and on a 01-50 I want to return the result "Nothing", 51-80 would be "Non-Combat Encounter" and 81-100 would be "Combat Encounter". If the roll would return "Non-Combat Encounter", it would return an encounter from a 1d100 list of Non-Combat Encounters. Likewise with Combat Encounters.

I have the following function:
`dice: [[Dice Scratchpad^UrbanEncounters]]`

Then in the note titled "Random Tables", I have the following table:

| test  | Description                      |
| ------ | -------------------------------- |
| 01-50  | Nothing                          |
| 51-80  | dice: [[Cold Sun Tribe#^chiefs]] |
| 81-100 | dice: [[Race Generator#^main]]   |

^UrbanEncounters

Then in the note titled "Non-Combat Encounters", I have a table called "Non-CombatEncounters", which has a similar structure as above, only 100 lines of different Non-Combat Encounters.

However, I cannot use the function. There is no dice rolling available.
Furthermore, when it did previously work, I couldn't get it to only show the result from the second header (Description). The function "", as described in the Dice Roller ReadMe, doesn't work.

What am I doing wrong? As a note, All the "dice" functions have "``" around them, which don't show above. Has anyone else got random tables to work in Obsidian, in combination with the plugin Dice Roller? I'm at my wits end, as I've been trying to get this to work for hours already.
