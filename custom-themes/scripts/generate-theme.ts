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

  // var(--name) without fallback
  if (/^var\s*\(\s*--[a-zA-Z0-9_-]+\s*\)$/i.test(v)) return;
  // hex color
  if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?$/.test(v)) return;
  // rgb/rgba
  if (/^rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(,\s*[\d.]+)?\s*\)$/.test(v)) return;
  // hsl/hsla
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(v)) return;
  // keywords
  if (/^(inherit|initial|unset|revert|transparent|none|auto|normal)$/i.test(v)) return;
  // lengths and numbers
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

function main() {
  const themeDir = process.argv[2];
  if (!themeDir) {
    console.error('Usage: npx ts-node scripts/generate-theme.ts <theme-dir>');
    console.error('Example: npx ts-node scripts/generate-theme.ts themes/mondrian');
    process.exit(1);
  }

  const configPath = path.resolve(themeDir, 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`Generating theme: ${config.name}`);

  const palette = validatePalette(config.palette);
  const css = generateCss(palette);

  const outputPath = path.resolve(themeDir, 'actual.css');
  fs.writeFileSync(outputPath, css, 'utf-8');

  const varCount = Object.keys(variableMap).length;
  console.log(`Generated ${varCount} CSS variables`);
  console.log(`Output: ${outputPath}`);
  console.log('Validation passed — ready to paste into Actual Budget.');
}

main();
