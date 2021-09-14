---
date updated: '2021-08-19T12:25:23-04:00'

---

test @{12-12-12}

### Paragraphs

This is a paragraph. _testing {: class=test}_
test 123
test ^[here]
abc
{: id=an_id .a_class }



### Lists

I'm normal text, but _I'm italic { class='internal-link' }_, **I'm bold { style="background-color: yellow" }** and ==I'm highlighted { id=highlight }==.
{ class='test'}
- 1
- 2
- 3
  {: .kanban }

### Tables

#### Cells

|             |              |
| ----------- | ------------ |
| a{: .foo }. | _b{: .bar }_ |
| set on td   | set on em    |

| header1      | header2 |
| ------------ | ------- |
| column1      | column2 |
| {: .special} |         |


### Code

```{:data-python=asdf .test}
nums = [x for x in range(10)]
```

### Link

[[Test 123]] {: .linkify}

[link](http://example.com){: class="foo bar" title="Some title!" }


#### Header {: id=hash .header-class }

### Header