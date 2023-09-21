import React from 'react'
// @ts-ignore
import {DOMParser} from 'linkedom'
import type {xmlDoc} from './xmlParameters'
import { Code } from './Themes'

const tagnames_index_by_label: Record<string, string> = {
	'a-code': 'Code',
	'a-codeblock': 'Code',
	'a-gdscript': 'GDScript',
	'a-csharp': 'C#',
}

export const CodeTabList = ({code}: { code: string }) => {
	code = code.replaceAll('[code]', '<a-code>')
		.replaceAll('[/code]', '</a-code>')
		.replaceAll('[codeblock]', '<a-codeblock>')
		.replaceAll('[/codeblock]', '</a-codeblock>')
		.replaceAll('[gdscript]', '<a-gdscript>')
		.replaceAll('[/gdscript]', '</a-gdscript>')
		.replaceAll('[csharp]', '<a-csharp>')
		.replaceAll('[/csharp]', '</a-csharp>')
	const dom = new DOMParser().parseFromString(code, 'text/xml')
	const codeEl = dom.querySelector('a-code')
	const codeBlockEl = dom.querySelector('a-codeblock')
	const gdscriptEL = dom.querySelector('a-gdscript')
	const csharpEl = dom.querySelector('a-csharp')

	const elArr = [codeEl, codeBlockEl, gdscriptEL, csharpEl]
	const needsBlocks = elArr.filter(i => i).length > 1

	return <>
		{elArr.map(i =>
			<CodeContent needsBlocks={needsBlocks} el={i}/>
		)}
	</>
}

type Code = {
	needsBlocks: boolean
	el: xmlDoc | undefined
}

const CodeContent = ({needsBlocks, el}: Code) => {
	if (!el) return <></>
	const label = tagnames_index_by_label[el.tagName] || ''
	let language = 'gdscript'
	if(el.tagName && el.tagName.includes('csharp')){
		language = 'csharp'
	}
	return <>
		{needsBlocks && <>
			<p>{label}</p>
		</>}
		<Code language={language} inline={false}>
			{el.textContent.trim()}
		</Code>
	</>
}