export async function temperatures() {
    Logger.logInfo("Check temperatures");
    var $temperatures = await _collect("_div", {className: "detail-item-description", sahiText: "Temperatur (°C)"});
    return $temperatures;
}

export async function snowLines() {
    Logger.logInfo("Check snow lines");
    var $snowLines = await _collect("_div", {className: "detail-item-description", sahiText: "Schneefallgrenze (m)"});
    return $snowLines;
}

export async function nodesInDiv($target) {
    var $parent = await _parentNode($target, "DIV", 1);
    var $nodes = await _collect("_div", {className: "detail-item-content detail-item-striped ng-star-inserted"}, _in($parent));
    return $nodes;
}

export async function check($valueElements) {
    for (var $idx = 0; $idx < $valueElements.length; $idx++) {
        var $element = $valueElements[$idx];
        await _highlight($element);
        if ((await _getText($element)) === "") {
            throw new Error("No value.");
        }
    }
}

export async function checkValuesInDiv($anchor) {
    for (var $idx = 0; $idx < $anchor.length; $idx++) {
        var $valueElements = await nodesInDiv($anchor[$idx]);
        await check($valueElements);
    }
}