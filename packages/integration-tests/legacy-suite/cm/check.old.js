_dynamicInclude($includeFolder);
var testCase = new TestCase(1200, 1300);
var env = new Environment();
//var screen = new Region();
//var thunderbird = new Application('thunderbird');
var tbOpened = false;

// I'm here

function sleep() {
    var $slowDown = (Number(env.getEnv('SLOW_DOWN')) || 0);
    Logger.logInfo("Slowing down env with " + $slowDown);
    env.sleep($slowDown);
}

try {
    //var timestamp = '' + (java.lang.System.currentTimeMillis() / 1000).toFixed(0);
    var timestamp = (new Date().getTime() / 1000).toFixed(0);
    var ticketData = {
        subject: "Perfect Coffee " + timestamp,
        type: "Praise",
        category: "Else",
        product: ["Coffee machines", "Home Line", "Home 500"],
        comment: "Just want to praise for your products"
    };

    loginToTrack();
    sleep();
    _highlightClick(_button('Create'));
    _createTrackTicket(ticketData);
    testCase.endOfStep("Create CM Track Ticket");

    loginToCmClient();
    searchTicket(ticketData.subject);
    _validateCmTicket(ticketData);
    _highlightClick(_link("Close immediately..."));
    _setSelected(_select(0, _near(_label(/Reason/))), "No action required");
    _highlightClick(_button("Save and continue"));
    testCase.endOfStep("Validate Ticket in CM-Client");

    /*
    thunderbird.open(); tbOpened = true;
    screen.waitForImage('thunderbird_icon.png', 5).highlight();
    if(screen.exists("system_integration_dialog.png", 10)) {
        var sidr = screen.find("system_integration_dialog.png").highlight();
        var dim = 15;
        sidr.setW(dim).move(270, 0).highlight().click();
    }
    //env.type(Key.ESC);

    env.sleep(5);
    sleep();
    env.type('k', Key.CTRL);
    env.sleep(.25);
    env.type(ticketData.subject);
    env.sleep(.25);
    screen.waitForImage('search_icon.png', 5).highlight().click();
    sleep();
    screen.waitForImage('email_text.png', 5).highlight();
    testCase.endOfStep("Validate Customer Mail");
    */

} catch (e) {
    testCase.handleException(e);
} finally {
    testCase.saveResult();
}

function _highlightClick($element) {
    _highlight($element);
    _click($element);
}

function loginToTrack() {
    _navigateTo("https://showroom2.cm6demo.consol.de/track/", true);
    _setValue(_textbox("username"), "sakulikunde");
    _setValue(_password("password"), "4testingonly");
    sleep();
    _click(_submit('Sign in'));
}


function loginToCmClient() {
    _navigateTo("https://showroom2.cm6demo.consol.de/cm-client/", true);
    _setValue(_textbox("username"), "Sakuli-Service");
    _setValue(_password("password"), "4testingonly");
    sleep();
    _click(_submit('Sign in'));
}

function searchTicket(pattern) {
    var $urlPattern = pattern.replace(/ /g, "+");
    _navigateTo("https://showroom2.cm6demo.consol.de/cm-client/search?c_pattern=" + $urlPattern);
    _highlight(_link(0, _under(_tableHeader(/Name/))));
    sleep();
    _click(_link(0, _under(_tableHeader(/Name/))));
}

function _createTrackTicket($ticketData) {
    _setValue(_textbox('subject'), $ticketData.subject);
    _setSelected(_select(0, _near(_label("/Type/"))), $ticketData.type);
    _setSelected(_select(0, _near(_label("/Category/"))), $ticketData.category);

    _highlightClick(_link("Please select", _near(_label("Product"))));
    for(var i = 0; i < $ticketData.product.length; i++) {
        _highlightClick(_link($ticketData.product[i]));
    }
    _rteWrite(_rte(0), $ticketData.comment);
    _setValue(_textarea('comment'), $ticketData.comment);
    _focus(_rte(0));
    //env.type($ticketData.comment);
    env.sleep(1);
    sleep();
    //env.type(Key.ENTER);
    _highlightClick(_submit("Create Ticket"));
    _highlight(_div(new RegExp(".* \\| " + $ticketData.subject)));
    sleep()
}

function _validateCmTicket($ticketData) {
    _highlight(_heading3($ticketData.subject));
    // This section is optional
    _highlight(_cell($ticketData.type, _rightOf(_cell(/Type/))));
    _highlight(_cell($ticketData.category, _rightOf(_cell(/Category/))));
    _highlight(_cell($ticketData.product.join(" | "), _rightOf(_cell(/Product/))));
    sleep();
}