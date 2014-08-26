function newPiDsl(term){
    var ret = '<routes xmlns="http://camel.apache.org/schema/spring">\r\t\t<!-- définition de la route -->';

    ret += '\n\t<route id="' + term.sign.name + '">\n';
    for (var i=0; i<term.core.params.length; i++){
        var param = '';
        if(term.core.params[i].name == 'from' || term.core.params[i].name == 'to' || term.core.params[i].name == 'migrate'){
            param = 'uri';
            ret +=  '\n\t\t<'+ term.core.params[i].name +' '+ param +'="' + term.core.params[i].params[0] +'"/>';
        }
        else{

            param = 'ref';
            ret +=  '\n\t\t<'+ term.core.params[i].name +' '+ param +'="' + term.core.params[i].params[0].name +'"/>';
        }

    }
    ret += '\n\t</route>\n\t<!-- ici on peut rajouter d autres routes -->\n</routes>';
    addPre(ret,'xml');

}
function newPiProcess(term){
    var ret = 'import java.nio.ByteBuffer;\n'
    + 'import java.nio.channels.Pipe;\n'
    + 'import java.nio.channels.Pipe.SinkChannel;\n'
    + 'import java.nio.channels.Pipe.SourceChannel;\n\n'

    + 'import org.apache.camel.Exchange;\n'
    + 'import org.apache.camel.Message;\n'
    + 'import org.apache.camel.Processor;\n'
    + 'import org.apache.camel.impl.DefaultMessage;\n\n';

    ret +=  'public class ' + term.sign.name + ' implements Processor {\n\n' +
        '\tpublic void process(Exchange exchange) throws Exception {\n';


    for (var i=0; i<term.core.params.length; i++){
        if(term.core.params[i].type == 'varRC' && term.core.params[i].name == 'in' ){
            ret +=  '\n\t\tMessage '+ term.core.params[i].params[0] +' = exchange.getIn();';
        }
        else
        if(term.core.params[i].type == 'varRC'  ){
            ret +=  '\n\t\t ByteBuffer '+ term.core.params[i].params[0] +' = null;' +
                '\n\t\t'+ term.core.params[i].name +'.read('+ term.core.params[i].params[0] +');';
        }
        else
        if(term.core.params[i].type == 'varEM' && term.core.params[i].name == 'out' ){

            ret +=  '\n\t\tMessage ' + term.core.params[i].params[0] +'Out = new DefaultMessage();' +
                '\n\t\t' + term.core.params[i].params[0] +'Out.setBody(' + term.core.params[i].params[0] +');' +
                '\n\t\texchange.setOut(' + term.core.params[i].params[0] +'Out);';
        }
        else
        if(term.core.params[i].type == 'varEM'  ){
            ret +=  '\n\t\t '+ term.core.params[i].name +'.write('+ term.core.params[i].params[0] +');';
        }
        else
        if(term.core.params[i].type == 'nu'  ){
            console.log(term.core.params[i].value);
            for (nu in term.core.params[i].value){
                console.log(nu);
                ret +=  '\n\t\tByteBuffer '+ term.core.params[i].value[nu] +' = null;';
            }

        }
        else
        if(term.core.params[i].type == 'tau'  ){
            ret +=  '\n\t\t//TODO: implementer l operation non observable -'+ term.core.params[i].value +'-';

        }


    }
    ret += '\n\t}\n}';
    addPre(ret,'java');

}
function addPre(ret,lang){
    var codes = document.getElementById('codes');
    var numi = document.getElementById('theValue');
    var num = numi.value = parseInt(numi.value) +1;
    var pre = document.createElement('pre');
    pre.setAttribute('id','pi'+num+lang);
    pre.setAttribute('class','prettyprint lang-'+lang);
    pre.innerHTML =  safeTagsRegex(ret);
    codes.appendChild(pre);

    prettyPrint();
}


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
        if(nodes[i].innerHTML !== undefined){
        pi += nodes[i].innerHTML;
        }
    }
    pi = parser.parse(pi);
    for(var i=0; i<pi.length; i+=1) {

        if(pi[i].sign.name.indexOf('Agent') > -1){
            newPiDsl(pi[i]);
        }
        else
        {
            newPiProcess(pi[i]);
        }
    }



    return pi;
}
var print = function(o, c){
    var str='';
    var sep = '';
    for(i=0; i<parseInt(c); i++){
        sep+='\t';
    }
    for(var p in o){
        if(typeof o[p] == 'string'){
            str+= sep+ p + ': ' + o[p]+'; \n';
        }else{
            str+= sep+ p + ': \n' +sep+ '\t{ \n' + print(o[p],parseInt(c)+1) + '\n'+ sep+'\t'+ '}\n';
        }
    }

    return str;
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
        | str.contains('migrate')
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
    document.getElementById('codes').innerHTML='';
}