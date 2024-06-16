document.getElementById('editor-text-bold').addEventListener('click', function() {
    wrapText('**');
});

document.getElementById('editor-text-italic').addEventListener('click', function() {
    wrapText('*');
});

document.getElementById('editor-text-ul').addEventListener('click', function() {
    wrapText('__');
});

document.getElementById('editor-text-quote').addEventListener('click', function() {
    createHeading('> ');
});

document.getElementById('editor-text-code').addEventListener('click', function() {
    wrapText('`');
});

document.getElementById('editor-text-h1').addEventListener('click', function() {
    createHeading('#');
});

document.getElementById('editor-text-h2').addEventListener('click', function() {
    createHeading('##');
});

document.getElementById('editor-text-h3').addEventListener('click', function() {
    createHeading('###');
});

document.getElementById('editor-list-numbered').addEventListener('click', function() {
    createList('1.');
});

document.getElementById('editor-list-uo').addEventListener('click', function() {
    createList('-');
});

document.getElementById('editor-image').addEventListener('click', function() {
    createImage();
});

document.getElementById('editor-link').addEventListener('click', function() {
    createLink();
});

document.getElementById('editor').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addListItem();
        e.preventDefault(); // Prevent default behavior of Enter key
    }
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
            case 'b':
                event.preventDefault(); // Prevent default action
                wrapText('**');
                break;
            case 'i':
                if (event.shiftKey) { 
                    event.preventDefault();
                    createImage();
                } else {
                    event.preventDefault();
                    wrapText('*');
                }
                break;
            case 'u':
                if (event.shiftKey) {
                    event.preventDefault();
                    wrapText('__');
                }
                break;
            case 'l':
                if (event.shiftKey) {
                    event.preventDefault();
                    createLink();
                }
                break;
            case 'k':
                if (event.shiftKey) {
                    event.preventDefault();
                    wrapText('`');
                }
                break;
            case 'q':
                event.preventDefault();
                createHeading('> ');
                break;
        }
    }
});

function wrapText(markdown) {
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    // Check if the selected text itself is wrapped in markdown
    const isSelectedTextWrapped = selectedText.startsWith(markdown) && selectedText.endsWith(markdown);
    
    // Check if the text outside the selected text is wrapped in markdown
    const isOutsideWrapped = beforeText.endsWith(markdown) && afterText.startsWith(markdown);

    if (isSelectedTextWrapped) {
        // Unwrap selected text
        const unwrappedText = selectedText.slice(markdown.length, -markdown.length);
        textarea.value = beforeText + unwrappedText + afterText;
        textarea.selectionStart = start;
        textarea.selectionEnd = end - 2 * markdown.length;
    } else if (isOutsideWrapped) {
        // Unwrap outside text
        textarea.value = beforeText.slice(0, -markdown.length) + selectedText + afterText.slice(markdown.length);
        textarea.selectionStart = start - markdown.length;
        textarea.selectionEnd = end - markdown.length;
    } else {
        // Wrap selected text
        const wrappedText = markdown + selectedText + markdown;
        textarea.value = beforeText + wrappedText + afterText;
        textarea.selectionStart = start + markdown.length;
        textarea.selectionEnd = end + markdown.length;
    }
    textarea.focus();
}

function createHeading(markdown) {
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    // If text is selected, add the markdown at the beginning of the selected text with a space
    // If no text is selected, add the markdown with a space
    // If selected text is already a heading, remove the markdown

    // Determine the start of the current line
    const lineStart = beforeText.lastIndexOf('\n') + 1;

    // Extract the current line
    const currentLine = textarea.value.substring(lineStart, end);

    // Check if the current line already starts with the markdown
    if (currentLine.startsWith(markdown + ' ')) {
        // Remove the markdown from the start of the line
        textarea.value = beforeText.substring(0, lineStart) + currentLine.substring(markdown.length + 1) + afterText;
        textarea.selectionStart = start - (markdown.length + 1);
        textarea.selectionEnd = end - (markdown.length + 1);
    } else {
        // Add the markdown to the start of the line
        const newLine = markdown + ' ' + currentLine;
        textarea.value = beforeText.substring(0, lineStart) + newLine + afterText;
        textarea.selectionStart = start + markdown.length + 1;
        textarea.selectionEnd = end + markdown.length + 1;
    }

    textarea.focus();
}

