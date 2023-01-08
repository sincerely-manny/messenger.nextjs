const acronym = (str: string) => str.match(/\b(\w)/g)?.join('');

export default acronym;
