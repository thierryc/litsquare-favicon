#!/usr/bin/env node
import { mkdir, readFile, writeFile, copyFile, access, stat } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIco } from '../src/ico.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');

const defaultConfig = {
  publicDir: 'public',
  sourceDir: 'litsquare-favicon/source',
  appName: 'My Project',
  shortName: 'App',
  themeColorLight: '#e5e7eb',
  themeColorDark: '#171717',
  backgroundColor: '#e5e7eb',
  maskIconColor: '#171717',
  includeSafariPinnedTab: false,
  htmlHeadPath: 'litsquare-favicon/head.html',
  reactComponentPath: 'src/seo/FaviconLinks.tsx'
};

function usage() {
  return `litsquare-favicon

Usage:
  litsquare-favicon init [--target .] [--public-dir public] [--framework react|html|none] [--force]
  litsquare-favicon generate [--target .] [--config litsquare.favicon.json] [--source dir] [--public-dir dir]
  litsquare-favicon validate [--target .] [--config litsquare.favicon.json]

Figma source contract:
  Export the Litsquare Favicon community file frames as SVG into the configured sourceDir.
  Required: favicon.svg
  Optional: icon.svg, icon-maskable.svg, apple-touch-icon.svg, safari-pinned-tab.svg
`;
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = { _: [] };
  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index];
    if (!item.startsWith('--')) {
      flags._.push(item);
      continue;
    }
    const [rawKey, inlineValue] = item.slice(2).split('=');
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inlineValue !== undefined) {
      flags[key] = inlineValue;
      continue;
    }
    const next = rest[index + 1];
    if (!next || next.startsWith('--')) {
      flags[key] = true;
      continue;
    }
    flags[key] = next;
    index += 1;
  }
  return { command, flags };
}

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function writeJson(filePath, data, force = false) {
  if (!force && await exists(filePath)) return false;
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
  return true;
}

async function copyTemplate(templatePath, destinationPath, force = false) {
  if (!force && await exists(destinationPath)) return false;
  await ensureDir(path.dirname(destinationPath));
  await copyFile(path.join(packageRoot, templatePath), destinationPath);
  return true;
}

async function writeText(filePath, text, force = false) {
  if (!force && await exists(filePath)) return false;
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, text);
  return true;
}

async function loadConfig(target, configPath = 'litsquare.favicon.json') {
  const absolutePath = path.resolve(target, configPath);
  if (!await exists(absolutePath)) return { ...defaultConfig };
  const parsed = JSON.parse(await readFile(absolutePath, 'utf8'));
  return { ...defaultConfig, ...parsed };
}

async function importSharp() {
  try {
    const mod = await import('sharp');
    return mod.default;
  } catch (error) {
    throw new Error(`The generate command requires sharp. Run npm install, pnpm install, or install litsquare-favicon as a project dependency.\n${error.message}`);
  }
}

function resolveConfig(flags, config) {
  return {
    ...config,
    sourceDir: flags.source || config.sourceDir,
    publicDir: flags.publicDir || config.publicDir
  };
}

