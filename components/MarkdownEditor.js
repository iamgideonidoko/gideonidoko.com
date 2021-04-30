// import react, react-markdown-editor-lite, and a markdown parser you like
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MarkdownIt from 'markdown-it'
import dynamic from 'next/dynamic';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

//get the highlight.js library
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt({
	//highlight is used to highlight the code syntax
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		return ''; //use external default escaping
	}
});

//dynamically fetch the `react-markdown-editor-lite` libary to avoid running on the server
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false})

// handle markdown editor change
/*
const handleEditorChange = ({html, text}) => {    
  console.log('handleEditorChange', html, text)
}
*/

 const MarkdownEditor = (props) => {
  return (
    <MdEditor
      style={{ height: "800px" }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={props.handleMarkdownEditorChange}
      value={props.textValue}
    />
  )
}

export default MarkdownEditor;