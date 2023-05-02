import type {ExtensionsAPI} from '../data/ExtensionsApi'
import ExtensionsApiJsonModule from '../data/extension_api.json'

const ExtensionsApiJson = ExtensionsApiJsonModule as ExtensionsAPI

const isLocalEnum = (className: string, enumName: string): boolean => {
	let isLocal = ExtensionsApiJson.classes.some(i => i.name === className && i.enums?.some(iEnum => iEnum.name === enumName))
	if (isLocal) {
		return true
	}
	return ExtensionsApiJson.builtin_classes.some(i => i.name === className && i.constants?.some(iEnum => iEnum.name === enumName))

}
const isGlobalEnum = (name: string) => ExtensionsApiJson.global_enums.some(i => i.name == name)

function replaceTag(str: string, tag: string, replaceStart: string, replaceEnd: string = '') {
	replaceEnd = replaceEnd || replaceStart
	str = str.replaceAll(`[${tag}]`, replaceStart)
	str = str.replaceAll(`[/${tag}]`, replaceEnd)
	return str
}

function convertBBLocal_to_a(str: string, tag: string, re: RegExp) {
	const match = str.matchAll(re)
	for (const temp of match) {
		if (!temp || !temp.groups) {
			return str
		}

		if (tag === 'enum' && isGlobalEnum(temp.groups.target)) { //TODO switch isGlobalEnum() to isLocalEnum()
			str = str.replaceAll(`[${tag} ${temp.groups.target}]`,
				`<a href="/classes/@GlobalScope#${temp.groups.target}">${temp.groups.target}</a>`)
		} else {
			str = str.replaceAll(`[${tag} ${temp.groups.target}]`,
				`<a href="#${temp.groups.target}">${temp.groups.target}</a>`)
		}
	}
	//https://github.com/godotengine/godot-docs/blob/20e2417231babc2dcd6d0bbcd2b3aaa3b59d26dc/tutorials/scripting/gdscript/gdscript_documentation_comments.rst?plain=1#LL183C41-L183C84
	//[enum EulerOrder] is link to local enum, but it might link to global enum instead
	//https://github.com/godotengine/godot/blob/7a0977ce2c558fe6219f0a14f8bd4d05aea8f019/doc/classes/Basis.xml#L73
	//[enum EulerOrder] should probably be [enum @GlobalScope.EulerOrder]

	//[method @GlobalScope.clamp]
	str = convertBBGlobal_to_a(str, tag, new RegExp(`\\[${tag} (?<target>.+)\\.(?<hash>\\w+)]`, 'gm'))
	return str
}

function convertBBLocal_md(str: string, tag: string, re: RegExp) {
	const match = str.matchAll(re)
	for (const temp of match) {
		if (!temp || !temp.groups) {
			return str
		}
		str = str.replaceAll(`[${tag} ${temp.groups.target}]`,
			`[${temp.groups.target}](#${temp.groups.target})`)
	}
	str = convertBBGlobal_md(str, tag, new RegExp(`\\[${tag} (?<target>\\w+)\\.(?<hash>\\w+)]`, 'gm'))
	return str
}

function convertBBGlobal_to_a(str: string, tag: string, re: RegExp) {
	const match = str.matchAll(re)
	for (const temp of match) {
		if (!temp || !temp.groups) {
			return str
		}
		str = str.replaceAll(`[${tag} ${temp.groups.target}.${temp.groups.hash}]`,
			`<a href="/classes/${temp.groups.target}#${temp.groups.hash}">${temp.groups.target}.${temp.groups.hash}</a>`)
	}
	return str
}

function convertBBGlobal_md(str: string, tag: string, re: RegExp) {
	const match = str.matchAll(re)
	for (const temp of match) {
		if (!temp || !temp.groups) {
			return str
		}
		str = str.replaceAll(`[${tag} ${temp.groups.target}.${temp.groups.hash}]`,
			`[${temp.groups.target}.${temp.groups.hash}](../${temp.groups.target}#${temp.groups.hash})`)
	}
	return str
}

function convertUlr_to_a(str: string, tag: string, re: RegExp) {
	const match = str.matchAll(re)

	for (const temp of match) {
		if (!temp || !temp.groups) {
			return str
		}
		str = str.replaceAll(`[url=${temp.groups.url}]${temp.groups.text}[/url]`,
			`<a href=${temp.groups.url}>${temp.groups.text}</a>`)
	}
	return str
}

function convertUlr_md(str: string, tag: string, re: RegExp) {
	const match = str.matchAll(re)

	for (const temp of match) {
		if (!temp || !temp.groups) {
			return str
		}
		str = str.replaceAll(`[url=${temp.groups.url}]${temp.groups.text}[/url]`,
			`[${temp.groups.text}](${temp.groups.url})`)
	}
	return str
}

