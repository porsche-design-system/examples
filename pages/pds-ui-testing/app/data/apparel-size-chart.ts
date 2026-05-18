export const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export type ApparelSize = (typeof apparelSizes)[number];

export type ApparelSizeChartRow = {
  size: ApparelSize;
  eu: string;
  us: string;
  uk: string;
  fr: string;
  it: string;
};

/** Demo conversion chart aligned with {@link apparelSizes} selector values. */
export const apparelSizeChart: readonly ApparelSizeChartRow[] = [
  { size: "XS", eu: "44", us: "34", uk: "34", fr: "44", it: "44" },
  { size: "S", eu: "46", us: "36", uk: "36", fr: "46", it: "46" },
  { size: "M", eu: "48", us: "38", uk: "38", fr: "48", it: "48" },
  { size: "L", eu: "50", us: "40", uk: "40", fr: "50", it: "50" },
  { size: "XL", eu: "52", us: "42", uk: "42", fr: "52", it: "52" },
  { size: "XXL", eu: "54", us: "44", uk: "44", fr: "54", it: "54" },
];
