---
date updated: '2021-03-30T20:37:16-04:00'
obsidianUIMode: preview
---
## The Price of Revenge

```ActivityHistory
/
```

### Map
![[20 Roleplaying/22 Compendium/Index#^khorvaire-map]]

### Characters

- [[Bob]]
- [[Mim]]
- [[Jeremiah Pumpernickle]]
- [[Merigold]]

### Key NPCs

- [[Jasper Bartlett]]
- [[Erandis Vol]]

### Current Adventure
```dataviewjs

dv.header(3, "Planning");
dv.list([dv.pages('#session/planning')
	.sort(p => p.session).values
	.pop().file.link]);

dv.header(3, "Seed");
dv.list([dv.pages('#plot/adventures/seed')
	.sort(p => p.ctime).values
	.pop().file.link]);
	
```



### Recaps

#### Last Session
```dataviewjs

const last = dv
			.pages('#session/recap')
			.sort(p => p.session).values
			.pop();

dv.list([last.file.link])

```

#### All Sessions
```dataview
list from "1. Sessions/Post Session Logs"
where !contains(file.name, "Index") 
sort file.ctime desc
```
