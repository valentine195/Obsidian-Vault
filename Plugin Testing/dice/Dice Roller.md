inline:: 2
dice_test:: 5

## Number Dice

`dice: 1`
`dice: 1d2`
`dice: 3d4 + 3`
`dice: 1d12 + 1d10 + 5`
`dice: 3d4+3d4-(3d4 * 1d4) - 2^1d7`
`dice: 1d[3,5]`
`dice: 1d`
`dice: d100`
`dice: d`

### Alternate Types
`dice: 1dF`
`dice: 1dS`
`dice: 1d%`
`dice: 1d422%`

### Modified
##### Min/Max
`dice: 4d[7, 8]`
`dice: 1d[20, 20]`

##### Keep Highest
`dice: 2d20k`
`dice: 2d20kh`
`dice: 4d20k2`
`dice: 4d20kh2`

##### Keep Lowest
`dice: 2d20kl`
`dice: 4d20kl2`

##### Drop Lowest
`dice: 2d20dh`
`dice: 2d20dl`
`dice: 4d20dh2`
`dice: 4d20dl2`

##### Drop Highest
`dice: 2d20dh`
`dice: 4d20dh2`

##### Explode
`dice: 2d20!`
`dice: 2d4!3`
`dice: 1d1!i`

##### Explode and Combine
`dice: 2d20!!`
`dice: 2d4!!3`
`dice: 1d1!!i`

##### Reroll
`dice: 2d20r`
`dice: 2d4r3`
`dice: 1d2ri`


#### Conditioned Modifiers
`dice: 1d4!=3`
`dice: 1d4!i=!3`
`dice: 1d4r<3`
`dice: 1d4r<2>3`

#### Conditioned Dice
`dice: 1d5=3`
`dice: 1d5=!3`
`dice: 1d5>3`
`dice: 1d5<3`
`dice: 1d5>=3`
`dice: 1d5<=3`
`dice: 1d5-=3`
`dice: 1d5=-3`

#### Modified and Conditioned

`dice: 1d4>=2!i<3`
`dice: 1d4=!2!i=!3`
`dice: 1d4r<3`
`dice: 1d4r<2>3`

#### Inline Fields


`dice: 1d5 + inline`

`dice: 1d5 + dice_test`


#### Full Example

`dice: ((((3d4!!i<2r>=3 + 3d4kl!>2) - 3d4=4kh2!ir) * 1d4!!i=3) + 2^2d7!!i=3>5kh)`

## Table Dice

`dice: [[Cold Sun Tribe#^chiefs]]`
`dice: [[Cold Sun Tribe#^chiefs]]|Clan`

### Lookup Tables


`dice: [[Race Generator#^main]]`

## Section Dice

`dice: [](Race%20Generator.md)`
`dice: [[Dice Variants]]`
`dice: [[Dice Variants]]`

### Line
`dice: [[Dice Variants]]|line`
### Paragraph
`dice: [[Dice Variants]]|paragraph`
### Multiple Headings
`dice: 2d[[Dice Variants]]|heading`

## Tag Dice

`dice: #location|-`

### Heading
`dice: #location|-|heading`

### Link
`dice: #location|link`
