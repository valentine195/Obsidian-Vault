---
location: [ 39, -82]
---

# Test Weather



**Here I try to construct the whole `<img>` link _within_ Templater:**

<%+* const link = createEl('img', { attr: { src: 'https://wttr.in/51.133333,10.416667_0tqp_lang=en.png'}}); console.log(tp); tR += link.innerHTML; console.log(tR) %>

_This doesn’t work because apparently Obsidian hits in and interprets the `<img …` **before** Templater gets its chance._

