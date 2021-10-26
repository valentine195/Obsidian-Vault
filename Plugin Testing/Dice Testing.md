| dice: 1d% | Treasure       |
| --------- | -------------- |
| 01-30     | `dice: [[treasure table#^copper]]` copper |
| 31-60     | `dice: [[treasure table#^silver]]` silver |
| 61-70     | `dice: [[treasure table#^electrum]]` electrum |
| 71-95     | `dice: [[treasure table#^gold]]` gold |
| 96-100    | `dice: [[treasure table#^platinum]]` platinum |
^treasure

`dice: #location `

`dice: [[Dice Testing#^treasure]]`

%%
| dice: d12+d8 | Encounter                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------- |
| 2              | Ghost ship                                                                                   |
| 3              | Friendly and curious bronze dragon                                                           |
| 4              | Whirlpool (25 percent chance that the whirlpool is a portal to the Elemental Plane of Water) |
| 5              | Merfolk traders                                                                              |
| 6              | Passing warship (friendly or hostile)                                                        |
| 7-8            | Pirate ship (hostile)                                                                        |
| 9-10           | Passing merchant ship (galley or sailing ship)                                               |
| 11-12          | Killer whale sighting                                                                        |
| 13-14          | Floating debris                                                                              |
| 15             | Longship crewed by hostile berserkers                                                        |
| 16             | Hostile griffons or harpies                                                                  |
| 17             | Iceberg (easily avoided if seen from a distance)                                             |
| 18             | Sahuagin boarding party                                                                      |
| 19             | NPC in the water (clinging to floating debris)                                               |
| 20             | Sea monster (such as a dragon turtle or kraken)                                              |
^encounter

`dice: [[Dice Testing#^encounter]]`

| dice:1d% | Result  |
| -------- | ------- |
| 01–50    | Nothing |
| 51–60    | Hazard  |
| 61–100   | Monster |
^encounter

`dice: [[Dice Testing#^encounter]]`



`dice+: -1d100` abc def gef 123

`dice+: 2d6 -1`

`dice+: 5d2-1 - 1`

`dice+: 8d10>=8-=1!i>9` test abc def 12345 6253 test test test test


Let's try an inline result in a paragraph. 3d100 + 12 -> [75, 20, 75] + 12 ->  **182**! Did it work?


`dice+: [[Dice Variants]]`


`dice: [[Cold Sun Tribe^chiefs]]`

`dice-: [[Cold Sun Tribe]]`

`dice: #location|heading`

`dice: 1dS + 2`


`dice+: abc`

`dice: 3d4 + 3`

This is a dice result in a paragraph. This is just for testing. `dice: 3d4 + 3` Hopefully it works.

`dice+: 1d12 - 1d10 + 5`

`dice: 3d4+3d4-(3d4 * 1d4) - 2^1d7`

`dice: 3d4+3d4-(3d4 * 1d4) - 2^1d7`

`dice+: 3d4+3d4-(3d4 * 1d4) - 2^1d7`

`dice: 3d4+3d4-(3d4 * 1d4) - 2^1d7`

%%

- 1
-  2
-  3
- 4
^test

`dice: [[Dice Testing]]|listItem`