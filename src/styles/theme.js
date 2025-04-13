'use client';
import { darken, lighten, mix } from 'polished';

const utils = {
    intensed: (color) => darken(0.1, color),
    disabled: (color) => mix(0.5, color, '#CCC'),
    outline:  (color) => mix(0.8, color, '#FFF'),
    darkMode: (color) => lighten(0.2, color),
};
const colors = {
    primary: '#8BBad4',
    secondary: '#2ecc71',
    third: '#e74c3c',
    white: ['#FFFFFF', '#F5F5F5', '#EEEEEE'],
    black: ['#000000', '#070707', '#111111'],
    gray: ['#BBBBBB', '#999999', '#777777'],
};

const theme = {
    colors : {
        primary: colors.primary,
        secondary: colors.secondary,
        third: colors.third,
        white: colors.white,
        black: colors.black,
        gray: colors.gray,
    },
    palette: {
        primary: {
            default: colors.primary,
            intensed: utils.intensed(colors.primary),
            disabled: utils.disabled(colors.primary),
            outline: utils.outline(colors.primary),
            dark: utils.darkMode(colors.primary),
        },
        secondary: {
            default: colors.secondary,
            intensed: utils.intensed(colors.secondary),
            disabled: utils.disabled(colors.secondary),
            outline: utils.outline(colors.secondary),
            dark: utils.darkMode(colors.secondary),
        },
        third: {
            default: colors.third,
            intensed: utils.intensed(colors.third),
            disabled: utils.disabled(colors.third),
            outline: utils.outline(colors.third),
            dark: utils.darkMode(colors.third),
        },
    },
};

export default theme;