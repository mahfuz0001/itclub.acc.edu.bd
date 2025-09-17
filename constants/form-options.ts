export const STREAMS = [
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts" },
  { value: "others", label: "Others" },
];

export const YEARS = [
  { value: "2022", label: "Batch of 2022" },
  { value: "2023", label: "Batch of 2023" },
  { value: "2024", label: "Batch of 2024" },
  { value: "2025", label: "Batch of 2025" },
  { value: "2026", label: "Batch of 2026" },
];

export const STREAM_SECTIONS: Record<
  "science" | "commerce" | "arts" | "others",
  { value: string; label: string }[]
> = {
  science: [
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
    { value: "S4", label: "S4" },
    { value: "S5", label: "S5" },
    { value: "S6", label: "S6" },
    { value: "S7", label: "S7" },
    { value: "S8", label: "S8" },
    { value: "S9", label: "S9" },
    { value: "S10", label: "S10" },
    { value: "S11", label: "S11" },
    { value: "S12", label: "S12" },
    { value: "S13", label: "S13" },
    { value: "S14", label: "S14" },
    { value: "S15", label: "S15" },
    { value: "S16", label: "S16" },
    { value: "S17", label: "S17" },
    { value: "S18", label: "S18" },
  ],
  commerce: [
    { value: "B1", label: "B1" },
    { value: "B2", label: "B2" },
    { value: "B3", label: "B3" },
    { value: "B4", label: "B4" },
  ],
  arts: [{ value: "H", label: "H" }],
  others: [
    { value: "O1", label: "O1" },
    { value: "O2", label: "O2" },
  ],
};
