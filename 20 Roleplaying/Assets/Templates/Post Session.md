<%*
function getNextSessionNumber() {
	const {index} = this.app.plugins?.plugins?.dataview ?? {} 
	
	if (!index) return;
	
	const tags = Array.from(index.etags.invMap);
	
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

const index = this.app.vault.getAbstractFileByPath("1. Sessions/Post Session Logs/_Index.md");

const content = await this.app.vault.cachedRead(index);

console.log(tp)

await this.app.vault.modify(index, `${content}\n- [[${tp.file.title}]]`)

%>
