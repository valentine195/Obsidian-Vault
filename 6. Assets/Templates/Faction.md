---
date updated: '2021-05-04T12:52:29-04:00'
type: faction

---

<%*
const splitNameAsTag = tp.file.title.split(" ").join("-").toLowerCase();
%>

# <% tp.file.title %>

### Description

<% tp.file.content %>

### Notable Members

##### Leader

```dataview
list FROM #factions/<% splitNameAsTag %>/member/leader
```

##### Others

```dataview
list 
FROM #factions/<% splitNameAsTag %>/member 
WHERE none(contains(file.etags, "#factions/<% splitNameAsTag %>/member/leader"))
```

### Ranks

### Organization Chart
