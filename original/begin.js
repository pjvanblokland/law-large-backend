function afrondenWorp() {
    var i;
    if (typeof model === "undefined") {
        return;
    }
    if (vallen) {
        vallen = false;
        if (timer1 != null) {
            clearInterval(timer1);
            timer1 = null;
        }
        aantalGraph1 = model.sampleSize();
        model.verwerkwaarde();
        initGraph();
    }
}


function maakSchoon() {
    "use strict";
    memoryleeg();
    simul=[3, 3, 3];
    zetsimul();
    $("#tekstsim").text(kies_een_van_de_drie[taal]);

    som1 = 0;
    som2 = 0;
    minimum = NaN;
    maximum = NaN;
    q1 = NaN;
    q2 = NaN;
    q3 = NaN;
    mean = NaN;
    sd = NaN;
    $("#aantal").text('...')
    $("#minimum").text('...');
    $("#maximum").text('...');
    $("#q1").text('...');
    $("#q2").text('...');
    $("#q3").text('...');
    $("#sd").text('...');
    $("#mean").text('...');
    model.uitvoer(0);
    initGraph();
}

var nummer, nieuweWaarde;
var tijdstart, nu, duur1, duur2, totDuur, eerstekeer;

function gooien() {
    "use strict";
    var noBall, nu, i, duur, links;
    nu = Date.now();
    duur = nu - tijdstart;
    if (duur < totDuur) {
        noBall = Math.floor(duur / duur1);
        trek(aantalGraph1, noBall);
        aantalGraph1 = noBall;
    } else {
        trek(aantalGraph1, model.sampleSize() - 1);
        aantalGraph1 = model.sampleSize() - 1;
        afrondenWorp();
        if (model.tempo() == 1) {
            timer1 = setTimeout(function() {
               
                model.volgendeStap()
            }, 2000);
            context.lineWidth = 1;
            context.strokeStyle = "Black";
        }		
    }
}
function startGooien() {
    "use strict";
    aantalGraph1 = 0;
    context.beginPath();
    context.fillStyle = "White";
    if (timer1 != null) {
        clearInterval(timer1);
        timer1 = null;
    }
    tijdstart = new Date().getTime();
    if (model.sampleSize() < 10) {
        totDuur = 3000;
    } else {
        totDuur = 6000;
    }
    duur1 = totDuur / model.sampleSize();
    duur2 = totDuur + 2000;
    initGraph();
    vallen = true;
    timer1 = setInterval(function() {
        gooien();
    }, 200);
}