function* getMatches(regEx: RegExp, testling: string) {
    let match;
    match = regEx.exec(testling);
    while (match != null) {
        yield ({
            fullMatch: match[0],
            match: match[1],
            index: match.index,
        });
        match = regEx.exec(testling);
    }
}

export const template = (t: string) => {
    const regEx = /\$\{([^}}]*)\}/gm;
    const matches = getMatches(regEx, t);
    const staticParts: string[] = [];
    const dynamicParts: string[] = [];
    let lastIndex = 0;
    for(let m of matches) {
        staticParts.push(t.substring(lastIndex, m.index));
        lastIndex = m.index + m.fullMatch.length;
        dynamicParts.push(m.match);
    }
    staticParts.push(t.substring(lastIndex, t.length));

    return (dataReflection: (key: string) => string) => {
        const all: string[] =[];
        for(let [i, staticPart] of staticParts.entries()) {
            all.push(staticPart);
            if(dynamicParts[i]) {
                all.push(dataReflection(dynamicParts[i]));
            }
        }
        return all.join('');
    }
};