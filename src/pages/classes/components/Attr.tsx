export class Attr extends String {
	txt = ''
	name = ''

	constructor(name: string, el: Element) {
		super()
		this.name = name
		this.txt = el.attributes[name]?.value || ''//'noValue'
	}

	toString(): string {
		if (this.txt === 'noValue') {
			return ''
		}
		/*
		switch (this.name) {
			case 'enum':
				return ' enum ' + this.txt
			case 'default':
				return ' = ' + this.txt
		}
		*/
		return this.txt
	}

	//for if(str)
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
	//sidebar -> Inheritance: -> Object -> Methods
	valueOf() {
		if (this.txt === 'noValue') {
			//return String('')
		}
		return this.txt
	}

	valid() {
		return Boolean(this.txt)
	}
}