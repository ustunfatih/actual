import * as c from './color-utils';

export type PaletteInput = {
  background: string;
  surface: string;
  text: string;
  textOnSurface: string;
  primary: string;
  accent: string;
  highlight: string;
  sidebarBase?: string; // dark even in light themes — falls back to background if absent
};

type DeriveFn = (p: PaletteInput) => string;

// Shorthand helpers
const bg = (p: PaletteInput) => p.background;
const sf = (p: PaletteInput) => p.surface;
const tx = (p: PaletteInput) => p.text;
const pr = (p: PaletteInput) => p.primary;
const ac = (p: PaletteInput) => p.accent;
const hl = (p: PaletteInput) => p.highlight;
const sb = (p: PaletteInput) => p.sidebarBase ?? p.background;

// Derived tones
const bgLight = (p: PaletteInput) => c.lighten(p.background, 0.08);
const bgLighter = (p: PaletteInput) => c.lighten(p.background, 0.15);
const bgLightest = (p: PaletteInput) => c.lighten(p.background, 0.25);
const sfLight = (p: PaletteInput) => c.lighten(p.surface, 0.15);
const sfDark = (p: PaletteInput) => c.darken(p.surface, 0.3);
const txSubdued = (p: PaletteInput) => c.darken(p.text, 0.45);
const txLight = (p: PaletteInput) => c.darken(p.text, 0.3);
const txDark = (p: PaletteInput) => c.lighten(p.text, 0.1);
const prLight = (p: PaletteInput) => c.lighten(p.primary, 0.25);
const prDark = (p: PaletteInput) => c.darken(p.primary, 0.3);
const prDarker = (p: PaletteInput) => c.darken(p.primary, 0.5);
const acLight = (p: PaletteInput) => c.lighten(p.accent, 0.2);
const acDark = (p: PaletteInput) => c.darken(p.accent, 0.4);
const acDarker = (p: PaletteInput) => c.darken(p.accent, 0.6);
const hlLight = (p: PaletteInput) => c.lighten(p.highlight, 0.2);
const hlDark = (p: PaletteInput) => c.darken(p.highlight, 0.4);
const hlDarker = (p: PaletteInput) => c.darken(p.highlight, 0.6);
const sbLight = (p: PaletteInput) => c.lighten(sb(p), 0.15);
const sbLighter = (p: PaletteInput) => c.lighten(sb(p), 0.25);

// Green for positive/success states (derived from primary)
const greenish = (p: PaletteInput) => c.mix(p.primary, '#22C55E', 0.7);
const greenDark = (p: PaletteInput) => c.darken(greenish(p), 0.3);
const greenLight = (p: PaletteInput) => c.lighten(greenish(p), 0.25);
const greenBg = (p: PaletteInput) => c.darken(greenish(p), 0.65);

