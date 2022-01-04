

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
```

