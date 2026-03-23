import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

const INPUT_DIR = path.resolve(__dirname, '../themes/input');
const THEMES_DIR = path.resolve(__dirname, '../themes');

type Palette = {
  background: string;
  surface: string;
  text: string;
  textOnSurface: string;
  primary: string;
  accent: string;
  highlight: string;
  sidebarBase: string;
};

type ExtractedPalettes = {
  dark: Palette;
  light: Palette;
};

const MEDIA_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

async function extractPalettes(imagePath: string, themeName: string): Promise<ExtractedPalettes> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mediaType = MEDIA_TYPES[ext];
  if (!mediaType) throw new Error(`Unsupported image type: .${ext}`);

  const imageData = fs.readFileSync(imagePath).toString('base64');

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType as 'image/png', data: imageData },
          },
          {
            type: 'text',
            text: `This is a color palette screenshot for a budget app theme called "${themeName}".

Read all hex color codes visible in the image and assign them to semantic roles for BOTH a dark mode and a light mode theme.

Return ONLY a valid JSON object in exactly this structure — no explanation, no markdown, just JSON:

{
  "dark": {
    "background": "#rrggbb",
    "surface": "#rrggbb",
    "text": "#rrggbb",
    "textOnSurface": "#rrggbb",
    "primary": "#rrggbb",
    "accent": "#rrggbb",
    "highlight": "#rrggbb",
    "sidebarBase": "#rrggbb"
  },
  "light": {
    "background": "#rrggbb",
    "surface": "#rrggbb",
    "text": "#rrggbb",
    "textOnSurface": "#rrggbb",
    "primary": "#rrggbb",
    "accent": "#rrggbb",
    "highlight": "#rrggbb",
    "sidebarBase": "#rrggbb"
  }
}

Rules for assigning semantic roles:
- background: darkest color for dark mode / lightest for light mode
- surface: slightly lighter than background for dark / slightly off-white for light
- text: main readable text (light on dark, dark on light)
- textOnSurface: text used on inverted surfaces (e.g. inside buttons)
- primary: main brand/action color (buttons, links, selected states)
- accent: error/destructive/negative color (often red or warm)
- highlight: warning/selection color (often yellow, orange, or vibrant)
- sidebarBase: ALWAYS use the darkest available color — sidebars stay dark even in light themes

Every value must be a valid 6-digit hex color (#rrggbb).
If the palette has fewer than 7 distinct colors, derive surface by lightening/darkening background slightly.`,
          },
        ],
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected API response type');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in API response:\n${content.text}`);

  return JSON.parse(jsonMatch[0]) as ExtractedPalettes;
}

function processTheme(imagePath: string) {
  const ext = path.extname(imagePath);
  const themeName = path.basename(imagePath, ext);
  const themeDir = path.join(THEMES_DIR, themeName);

  if (fs.existsSync(themeDir)) {
    console.log(`  ⊘  Skipping "${themeName}" — folder already exists`);
    return null;
  }

  return { imagePath, themeName, themeDir };
}

async function generateTheme(imagePath: string, themeName: string, themeDir: string) {
  console.log(`\n→ Processing: ${path.basename(imagePath)}`);

  console.log('  Extracting palette with Claude Vision...');
  const palettes = await extractPalettes(imagePath, themeName);

  fs.mkdirSync(themeDir, { recursive: true });

  const config = {
    name: themeName.charAt(0).toUpperCase() + themeName.slice(1).replace(/[-_]/g, ' '),
    description: `Generated from ${path.basename(imagePath)}`,
    palettes,
  };

  fs.writeFileSync(
    path.join(themeDir, 'config.json'),
    JSON.stringify(config, null, 2),
  );

  const scriptPath = path.resolve(__dirname, 'generate-theme.ts');

  for (const mode of ['dark', 'light'] as const) {
    console.log(`  Generating ${mode} theme...`);
    execSync(`node -r ts-node/register "${scriptPath}" "${themeDir}" ${mode}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    });
  }

  console.log(`  ✓ Done! Output:`);
  console.log(`    themes/${themeName}/actual-dark.css`);
  console.log(`    themes/${themeName}/actual-light.css`);
  console.log(`\n  To apply in Actual Budget:`);
  console.log(`    cat themes/${themeName}/actual-dark.css | pbcopy`);
  console.log(`    then paste into Settings → Themes → Custom Theme`);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY not set. Check your custom-themes/.env file.');
    process.exit(1);
  }

  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    console.log('Created themes/input/');
    console.log('Drop palette screenshots here named after the theme (e.g. cyberpunk.png) then run npm run scan again.');
    return;
  }

  const images = fs.readdirSync(INPUT_DIR)
    .filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map(f => path.join(INPUT_DIR, f));

  if (images.length === 0) {
    console.log('No images found in themes/input/');
    console.log('Add screenshots named after your theme (e.g. cyberpunk.png) then run npm run scan again.');
    return;
  }

  const pending = images
    .map(img => processTheme(img))
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (pending.length === 0) {
    console.log(`All ${images.length} image(s) already have generated themes. No new work to do.`);
    return;
  }

  console.log(`Found ${pending.length} new palette(s) to generate...\n`);

  for (const { imagePath, themeName, themeDir } of pending) {
    await generateTheme(imagePath, themeName, themeDir);
  }

  console.log('\nAll done!');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
