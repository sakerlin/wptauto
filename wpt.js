 var page = new WebPage(),
     testindex = 0,
     loadInProgress = false;

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
 var data, steps,
 wpt = "http://www.webpagetest.org/";
    // wpt = "http://mirador.corp.yahoo.com/adhoc.php";

 data = {
     testurl: "https://tw.buy.yahoo.com/?Bucket=BUCKET_TOTAL_LOOK",
     runs: "1",
     testlabel : "tw_shp newhp 0606",
     browser : 0
 }
  
 steps = [
     function() {
         console.log("Load wpt Page");
         page.open(wpt);

     } ,
     function() {
        console.log(document.title);
         page.injectJs("jquery-2.1.1.min.js");
        page.evaluate(function(data) {
             $('#advanced_settings-container').removeClass('hidden');       
             $('#url').val(data.testurl);
             $('input[name="runs"]').val(data.runs);
             $('input[name="label"]').val(data.testlabel);
              
             $('#location')[0].selectedIndex = 4;
             LocationChanged();
              
            $('#browser')[0].selectedIndex = 2; 
             $('#browser').val('Firefox');
            $('#connection')[0].selectedIndex = 2;
             
         }, data);
     } ,
     function() {

         page.evaluate(function() {
             
            
             console.log('do nothing');
             
         });
     },
     function() {

         page.evaluate(function() {
             
             console.log(document.title);
             console.log('do submit');
           //  $('#start_test-container .start_test').click();
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


