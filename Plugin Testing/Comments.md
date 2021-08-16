

### Paragraphs

This is a paragraph. *testing {: class=test}*
test 123
abc
{: id=an_id .a_class }

I'm normal text, but *I'm italic { class='internal-link' }*, **I'm bold { style="background-color: yellow" }** and ==I'm highlighted { id=highlight }==. 
{ class='test'}

### Lists
- 3
- 2
- 1
  {: .kanban }

### Tables
#### Cells

|     | set on td     | set on em    |
| --- | ------------- | ------------ |
|     | a{: .foo }.   | *b{: .bar }* |

| header1 | header2 |
| ------- | ------- |
| column1 | column2 |
{: .special}

### Code

``` {:data-python=asdf .test}
nums = [x for x in range(10)]
```

### Link

[[Test 123]] {: .linkify}

[link](http://example.com){: class="foo bar" title="Some title!" }

### Header

#### Header {: id=hash .header-class }