export const AssignComponentProps = <Props, Data>(
	component: React.FC<Props>,
	props: Data
): React.FC<Props> & Data => Object.assign(component, props);
