export function isSakuliPreset(info: any): boolean {
  const keywords: unknown[] = info.keywords;
  if (!keywords || !Array.isArray(keywords)) {
    return false;
  }

  for (const keyword of keywords) {
    if (
      typeof keyword === "string" &&
      keyword.toLowerCase() === "sakulipreset"
    ) {
      return true;
    }
  }
  return false;
}
