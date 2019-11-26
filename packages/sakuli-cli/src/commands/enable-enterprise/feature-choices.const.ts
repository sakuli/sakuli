export const FeatureChoices = {
    Icinga2: 'Forwarding to Icinga2',
    CheckMk: 'Forwarding to Check_MK',
    OMD: 'Forwarding to OMD'
} as const;

export const AllFeatureChoices = [
    FeatureChoices.Icinga2,
    FeatureChoices.CheckMk,
    FeatureChoices.OMD,
]


