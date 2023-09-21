import React from "react";
import {unescape} from 'html-escaper';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {renderToStaticMarkup} from 'react-dom/server';

export const Code = ({children, inline = true, language = 'gdscript'}: { children: React.ReactNode, inline?: boolean, language?: 'gdscript' | string }) => {
	let str = ''
	if (children) {
		str = unescape(renderToStaticMarkup(children))
		str.replace(/&#x27;/g, "'kissa")
	}
	//bug: ' is encoded as &#39;
	return <SyntaxHighlighter
		language="gdscript"
		//style={oneLight}
		useInlineStyles={false}
		codeTagProps={{
			style: {}, className: `language-${language}`
		}}
		PreTag={inline ? 'span' : 'pre'}
		className={`language-${language}`} //extra/'undefined' props are passed into PreTag by react-syntax-highlighter
	>
		{str}
	</SyntaxHighlighter>
}