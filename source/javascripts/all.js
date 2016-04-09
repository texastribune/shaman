//= require_tree .

function fillEmbedData(elem, data) {
    $(elem).find('.headline-embed').text(data.title);
    $(elem).find('.image-embed').html('<img src="'+data.thumbnail_url+'" height="200" width="400" />');
    $(elem).find('.lede-embed').text(data.description);
}

function fillEmotionData(elem, data) {
    // set up emotion colors
    var fearColor = '#df7a96';
    var joyColor = '#fff65a';
    var sadnessColor = '#095b9d';
    var angerColor = '#f13a07';
    var disgustColor = '#7dbc40';

    // set up emotion values
    var angerVal = data['anger'] * 100;
    var sadnessVal = data['sadness'] * 100;
    var fearVal = data['fear'] * 100;
    var joyVal = data['joy'] * 100;
    var disgustVal = data['disgust'] * 100;

    $(elem).css('height', '200px');
    $(elem).css('background-image', 'linear-gradient(to right, ' + joyColor + ' ' + joyVal + '%, ' + disgustColor + ' ' + disgustVal + '%, ' + fearColor + ' ' + fearVal + '%, ' + sadnessColor + ' ' + sadnessVal + '%, ' + angerColor + ' ' + angerVal + '%)');
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

function addInputLine() {
    $(this).prev().append(
        '<div class="story-form">'+
            '<label>Story Url</label>'+
            '<input type="text" name="url0" placeholder="Paste here" class="urlinput"><br />'+
            '<div class="story-embed">'+
                '<div class="headline-embed"></div>'+
                '<div class="image-embed"></div>'+
                '<div class="lede-embed"></div>'+
            '</div>'+
            '<div class="story-emotions">'+
              '<div class="anger"></div>'+
              '<div class="fear"></div>'+
              '<div class="disgust"></div>'+
              '<div class="sadness"></div>'+
              '<div class="joy"></div>'+
            '</div>'+
        '</div>');
}

$(document).ready(function() {
    $('.urlinput').on('change', populateEmbedOnInputChange)
    $('#btn-add-url').on('click', addInputLine)
})
