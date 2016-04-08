//= require_tree .

function callAlchemy(url) {
    $.ajax({
        type: 'GET',
        url: 'https://gateway-a.watsonplatform.net/calls/url/URLGetEmotion'+
             '?url='+encodeURI(url)+
             '&apikey=6f677848fd0c5a28f9fd6d08d1e36645d9f11d2e'+
             '&outputMode=json',
        success: function(data) {
            // This is where you do things with the data, such as...
            var newEmotions = {};
            Object.keys(data.docEmotions).map(function(key) {
                newEmotions[key] = parseFloat(data.docEmotions[key])
            });
            return newEmotions;
        }
    });
}
