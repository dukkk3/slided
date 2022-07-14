import { a, config, useSpring } from "react-spring";
import { useTheme } from "styled-components";

import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

export const LandscapePlug = () => {
	const theme = useTheme();
	const { opacity1, opacity2, rotate } = useSpring({
		from: { opacity1: 1, opacity2: 0, rotate: 0 },
		to: { opacity1: 0, opacity2: 1, rotate: 30 },
		loop: { reverse: true },
		config: config.slow,
	});

	return (
		<S.LandscapePlug>
			<S.SmileGroup style={{ rotate }}>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 139 139' fill='none'>
					<circle cx='69.0757' cy='69.5' r='69' fill={theme.color.primary} />
					<a.g style={{ opacity: opacity1.to(interpolations.range(0.4, 1)) }}>
						<circle cx='49.3198' cy='50' r='6.5' fill='black' />
						<circle cx='85.3198' cy='50' r='6.5' fill='black' />
						<ellipse cx='67.8198' cy='95.5' rx='11' ry='19' fill='black' />
					</a.g>
					<a.g style={{ opacity: opacity2.to(interpolations.range(0.4, 1)) }}>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M35.6391 78.8436C35.5561 79.6245 35.5137 80.4149 35.5137 81.2133C35.5137 96.1353 50.3162 108.232 68.576 108.232C86.8359 108.232 101.638 96.1353 101.638 81.2133C101.638 80.4149 101.596 79.6245 101.513 78.8436H35.6391Z'
							fill='black'
						/>
						<path
							d='M51.8288 50.2374L41.2632 45.4936V40.7499L57.4351 48.2968V52.178L41.2632 59.7249V54.9811L51.8288 50.2374Z'
							fill='black'
						/>
						<path
							d='M81.3694 50.2374L91.9351 54.9811L91.9351 59.7249L75.7632 52.178L75.7632 48.2967L91.9351 40.7499L91.9351 45.4936L81.3694 50.2374Z'
							fill='black'
						/>
					</a.g>
				</svg>
			</S.SmileGroup>
			<S.Description>
				Ah, not ready for this yet...
				<br />
				Try it with your presentation
			</S.Description>
		</S.LandscapePlug>
	);
};
