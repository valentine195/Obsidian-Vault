---
created: Sunday, January 29th 2023, 9:17:49 pm
modified: Thursday, February 2nd 2023, 3:17:25 pm
---

abc

```statblock

name: Ancient Black Dragon
size: Gargantuan
type: dragon
subtype:
alignment: chaotic evil
ac: 22
hp: 367
hit_dice: 21d20
speed: 40 ft., fly 80 ft., swim 40 ft.
stats: [27, 14, 25, 16, 15, 19]
saves:
  dexterity: 9
  constitution: 14
  wisdom: 9
  charisma: 11
skillsaves:
  - perception: 16
  - stealth: 9
senses: blindsight 60 ft., darkvision 120 ft., passive Perception 26
languages: Common, Draconic
damage_resistances: bludgeoning, piercing, and slashing from nonmagical attacks
damage_immunities: fire, poison
condition_immunities: charmed, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained
cr: 21
traits:
  - name: Amphibious
    desc: The dragon can breathe air and water
  - name: Legendary Resistance (3/Day)
    desc: If the dragon fails a saving throw, it can choose to succeed instead.
actions:
  - name: Multiattack
    desc: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
  - name: Bite
    desc: "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 9 (2d8) acid damage."
  - name: Claw
    desc: "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
  - name: Tail
    desc: "Melee Weapon Attack: +15 to hit, reach 20 ft ., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
  - name: Frightful Presence
    desc: "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
  - name: Acid Breath (Recharge 5-6)
    desc: The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one.
reactions:
  - name: Amphibious
    desc: The dragon can breathe air and water.
  - name: Legendary Resistance (3/Day)
    desc: If the dragon fails a saving throw, it can choose to succeed instead.
legendary_actions:
  - name: Detect
    desc: The dragon makes a Wisdom (Perception) check.
  - name: Tail Attack
    desc: The dragon makes a tail attack.
  - name: Wing Attack (Costs 2 Actions),
    desc: The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.
spells:
  - The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast disguise self and invisibility at will and has the following wizard spells prepared
  - Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp
  - 1st level (4 slots): detect magic, identify, mage armor*, magic missile
  - 2nd level (3 slots): detect thoughts, mirror image, misty step
  - 3rd level (3 slots): counterspell, fly, lightning bolt
  - 4th level (3 slots): banishment, fire shield, stoneskin*
  - 5th level (3 slots): cone of cold, scrying, wall of force
  - 6th level (1 slot): globe of invulnerability
  - 7th level (1 slot): teleport
  - 8th level (1 slot): mind blank*
  - 9th level (1 slot): time stop
  - "* The archmage casts these spells on itself before combat."
```

```statblock
name: Aberrant Spirit
size: Medium
type: aberration
ac: 11 + the level of the spell
hp: 40 + 10 for each spell level above 4th
speed: 30 ft.; fly 30 ft. (hover) (Beholderkin only)
stats: [16, 10, 15, 16, 10, 6]
damage_vulnerabilities:
damage_resistances:
damage_immunities: psychic
senses: darkvision 60 ft., passive Perception 10
languages: Deep Speech, Understands the languages yu speak
cr: -
traits:
    - [Regeneration (Slaad Only)., The aberration regains 5 hit points at the start of its turn if it has at least 1 hit point.]
    - [Whispering Aura (Star Spawn Only)., At the start of each of the aberration's turns, each creature within 5 feet of the aberration must succeed on a Wisdom saving throw against your spell save DC or take 7 (2d6) pshychic damage, provided that the aberration isn't incapacitated.]
actions:
    - [Multiattack, The aberration makes a number of attacks equal to half this spell's level (rounded down).]
    - [Claws (Slaad Only), Melee Weapon Attack: your spell attack modifier to hit, reach 5 ft., one target. Hit: 19 (1d10 + 3) + the spell's level piercing damage. If the target is a creature, it can't regain hit points until the start of the aberration's next turn.]
    - [Eye Ray (Beholderkin Only), Ranged Spell Attack: your spell attack modifier to hit, range 150 ft., one target. Hit: 15 (1d8+3) + the spell's level psychic damage.]
    - [Psychic Slam (Star Spawn Only), Melee Spell Attack: your spell attack modifier to hit, reach 5 ft., one creature. Hit: 17 (1d8 + 3) + the spell's level psychic damage.]
```
