---
date updated: '2021-03-30T20:37:16-04:00'

---

# The Mark of Death

## Map
![[1. Location Index#^khorvaire-map]]

## Characters

- [[Bob]]
- [[Mim]]
- [[Jeremiah Pumpernickle]]
- [[Merigold]]

## Todo

```dataviewjs
const tasks = dv.pages("#todo");
const list = dv.taskList(tasks.file.tasks.where(t => !t.completed && t.text.includes("#todo")));

console.log(list)

dv.table(
  ["File", "Tasks"], 
  tasks.map(f => 
  	[
		f.file.link, 
		'test'
	]
  )
)
```

## Key NPCs

- [[Jasper Bartlett]]
- [[Erandis Vol]]

## Current Adventure

```dataview
list from "Adventure Seeds"
where status = "current"
```

## Recaps

### Last Session
![[21-5-15]]

### All Sessions
```dataview
list from "Post Session Logs"
sort file.name desc
```
