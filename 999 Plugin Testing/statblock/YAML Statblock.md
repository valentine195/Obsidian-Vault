---
statblock: true
layout: Basic Fate Core Layout
image: [[kintargo.png]]
name: yaml-test
description: an awkward sunbear
aspects: "
  - Smuggler Queen of the Sindral Reach\n
  - A Mostly Loyal Crew\n
  - Remorse is For the Weak\n
  - [[My Ship, The Death Dealer]]\n
  - I've Got the Law in My Pocket"
temporaryAspects: "
  - Owes [[the PCs]] a favor\n
  - Current owner of [[the MacGuffin]]"
stress: [4, 5]
consequences:
  - name: Mild (2)
    desc: Formerly fractured bone is still healing
  - name: Moderate (4)
    desc: -
  - name: Severe (6)
    desc: -
skills:
  - name: "[[Fantastic]] (+6)"
    desc: Deceive, Fight
  - name: Superb (+5)
    desc: Shoot, Burglary
  - name: Great (+4)
    desc: Resources, Will
  - name: Good (+3)
    desc: Contacts, Notice
  - name: Fair (+2)
    desc: Crafts, Stealth
  - name: Average (+1)
    desc: Lore, Physique
stunts:
  - name: Takes One to Know One (Deceive)
    desc: Use Deceive instead of Empathy to create an advantage in social situations.
  - name: Feint Master (Deceive)
    desc: +2 to use Deceive to create an advantage in a physical conflict.
  - name: Riposte (Fight)
    desc: If you succeed with style on a Fight defense, you can choose to inflict a 2-shift hit rather than take a boost.
items:
  - name: sword +1
    desc: -
  - name: leather armor +1
    desc: a scuffed [[leather armor]] with red linen undershirt
---

```statblock
monster: yaml-test
```