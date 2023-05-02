/**
 * @type {typeof import("./ExtensionsApi").ExtensionsAPI }
 */
const Extensions_Api = require('./extension_api.json')
const {writeFile} = require('node:fs/promises')

const build = async () => {
	const allObjects = [...Extensions_Api.classes, ...Extensions_Api.builtin_classes]
	const classesByName = Object.fromEntries(allObjects.map(i => [i.name, i]))
	/**
	 * @type {Record<string, {inherits: [], inheritedBy: [], name: string}>}>
	 */
	const outGraph = {}
	for (const obj of Object.values(classesByName)) {
		outGraph[obj.name] = {inherits: [], inheritedBy: [], name: obj.name}
	}

	for (const currentClass of Object.values(classesByName)) {
		const we_inherit_this_name = currentClass?.inherits
		if (we_inherit_this_name) {
			outGraph[currentClass.name].inherits.push(we_inherit_this_name)
			outGraph[we_inherit_this_name].inheritedBy.push(currentClass.name)
		}
	}

	await writeFile('./inheritance.json', JSON.stringify(outGraph, null, '\t'))
	console.log('done')
}
build()