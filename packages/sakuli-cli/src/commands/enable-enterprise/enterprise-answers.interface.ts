export interface EnterpriseAnswers {
  hasLicense: boolean;
  features: string[];
  licenseKey?: string;
  npmKey?: string;
}

export const hasLicense = (answers: EnterpriseAnswers) => answers.hasLicense;
