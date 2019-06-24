import {template} from "./template.function";

describe('template', () => {

    it('should work', () => {
        const tpl = template(`
            Hallo \${name},
            you feel \${mood} today?
        `);
        const rendered = tpl(key => ((<Record<string, string>>{
            'name': 'Sakuli',
            'mood': 'good'
        })[key] || ''));
        expect(rendered).toBe(`
            Hallo Sakuli,
            you feel good today?
        `)
    });

});