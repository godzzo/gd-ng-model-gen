
export function SetNames(data: any): any {
	const arrWords = data.name.split(/_/g);
	const arrHypen: string[] = [];
	const arrCapital: string[] = [];
	const arrLowerCamel: string[] = [];

	arrWords.forEach((word: string) => {
		const upper = word.charAt(0).toUpperCase() + word.substring(1);

		if (arrLowerCamel.length < 1) {
			arrLowerCamel.push(word);
		} else {
			arrLowerCamel.push(upper);
		}

		arrCapital.push(upper);

		arrHypen.push(word);
	});

	data.lowerCamelName = arrLowerCamel.join('');
	data.hypeName = arrHypen.join('-');
	data.periodName = arrHypen.join('.');
	data.camelName = arrCapital.join('');

	return data;
}

console.log(SetNames({name: 'hello'}));
console.log(SetNames({name: 'hello_world'}));
console.log(SetNames({name: 'hello_world_how_are_u'}));
