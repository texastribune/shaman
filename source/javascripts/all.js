//= require_tree .

function fillEmbedData(elem, data) {
    $(elem).find('.headline-embed').text(data.title);
    $(elem).find('.image-embed').html('<img src="'+data.thumbnail_url+'" height="200" width="400" />');
    $(elem).find('.lede-embed').text(data.description);
}

function fillEmotionData(elem, data) {
    // convert emotion data to color
    // set elem color to given color
}

function callAlchemy(elem, url) {
    $.ajax({
        type: 'GET',
        url: 'https://gateway-a.watsonplatform.net/calls/url/URLGetEmotion'+
             '?url='+encodeURI(url)+
             '&apikey=6f677848fd0c5a28f9fd6d08d1e36645d9f11d2e'+
             '&outputMode=json',
        success: function(data) {
            var newEmotions = {};
            Object.keys(data.docEmotions).map(function(key) {
                newEmotions[key] = parseFloat(data.docEmotions[key])
            });
            fillEmotionData(elem, newEmotions);
        }
    });
}

function callEmbedly(elem, url, endpoint) {
    var finalEndpoint = (typeof endpoint === 'undefined') ? 'oembed' : endpoint;
    $.ajax({
        type: 'GET',
        url: 'https://api.embed.ly/1/'+finalEndpoint+
             '?url='+encodeURI(url)+
             '&key=d16b64773ea44778a3542f84f8020ce7',
        success: function(data) { fillEmbedData(elem, data); }
    });
}

function populateEmbedOnInputChange() {
    var url = this.value;
    callEmbedly($(this).nextAll('.story-embed'), url);
    callAlchemy($(this).nextAll('.story-emotions'), url);
}

$(document).ready(function() {
    $('.urlinput').on('change', populateEmbedOnInputChange)
})
