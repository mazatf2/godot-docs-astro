import xmlPathsJson from "./xmlpaths.json" assert {type: "json"}
/**
 * @type {typeof import("./ExtensionsApi").ExtensionsAPI }
 */
import dataJson from "./extension_api.json" assert {type: "json"}
import {get} from "./inheritance.mjs"
import Fs from "fs"

const isNodeRe = /^Node$/gm

function genTags() {
	/**
	 * @type {Record<string, string[]>}
	 */
	const tagPages = {}
	/**
	 * @type {Record<string, string[]>}
	 */
	const out = {}
	dataJson.classes.forEach(node => {
		out[node.name] = out[node.name] || []

		node.is_refcounted && out[node.name].push('is_refcounted')
		node.is_instantiable && out[node.name].push('is_instantiable')

		node.name.toLowerCase().includes('vehicle') && out[node.name].push('vehicle')
		const inherits = get(node.name)

		inherits.forEach(i => {
			const resource = i[0].includes('Resource')
			resource && out[node.name].push('resource')

			isNodeRe.test(i[0]) && out[node.name].push('Node')
			i[0].includes('Node2D') && out[node.name].push('Node2D')
			i[0].includes('Node3D') && out[node.name].push('Node3D')
		})

		out[node.name].push(node.api_type)
		out[node.name].push('not_builtin_classes')
		dataJson.singletons.some(i => i.name === node.name) && out[node.name].push('singleton')

	})
	dataJson.builtin_classes.forEach(node => {
		out[node.name] = out[node.name] || []
		node.indexing_return_type && out[node.name].push(node.indexing_return_type)

		out[node.name].push('builtin_classes')
		dataJson.singletons.some(i => i.name === node.name) && out[node.name].push('singleton')

	})
	Object.entries(xmlPathsJson).forEach(([node, path]) => {
		out[node] = out[node] || ['from xmlPathsJson']
		//is_deprecated, is_experimental
	})
	Object.entries(out).forEach(([name, tagsArr]) => {
		tagsArr.forEach(tag => {
			tagPages[tag] = tagPages[tag] || []
			tagPages[tag].push(name)
		})
	})
	Fs.writeFile('./tags.json',
		JSON.stringify(out, null, '\t'), 'utf8', i => {
		})
	Fs.writeFile('./tagpages.json',
		JSON.stringify(tagPages, null, '\t'), 'utf8', i => {
		})
}

genTags()

function build() {
	let out = []
	Object.entries(xmlPathsJson).forEach(([key, v]) => {

		out.push({
			params: {className: key},
			props: {}
		})
	})
	out.sort((a, b) => a.params.className.localeCompare(b.params.className))

	Fs.writeFile('./classes.json', JSON.stringify(out, null, '\t'), 'utf8', i => {

	})
}

build()