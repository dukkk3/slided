export const variant = <Then = undefined, Else = undefined>(config: {
	if: boolean;
	then?: Then;
	else?: Else;
}) => {
	return config.if ? config.then : config.else;
};
