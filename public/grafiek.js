var chartMargin = 30,
    chartTop = 20,
	chartTop3=5,
    chartLeft, chartRight, chartHeight, chartBottom;
var chartLeft1, chartRight1, chartHeight1, chartBottom1;
var chartLeft3, chartRight3, chartHeight3, chartBottom3;


function initsettings() {
    "use strict";
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "White";
    context.fill();
    context.beginPath();
    context.fillStyle = "Black";
    chartLeft = 50
    chartRight = canvas.width - 50;
    chartHeight = canvas.height - 50;
    chartBottom = canvas.height - 30;
    context.save();
    context.translate(0.5, 0.5);
}

function initsettings1() {
    "use strict";
    context1.rect(0, 0, canvas1.width, canvas1.height);
    context1.fillStyle = "White";
    context1.fill();
    context1.beginPath();
    context1.fillStyle = "Black";
    chartLeft1 = 50
    chartRight1 = canvas1.width - 25;
    chartHeight1 = canvas1.height - 50;
    chartBottom1 = canvas1.height - 50;
    context1.save();
    context1.translate(0.5, 0.5);
}

function initsettings3() {
    "use strict";
    context3.rect(0, 0, canvas3.width, canvas3.height);
    context3.fillStyle = "White";
    context3.fill();
    context3.beginPath();
    context3.fillStyle = "Black";
    chartLeft3 = 50
    chartRight3 = canvas3.width - 50;
    chartHeight3 = canvas3.height - 50;
    chartBottom3 = canvas3.height - 40;
    context3.save();
    context3.translate(0.5, 0.5);
}

function tekennet() {
    var i, j, z, onder, boven, getal, getal1;
    if ((model.sampleSize() < 200) && model.showgrid()) {
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#f2f2f2";
        for (i = 1; i < model.sampleSize(); i += 1) {
            for (j = 0; j <= i; j += 1) {
                if (j > 0) { //gooit 0
                    context.moveTo(i * assen.fx + assen.cx, (j * assen.fy / i + assen.cy));
                    context.lineTo((i + 1) * assen.fx + assen.cx, (j * assen.fy / (i + 1) + assen.cy));
                };

                context.moveTo(i * assen.fx + assen.cx, (j * assen.fy / i + assen.cy));
                context.lineTo((i + 1) * assen.fx + assen.cx, (j + 1) * assen.fy / (i + 1) + assen.cy);
            }
        }
        context.stroke();
    }
    context.beginPath();
    context.strokeStyle = "Black";
    switch (+model.showTrechter()) {
        case 0:
            context.lineWidth = 1;
            return;
        case 1:
            z = jStat.normal.inv(0.95, 0, 1);
            break;
        case 2:
            z = jStat.normal.inv(0.975, 0, 1);
            break;
        case 3:
            z = jStat.normal.inv(0.995, 0, 1);
            break;
    }
    context.lineWidth = 2;
    context.strokeStyle = "black";
    switch (+model.simulate()) {
        case 0:
            p = +model.kans();
            break;
        case 1:
            if (model.selectedkeuze() == 0) {
                p = 1 / 3;
            } else {
                p = 2 / 3;
            }
            break;
        case 2:
            break;
    }

    for (i = 5; i < model.sampleSize(); i += 1) {
        if ((i * p > 5) && (i * (1 - p) > 5)) {
            getal = z * Math.sqrt(p * (1 - p) / i);
            getal1 = z * Math.sqrt(p * (1 - p) / (i + 1));
            onder = +p - getal;
            if (onder > 0) {
                context.moveTo(i * assen.fx + assen.cx, onder * assen.fy + assen.cy);
                onder = p - getal1;
                context.lineTo((i + 1) * assen.fx + assen.cx, onder * assen.fy + assen.cy);
            }
            boven = +p + getal;
            if (boven < 1) {
                context.moveTo(i * assen.fx + assen.cx, boven * assen.fy + assen.cy);
                boven = +p + getal1;
                context.lineTo((i + 1) * assen.fx + assen.cx, boven * assen.fy + assen.cy);
            }
        }
        context.stroke();
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "black";
    }
}