export const variableMap: Record<string, DeriveFn> = {
  // ── Page ──────────────────────────────────────────────────
  pageBackground: bg,
  pageBackgroundModalActive: bgLight,
  pageBackgroundTopLeft: (p) => c.mix(p.background, p.primary, 0.1),
  pageBackgroundBottomRight: bgLight,
  pageBackgroundLineTop: pr,
  pageBackgroundLineMid: bg,
  pageBackgroundLineBottom: bgLighter,
  pageText: tx,
  pageTextLight: txLight,
  pageTextSubdued: txSubdued,
  pageTextDark: txDark,
  pageTextPositive: prLight,
  pageTextLink: pr,
  pageTextLinkLight: prLight,

  // ── Card ──────────────────────────────────────────────────
  cardBackground: sf,
  cardBorder: pr,
  cardShadow: (p) => c.darken(p.background, 0.2),

  // ── Table ─────────────────────────────────────────────────
  tableBackground: sf,
  tableRowBackgroundHover: sfLight,
  tableText: tx,
  tableTextLight: tx,
  tableTextSubdued: txSubdued,
  tableTextSelected: tx,
  tableTextHover: txLight,
  tableTextInactive: txSubdued,
  tableHeaderText: txLight,
  tableHeaderBackground: sfDark,
  tableBorder: (p) => c.lighten(p.surface, 0.1),
  tableBorderSelected: pr,
  tableBorderHover: prLight,
  tableBorderSeparator: txSubdued,
  tableRowBackgroundHighlight: prDarker,
  tableRowBackgroundHighlightText: tx,
  tableRowHeaderBackground: sfDark,
  tableRowHeaderText: tx,

  // ── Numbers ───────────────────────────────────────────────
  numberPositive: greenish,
  numberNegative: ac,
  numberNeutral: txSubdued,
  budgetNumberNegative: ac,
  budgetNumberZero: txSubdued,
  budgetNumberNeutral: tx,
  budgetNumberPositive: tx,
  templateNumberFunded: greenish,
  templateNumberUnderFunded: hl,
  toBudgetPositive: greenish,
  toBudgetZero: greenish,
  toBudgetNegative: ac,

  // ── Sidebar (always dark — uses sidebarBase) ──────────────
  sidebarBackground: sb,
  sidebarItemBackgroundPending: hlLight,
  sidebarItemBackgroundPositive: greenDark,
  sidebarItemBackgroundFailed: ac,
  sidebarItemAccentSelected: prLight,
  sidebarItemBackgroundHover: sbLighter,
  sidebarItemText: (p) => c.lighten(sb(p), 0.75),
  sidebarItemTextSelected: prLight,
  sidebarBudgetName: sbLight,

  // ── Menu ──────────────────────────────────────────────────
  menuBackground: sf,
  menuItemBackground: sf,
  menuItemBackgroundHover: sfLight,
  menuItemText: tx,
  menuItemTextHover: tx,
  menuItemTextSelected: pr,
  menuItemTextHeader: prLight,
  menuBorder: bg,
  menuBorderHover: pr,
  menuKeybindingText: prLight,
  menuAutoCompleteBackground: bg,
  menuAutoCompleteBackgroundHover: sfLight,
  menuAutoCompleteText: tx,
  menuAutoCompleteTextHeader: prLight,
  menuAutoCompleteItemText: tx,
  menuAutoCompleteTextHover: greenLight,
  menuAutoCompleteItemTextHover: tx,

  // ── Modal / Mobile ────────────────────────────────────────
  modalBackground: sf,
  modalBorder: (p) => c.lighten(p.surface, 0.1),
  mobileHeaderBackground: prDark,
  mobileHeaderText: tx,
  mobileHeaderTextSubdued: txSubdued,
  mobileHeaderTextHover: () => 'rgba(200, 200, 200, 0.15)',
  mobilePageBackground: bgLight,
  mobileNavBackground: sf,
  mobileNavItem: tx,
  mobileNavItemSelected: pr,
  mobileAccountShadow: (p) => c.darken(p.background, 0.2),
  mobileAccountText: prLight,
  mobileTransactionSelected: pr,
  mobileViewTheme: prDark,
  mobileConfigServerViewTheme: pr,

  // ── Markdown ──────────────────────────────────────────────
  markdownNormal: prDarker,
  markdownDark: pr,
  markdownLight: prDarker,

  // ── Button: Menu ──────────────────────────────────────────
  buttonMenuText: txLight,
  buttonMenuTextHover: txLight,
  buttonMenuBackground: () => 'transparent',
  buttonMenuBackgroundHover: () => 'rgba(200, 200, 200, 0.25)',
  buttonMenuBorder: txSubdued,
  buttonMenuSelectedText: (p) => c.darken(p.highlight, 0.7),
  buttonMenuSelectedTextHover: (p) => c.darken(p.highlight, 0.6),
  buttonMenuSelectedBackground: hlLight,
  buttonMenuSelectedBackgroundHover: hl,
  buttonMenuSelectedBorder: hlLight,

  // ── Button: Primary ───────────────────────────────────────
  buttonPrimaryText: () => '#FFFFFF',
  buttonPrimaryTextHover: () => '#FFFFFF',
  buttonPrimaryBackground: pr,
  buttonPrimaryBackgroundHover: prDark,
  buttonPrimaryBorder: pr,
  buttonPrimaryShadow: () => 'rgba(0, 0, 0, 0.6)',
  buttonPrimaryDisabledText: txSubdued,
  buttonPrimaryDisabledBackground: bgLightest,
  buttonPrimaryDisabledBorder: bgLightest,

  // ── Button: Normal ────────────────────────────────────────
  buttonNormalText: tx,
  buttonNormalTextHover: tx,
  buttonNormalBackground: sf,
  buttonNormalBackgroundHover: sfLight,
  buttonNormalBorder: txLight,
  buttonNormalShadow: () => 'rgba(0, 0, 0, 0.4)',
  buttonNormalSelectedText: () => '#FFFFFF',
  buttonNormalSelectedBackground: prDark,
  buttonNormalDisabledText: txSubdued,
  buttonNormalDisabledBackground: sf,
  buttonNormalDisabledBorder: txSubdued,

  // ── Calendar ──────────────────────────────────────────────
  calendarText: tx,
  calendarBackground: bg,
  calendarItemText: tx,
  calendarItemBackground: sf,
  calendarSelectedBackground: prDark,

  // ── Button: Bare ──────────────────────────────────────────
  buttonBareText: tx,
  buttonBareTextHover: tx,
  buttonBareBackground: () => 'transparent',
  buttonBareBackgroundHover: () => 'rgba(200, 200, 200, 0.3)',
  buttonBareBackgroundActive: () => 'rgba(200, 200, 200, 0.5)',
  buttonBareDisabledText: txSubdued,
  buttonBareDisabledBackground: () => 'transparent',

  // ── Notice / Warning / Error ──────────────────────────────
  noticeBackground: greenBg,
  noticeBackgroundLight: (p) => c.darken(greenish(p), 0.75),
  noticeBackgroundDark: greenDark,
  noticeText: greenish,
  noticeTextLight: greenDark,
  noticeTextDark: greenLight,
  noticeTextMenu: greenDark,
  noticeBorder: greenBg,

  warningBackground: hlDarker,
  warningText: hl,
  warningTextLight: hlDark,
  warningTextDark: hlLight,
  warningBorder: hlDark,

  errorBackground: acDarker,
  errorText: ac,
  errorTextDark: acLight,
  errorTextDarker: acLight,
  errorTextMenu: ac,
  errorBorder: acDark,

  upcomingBackground: prDarker,
  upcomingText: prLight,
  upcomingBorder: (p) => c.lighten(p.surface, 0.1),

  // ── Form ──────────────────────────────────────────────────
  formLabelText: prLight,
  formLabelBackground: prDarker,
  formInputBackground: sf,
  formInputBackgroundSelected: sfLight,
  formInputBackgroundSelection: pr,
  formInputBorder: (p) => c.lighten(p.surface, 0.1),
  formInputTextReadOnlySelection: sf,
  formInputBorderSelected: pr,
  formInputText: tx,
  formInputTextSelected: bg,
  formInputTextPlaceholder: tx,
  formInputTextPlaceholderSelected: txLight,
  formInputTextSelection: sf,
  formInputShadowSelected: prLight,
  formInputTextHighlight: pr,
  checkboxText: tx,
  checkboxBackgroundSelected: pr,
  checkboxBorderSelected: pr,
  checkboxShadowSelected: prDark,
  checkboxToggleBackground: bgLightest,
  checkboxToggleBackgroundSelected: pr,
  checkboxToggleDisabled: bgLighter,

  // ── Pill ──────────────────────────────────────────────────
  pillBackground: sf,
  pillBackgroundLight: bg,
  pillText: txLight,
  pillTextHighlighted: prLight,
  pillBorder: sfDark,
  pillBorderDark: sfDark,
  pillBackgroundSelected: prDark,
  pillTextSelected: tx,
  pillBorderSelected: pr,
  pillTextSubdued: txSubdued,

  // ── Reports / Charts ──────────────────────────────────────
  reportsRed: ac,
  reportsBlue: pr,
  reportsGreen: greenish,
  reportsGray: txSubdued,
  reportsLabel: tx,
  reportsInnerLabel: sf,
  reportsNumberPositive: greenish,
  reportsNumberNegative: ac,
  reportsNumberNeutral: txSubdued,
  reportsChartFill: greenish,

  // ── Note Tags ─────────────────────────────────────────────
  noteTagBackground: prDarker,
  noteTagBackgroundHover: pr,
  noteTagDefault: prDarker,
  noteTagText: prLight,

  // ── Budget ────────────────────────────────────────────────
  budgetOtherMonth: bg,
  budgetCurrentMonth: sf,
  budgetHeaderOtherMonth: sfDark,
  budgetHeaderCurrentMonth: sfDark,

  // ── Floating Action Bar ───────────────────────────────────
  floatingActionBarBackground: prDark,
  floatingActionBarBorder: prDark,
  floatingActionBarText: tx,

  // ── Tooltip ───────────────────────────────────────────────
  tooltipText: tx,
  tooltipBackground: sf,
  tooltipBorder: sfDark,

  // ── Calendar Cell ─────────────────────────────────────────
  calendarCellBackground: bg,

  // ── Overlay ───────────────────────────────────────────────
  overlayBackground: () => 'rgba(0, 0, 0, 0.3)',

  // ── Chart Qualitative Colors (9 distinct) ─────────────────
  chartQual1: pr,
  chartQual2: ac,
  chartQual3: hl,
  chartQual4: greenish,
  chartQual5: prLight,
  chartQual6: acLight,
  chartQual7: hlLight,
  chartQual8: greenLight,
  chartQual9: (p) => c.mix(p.primary, p.accent, 0.5),
};
