import {DeclarationReflection} from "typedoc";

export const renderDeclaration = (reflections: DeclarationReflection[]) => `
import {
    LegacyApi, 
    TestCase as _TestCase, 
    NewableTestCase,
    NewableThenableRegion, 
    ThenableRegion, 
    NewableThenableApplication, 
    ThenableApplication, 
    NewableThenableEnvironment,
    ThenableEnvironment,
    Key as _Key,
    MouseButton as _MouseButton,
    Logger,
} from '@sakuli/legacy'

declare const api: LegacyApi;

declare global {
    type TestCase = _TestCase;
    const TestCase: (NewableTestCase & _TestCase);

    type Region = ThenableRegion;
    const Region: (NewableThenableRegion & ThenableRegion)
    
    type Application = ThenableApplication;
    const Application: (NewableThenableApplication & ThenableApplication)

    type Environment = ThenableEnvironment;
    const Environment: (NewableThenableEnvironment & ThenableEnvironment)

    const Logger: Logger;
    const Key: typeof _Key;
    const MouseButton: typeof _MouseButton;    
    
    const driver: typeof api.driver;
    const context: typeof api.context;

    function done():void;

    ${reflections
        .map(reflection => `const ${reflection.name}: typeof api.${reflection.name};`)
        .join('\n    ')
    }
}
`;