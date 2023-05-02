import inheritanceJson from './inheritance.json' assert {type: 'json'}

/**
 * @param {string} className
 */
export function get(className) {
	/**
	 * @type {[string, string[]][]}
	 */
	const out = []

	/**
	 * @param {string} str
	 */
	function get2(str) {
		if (!inheritanceJson[str]) {
			return
		}
		const inherits = inheritanceJson[str].inherits
		const inheritedBy = inheritanceJson[str].inheritedBy

		out.push([str, inheritedBy])

		if (inherits[0]) {
			get2(inherits[0])
		}
	}

	get2(className)
	return out
}
