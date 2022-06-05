import { createGlobalStyle, css } from "styled-components";

import { breakpoint } from "./breakpoint";
import { fontsStyle } from "./fonts";

export const GlobalStyle = createGlobalStyle`
    ${fontsStyle}

    html {
        font-size: 10px;
    }

    body {
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-style: normal;
        font-variant-ligatures: normal;
        font-variant-caps: normal;
        font-variant-numeric: normal;
        font-variant-east-asian: normal;
        font-weight: 400;
        font-stretch: normal;
        font-family: ${(props) => props.theme.font.primary};
        overflow: hidden;
        height: 100vh;

        --container-gap: 4rem;
        --container-bigger-gap: 10vw;

        --container-width-bigger: calc(100vw - var(--container-gap) * 2);
        --container-width-smaller: calc(100vw - var(--container-bigger-gap) * 2);

        ${breakpoint("mobile", "tablet")`
            --container-gap: 4.5vw;
        `}
    }

    * {
        margin: 0;
        padding: 0;
        outline: none;
        color: inherit;
        background: initial;
        box-sizing: border-box;
        cursor: inherit;
        border: initial;
        font-family: inherit;
        font-weight: inherit;
        text-align: inherit;
        font-size: inherit;
        text-decoration: initial;
        word-wrap: break-word;
        text-transform: inherit;

        ${breakpoint("mobile", "tablet")`
            cursor: inherit;
        `}
    }

    .lazyload,
    .lazyloading {
        opacity: 0;
    }
    
    .lazyloaded {
        opacity: 1;
        transition: opacity 250ms ease;
    }

    .animated-row span {
        white-space: pre;
        display: inline-block;
    }

    .animated-row.words span, .animated-row.chars span span {
        will-change: transform, opacity;
    }

    .safari-border-radius-overflow-bugfix {
        -webkit-mask-image: -webkit-radial-gradient(white, black);
    }

    p, p span {
        vertical-align: -webkit-baseline-middle;
    }

    #app {
       height: 100%;
       overflow: inherit;
    }

    img {
        max-width: 100%;
        max-height: 100%;
    }
    
    button {
        cursor: pointer;
    }

    input,
    textarea,
    select {
        border: initial;
        padding: initial;
        background: initial;
    }
    
    svg {
        width: 100%;
        height: 100%;

        &.icon {
         fill: inherit;
         stroke: inherit;
         stroke-width: inherit;

            g, path {
                  stroke: inherit;
                  fill: inherit;
                  stroke-width: inherit;
            }
         }
    }
    
    .noselect {
        user-select: none;
    }
`;

export const descriptionMixin = css`
	line-height: 100%;
	font-weight: 700;
	text-align: center;
	color: black;
`;
