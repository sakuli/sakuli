export const FeatureChoices = {
  Icinga2: "Forwarding to Icinga2",
  CheckMk: "Forwarding to Check_MK",
  OMD: "Forwarding to OMD",
  Prometheus: "Forwarding to Prometheus",
} as const;

export const AllFeatureChoices = [
  FeatureChoices.Icinga2,
  FeatureChoices.CheckMk,
  FeatureChoices.OMD,
  FeatureChoices.Prometheus,
];
