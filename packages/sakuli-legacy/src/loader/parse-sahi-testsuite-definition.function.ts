export interface SahiTestCase {
    path: string;
    startUrl: string;
} 

export function parseSahiTestsuiteDefiniton(sahiTestsuiteDefinition: string): SahiTestCase[] {
    return sahiTestsuiteDefinition
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length)
        .filter(l => !l.startsWith('//'))
        .map(l => l.split(' '))
        .map(([path, startUrl]) => ({path, startUrl}))
}