function tekenPath() {
    var i, j, gewonnen;
    context.beginPath();
    context.lineWidth = 1;
    if (model.showmemory()) { //tekenen van memory aantalsteps
        for (i = 0; i < aantalgeheugen; i += 1) {
            context.moveTo(assen.fx + assen.cx, memory[i][0] * assen.fy + assen.cy);
            if ((i != aantalsteps) && (memory[i].length > 0)) {
                context.strokeStyle = kleuren[i];
                for (j = 1; j < aantal1; j += 1) {
                    context.lineTo((j + 1) * assen.fx + assen.cx, memory[i][j] * assen.fy / (j + 1) + assen.cy);
                }
                context.stroke();
                context.beginPath()
            }
        };
    };
    if (memory[aantalsteps].length > 0) {
        context.lineWidth = 3;
        context.moveTo(assen.fx + assen.cx, memory[aantalsteps][0] * assen.fy + assen.cy);
        context.strokeStyle = kleuren[aantalsteps];
        for (j = 1; j < aantalGraph1; j += 1) {
            context.lineTo((j + 1) * assen.fx + assen.cx, memory[aantalsteps][j] * assen.fy / (j + 1) + assen.cy);
        }
        if (model.simulate() == 1) {
            if (aantalGraph1 > 0) {
                gewonnen = memory[aantalsteps][aantalGraph1 - 1] - memory[aantalsteps][aantalGraph1 - 2];
                simdraaien();
                simtekst((model.selectedkeuze() == 0), gewonnen);
            }
        }
    }
    context.stroke();
    context.beginPath();
    context.lineWidth = 1;
}

function simtekst(keep, gewonnen) {
    var hulp;
    if (keep) {
        hulp = hou_keuze[taal]
    } else {
        hulp = choice_changed[taal]
    };
    if (gewonnen) {
        hulp += '. ' + jij_wint[taal]
    } else {
        hulp += '. ' + jij_verliest[taal];
    }
    $("#tekstsim").text(hulp);
}

function trek(van, tot) {
    if (model.simulate() == 1) {
        if (tot > 0) {
            gewonnen = memory[aantalsteps][tot] - memory[aantalsteps][tot - 1];
            simdraaien();
            simtekst((model.selectedkeuze() == 0), gewonnen);
        }
    }
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = kleuren[aantalsteps];
    context.moveTo(assen.fx * (van + 1) + assen.cx, memory[aantalsteps][van] / (van + 1) * assen.fy + assen.cy);
    for (j = van + 1; j <= tot; j += 1) {
        context.lineTo((j + 1) * assen.fx + assen.cx, memory[aantalsteps][j] * assen.fy / (j + 1) + assen.cy);
    }
    context.stroke();
    context.beginPath();
    context.lineWidth = 1;
    tekenstaven(memory[aantalsteps][tot], tot - memory[aantalsteps][tot]);
}
function omzetx(y) {
    return y * assen.fy + assen.cy;
}

function tekenboxplot() {
    var posx, mediaan, sigma;
    context.beginPath();
    context.strokeRect(assen.rechts, assen.boven, 50, assen.rangey);
    context.beginPath();
    posx = assen.rechts + 25;
    if (totSort.length < 5) {
        context.fillStyle = "silver";
        context.fillRect(assen.rechts, assen.boven, 50, assen.rangey);

        context.beginPath();
        if (model.sampleSize() == 0) {
            return;
        }
        mediaan = model.kans() * assen.boven + (1 - model.kans()) * assen.onder;
        sigma = Math.sqrt(model.kans() * (1 - model.kans()) / model.sampleSize());
        kwart1 = mediaan + 0.68 * sigma * assen.fy;
        kwart3 = mediaan - 0.68 * sigma * assen.fy;
        onderhange = mediaan + 2 * sigma * assen.fy;
        bovenhange = mediaan - 2 * sigma * assen.fy;
        context.strokeRect(posx - 20, kwart1, 40, kwart3 - kwart1);
        context.moveTo(posx - 20, mediaan);
        context.lineTo(posx + 20, mediaan);
        context.moveTo(posx - 10, onderhange);
        context.lineTo(posx + 10, onderhange);
        context.moveTo(posx, onderhange);
        context.lineTo(posx, kwart3);
        context.moveTo(posx, kwart1);
        context.lineTo(posx, bovenhange);
        context.moveTo(posx - 10, bovenhange);
        context.lineTo(posx + 10, bovenhange);
        context.stroke();
    } else {
        context.fillStyle = "yellow";
        context.fillRect(posx - 20, omzetx(kwart3), 40, (kwart1 - kwart3) * assen.fy);
        context.strokeRect(posx - 20, omzetx(kwart3), 40, (kwart1 - kwart3) * assen.fy);
        context.beginPath();
        context.fillStyle = "white";
        context.moveTo(posx - 20, omzetx(kwart2));
        context.lineTo(posx + 20, omzetx(kwart2));

        context.moveTo(posx - 10, omzetx(onderhange));
        context.lineTo(posx + 10, omzetx(onderhange));

        context.moveTo(posx, omzetx(onderhange));
        context.lineTo(posx, omzetx(kwart1));
        context.moveTo(posx, omzetx(kwart3));
        context.lineTo(posx, omzetx(bovenhange));
        context.moveTo(posx - 10, omzetx(bovenhange));
        context.lineTo(posx + 10, omzetx(bovenhange));
        for (i = 0; i < onderpunt; i += 1) {
            context.moveTo(posx - 5, omzetx(totSort[i] / aantal1) - 5);
            context.lineTo(posx + 5, omzetx(totSort[i] / aantal1) + 5);
            context.moveTo(posx - 5, omzetx(totSort[i] / aantal1) + 5);
            context.lineTo(posx + 5, omzetx(totSort[i] / aantal1) - 5);
        };
        // context.arc(posx-3,omzetx(mediaan)-3,posx+3,omzetx(mediaan)+3);
        for (i = bovenpunt + 1; i < model.uitvoer(); i += 1) {
            context.moveTo(posx - 5, omzetx(totSort[i] / aantal1) - 5);
            context.lineTo(posx + 5, omzetx(totSort[i] / aantal1) + 5);
            context.moveTo(posx - 5, omzetx(totSort[i] / aantal1) + 5);
            context.lineTo(posx + 5, omzetx(totSort[i] / aantal1) - 5);
        }
        context.stroke();
    }

}

