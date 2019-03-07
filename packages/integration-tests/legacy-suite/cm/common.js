async function _highlightClick($element) {
    await _highlight($element);
    await _click($element);
}


module.exports = {_highlightClick};