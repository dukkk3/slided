declare module "styled-components-grid" {
	interface GridInterface extends React.FC<React.ComponentPropsWithRef<"div">> {
		Unit: React.FC<React.ComponentPropsWithRef<"div"> & { size: number }>;
	}

	declare const Grid: GridInterface;

	export default Grid;
}
