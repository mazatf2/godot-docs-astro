import {CodeTabList} from './CodeTabList'
import {convertBBTags_to_html} from '../../../bbcode/bbcode'
import React from 'react'

function handleSplitting(str: string) {
	let out = []
	let endTagToSearch = ''
	let codeBlockStr = ''
	let isFirstCodeLine = false

	for (const line of str.split('\n')) {

		const tags = ['<code>', '</code>', '<codeblocks>', '</codeblocks>', '<codeblock>', '</codeblock>', '<gdscript>', '</gdscript>', '<csharp>', '</csharp>']
			.map(i => i.replaceAll('<', '['))
			.map(i => i.replaceAll('>', ']'))
		for (let i = 0; i < tags.length; i += 2) {
			if (endTagToSearch) {

				break
			}
			const startTag = tags[i]
			const endTag = tags[i + 1]
			if (line.includes(startTag) && !line.includes(endTag)) {
				endTagToSearch = endTag
				isFirstCodeLine = true
				break
			}
		}
		//build codeblock
		if (endTagToSearch) {
			//line = line.replaceAll('\t', '')
			if (isFirstCodeLine) {
				codeBlockStr += line
			} else {
				codeBlockStr += '\n' + line
			}
			isFirstCodeLine = false
			if (line.includes(endTagToSearch)) {
				out.push(<CodeTabList code={codeBlockStr}/>)
				endTagToSearch = ''
				codeBlockStr = ''

			}
		} else {
			let temp = line
			//temp = temp.replaceAll('[', 'kona')
			//line.replaceAll(']', 'santti')
			temp = convertBBTags_to_html(temp)
			//line.replaceAll('kona', '[')
			out.push(<p dangerouslySetInnerHTML={{__html: temp}} key={Math.random()}></p>)
		}
	}
	return out
}

export const handleDesc = (desc: string) => {
	//desc = convertBBTags_to_html(desc)
	return handleSplitting(desc)
}