function tekenstaven(kop1, munt1) {
    var breed, aantal;
    context1.fillStyle = "Lime";
    breed = assen1.fx - 5;
    context1.fillRect(assen1.cx - breed / 2, assen1.onder, breed, assen1.fy * kop1);
    context1.fillStyle = "Yellow"
    context1.fillRect(assen1.cx - breed / 2 + assen1.fx, assen1.onder, breed, assen1.fy * munt1);
    if ((kop1 + munt1 > 0) && (model.simulate() == 2)) {
        maakshowtabel(kop1 + munt1 - 1, aantalgroep);
    }
    if (model.showmemory()) {
        context1.beginPath();
        context1.strokeStyle = "silver";
        for (i = 0; i < aantalgeheugen; i += 1) {
            if ((i != aantalsteps) && (memory[i].length > 0)) {
                aantal = memory[i][aantal1 - 1];
                context1.moveTo(assen1.cx - breed / 2, aantal * assen1.fy + assen1.cy);
                context1.lineTo(assen1.cx + breed / 2, aantal * assen1.fy + assen1.cy);
                context1.moveTo(assen1.cx + assen1.fx - breed / 2, (aantal1 - aantal) * assen1.fy + assen1.cy);
                context1.lineTo(assen1.cx + assen1.fx + breed / 2, (aantal1 - aantal) * assen1.fy + assen1.cy);
            }
        }
        context1.stroke();
        context1.beginPath();
        context1.strokeStyle = "Black";
    }
}

function drawhistogram(kop1, munt1) {
    var maximum, kans, breed;
    switch (+model.simulate()) {
        case 0:
            var mat = [
                [0, kop[taal]],
                [1, munt[taal]]
            ];
            break;
        case 1:
            var mat = [
                [0, auto[taal]],
                [1, geit[taal]]
            ];
            break;
        case 2:
            var mat = [
                [0, good[taal] ],
                [1,zelf[taal]]
            ];
            break;
    }

    //eerst maximum bepalen
    switch (+model.simulate()) {
        case 0:
            kans = Math.max(model.kans(), 1 - model.kans());
            break;
        case 1:
            kans = 2 / 3;
            break;
        case 2:
            kans = 1 - 1 / Math.exp(1);
            break;
    }
    maximum = 3 * Math.sqrt(kans * (1 - kans) * model.sampleSize()) + kans * model.sampleSize();
    context1.lineWidth = 1;
    assen1.dimensies(chartLeft1, chartTop, chartRight1, chartBottom1);
    assen1.tekenenxtekst(mat, '', context1, canvas1);
    assen1.tekenyas(0, maximum, true, context1);

    // teken eerst de echte histogram
    tekenstaven(kop1, munt1);

}

