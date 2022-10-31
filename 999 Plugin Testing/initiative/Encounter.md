
```encounter
name: Korgstrod's Response Team
creatures:
  - 1: [Bandit, Krentz]
  - 1: [Bandit]
  - 3: Duergar
  - 1: Half-Ogre (Ogrillon)
  - 2: Goblin
  - 1: Gazer
```

```encounter
name: Example 1
creatures:
 - 3d6: Goblin

---

name: Example 2
creatures:
 - 3: Hobgoblin
 - Goblin

```


```encounter
creatures:
  - Hobgoblin
  - 3d5: Hobgoblin
  - [[Hobgoblin, Bob], 12]
  -
    - [Hobgoblin, Jim]
    - 12
    - 13
    - 2
    - 25
  - 2:                          # 2 Hobgoblins named Jeff with 12 HP and 13 AC.
    - [Hobgoblin, Jeff]
    - 12
    - 13
  - 5:                          # 5 Hobgoblins named Ted with 12 HP and 13 AC.
      creature: Hobgoblin
      name: Ted
      hp: 12
      ac: 13
  - 1d5:                        # 1d5 Hobgoblins named Sarah with 12 HP and 13 AC.
      creature: Hobgoblin
      name: Sarah
      hp: 12
      ac: 13
```


## **Table:**
```encounter-table
name: Example 1
creatures:
 - Hobgoblin
 - 3: Goblin

---

name: Example 2
creatures:
 - 3: Hobgoblin
 - Goblin
 
---

name: Example 3
creatures:
 - 3: Hobgoblin
 - 1d5: Goblin

---

name: Example 4
party: Other
creatures:
 - 1d5: Hobgoblin
 - 5d5: Goblin
```


## **Inline:**
| dice: 1d3 | Encounter                                      |
| --- | ---------------------------------------------- |
| 1   | `encounter: 3: Hobgoblin, 1d5: Goblin, Custom` |
| 2   | `encounter: 2 Hobgoblin`                       |
| 3   | `encounter: 2d5: Hobglin, 5d5: Goblin`                                               |
^test-encounter
%%



























%%
```encounter
hide: players
players: 
 - Bob
 - test2
creatures:
- 3: Salamander, 60, 12, 5
- 1d3: Goblin
- Goblin
---
name: Example
creatures:
 - Hobgoblin
 - 3: Goblin
---
name: Example 2
creatures:
 - Goblin, 7, 15, 2
xp: 500
---
name: Example 3
players: none
creatures:
 - 1d3: Goblin test long name la la la la,, 15, 2
 - Testing
 - Testing CR
---
creatures:
  - My Monster                          # 1 monster named My Monster will be added, with no HP, AC or modifier.
  - Goblin, 7, 15, 2                    # 1 goblin with HP: 7, AC: 15, MOD: 2 will be added.
  - Goblin, 5, 15, 2, 25                # 1 goblin with HP: 7, AC: 15, MOD: 2 worth 25 XP will be added.
---
creatures:
  - 3: Goblin, 7, 15, 2                 # 3 goblins with HP: 7, AC: 15, MOD: 2 will be added.
  - 2: Goblin, 5, 15, 2, 25             # 3 goblins with HP: 7, AC: 15, MOD: 2 worth 25 XP will be added.
```%%