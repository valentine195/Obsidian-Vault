---
location: [ 39, -82]
---

# Test Weather



**Here I try to construct the whole `<img>` link _within_ Templater:**

<%+* const link = createEl('a', { attr: { src: 'https://wttr.in/51.133333,10.416667_0tqp_lang=en.png'}}); document.body.appendChild(link); %>

_This doesn’t work because apparently Obsidian hits in and interprets the `<img …` **before** Templater gets its chance._

