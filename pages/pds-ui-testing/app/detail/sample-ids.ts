// Single source of truth for the dynamic [id] sample(s).
// Used by `generateStaticParams`, navigation links, and a11y tests
// to avoid drift between the static export, in-app links, and tests.
// Detail routes live under `/[locale]/detail/[id]/`.
export const detailSampleIds = ["watch-001"] as const;

export type DetailSampleId = (typeof detailSampleIds)[number];
