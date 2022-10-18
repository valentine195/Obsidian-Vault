### Inline Text Elements

Inline text elements such as italics, bold, highlight, etc. should have their attributes placed _inside_ the symbol:


I'm normal text, but *I'm italic { class='italics' }*, **I'm bold { .bold }** and ==I'm highlighted { id=highlight }==.



### Paragraphs
abc
Paragraph attributes should be placed after the last line of the block.

abc def
This is a paragraph.
This is another line of the paragraph.
This is the last line. def
{ id=my_paragraph .class }


### Headers

Attributes must be added to headers at the end of the line.

#### A Header { id=header .header-class }

### Tables

Attributes can be added to the `<table>` element by placing the attribute on the line below it.


| header1 | header2 |
| ------- | ------- |
| column1 | column2 |
{ .table-class }


Attributes can be added to individual table cells like so:


| header1 { .class} | header2                |
| ------------------ | ---------------------- |
| column1            | column2 { .class-two} |


It is not currently possible to add attributes to `<tr>` or `<thead>` elements.

### Links

Both Wikilinks and markdown syntax links may have attributes placed on them.

[link](http://example.com){ class="foo bar" title="Some title!" }

[[Test 123]] { .wikilink}

### Lists

Lists may have attributes placed on each individual list item.


-   item { .item}
    -   nested item { .nested}
    -   nested item 2 { id="item 2" }


Attributes can only be applied to the final nested list by placing the attribute on the line immediately following the last item.


-   item 1 { .item}
-   item 2 { id=item }
-   item 3 { data-item=3 }
{ .top-level-ul }



-   item { .item}
    -   nested item { .nested}
    -   nested item 2 { id="item 2" }
        { .nested-ul}


### Code Blocks

Code blocks should have their attributes placed after the initial three ticks.


```python { data-python="code" .class }
nums = [x for x in range(10)]
```


Please note that at the moment, changes to code block attributes will not take effect until you reload the note.

### Block Quotes

Block quotes can by targeted by placing the attributes directly after the last line of the quote.


> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequa t.
{ .class }