 export interface Response_Type  {
  id: number,
  direction:  "top" | "left" | "right" | "bottom",
  type: "margin" | "padding",
  value: number,
  unit: "pt" | "%"
}