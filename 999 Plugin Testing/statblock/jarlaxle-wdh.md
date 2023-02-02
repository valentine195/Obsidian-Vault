---
obsidianUIMode: preview
cssclass: json5e-monster
tags:

- compendium/src/wdh
- monster/size/medium
- monster/type/humanoid/elf
statblock: true
statblock-link: "#^statblock"
name: Jarlaxle
"size": "Medium"
"type": "humanoid"
"subtype": "elf"
"alignment": "Chaotic Neutral"
"ac": !!int "24"
"hp": !!int "123"
"hit_dice": "19d8 + 38"
"stats":
- !!int "12"
- !!int "22"
- !!int "14"
- !!int "20"
- !!int "16"
- !!int "19"
"speed": "walk 30 ft."
"saves":
  "Dexterity": !!int "11"
  "Wisdom": !!int "8"
"skillsaves":
  "Athletics": !!int "6"
  "Sleight of Hand": !!int "11"
  "Deception": !!int "14"
  "Stealth": !!int "16"
  "Perception": !!int "8"
  "Acrobatics": !!int "11"
"senses": "darkvision 120 ft., passive Perception 18"
"languages": "Abyssal, Common, Draconic, Dwarvish, Elvish, Undercommon"
"cr": "15"
"traits":
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle's innate spellcasting ability is Charisma (spell save DC 17, +9\
    \ to hit with spell attacks) He can innately cast the following spells, requiring\
    \ no material components:\n\nAt will: [dancing lights](/2-Compendium/spells/dancing-lights.md)\n\
    \n1/day each: [darkness](/2-Compendium/spells/darkness.md), [faerie fire](/2-Compendium/spells/faerie-fire.md),\
    \ [levitate](/2-Compendium/spells/levitate.md) (self only)"
  "name": "innate"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle wears +3 leather armor, a [hat of disguise](/2-Compendium/items/hat-of-disguise.md),\
    \ a [bracer of flying daggers](/2-Compendium/items/bracer-of-flying-daggers-wdh.md),\
    \ a [cloak of invisibility](/2-Compendium/items/cloak-of-invisibility.md), a [knave's\
    \ eye patch](/2-Compendium/items/knaves-eye-patch-wdh.md), and a [ring of truth\
    \ telling](/2-Compendium/items/ring-of-truth-telling-wdh.md). He wields a +3 rapier\
    \ and carries a [portable hole](/2-Compendium/items/portable-hole.md) and a [wand\
    \ of web](/2-Compendium/items/wand-of-web.md). His hat is adorned with a [feather\
    \ of diatryma summoning](/2-Compendium/items/feather-of-diatryma-summoning-wdh.md)."
  "name": "Special Equipment"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "If he is subjected to an effect that allows him to make a Dexterity saving\
    \ throw to take only half damage, Jarlaxle instead takes no damage if he succeeds\
    \ on the saving throw, and only half damage if he fails. He can't use this trait\
    \ if he's [incapacitated](/1-Rules/conditions.md#incapacitated)."
  "name": "Evasion"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle has advantage on saving throws against being [charmed](/1-Rules/conditions.md#charmed),\
    \ and magic can't put him to sleep."
  "name": "Fey Ancestry"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "If Jarlaxle fails a saving throw, he can choose to succeed instead."
  "name": "Legendary Resistance (1/Day)"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle can attune to up to five magic items, and he can attune to magic\
    \ items that normally require attunement by a sorcerer, warlock, or wizard."
  "name": "Master Attuner"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle deals an extra 24 (7d6) damage when he hits a target with a weapon\
    \ attack and has advantage on the attack roll, or when the target is within 5\
    \ feet of an ally of Jarlaxle's that isn't [incapacitated](/1-Rules/conditions.md#incapacitated)\
    \ and Jarlaxle doesn't have disadvantage on the attack roll."
  "name": "Sneak Attack (1/Turn)"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "While Jarlaxle is wearing light or no armor and wielding no shield, his\
    \ AC includes his Charisma modifier."
  "name": "Suave Defense"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "When not wearing his knave's eye patch, Jarlaxle has disadvantage on attack\
    \ rolls, as well as on Wisdom (Perception) checks that rely on sight."
  "name": "Sunlight Sensitivity"
"actions":
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle makes three attacks with his +3 rapier or two attacks with daggers\
    \ created by his bracer of flying daggers."
  "name": "Multiattack"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 13 (1d8\
    \ + 9) piercing damage."
  "name": "+3 Rapier"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Ranged Weapon Attack: +11 to hit, range 20/60 ft., one target. Hit: 8\
    \ (1d4 + 6) piercing damage."
  "name": "Flying Dagger"
"legendary_actions":
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle moves up to his speed without provoking opportunity attacks."
  "name": "Quick Step"
- !!dev.ebullient.json5e.qute.Trait
  "desc": "Jarlaxle makes one attack with his +3 rapier or two attacks with daggers\
    \ created by his bracer of flying daggers."
  "name": "Attack (Costs 2 Actions)"
"source":
- "WDH"
aliases: ["Jarlaxle"]
created: Tuesday, January 31st 2023, 7:26:51 pm
modified: Tuesday, January 31st 2023, 7:39:02 pm
---

```statblock
creature: Jarlaxle
```

```statblock
name: Jarlaxle
"size": "Medium"
"type": "humanoid"
"subtype": "elf"
"alignment": "Chaotic Neutral"
"ac": !!int "24"
"hp": !!int "123"
"hit_dice": "19d8 + 38"
"stats":
- !!int "12"
- !!int "22"
- !!int "14"
- !!int "20"
- !!int "16"
- !!int "19"
"speed": "walk 30 ft."
"saves":
  "Dexterity": !!int "11"
  "Wisdom": !!int "8"
"skillsaves":
  "Athletics": !!int "6"
  "Sleight of Hand": !!int "11"
  "Deception": !!int "14"
  "Stealth": !!int "16"
  "Perception": !!int "8"
  "Acrobatics": !!int "11"
```