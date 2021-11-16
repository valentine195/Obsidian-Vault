<%*
function getNextSessionNumber() {
	const {index} = this.app.plugins?.plugins?.dataview ?? {} 
	
	if (!index) return;
	
	const tags = Array.from(index.etags.invMap);
	
	const sessionTags = tags.filter(([tag, set]) => {
		return /\#session\/\d+/.test(tag)
	});
	
	return sessionTags?.length + 1 ?? 1; 
	
}

const YAML =`---
type: session
date: 
session: ${getNextSessionNumber()}
tags:
  - session/planning
  - session/${getNextSessionNumber()}
---`;
tR += YAML; %>

# Session
```dataviewjs

const last = dv.pages('#session/recap')
	.sort(p => p.session).values
	.pop().file.link;

dv.paragraph(`[[${last.path}]]`)

```

## Characters
```dataview
list from #pc/alive 
```

## Strong Start


## Scenes


## Secrets and Clues


## Fantastic Locations


## Important NPCs


## Potential Monsters


## Potential Treasure

