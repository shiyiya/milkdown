/* Copyright 2021, Milkdown by Mirone. */

/* This file only:
 * 1. provide common vite config for sub modules in `packages` dir,
 * 2. as config file for vitest.
 * Please don't use this file for other purpose.
 */

import path from 'path';
import type { Plugin } from 'rollup';
import autoExternal from 'rollup-plugin-auto-external';
import type { BuildOptions, UserConfig as ViteUserConfig } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { UserConfig } from 'vitest';

export const libFileName = (format: string) => `index.${format}.js`;

export const rollupPlugins: Plugin[] = [autoExternal()];

const resolvePath = (str: string) => path.resolve(__dirname, str);

export const external = [
    'tslib',
    '@emotion/css',
    '@emotion/cache',
    '@emotion/sheet',
    'remark',
    'vue',
    'react',
    'react-dom',
    '@milkdown/core',
    '@milkdown/ctx',
    '@milkdown/design-system',
    '@milkdown/exception',
    '@milkdown/prose',
    '@milkdown/transformer',
    '@milkdown/utils',
    '@milkdown/preset-gfm',
    '@milkdown/preset-commonmark',
    '@milkdown/plugin-clipboard',
    '@milkdown/plugin-collaborative',
    '@milkdown/plugin-cursor',
    '@milkdown/plugin-diagram',
    '@milkdown/plugin-emoji',
    '@milkdown/plugin-history',
    '@milkdown/plugin-indent',
    '@milkdown/plugin-listener',
    '@milkdown/plugin-math',
    '@milkdown/plugin-menu',
    '@milkdown/plugin-prism',
    '@milkdown/plugin-slash',
    '@milkdown/plugin-tooltip',
    '@milkdown/plugin-upload',
];

export const viteBuild = (packageDirName: string): BuildOptions => ({
    sourcemap: true,
    lib: {
        entry: resolvePath(`packages/${packageDirName}/src/index.ts`),
        name: `milkdown_${packageDirName}`,
        fileName: libFileName,
        formats: ['es'],
    },
    rollupOptions: {
        external,
        output: {
            dir: resolvePath(`packages/${packageDirName}/lib`),
        },
        plugins: rollupPlugins,
    },
});

export const pluginViteConfig = (packageDirName: string, options: ViteUserConfig = {}) => {
    const vitePlugins = options.plugins ?? [];
    return defineConfig({
        build: viteBuild(packageDirName),
        ...options,
        plugins: vitePlugins.concat(dts({ outputDir: 'lib', root: '.', insertTypesEntry: true })),
    });
};

export default defineConfig({
    test: {
        include: ['packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        environment: 'jsdom',
    },
} as UserConfig);