function convertBBLinks_to_a(str: string) {
	const bbLinks = str.matchAll(/\[(?<target>\w+)](?<nextChar>[^(])/gm)
	for (const match of bbLinks) {
		if (!match || !match.groups) {
			continue
		}
		str = str.replaceAll(`[${match.groups.target}]${match.groups.nextChar}`,
			`<a href="/classes/${match.groups.target}">${match.groups.target}</a>${match.groups.nextChar}`)
	}
	return str
}

function convertBBLinks_md(str: string) {
	const bbLinks = str.matchAll(/\[(?<target>\w+)](?<nextChar>[^(])/gm)
	for (const match of bbLinks) {
		if (!match || !match.groups) {
			continue
		}
		str = str.replaceAll(`[${match.groups.target}]${match.groups.nextChar}`,
			`[${match.groups.target}](../${match.groups.target})${match.groups.nextChar}`)
	}
	return str
}

export function convertBBTags_md(str: string) {
	//https://docs.godotengine.org/en/latest/contributing/documentation/class_reference_primer.html#linking
	//https://docs.godotengine.org/en/latest/tutorials/scripting/gdscript/gdscript_documentation_comments.html#bbcode-and-class-reference
	str = replaceTag(str, 'b', '**')
	str = replaceTag(str, 'i', '*')
	str = replaceTag(str, 'kbd', '<kbd>', '</kbd>')

	str = replaceTag(str, 'code', '`')
	str = replaceTag(str, 'codeblocks', '<!-- <codeblocks> -->', '<!-- </codeblocks> -->')
	str = replaceTag(str, 'codeblock', '```gdscript', '```')
	str = replaceTag(str, 'gdscript', '```gdscript', '```')
	str = replaceTag(str, 'csharp', '```csharp', '```')

	str = convertBBLocal_md(str, 'annotation', /\[annotation (?<target>\w+)]/gm)
	str = convertBBLocal_md(str, 'constant', /\[constant (?<target>\w+)]/gm)
	str = convertBBLocal_md(str, 'enum', /\[enum (?<target>\w+)]/gm)
	str = convertBBLocal_md(str, 'method', /\[method (?<target>\w+)]/gm)
	str = convertBBLocal_md(str, 'member', /\[member (?<target>\w+)]/gm)
	str = convertBBLocal_md(str, 'signal', /\[signal (?<target>\w+)]/gm)
	str = convertBBLocal_md(str, 'theme_item', /\[theme_item (?<target>\w+)]/gm)

	str = convertBBLocal_md(str, 'param', /\[param (?<target>\w+)]/gm)

	//[url=$DOCS_URL/tutorials/plugins/running_code_in_the_editor.html]tool scripts[/url]
	str = convertUlr_md(str, 'url', /\[url=(?<url>[^\]]+)](?<text>[^[]+)/gm)

	const hasUnclosedTags = str.match(/\[\\.+]/)
	if (hasUnclosedTags) {
		console.error(str)
		throw 'hasUnclosedTags'
	}

	//[Vector3], [Node]
	str = convertBBLinks_md(str) //TODO check if inside code block
	//The vector's X component. Also accessible by using the index position [code][0][/code].
	//The vector's X component. Also accessible by using the index position `[0](../0)`.

	return str
}

export function convertBBTags_to_html(str: string) {
	//https://docs.godotengine.org/en/latest/contributing/documentation/class_reference_primer.html#linking
	//https://docs.godotengine.org/en/latest/tutorials/scripting/gdscript/gdscript_documentation_comments.html#bbcode-and-class-reference
	str = replaceTag(str, 'b', '<b>', '</b>')
	str = replaceTag(str, 'i', '<i>', '</i>')
	str = replaceTag(str, 'kbd', '<kbd>', '</kbd>')

	str = replaceTag(str, 'code', '<code>', '</code>')
	str = replaceTag(str, 'codeblocks', '<codeblocks>', '</codeblocks>')
	str = replaceTag(str, 'codeblock', '<codeblock>', '</codeblock>')
	str = replaceTag(str, 'gdscript', '<gdscript>', '</gdscript>')
	str = replaceTag(str, 'csharp', '<csharp>', '</csharp>')
	/*
	str = replaceTag(str, 'codeblocks', '<code>', '</code>')
	str = replaceTag(str, 'codeblock', '<code>', '</code>')
	str = replaceTag(str, 'gdscript', '<code>', '</code>')
	str = replaceTag(str, 'csharp', '<code>', '</code>')
	*/
	str = convertBBLocal_to_a(str, 'annotation', /\[annotation (?<target>\w+)]/gm) //FIXME [annotation @GDScript.@rpc].
	str = convertBBLocal_to_a(str, 'constant', /\[constant (?<target>\w+)]/gm)
	str = convertBBLocal_to_a(str, 'enum', /\[enum (?<target>\w+)]/gm)
	str = convertBBLocal_to_a(str, 'method', /\[method (?<target>\w+)]/gm) //don't match [method @GlobalScope.clamp]
	str = convertBBLocal_to_a(str, 'member', /\[member (?<target>\w+)]/gm)
	str = convertBBLocal_to_a(str, 'signal', /\[signal (?<target>\w+)]/gm)
	str = convertBBLocal_to_a(str, 'theme_item', /\[theme_item (?<target>\w+)]/gm)

	//See [enum MultiplayerAPI.RPCMode] and [enum MultiplayerPeer.TransferMode]. An alternative is an
	// enum link is broken
	//http://localhost:3000/classes/Node#rpc_config

	//[param pre_a]
	const paramRe = /\[param (?<txt>\w+)]/gm
	const match = str.matchAll(paramRe)
	for (const temp of match) {
		if (!temp || !temp.groups) {
			continue
		}
		str = str.replaceAll(`[param ${temp.groups.txt}]`,
			`<code>${temp.groups.txt}</code>`) //or <var> (it's rendered as code in official docs)
	}

	//[url=$DOCS_URL/tutorials/plugins/running_code_in_the_editor.html]tool scripts[/url]
	str = convertUlr_to_a(str, 'url', /\[url=(?<url>[^\]]+)](?<text>[^[]+)/gm) //TODO fix invalid urls

	const hasUnclosedTags = str.match(/\[\\.+]/)
	if (hasUnclosedTags) {
		console.error(str)
		throw 'hasUnclosedTags'
	}

	//[Vector3], [Node]
	str = convertBBLinks_to_a(str) //TODO check if inside code block
	//The vector's X component. Also accessible by using the index position [code][0][/code].
	//The vector's X component. Also accessible by using the index position `[0](../0)`.

	return str
}