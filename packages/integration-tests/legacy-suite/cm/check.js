(async () => {
    await _dynamicInclude($includeFolder);
    var testCase = new TestCase(1200, 1300);
    //var env = new Environment();
    var tbOpened = false;

    try {
        var timestamp = (new Date().getTime() / 1000).toFixed(0);
        var ticketData = {
            subject: 'Perfect Coffee ' + timestamp,
            type: 'Praise',
            category: 'Else',
            product: [
                'Coffee machines',
                'Home Line',
                'Home 500'
            ],
            comment: 'Just want to praise for your products'
        };
        await _navigateTo('https://showroom2.cm6demo.consol.de/track/', true);
        //await _wait(5000);
        await _highlight(await _textbox("username"));
        //await loginToTrack();
        /*
        await _highlightClick(await _button('Create'));
        await _createTrackTicket(ticketData);
        testCase.endOfStep('Create CM Track Ticket');
        await loginToCmClient();
        await searchTicket(ticketData.subject);
        await _validateCmTicket(ticketData);
        await _highlightClick(await _link('Close immediately...'));
        await _setSelected(await _select(0, await _near(await _label(/Reason/))), 'No action required');
        await _highlightClick(await _button('Save and continue'));
        testCase.endOfStep('Validate Ticket in CM-Client');
        */
    } catch (e) {
        testCase.handleException(e);
    } finally {
        testCase.saveResult();
        done();
    }
    async function _highlightClick($element) {
        await _highlight($element);
        await _click($element);
    }
    async function loginToTrack() {
        await _navigateTo('https://showroom2.cm6demo.consol.de/track/', true);
        await _setValue(await _textbox('username'), 'sakulikunde');
        await _setValue(await _password('password'), '4testingonly');
        await _click(await _submit('Sign in'));
    }
    async function loginToCmClient() {
        await _navigateTo('https://showroom2.cm6demo.consol.de/cm-client/', true);
        await _setValue(await _textbox('username'), 'Sakuli-Service');
        await _setValue(await _password('password'), '4testingonly');
        await _click(await _submit('Sign in'));
    }
    async function searchTicket(pattern) {
        var $urlPattern = pattern.replace(/ /g, '+');
        await _navigateTo('https://showroom2.cm6demo.consol.de/cm-client/search?c_pattern=' + $urlPattern);
        await _highlight(await _link(0, await _under(await _tableHeader(/Name/))));
        await _click(await _link(0, await _under(await _tableHeader(/Name/))));
    }
    async function _createTrackTicket($ticketData) {
        await _setValue(await _textbox('subject'), $ticketData.subject);
        await _setSelected(await _select(0, await _near(await _label('/Type/'))), $ticketData.type);
        await _setSelected(await _select(0, await _near(await _label('/Category/'))), $ticketData.category);
        await _highlightClick(await _link('Please select', await _near(await _label('Product'))));
        for (var i = 0; i < $ticketData.product.length; i++) {
            await _highlightClick(await _link($ticketData.product[i]));
        }
        await _rteWrite(await _rte(0), $ticketData.comment);
        await _setValue(await _textarea('comment'), $ticketData.comment);
        await _focus(await _rte(0));
        await _highlightClick(await _submit('Create Ticket'));
        await _highlight(await _div(new RegExp('.* \\| ' + $ticketData.subject)));
    }
    async function _validateCmTicket($ticketData) {
        await _highlight(await _heading3($ticketData.subject));
        await _highlight(await _cell($ticketData.type, await _rightOf(await _cell(/Type/))));
        await _highlight(await _cell($ticketData.category, await _rightOf(await _cell(/Category/))));
        await _highlight(await _cell($ticketData.product.join(' | '), await _rightOf(await _cell(/Product/))));
    }
})(done);