---
date updated: '2021-05-04T12:52:29-04:00'
type: faction
tags:
 - factions/yirr-tribe
---



# Yirr Tribe

### Description
Tribe of [[Merigold]]

### Notable Members

##### Leader

```dataview
list FROM #factions/yirr-tribe/member/leader
```

##### Others

```dataview
list 
FROM #factions/yirr-tribe/member 
WHERE none(contains(file.etags, "#factions/yirr-tribe/member/leader"))
```

### Ranks

### Organization Chart