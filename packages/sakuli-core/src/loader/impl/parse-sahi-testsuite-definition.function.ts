export interface SahiTestsuite {
    file: string;
    startUrl: string;
} 

export function parseSahiTestsuiteDefiniton(sahiTestsuiteDefinition: string): SahiTestsuite[] {
    return sahiTestsuiteDefinition
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length)
        .filter(l => !l.startsWith('//'))
        .map(l => l.split(' '))
        .map(([file, startUrl]) => ({file, startUrl}))
}