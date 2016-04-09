//= require_tree .

var fearColor = '#df7a96';
var joyColor = '#fff65a';
var sadnessColor = '#095b9d';
var angerColor = '#f13a07';
var disgustColor = '#7dbc40';

function fillEmbedData(elem, data) {
    $(elem).find('.headline-embed').text(data.title);
    $(elem).find('.image-embed').html('<img src="'+data.thumbnail_url+'" height="200" width="400" />');
    $(elem).find('.lede-embed').text(data.description);
}

function fillEmotionData(elem, data) {

    // anger
    var angerElem = $(elem).find('.anger');
    var angerVal = data['anger'];
    var angerHeight = angerVal * 200;

    angerElem.css('height', angerHeight);
    angerElem.css('width', '100%');

    // sadness
    var sadnessElem = $(elem).find('.sadness');
    var sadnessVal = data['sadness'];
    var sadnessHeight = sadnessVal * 200;

    sadnessElem.css('height', sadnessHeight);
    sadnessElem.css('width', '100%');

    // fear
    var fearElem = $(elem).find('.fear');
    var fearVal = data['fear'];
    var fearHeight = fearVal * 200;

    fearElem.css('height', fearHeight);
    fearElem.css('width', '100%');

    // joy
    var joyElem = $(elem).find('.joy');
    var joyVal = data['joy'];
    var joyHeight = joyVal * 200;

    joyElem.css('height', joyHeight);
    joyElem.css('width', '100%');

    // disgust
    var disgustElem = $(elem).find('.disgust');
    var disgustVal = data['disgust'];
    var disgustHeight = disgustVal * 200;

    disgustElem.css('height', disgustHeight);
    disgustElem.css('width', '100%');

    // store their data on the element
    $(elem).data('anger', angerVal);
    $(elem).data('sadness', sadnessVal);
    $(elem).data('fear', fearVal);
    $(elem).data('joy', joyVal);
    $(elem).data('disgust', disgustVal);

    $(elem).css('height', '200px');
    $(elem).css('background-image', 'linear-gradient(to right, ' + joyColor + ' ' + joyVal + '%, ' + disgustColor + ' ' + disgustVal + '%, ' + fearColor + ' ' + fearVal + '%, ' + sadnessColor + ' ' + sadnessVal + '%, ' + angerColor + ' ' + angerVal + '%)');

    updateOverallMood();
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

function addInputLineOnClick() {
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

function updateOverallMood() {
    storyTotal = 0;
    angerTotal = 0.0;
    joyTotal = 0.0;
    sadnessTotal = 0.0;
    fearTotal = 0.0;
    disgustTotal = 0.0;
    $('.story-emotions').each(function() {
        // assume that all future elements are empty
        if (typeof $(this).data('anger') === 'undefined') { return false; }
        storyTotal += 1;
        angerTotal += $(this).data('anger');
        joyTotal += $(this).data('joy');
        sadnessTotal += $(this).data('sadness');
        fearTotal += $(this).data('fear');
        disgustTotal += $(this).data('disgust')
    });

    $('.mood').text('');
    $('.mood').css('background-image', 'linear-gradient(to right, ' + joyColor + ' ' + joyTotal/storyTotal + '%, ' + disgustColor + ' ' + disgustTotal/storyTotal + '%, ' + fearColor + ' ' + fearTotal/storyTotal + '%, ' + sadnessColor + ' ' + sadnessTotal/storyTotal + '%, ' + angerColor + ' ' + angerTotal/storyTotal + '%)');
}

$(document).ready(function() {
    $(document).on('change', '.urlinput', populateEmbedOnInputChange)
    $('#btn-add-url').on('click', addInputLineOnClick)
})