function tekenhist(aantalGraph1) {
    var aantalkop
    canvas1 = document.getElementById('histogram');
    context1 = canvas1.getContext('2d');
    initsettings1();
    if (aantalGraph1 == 0) {
        drawhistogram(0, 0);
    } else {
        aantalkop = memory[aantalsteps][aantalGraph1 - 1];
        drawhistogram(aantalkop, aantalGraph1 - aantalkop);
        if (model.simulate() == 2) {
            maakshowtabel(aantalGraph1 - 1, model.size_group());
        }

    }
};

function initGraph() {
    if (model == null) {
        return;
    }
    canvas = document.getElementById('paintbox');
    context = canvas.getContext('2d');
    initsettings();
    assen.minimumx = 0;
    assen.maximumx = model.sampleSize();
    assen.minimumy = 0;
    assen.dimensies(chartLeft, chartTop, chartRight, chartBottom);
    assen.tekenxas(assen.minimumx, assen.maximumx, false, context);
    assen.tekeneny(context);
    tekennet();
    tekenPath();
    context.strokeStyle = "Black";
    context.rect(assen.links, assen.boven, assen.rechts, assen.rangey);
    context.stroke();
    tekenboxplot();
    context.restore();
    tekenhist(aantalGraph1);
    context1.restore();
}

function tekenkeeps() {
    context3.beginPath();
    if (model.alleen_keep()) {
        context3.strokeStyle = kleurkeep;
        context3.fillStyle = kleurkeep;
        for (i = 0; i < alleen_keeps.length; i += 1) {
            if (i > 0) {
                context3.moveTo(assen.fx * i + assen.cx, assen.fy * alleen_keeps[i - 1] / i + assen.cy);
                context3.lineTo(assen.fx * (i + 1) + assen.cx, assen.fy * alleen_keeps[i] / (i + 1) + assen.cy);
                context3.stroke();
            }
            context3.beginPath();
            context3.arc(assen.fx * (i + 1) + assen.cx, assen.fy * alleen_keeps[i] / (i + 1) + assen.cy, 4, 0, 2 * Math.PI)
            context3.fill();
            context3.beginPath();
        }
    }
}

function tekenchanges() {
    if (model.alleen_change()) {
        context3.beginPath();
        context3.strokeStyle = kleurchange;
        context3.fillStyle = kleurchange;
        for (i = 0; i < alleen_changes.length; i += 1) {
            if (i > 0) {
                context3.moveTo(assen.fx * i + assen.cx, assen.fy * alleen_changes[i - 1] / i + assen.cy);
                context3.lineTo(assen.fx * (i+1) + assen.cx, assen.fy * alleen_changes[i] / (i + 1) + assen.cy);
                context3.stroke();
            }
            context3.beginPath();
            context3.arc(assen.fx * (i+1) + assen.cx, assen.fy * alleen_changes[i] / (i + 1) + assen.cy, 4, 0, 2 * Math.PI)
            context3.fill();

            context3.beginPath();
        }
    }
}

function initGraph3() {
    if (model == null) {
        return;
    }
    canvas3 = document.getElementById('paintbox3');
    context3 = canvas3.getContext('2d');
    initsettings3();
    assen.minimumx = 0;
    assen.maximumx = Math.max(+model.keepChoice(), +model.changeChoice());
    assen.maximumx = Math.max(10, assen.maximumx + 5)
    assen.minimumy = 0;
    assen.dimensies(chartLeft3, chartTop3, chartRight3, chartBottom3);
    if (assen.maximumx <= 15) {
        assen.firstPointx = 0;
        assen.stapx = 1;
        assen.aantalintervallenx = assen.maximumx;
        assen.kommax = 0;
        assen.zetfactoren();
        assen.stepx = self.stapx * self.fx;

        assen.tekenenx(context3);


    } else {
        assen.tekenxas(assen.minimumx, assen.maximumx, false, context3)
    };
    assen.tekeneny(context3);
    //tekennet();
    //tekenPath();
    context.strokeStyle = "Black";
    context3.rect(assen.links, assen.boven, assen.rechts, assen.rangey);
    context3.stroke();
	context3.lineWidth=3;
    tekenchanges();
    tekenkeeps();
	context3.lineWidth=1;
	context3.beginPath();
	context3.fillStyle="Black";
	context3.textBaseline="Bottom";
	context3.textAlign="Center";
	context3.font="titelfont"
	context3.fillText(drie_deuren[taal],canvas3.width/2, canvas3.height-10);
	context3.beginPath();
	context3.textBaseline="Top";
	context3.textAlign="Center";
	context3.font="titelfont"
	context3.fillText(drie_deuren[taal],canvas3.width/2, canvas3.height-10);

    context3.restore();
    
}
