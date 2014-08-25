
var onMouseIn = function  () {
    'use strict';
    this.style.border = '2px solid blue';
};
var onMouseOut = function () {
    'use strict';
    this.style.border = '';
};
var onClickIn = function () {
    'use strict';
    this.innerHTML = prompt('Voulez vous remplacer ? Annuler pour le suprimer !!', this.innerHTML);
};

function safeTagsRegex(str) {
    'use strict';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function getPiText() {
    'use strict';
    var nodes = document.getElementById('piCalculus').childNodes;
    var pi = '';
    for(var i=0; i<nodes.length; i+=1) {
        pi += nodes[i].innerHTML;
    }
    alert(parser.parse(pi));
    return pi;
}
function isEipRegex(str) {
    'use strict';
    return str.contains('Agent')
        | str.contains('from')
        | str.contains('process')
        | str.contains('to')
        | str.contains('transform')
        | str.contains('split')
        | str.contains('agregate')
        | str.contains('dynamic')
        //| str.contains('')
        //| str.contains('')
        ;
}
function addElement(text, textDecoration) {
    'use strict';

    var piCalculus = document.getElementById('piCalculus');

    var numi = document.getElementById('theValue');

    var num = parseInt(numi.value) +1;

    numi.value = num;

    var span = document.createElement('span');

    var spanIdName = 'pi'+num+'span';

    span.setAttribute('id',spanIdName);

    span.style.textDecoration=textDecoration;
    if(isEipRegex(text)){
        console.log('text color = ' + span.style.textDecorationColor)
        span.style.color = 'RED'
    }
    span.innerHTML =  text;

    span.onclick = onClickIn;
    span.onmouseover = onMouseIn;
    span.onmouseout = onMouseOut;

    piCalculus.appendChild(span);

}

function plainFunction()
{
    'use strict';
    var textToInsert = document.getElementById('textToInsert');
    var value = safeTagsRegex(textToInsert.value);
    addElement(value);
    textToInsert.value = '';

}
function sendFunction()
{
    'use strict';
    var textToInsert = document.getElementById('textToInsert');
    var value = safeTagsRegex(textToInsert.value);
    addElement(value,'overline');
    textToInsert.value = '';
}
function newFunction()
{
    'use strict';
    addElement('&nu;');

}
function brFunction()
{
    'use strict';
    addElement('<br>');

}
function tauFunction()
{
    'use strict';
    addElement('&tau;');

}
function defFunction()
{
    'use strict';
    addElement('&#8797;');
}
function resetFunction()
{
    'use strict';
    document.getElementById('piCalculus').innerHTML='';
}