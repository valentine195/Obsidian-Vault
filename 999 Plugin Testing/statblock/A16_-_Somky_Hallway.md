---
aliases: A16
tags: area
---


> [!quote] 
> This wide hallway is filled with billowing smoke. Further ahead, on either side of the hall, several open doorways are illuminated by flickering flames.

**Hazard:** As the Black Tears began their attack, their leader Volodmyra (area A23) sent agents to light each of the west wing guest chambers (areas A17a–A17e) on fire while locking their panicked occupants within. The adventurers housed in this wing all perished except for Tartuccio (area A19) and—assuming she didn’t leave during the feast—Jaethal (area A21). The rooms have continued to burn, filling this area with thick clouds of acrid smoke. While the smoke persists, all creatures in the smoke become concealed, and all creatures outside the smoke become concealed to creatures within it.


```statblock
layout: Path2eBlockHaz
statblock: true

name: "Smoke-Filled Halway"
level: "Hazard 2"
trait_01: "complex"
trait_02: "enviromental"

stealth: "+0 (noticing the smoke is automatic)"

description: "Thick smoke fills this hallway, making it difficult to see and breathe."

disable: "While a spell like gust of wind can temporarily clear a path through the smoke, the hazard returns at the start of the next round as long as the fires in area A17 continue to burn; DC 18 Survival to know how best to cover your nose and mouth with a wet cloth to help alleviate the choking effects of the smoke."

trigger: 
  - name: "Choke ⭓ Trigger"
    desc: "A creature that isn’t holding their breath walks into the hallway or starts their turn in the hallway."

effect:
  - name: "Effect"
    desc: "The triggering creature must attempt a DC 18 Fortitude save."
  - name: "Critical Success"
    desc: "The creature is unaffected by the smoke."
  - name: "Success"
    desc: "The creature is sickened 1 by the smoke."
  - name: "Faliure"
    desc: "The creature is sickened 1 and takes 1d6 nonlethal damage from choking on the smoke. A creature that falls unconscious from the nonlethal damage begins to suffocate in 1d4+1 rounds (Core Rulebook 478) if not dragged to safety."
  - name: "Critical Failure"
    desc: "As failure, but sickened 2 and 1d6 persistent nonlethal damage."

reset: "The smoke continues to affect anyone who enters area A16 until the fires in area A17 are extinguished."

sourcebook: Kingmake 2e pg. 34
```