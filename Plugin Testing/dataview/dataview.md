%%
```dataviewjs


dv.table(["Name", "HP", "AC"], [...window.bestiary.values()].sort((a,b) => a.hp - b.hp).map((monster) => [dv.fileLink(monster.name), monster.hp, monster.ac]))


```
%%

```ad-note

[test:: 1]
```