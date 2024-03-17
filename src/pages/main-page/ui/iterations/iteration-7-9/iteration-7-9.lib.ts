export const calculateCardTranslate = (value: number, index: number, offset: number) => {
	return index === 0 ? `${offset * value}%` : `-${index * 115 * value - offset * value}%`;
};
