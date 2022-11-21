<%*
function getNextSessionNumber() {
	const {index} = this.app.plugins?.plugins?.dataview ?? {} 
	
	if (!index) return;
	
	const tags = Array.from(index.etags.delegate.invMap);
	
	const sessionTags = tags.filter(([tag, set]) => {
		return /\#session\/\d+/.test(tag)
	});
	
	return sessionTags?.length; 
	
}

const YAML =`---
share: true
type: recap
date: 
session: ${getNextSessionNumber()}
tags:
  - session/recap
  - session/${getNextSessionNumber()}
---`;
tR += YAML;


%>