async function findSource(sourceDir, names) {
  for (const name of names) {
    const candidate = path.join(sourceDir, name);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

async function renderPng(sharp, sourcePath, size, destinationPath) {
  await ensureDir(path.dirname(destinationPath));
  await sharp(sourcePath).resize(size, size, { fit: 'contain' }).png().toFile(destinationPath);
}

async function copyIfExists(sourcePath, destinationPath) {
  if (!sourcePath) return false;
  await ensureDir(path.dirname(destinationPath));
  await copyFile(sourcePath, destinationPath);
  return true;
}

async function generateManifest(publicDir, config) {
  const manifest = {
    name: config.appName,
    short_name: config.shortName,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    theme_color: config.themeColorLight,
    background_color: config.backgroundColor,
    display: 'standalone'
  };
  await writeFile(path.join(publicDir, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);
}

function headHtml(config) {
  const maskLine = config.includeSafariPinnedTab
    ? `\n<link rel="mask-icon" href="/safari-pinned-tab.svg" color="${config.maskIconColor}">`
    : '';
  return `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${config.themeColorLight}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${config.themeColorDark}" media="(prefers-color-scheme: dark)">${maskLine}
`;
}

function reactComponent(config) {
  const maskLine = config.includeSafariPinnedTab
    ? `\n      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="${config.maskIconColor}" />`
    : '';
  return `export function FaviconLinks() {
  return (
    <>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="${config.themeColorLight}" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="${config.themeColorDark}" media="(prefers-color-scheme: dark)" />${maskLine}
    </>
  )
}
`;
}

async function initProject(flags) {
  const target = path.resolve(flags.target || '.');
  const force = Boolean(flags.force);
  const framework = flags.framework || 'react';
  const config = {
    ...defaultConfig,
    publicDir: flags.publicDir || defaultConfig.publicDir
  };
  const written = [];
  const skipped = [];

  const track = async (label, action) => {
    if (await action()) written.push(label);
    else skipped.push(label);
  };

  await track('litsquare.favicon.json', () => writeJson(path.join(target, 'litsquare.favicon.json'), config, force));
  await track(config.htmlHeadPath, () => writeText(path.join(target, config.htmlHeadPath), headHtml(config), force));
  await track('litsquare-favicon/README.md', () => copyTemplate('figma/README.md', path.join(target, 'litsquare-favicon/README.md'), force));
  await track('litsquare-favicon/source/favicon.svg', () => copyTemplate('templates/source/favicon.svg', path.join(target, 'litsquare-favicon/source/favicon.svg'), force));
  await track('litsquare-favicon/source/icon.svg', () => copyTemplate('templates/source/icon.svg', path.join(target, 'litsquare-favicon/source/icon.svg'), force));
  await track('litsquare-favicon/source/icon-maskable.svg', () => copyTemplate('templates/source/icon-maskable.svg', path.join(target, 'litsquare-favicon/source/icon-maskable.svg'), force));
  await track('SKILL.md', () => copyTemplate('templates/skill/codex/SKILL.md', path.join(target, 'SKILL.md'), force));
  await track('CLAUDE.md', () => copyTemplate('templates/skill/claude/SKILL.md', path.join(target, 'CLAUDE.md'), force));

  if (framework === 'react') {
    await track(config.reactComponentPath, () => writeText(path.join(target, config.reactComponentPath), reactComponent(config), force));
  }

  return { target, written, skipped };
}

async function generateProject(flags) {
  const target = path.resolve(flags.target || '.');
  const loadedConfig = await loadConfig(target, flags.config || 'litsquare.favicon.json');
  const config = resolveConfig(flags, loadedConfig);
  const sourceDir = path.resolve(target, config.sourceDir);
  const publicDir = path.resolve(target, config.publicDir);
  const sharp = await importSharp();

  const faviconSource = await findSource(sourceDir, ['favicon.svg']);
  if (!faviconSource) {
    throw new Error(`Missing required source: ${path.join(sourceDir, 'favicon.svg')}`);
  }

  const iconSource = await findSource(sourceDir, ['icon.svg', 'favicon.svg']);
  const maskableSource = await findSource(sourceDir, ['icon-maskable.svg', 'icon.svg', 'favicon.svg']);
  const appleSource = await findSource(sourceDir, ['apple-touch-icon.svg', 'icon.svg', 'favicon.svg']);
  const safariSource = await findSource(sourceDir, ['safari-pinned-tab.svg']);

  await ensureDir(publicDir);
  await copyFile(faviconSource, path.join(publicDir, 'favicon.svg'));
  await renderPng(sharp, faviconSource, 96, path.join(publicDir, 'favicon-96x96.png'));
  await renderPng(sharp, appleSource, 180, path.join(publicDir, 'apple-touch-icon.png'));
  await renderPng(sharp, iconSource, 192, path.join(publicDir, 'icon-192.png'));
  await renderPng(sharp, iconSource, 512, path.join(publicDir, 'icon-512.png'));
  await renderPng(sharp, maskableSource, 192, path.join(publicDir, 'icon-maskable-192.png'));
  await renderPng(sharp, maskableSource, 512, path.join(publicDir, 'icon-maskable-512.png'));

  const icoPngs = [];
  for (const size of [16, 32, 48]) {
    const buffer = await sharp(faviconSource).resize(size, size, { fit: 'contain' }).png().toBuffer();
    icoPngs.push({ size, buffer });
  }
  await writeFile(path.join(publicDir, 'favicon.ico'), buildIco(icoPngs));

  if (config.includeSafariPinnedTab && safariSource) {
    await copyIfExists(safariSource, path.join(publicDir, 'safari-pinned-tab.svg'));
  }

  await generateManifest(publicDir, config);
  await writeText(path.resolve(target, config.htmlHeadPath), headHtml(config), true);

  return {
    publicDir,
    generated: [
      'favicon.ico',
      'favicon.svg',
      'favicon-96x96.png',
      'apple-touch-icon.png',
      'icon-192.png',
      'icon-512.png',
      'icon-maskable-192.png',
      'icon-maskable-512.png',
      'site.webmanifest'
    ]
  };
}

async function validateProject(flags) {
  const target = path.resolve(flags.target || '.');
  const config = resolveConfig(flags, await loadConfig(target, flags.config || 'litsquare.favicon.json'));
  const publicDir = path.resolve(target, config.publicDir);
  const required = [
    'favicon.ico',
    'favicon.svg',
    'favicon-96x96.png',
    'apple-touch-icon.png',
    'icon-192.png',
    'icon-512.png',
    'icon-maskable-192.png',
    'icon-maskable-512.png',
    'site.webmanifest'
  ];
  const missing = [];
  const files = [];
  for (const file of required) {
    const filePath = path.join(publicDir, file);
    if (!await exists(filePath)) {
      missing.push(file);
      continue;
    }
    const info = await stat(filePath);
    files.push({ file, bytes: info.size });
  }
  return { publicDir, ok: missing.length === 0, missing, files };
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (!command || command === 'help' || flags.help) {
    process.stdout.write(usage());
    return;
  }

  if (command === 'init') {
    const result = await initProject(flags);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  if (command === 'generate') {
    const result = await generateProject(flags);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  if (command === 'validate') {
    const result = await validateProject(flags);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.ok) process.exitCode = 1;
    return;
  }

  throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