function createImage() 
{
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end)|| 'Image description';
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    // if the selected text is a URL, then pre-fill the image URL in the prompt
    const selectedTextIsUrl = selectedText.match(/^https?:\/\/\S+$/);
    const imageUrl = selectedTextIsUrl ? selectedText : prompt('Enter the image URL:', 'https://');
    const imageAlt = selectedTextIsUrl ? 'Image description' : selectedText;


    if (!imageUrl) {
        return;
    }

    const image = `![${imageAlt}](${imageUrl})`;

    textarea.value = beforeText + image + afterText;
    textarea.selectionStart = start + 2;
    textarea.selectionEnd = start + 2 + imageAlt.length;
    textarea.focus();
}

function createLink() 
{
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Link text';
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    // if the selected text is a URL, then pre-fill the link URL in the prompt
    const selectedTextIsUrl = selectedText.match(/^https?:\/\/\S+$/);
    const linkUrl = selectedTextIsUrl ? selectedText : prompt('Enter the link URL:', 'https://');
    const linkText = selectedTextIsUrl ? 'Link text' : selectedText;

    if (!linkUrl) {
        return;
    }

    const link = `[${linkText}](${linkUrl})`;

    textarea.value = beforeText + link + afterText;
    textarea.selectionStart = start + 1;
    textarea.selectionEnd = start + 1 + linkText.length;
    textarea.focus();
}

function createList(prefix)
{
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    // if current line starts with the list prefix, remove it
    const currentLineStart = beforeText.lastIndexOf('\n') + 1;
    const currentLineEnd = afterText.indexOf('\n') === -1 ? textarea.value.length : end + afterText.indexOf('\n');
    const currentLine = textarea.value.substring(currentLineStart, currentLineEnd);
    const currentLinePrefix = currentLine.match(/^(\d+\.|-|\*\s)/);

    if (currentLinePrefix) {
        const currentLinePrefixLength = currentLinePrefix[0].length;
        const newLine = currentLine.slice(currentLinePrefixLength).trim(); // Remove the prefix and trim spaces
        const newBeforeText = beforeText.slice(0, currentLineStart);
        const newAfterText = afterText.trimStart(); // Remove leading spaces from afterText

        textarea.value = newBeforeText + newLine + newAfterText;
        textarea.selectionStart = currentLineStart + newLine.length;
        textarea.selectionEnd = textarea.selectionStart;
        return;
    }


    const lines = selectedText.split('\n');
    const list = lines.map(line => `${prefix} ${line}`).join('\n');

    textarea.value = beforeText + list + afterText;
    textarea.focus();
}

function addListItem()
{
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const value = textarea.value;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);

    const currentLineStart = beforeText.lastIndexOf('\n') + 1;
    const currentLineEnd = afterText.indexOf('\n') === -1 ? value.length : start + afterText.indexOf('\n');
    const currentLine = value.substring(currentLineStart, currentLineEnd).trim();

    const listItemMatch = currentLine.match(/^(\d+\.|-|\*\s)/);

    if (listItemMatch) {
        const listItemPrefix = listItemMatch[0];

        if (currentLine.length > listItemPrefix.length) {
            let newListItemPrefix = listItemPrefix;
            if (listItemPrefix.match(/^\d+\./)) {
                const currentNumber = parseInt(listItemPrefix, 10);
                newListItemPrefix = `${currentNumber + 1}. `;
            }

            const newListItem = `\n${newListItemPrefix} `;
            textarea.value = beforeText + newListItem + afterText;
            textarea.selectionStart = start + newListItem.length;
            textarea.selectionEnd = textarea.selectionStart;
        } else {
            // Remove the list item prefix if the current line is empty
            textarea.value = beforeText.slice(0, currentLineStart) + afterText.trim();
            textarea.selectionStart = currentLineStart;
            textarea.selectionEnd = textarea.selectionStart;
        }
    } else {
        textarea.value = beforeText + '\n' + afterText;
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = textarea.selectionStart;
    }
    textarea.focus();
}