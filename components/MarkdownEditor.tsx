// import react, react-markdown-editor-lite, and a markdown parser you like
import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import dynamic from 'next/dynamic';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
// plugins
import markdownItAttrs from 'markdown-it-attrs';
import markdownItContainer from 'markdown-it-container';
import Prism from 'prismjs';
import { embedHtml } from '../helper';
import { loadLanguages } from '../pages/blog/[slug]';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt({
    //highlight is used to highlight the code syntax
    highlight: function (str, lang) {
        if (lang) {
            loadLanguages([lang]);
            try {
                return `<pre class="postBodyPreCode language-${lang}"><code class="language-${lang}">${Prism.highlight(
                    str,
                    Prism.languages[lang],
                    lang,
                )}</code></pre>`;
                // return Prism.highlight(str, Prism.languages[lang], lang);
            } catch (__) {
                return `<pre class="postBodyPreCode"><code class="language-${lang}">${str}</code></pre>`;
            }
        }

        return str; //use external default escaping
    },
    // html: true,
    // linkify: true,
    // breaks: true,
});

mdParser.use(markdownItAttrs, {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: ['id', 'class'], // empty array = all attributes are allowed
});
mdParser.use(markdownItContainer, 'embedhtml', {});

//dynamically fetch the `react-markdown-editor-lite` libary to avoid running on the server
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

const MarkdownEditor = ({
    textValue,
    handleMarkdownEditorChange,
}: {
    textValue: string;
    handleMarkdownEditorChange: ({ text }: { text: string }) => void;
}) => {
    return (
        <>
            <div>
                <h4>
                    <i>Tips:</i>
                </h4>
                <p>
                    <pre>{`Use {.class} for class, {#id} for id and \n::: embedhtml\n [html] \n::: to embed html`}</pre>
                </p>
            </div>
            <br />
            <MdEditor
                style={{ height: '800px' }}
                renderHTML={(text) => embedHtml(mdParser.render(text))}
                onChange={handleMarkdownEditorChange}
                value={textValue}
            />
        </>
    );
};

export default MarkdownEditor;
