export const ModuleChoices = {
  Icinga2: "Forwarding to Icinga2",
  CheckMk: "Forwarding to Check_MK",
  OMD: "Forwarding to OMD",
  Prometheus: "Forwarding to Prometheus",
  OCR: "Optical Character Recognition (OCR) Plug-in",
} as const;

export const AllModuleChoices = [
  ModuleChoices.Icinga2,
  ModuleChoices.CheckMk,
  ModuleChoices.OMD,
  ModuleChoices.Prometheus,
  ModuleChoices.OCR,
];
