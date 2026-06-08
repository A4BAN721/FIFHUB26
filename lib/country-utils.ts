export function normalizeCountryName(name: string): string {
  const nameMap: Record<string, string> = {
    "Bosnia & Herzegovina": "bosnia-herzegovina",
    "CÃ´te d'Ivoire": "ivory-coast",
    "DR Congo": "dr-congo",
    "Cabo Verde": "cape-verde",
    "South Korea": "south-korea",
    "TÃ¼rkiye": "turkiye",
    "CuraÃ§ao": "curacao",
  };

  return nameMap[name] || name.toLowerCase().replace(/\s+/g, "-");
}
