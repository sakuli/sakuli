(async () => {
    //await _dynamicInclude($includeFolder);
    const {_highlightClick} = require('./common');


    var testCase = new TestCase(1200, 1300);
    //var env = new Environment();
    var tbOpened = false;

    try {
        var timestamp = (new Date().getTime() / 1000).toFixed(0);
        var ticketData = {
            subject: 'Perfect Coffee ' + timestamp,
            type: 'Lob',
            category: 'Sonstiges',
            product: [
                'Kaffeemaschinen',
                'Home Line',
                'Home 500'
            ],
            comment: 'Just want to praise for your products'
        };
        /*
        await _navigateTo('https://showroom2.cm6demo.consol.de/track/', true);
        await _wait(5000);
        await _highlight(await _textbox("username"));
        */
        await loginToTrack();
        await _highlightClick(await _button('Erstellen'));
        await _createTrackTicket(ticketData);
        testCase.endOfStep('Create CM Track Ticket');
        /*
        await loginToCmClient();
        await searchTicket(ticketData.subject);
        await _validateCmTicket(ticketData);
        await _highlightClick(await _link('Close immediately...'));
        await _setSelected(await _select(0, await _near(await _label(/Reason/))), 'No action required');
        await _highlightClick(await _button('Save and continue'));
        testCase.endOfStep('Validate Ticket in CM-Client');
        */
    } catch (e) {
        //await _wait(10000);
        testCase.handleException(e);
    } finally {
        testCase.saveResult();
        done();
    }

    async function loginToTrack() {
        await _navigateTo('https://showroom2.cm6demo.consol.de/track/', true);
        await _setValue(_textbox('username'), 'sakulikunde');
        await _setValue(_password('password'), '4testingonly');
        const btn = await _submit('Anmelden');
        _highlight(btn);
        await _click(btn);
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
        await _setValue(_textbox('subject'), $ticketData.subject);
        await _highlight(_select(0, _near(_label(/Anfragetyp/))));
        await _setSelected(_select(0, _near(_label(/Anfragetyp/))), $ticketData.type);
        await _setSelected(_select(0, _near(_label(/Kategorie/))), $ticketData.category);

        Logger.logInfo('before main link');
        /*
        await _highlightClick(_link(/Bitte wählen/, _near(_label(/Produkt/))));
        Logger.logInfo('after main link');
        for (var i = 0; i < $ticketData.product.length; i++) {
            Logger.logInfo('waiting for link with ' + $ticketData.product[i]);
            await _highlightClick(_link($ticketData.product[i]));
        }
        //await _rteWrite(await _rte(0), $ticketData.comment);
        */
        //await _setValue(_textarea(0), $ticketData.comment);
        //await _focus(_rte(0));
        /*
           _click(_div("/fr-element/",_in(_div($targetFieldRegExp))));
            _eval("jQuery(_div('/fr-element/',_in(_div('"+$targetFieldRegExp+"')))).html('"+$pTextToWrite+"');");
            _eval("jQuery(_textarea('/froala_editor/',_in(_div('"+$targetFieldRegExp+"')))).html('"+$pTextToWrite+"');");
            _eval("jQuery(_textarea('/froala_editor/',_in(_div('"+$targetFieldRegExp+"')))).froalaEditor('cursor.enter',true);");
            _eval("jQuery(_textarea('/froala_editor/',_in(_div('"+$targetFieldRegExp+"')))).froalaEditor('events.trigger', 'blur');");
        }
         */
        await _click(_div('fr-element fr-view'));
        _eval(`
            const textarea = arguments[0];
            const div = arguments[1];
            jQuery(div).html('Hello Froala');
            jQuery(textarea).froalaEditor('cursor.enter', true);
            jQuery(textarea).froalaEditor('events.trigger', 'blur');
        `,
            _textarea('froala_editor'),
            _div('fr-element'),
        );
        _highlight(_div('fr-element'));
        // await _highlightClick(await _submit('Ticket erstellen'));
        await _highlight(_div(new RegExp('.* \\| ' + $ticketData.subject)));
    }

    async function _validateCmTicket($ticketData) {
        await _highlight(_heading3($ticketData.subject));
        await _highlight(_cell($ticketData.type, _rightOf(_cell(/Type/))));
        await _highlight(_cell($ticketData.category, _rightOf(_cell(/Category/))));
        await _highlight(_cell($ticketData.product.join(' | '), _rightOf(_cell(/Product/))));
    }
})(done);