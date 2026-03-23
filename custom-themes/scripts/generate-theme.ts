import * as fs from 'fs';
import * as path from 'path';
import { variableMap, PaletteInput } from './variable-map';

const REQUIRED_KEYS: (keyof PaletteInput)[] = [
  'background', 'surface', 'text', 'textOnSurface',
  'primary', 'accent', 'highlight',
];

function validatePalette(palette: Record<string, string>): PaletteInput {
  for (const key of REQUIRED_KEYS) {
    if (!palette[key]) {
      throw new Error(`Missing required palette key: "${key}"`);
    }
    if (!/^#[0-9a-fA-F]{3,8}$/.test(palette[key])) {
      throw new Error(`Invalid hex color for "${key}": ${palette[key]}`);
    }
  }
  return palette as unknown as PaletteInput;
}

function validateCssValue(value: string, property: string): void {
  const v = value.trim();
  if (/^var\s*\(\s*--[a-zA-Z0-9_-]+\s*\)$/i.test(v)) return;
  if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?$/.test(v)) return;
  if (/^rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(,\s*[\d.]+)?\s*\)$/.test(v)) return;
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(v)) return;
  if (/^(inherit|initial|unset|revert|transparent|none|auto|normal)$/i.test(v)) return;
  if (/^(\d+\.?\d*|\d*\.\d+)(px|em|rem|%|vh|vw)?$/.test(v)) return;
  throw new Error(`Invalid CSS value "${v}" for --color-${property}`);
}

function generateCss(palette: PaletteInput): string {
  const lines: string[] = [':root {'];
  for (const [key, deriveFn] of Object.entries(variableMap)) {
    const value = deriveFn(palette);
    validateCssValue(value, key);
    lines.push(`  --color-${key}: ${value};`);
  }
  lines.push('}');
  return lines.join('\n');
}

function loadPalette(config: Record<string, unknown>, mode: 'dark' | 'light'): PaletteInput {
  // New format: { palettes: { dark: {...}, light: {...} } }
  if (config.palettes && typeof config.palettes === 'object') {
    const palettes = config.palettes as Record<string, Record<string, string>>;
    if (!palettes[mode]) throw new Error(`No "${mode}" palette in config.palettes`);
    return validatePalette(palettes[mode]);
  }
  // Legacy format: { palette: {...} } — dark only
  if (config.palette && typeof config.palette === 'object') {
    if (mode === 'light') {
      throw new Error('Legacy config has no light palette. Update config.json to use "palettes": { "dark": {...}, "light": {...} }');
    }
    return validatePalette(config.palette as Record<string, string>);
  }
  throw new Error('config.json must have either "palettes" or "palette" key');
}

function main() {
  const themeDir = process.argv[2];
  const mode = (process.argv[3] ?? 'dark') as 'dark' | 'light';

  if (!themeDir) {
    console.error('Usage: npx ts-node scripts/generate-theme.ts <theme-dir> [dark|light]');
    console.error('Example: npx ts-node scripts/generate-theme.ts themes/mondrian dark');
    process.exit(1);
  }

  if (mode !== 'dark' && mode !== 'light') {
    console.error(`Invalid mode "${mode}". Must be "dark" or "light".`);
    process.exit(1);
  }

  const configPath = path.resolve(themeDir, 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const themeName = config.name ?? path.basename(themeDir);
  console.log(`Generating ${mode} theme: ${themeName}`);

  const palette = loadPalette(config, mode);
  const css = generateCss(palette);

  const outputPath = path.resolve(themeDir, `actual-${mode}.css`);
  fs.writeFileSync(outputPath, css, 'utf-8');

  console.log(`Generated ${Object.keys(variableMap).length} variables → actual-${mode}.css`);
  console.log('Validation passed — ready to paste into Actual Budget.');
}

main();
