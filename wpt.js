var page = new WebPage(),
    testindex = 0,
    loadInProgress = false,
    data,
    testurl = "https://tw.buy.yahoo.com/?Bucket=BUCKET_TOTAL_LOOK",
    label = 'newhp',
    browser = 2,
    runs = 10,
    steps;


function gettoday() {
    var today, dd, mm, yyyy;
    today = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + mm + dd;
    return today;
}

data = {
    wpt: "http://mirador.corp.yahoo.com/adhoc.php",
    testurl: testurl,
    runs: runs,
    testlabel: "tw_shp " + label + " "+gettoday(),
    browser: browser
}

var args = require('system').args;
args.forEach(function(arg, i) {
    console.log(i+'::'+arg);
});

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};
 
steps = [
    function() {
        console.log("Load wpt Page");
        page.open(data.wpt);
    },
    function() {
        console.log(document.title);
        page.injectJs("jquery-2.1.1.min.js");
        page.evaluate(function(data) {
            console.log(data.testlabel);
            $('#advanced_settings-container').removeClass('hidden');
            $('#url').val(data.testurl);
            $('input[name="runs"]').val(data.runs);
            $('input[name="label"]').val(data.testlabel);

            $('#location')[0].selectedIndex = 3;
            $('#url').focus();
            LocationChanged();
            
            $('#browser')[0].selectedIndex = data.browser;
            $('#url').focus();
            BrowserChanged();
            $('#connection')[0].selectedIndex = 2;

        }, data);
    },
    function() {
       page.evaluate(function() {

            console.log(document.title);
            console.log('do submit');
            $('#start_test-container .start_test').click();
        });
    }
]

 

 
    interval = setInterval(function() {

    if (!loadInProgress && typeof steps[testindex] == "function") {
        console.log("step " + (testindex + 1));
        steps[testindex]();
        page.render("wpt" + (testindex + 1) + ".png");
        testindex++;
    }

    if (typeof steps[testindex] != "function") {
        window.setTimeout(function() {
            console.log("test complete!");
            page.render("wpt" + (testindex + 1) + ".png");
            phantom.exit();

        }, 5000);
    }
}, 1000);





