/*global assenfont,defaultfont   */
/*jslint plusplus: true  */
/*jslint white: true */
var posmachten = [1, 10, 100, 1000, 10000, 1E5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30];

function isInteger(num) {
    return (num ^ 0) === num;
}

function rotateLabel(hulp, context, x, y, hoek) {
    "use strict";
    context.save();
    hulp = hulp.toString();
    context.translate(x, y);

    context.rotate(hoek * Math.PI / 180);
    context.fillText(hulp, 0, 0);
    context.restore();
}


var klasgroot = 80;
var machten = [1, 0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 1E-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17, 1e-18, 1e-19, 1e-20, 1e-21, 1e-22, 1e-23, 1e-24, 1e-25, 1e-26, 1e-27, 1e-28, 1e-29, 1e-30];
var posmachten = [1, 10, 100, 1000, 10000, 1E5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29, 1e30];

var stripgetal = function (hulp) {
    "use strict";
    var l = hulp.indexOf('.'),
        h;
    if (l === 0) {
        return hulp;
    } else {
        return parseFloat(hulp);
        // hulp = hulp.replace(/\.0+$/, '');
        //    return hulp;
        //   h=regexp
        //    als laatste is punt dan verwijderen
    }
};

function geefkomma(stap) {
    "use strict";
    if (stap > 2.6) {
        return 0;
    } else if (stap > 2.4) {
        return 1;
    } else if (stap > 0.999) {
        return 0;
    } else {


        return Math.round(-Math.log(0.5 * stap) / Math.log(10));
    }
}

function verschiln(getal, komma) {
    "use strict";

    var hulp;
    hulp = getal.toFixed(komma);
    return +hulp - Math.pow(10, -komma);


    //  return Math.floor(+getal * posmachten[komma]) / posmachten[komma];
}

function verschilp(getal, komma) {
    "use strict";
    return Math.ceil(+getal * posmachten[komma]) / posmachten[komma];
}

function mooieGrenzen(minimum, maximum) {
    // geeft kleiner en groter getal dan minimum en maximum
    "use strict";
    var aantalintervallen, i, getal, breuk, afrond, stap, eerstegrens, kommanu; //aantalintervallen volledig gekozen door programma
    getal = +maximum - minimum;
    if (getal < 1E-10) {
        maximum = minimum + 1;
        minimum = maximum - 2;
        kommanu = 1;
    } else {
        if (getal > 5) {
            kommanu = 0;
        } else {
            kommanu = -Math.floor(Math.log(2 * getal) / Math.log(10)) + 1;
        }
    }
    if (getal >= 5 * verschilp(0, kommanu)) {
        // zorg dat je een getal tussen 15 en 100 krijgt
        i = Math.floor(Math.log(getal) / Math.log(10)) - 1;
        breuk = getal / Math.pow(10, i);
        if (breuk < 15) {
            stap = 2;
        } else if (breuk < 20) {
            stap = 3;
        } else if (breuk < 45) {
            stap = 5;
        } else if (breuk < 80) {
            stap = 10;
        } else {
            stap = 20;
        }
        afrond = +(+stap * Math.pow(10, i)).toFixed(kommanu);
    } else {
        afrond = verschilp(0, kommanu);
    }
    stap = +afrond;
    eerstegrens = +Math.round(minimum / afrond) * afrond;
    if (minimum < eerstegrens) {
        eerstegrens -= stap;
    }
    while (eerstegrens + stap < minimum) {
        eerstegrens += stap;

    }

    kommanu = geefkomma(stap);
    aantalintervallen = Math.round((maximum - eerstegrens) / afrond);
    while (eerstegrens + aantalintervallen * afrond <= maximum) {
        aantalintervallen += 1;
    }
    while (eerstegrens + stap < minimum) {
        eerstegrens += stap;
        aantalintervallen -= 1;
    }
    while (eerstegrens + (aantalintervallen - 1) * stap > maximum) {
        aantalintervallen -= 1;
    }
    if (aantalintervallen < 1) {
        aantalintervallen = 1;
    }
    return {
        aantalintervallen: aantalintervallen,
        ondergr: eerstegrens,
        bovengr: eerstegrens + aantalintervallen * stap,
        stap: stap,
        komma: kommanu
    };
}

function maakgelijkegrenzen(aantalintervallen, minimum, maximum, kommanu) {
    var eerstegrens, intervalbreedte;
    var posmachten = [1, 10, 100, 1000, 10000, 100000, 1E6, 1E7, 1E8, 1E9, 1E10, 1E11, 1E12, 1E13, 1E14, 1E15, 1E16, 1E17, 1E18, 1E19, 1E20];
    var negmachten = [1, 0.1, 0.01, 0.001, 0.0001, 1E-5, 1E-1, 1E-7, 1E-8, 1E-9, 1E-10, 1E-11, 1E-12, 1E-13, 1E-14, 1E-15, 1E-16, 1E-17, 1E-18, 1E-19, 1E-20];

    var i, getal, stap, afrond, tel;
    var stapmat = [1, 2, 3, 5, 10, 20, 25, 50, 100, 200, 300, 500];
    getal = maximum - minimum;
    if (getal >= -aantalintervallen * verschiln(0, kommanu)) {
        i = 0;
        if (getal > 1) {
            while (getal > posmachten[i]) {
                i += 1;
            }
            i = i - 1;
        } else {
            while (getal < negmachten[-i]) {
                i -= 1
            }
        }
        tel = 0;
        do {
            stap = stapmat[tel];
            afrond = stap * Math.pow(10, +i - 1);
            eerstegrens = Math.round(minimum / afrond) * afrond;
            if (minimum < eerstegrens) {
                eerstegrens -= afrond;
            }
            while (eerstegrens + afrond < minimum) {
                eerstegrens += afrond;
            }
            tel += 1;
        }
        while (eerstegrens + aantalintervallen * afrond <= maximum);
        intervalbreedte = afrond;
    } else {
        eerstegrens = minimum.toFixed(kommanu);
        intervalbreedte = verschilp(0.00000000001, kommanu);
    }
    return {
        eerstegrens: eerstegrens,
        intervalbreedte: intervalbreedte
    }
}


function berekenverdeling(veel, range100) {
    // range100 is een getal tussen 12 en 120 veel is het aantal intervallen. op grond daarvan wordt de stapgrootte bepaald
    "use strict";
    var ran;
    ran = Math.floor(range100);
    switch (veel) {
        case 1:
            if (ran <= 22) {
                return 10;
            } else if (ran <= 35) {
                return 20;
            } else if (ran <= 50) {
                return 30;
            } else if (ran <= 70) {
                return 40;
            } else if (ran <= 90) {
                return 50;
            } else {
                return 70;
            }
        case 2:
            if (ran <= 21) {
                return 5;
            } else if (ran <= 30) {
                return 10;
            } else if (ran <= 59) {
                return 20;
            } else if (ran <= 70) {
                return 25;
            } else if (ran <= 95) {
                return 30;
            } else {
                return 40;
            }
        case 3:
            if (ran <= 24) {
                return 5;
            } else if (ran <= 49) {
                return 10;
            } else if (ran <= 79) {
                return 20;
            } else if (ran <= 99) {
                return 25;
            } else {
                return 30;
            }

        case 4:
            if (ran <= 24) {
                return 5;
            } else if (ran <= 49) {
                return 10;
            } else if (ran <= 79) {
                return 20;
            } else if (ran <= 99) {
                return 25;
            } else {
                return 30;
            }

        case 5:
            if (ran <= 14) {
                return 2;
            } else if (ran <= 29) {
                return 5;
            } else if (ran <= 59) {
                return 10;
            } else if (ran <= 99) {
                return 20;
            } else {
                return 30;
            }

        case 6:
            if (ran <= 16) {
                return 2;
            } else if (ran <= 34) {
                return 5;
            } else if (ran <= 69) {
                return 10;
            } else {
                return 20;
            }

        case 7:
            if (ran <= 18) {
                return 2;
            } else if (ran <= 40) {
                return 5;
            } else if (ran <= 79) {
                return 10;
            } else {
                return 20;
            }
        default:
            if (ran <= 23) {
                return 2;
            } else if (ran <= 59) {
                return 5;
            } else if (ran <= 109) {
                return 10;
            } else {
                return 20;
            }
    }
}


function berekenStap(veel, maxaantal, ondergrens, bovengrens) {
    "use strict";
    var range100, verm, ondergr, range, code, stap100, stap;
    range = bovengrens - ondergrens;
    verm = 1;
    range100 = range;
    if (range100 > 120) {
        while (range100 > 120) {
            range100 = range100 / 10;
            verm = verm * 10;
        }
    } else {
        while (range100 <= 12) {
            range100 = range100 * 10;
            verm = verm / 10;
        }
    }
    ondergr = Math.round(Math.abs(ondergrens / verm / 10)) * verm * 10;
    if (ondergrens < 0) {
        ondergr = -ondergr;
    }
    stap100 = berekenverdeling(veel, range100);
    stap = stap100 * verm;
    while (ondergr > ondergrens + 0.1 * range) {
        ondergr -= stap;
    }
    while (ondergr <= (ondergrens + 0.001 * range)) {
        ondergr += stap;
    }
    return {
        firstPoint: ondergr,
        stap: stap
    };

}

function berekenInterval(minimum, maximum) {
    //laat minimum en maximum staan en geeft mooie getallen tussen minimum en maximum
    "use strict";
    var veel, maxaantal, breed, range, ondergr, nulgetal, nul, accoord, stap, komma, firstPoint, aantalintervallen, answer;
    range = maximum - minimum;
    maxaantal = 10;
    veel = 5;
    accoord = true;
    //	do {
    if ((range >= 4) && (range < maxaantal + 1) && (Math.abs(maximum) < 99)) {
        stap = 1;
        komma = 0;
        ondergr = Math.floor(minimum);
    } else {
        nul = ((minimum <= 0) && (0 <= maximum));
        if (nul) {
            nulgetal = maximum / range;
            if (nulgetal > 0.5) {
                answer = berekenStap(Math.round(veel * nulgetal), Math.round(maxaantal * nulgetal), 0, maximum);
            } else {
                nulgetal = 1 - nulgetal;
                answer = berekenStap(Math.round(veel * nulgetal), Math.round(maxaantal * nulgetal), minimum, 0);
            }
            ondergr = 0;
        } else {
            answer = berekenStap(veel, maxaantal, minimum, maximum);
            ondergr = answer.firstPoint;
        }
        stap = answer.stap;
    }
    while (ondergr - stap >= minimum - 0.001 * range) {
        ondergr -= stap;
    }
    if (ondergr < minimum - 0.0001 * range) {
        ondergr += stap;
    }
    firstPoint = ondergr;
    aantalintervallen = Math.floor((maximum - firstPoint) / stap) + 1;

    return {
        firstPoint: ondergr,
        aantalintervallen: aantalintervallen,
        komma: geefkomma(stap),
        stap: stap
    };
}


function Assen() {
    "use strict";
    var self = this;
    this.firstPointx = 0; // de echte x waarde van het eerste punt van de labels
    this.stapx = 0;
    this.fx = 0;
    this.cx = 0;
    this.factorx = 0;
    this.constx = 0;
    this.tekst=true;
    this.minimumx = 0;
    this.maximumx = 1;
    this.firstPointy = 0;
    this.stapy = 0;
    this.fy = 0;
    this.cy = 0;
    this.half = false;
    this.asrechts = false;
    this.factory = 0;
    this.consty = 0;
    this.minimumy = 0;
    this.maximumy = 1;
    this.aantalPunten = 0;
    this.aantalbars = 5;
    this.links = 0;
    this.rechts = 1;
    this.boven = 0;
    this.onder = 1;
    this.komma = 0;
    this.naamx = '';
    this.omhoogy = 0;
    this.percentagesy = false;
    this.gridy = false;
    this.labely = "";
    this.labelx = "";
    this.yasnaarlinks = 0;
    this.percentagesx = false;
    this.samen = 1; // het aantal staafjes dat samen genomen wordt
    this.dimensies = function (chartLeft, chartTop, chartRight, chartBottom) {
        self.links = chartLeft;
        self.rechts = chartRight;
        self.onder = chartBottom;
        self.boven = chartTop;
        self.rangex = self.rechts - self.links;
        self.rangey = self.onder - self.boven;
        self.zetfactoren();
    };
    this.zetfactoren = function () {
        self.fx = (self.rechts - self.links) / (self.maximumx - self.minimumx);
        self.cx = self.links - self.fx * self.minimumx;
        self.factorx = 1 / self.fx;
        self.constx = -self.cx / self.fx;
        self.fy = (self.boven - self.onder) / (self.maximumy - self.minimumy);
        self.cy = self.onder - self.fy * self.minimumy;
        self.factory = 1 / self.fy;
        self.consty = -self.cy / self.fy;
    };
    this.tekenenx = function (context) { //alles is al berekend. Er hoeft alleen nog maar te worden getekend alleen 
        var hoogte = 5,
            waarde, getal, hulp, i;

        //self.zetfactoren();


        context.moveTo(self.rechts, self.onder);
        context.lineTo(self.links, self.onder);
        context.font = assenfont;
        context.textBaseline = "top";
        context.textAlign = "center";
        context.strokeStyle = "Black";
        context.fillStyle = "Black";

        for (i = 0; i <= self.aantalintervallenx; i += 1) {
            waarde = i * self.stapx + self.firstPointx;
            if (self.percentagesx) {
                hulp = parseFloat((waarde * 100).toFixed(Math.max(self.kommax - 2, 0))) + '%';
            } else {
                hulp = parseFloat(waarde.toFixed(this.kommax)); //stripgetal}
            }
            getal = Math.round(self.fx * waarde + self.cx);
            if (getal <= self.rechts + 3) {
                if (self.tekst){context.fillText(hulp, getal, self.onder + hoogte + 2);}
                context.moveTo(getal, self.onder);
                context.lineTo(getal, self.onder + hoogte);
                context.stroke();
                context.fill();
            }
        }
        context.textBaseline = "middle";
        context.font = defaultfont;
    };
    this.verschuif = function (verschuifx, verschuify) {
        self.links += verschuifx;
        self.rechts += verschuifx
        self.onder += verschuify;
        self.boven += verschuify;

        self.cx = self.links - self.fx * self.minimumx;
        self.cy = self.onder - self.fy * self.minimumy;
        self.constx = -self.cx / self.fx;
    }
    this.tekenxas = function (ondergr, bovengr, mooiegrenzen, context) {
        var answer;
        self.omhoogy = 0;
        if (mooiegrenzen) { //De grenzen moeten worden uitgebreid om mooie getallen te krijgen}
            answer = mooieGrenzen(ondergr, bovengr);
            self.firstPointx = answer.ondergr;
            self.stapx = answer.stap;
            self.minimumx = answer.ondergr;
            self.maximumx = answer.bovengr;
            self.aantalintervallenx = answer.aantalintervallen;
            self.kommax = answer.komma;


        } else { //mooie getallen tussen deez twee grenzen moeten worden getoond
            self.minimumx = ondergr;
            self.maximumx = bovengr;
            answer = berekenInterval(ondergr, bovengr);
            self.firstPointx = answer.firstPoint;
            self.stapx = answer.stap;
            self.kommax = answer.komma;
            self.aantalintervallenx = answer.aantalintervallen;
        }
        self.zetfactoren();
        self.stepx = self.stapx * self.fx;

        self.tekenenx(context);
    };
    this.tekenlabel = function (x, tekst, context) {
        var posx;
        context.beginPath();
        context.font = assenfont;
        context.textBaseline = "top";
        context.textAlign = "center";
        context.strokeStyle = "Black";
        context.fillStyle = "Black";
        posx = x * self.fx + self.cx
        context.moveTo(posx, self.onder);
        context.lineTo(posx, self.onder + 5);
        context.stroke();
        context.fillText(tekst, x * self.fx + self.cx, self.onder + 5);
    }
    this.tekenenxtekst = function (mat, titel, context, canvas) {
        var aantalcat, i, hulp, getal, hoogte = 10,
            eerstepunt, maxbreed, verticaal, breed, klasbreed, onder;
        if (mat == undefined) {
            return;
        }
        maxbreed = 0;
        for (i in mat) {
            hulp = mat[i][1];
            breed = context.measureText(hulp).width;
            if (breed > maxbreed) {
                maxbreed = breed;
            }
        }
        verticaal = maxbreed > (self.fx - 10);
        if ((verticaal) && (maxbreed > canvas.height - self.onder)) {
            onder = self.onder;
            self.onder = canvas.height - maxbreed - 10;
            self.rangey = self.onder - self.boven;
            self.omhoogy = self.onder - onder;
            self.zetfactoren();
        } else {
            self.omhoogy = 0;
        }
        context.moveTo(self.rechts, self.onder);
        context.lineTo(self.links, self.onder);
        context.font = assenfont;
        context.textBaseline = "top";
        context.textAlign = "center";
        context.fillStyle = "Black";
        context.stroke();
        aantalcat = mat.length;
        self.stapx = 1;
        klasbreed = Math.max(120, maxbreed + 10);
        if (self.rangex > aantalcat * klasbreed) {
            eerstepunt = (self.rechts + self.links - aantalcat * klasbreed) / 2;
            self.fx = klasbreed;
        } else {
            self.fx = self.rangex / aantalcat;
            eerstepunt = self.links + self.fx / 2;
        }
        self.cx = eerstepunt;
        self.factorx = 1 / self.fx;
        self.constx = -self.cx / self.fx;
        self.minimumx = self.factorx * self.links + self.constx;
        self.maximumx = self.factorx * self.rechts + self.constx;
        self.aantalintervallenx = mat.length;
        self.firstPointx = -0.5;
        for (i in mat) {
            hulp = mat[i][1];
            getal = Math.round(self.fx * i + self.cx);
            if (getal <= self.rechts + 3) {
                if (verticaal) {
                    context.save();
                    context.translate(getal, self.onder + 10);
                    context.rotate(-Math.PI / 2);
                    context.textAlign = "right";
                    context.textBaseline = "middle";
                    context.fillText(hulp, 0, 0);
                    context.restore();
                } else {
                    context.fillText(hulp, getal, self.onder + hoogte + 2);
                }
                context.moveTo(getal, self.onder);
                context.lineTo(getal, self.onder + hoogte);
                context.stroke();
            }
        }
        context.textBaseline = "middle";
        context.font = defaultfont;
    };
    this.tekenyas = function (ondergr, bovengr, mooiegrenzen, context) {
        var answer;
        if (mooiegrenzen) { //De grenzen moeten worden uitgebreid om mooie getallen te krijgen}
            answer = mooieGrenzen(ondergr, bovengr);
            self.firstPointy = answer.ondergr;
            self.stapy = answer.stap; //verwijderd 0 aan het einde
            self.minimumy = answer.ondergr;
            self.maximumy = answer.bovengr;
            self.aantalintervalleny = answer.aantalintervallen;
            self.kommay = answer.komma;


        } else { //mooie getallen tussen deez twee grenzen moeten worden getoond
            self.minimumy = ondergr;
            self.maximumy = bovengr;
            answer = berekenInterval(ondergr, bovengr);
            self.firstPointy = answer.firstPoint;
            self.stapy = answer.stap;
            self.kommay = answer.komma;
            self.aantalintervalleny = answer.aantalintervallen;
        }
        self.zetfactoren();
        self.tekeneny(context);
    };
    this.geefIndelingx = function (minimum, maximum, firstPoint, stap, context) { //minimum,maximum zijn gegeven
        var getal;
        self.firstPointx = firstPoint;
        self.stapx = stap;
        self.stepx = stap * self.fx; //in pixels
        self.minimumx = minimum;
        getal = firstPoint;
        self.aantalintervallenx = Math.floor((maximum - firstPoint) / stap);
        self.zetfactoren();
        self.tekenenx(context);
    };
    this.geefIndelingy = function (minimum, maximum, firstPoint, stap, context) { //minimum,maximum zijn gegeven
        self.firstPointy = firstPoint;
        self.stapy = stap;
        self.minimumy = minimum;
        self.maximumy = maximum;
        self.aantalintervalleny = Math.floor((maximum - firstPoint) / stap);
        self.zetfactoren();


        self.tekeneny(context);
    };

    this.tekeneny = function (context) { //alles is al berekend. Er hoeft alleen nog maar te worden getekend
        var hoogte = 5,
            naarrechts = 0,
            waarde, getal, hulp, i;
        context.font = assenfont;
        context.moveTo(self.links - self.yasnaarlinks, self.onder);
        context.lineTo(self.links - self.yasnaarlinks, self.boven);
        context.textBaseline = "middle";
        if (self.asrechts) {
            context.textAlign = "left";
            naarrechts = 4;
            hoogte = -hoogte
        } else {
            context.textAlign = "right";
        }
        context.fillStyle = "Black";
        for (i = 0; i <= self.aantalintervalleny; i += 1) {
            waarde = i * self.stapy + self.firstPointy;
            if (self.percentagesy) {
                hulp = parseFloat((waarde * 100).toFixed(Math.max(self.kommay - 2, 0))) + '%';
            } else {
                hulp = parseFloat(waarde.toFixed(this.kommay)); //stripgetal}
            }

            //hulp = stripgetal(waarde.toFixed(this.kommay));

            getal = Math.round(self.fy * waarde + self.cy);
            if (getal >= self.boven - 3) {
                if (self.tekst){context.fillText(hulp, self.links - hoogte - 2 - self.yasnaarlinks + naarrechts, getal);}
                context.moveTo(self.links - hoogte - self.yasnaarlinks, getal);

                context.lineTo(self.links - self.yasnaarlinks, getal);
                context.stroke();
                if ((self.gridy) && (getal < self.onder)) {
                    context.beginPath();
                    context.strokeStyle = "silver";
                    context.moveTo(self.links - self.yasnaarlinks, getal);
                    context.lineTo(self.rechts, getal);
                    context.stroke();
                    context.beginPath();
                    context.strokeStyle = "Black";
                }

            }
        }

        if (self.labely > '') {
            context.textAlign = "right";
            context.fillStyle = "Black";
            // rotateLabel("test",context,100,100,90);
            rotateLabel(self.labely, context, self.links - 50, self.boven, -90);
        }
        context.font = defaultfont;

    };
    this.grenzenaanpassen = function (bars) { //alleen nog maar in gebruik bij verdelingen 
        var minimum, maximum, bereikx, answer;
        // voor de discrete verdeling
        //{ Als samen =1 dan staat staaf in het midden anders aan het begin} 
        // eerst de staafjes netjes op de xas zetten
        minimum = self.minimumx;
        maximum = self.maximumx;
        bereikx = self.maximumx - self.minimumx;
        self.rangex = bereikx;


        if ((self.rangex < klasgroot) || (self.staven)) {
            self.samen = 1;
        } else {
            self.samen = 2;
            while ((bereikx / self.samen) > klasgroot) {
                self.samen += 1;
            }
            maximum = minimum + Math.ceil((maximum - minimum) / self.samen) * self.samen;
        }
        self.minimum = +minimum;
        self.maximum = +maximum;
        if (self.samen > 1) {
            self.maximumy = self.maximumy * self.samen;
        }
        self.zetfactoren();
        answer = berekenInterval(minimum, maximum);
        self.firstPointx = answer.firstPoint;
        self.stapx = answer.stap;
        self.aantalintervallenx = answer.aantalintervallen;
        if (bars) {
            self.minimumx = +self.minimum - 0.1 * (maximum - minimum) - 0.5;
            self.maximumx = +self.maximum + 0.1 * (maximum - minimum) + 0.5;
        } else {
            self.minimumx = +self.minimum - 0.1 * (maximum - minimum);
            self.maximumx = +self.maximum + 0.1 * (maximum - minimum);

        }
        //zorg dat de minimum begin is van staaf

        self.aantalbars = Math.round((maximum - minimum) / self.samen) + 1;
        //nu de labels op de x-as bepalen

    };
    this.integergrenzen = function () { //alleen nog maar in gebruik bij crossboot
        var minimum, maximum, bereikx, answer;
        // voor de discrete verdeling
        //{ Als samen =1 dan staat staaf in het midden anders aan het begin} 
        // eerst de staafjes netjes op de xas zetten

        minimum = self.minimumx;
        maximum = self.maximumx;
        bereikx = self.maximumx - self.minimumx;
        self.minimum = self.minimumx;
        self.maximum = self.maximumx;
        if (bereikx < klasgroot) {
            self.samen = 1;

            self.minimumx -= 0.5;
            self.maximumx += 0.5;

        } else {
            self.samen = 2;
            while ((bereikx / self.samen) > klasgroot) {
                self.samen += 1;
            }
            self.maximumx = minimum + Math.ceil((maximum - minimum) / self.samen) * self.samen;
        }
        self.zetfactoren();


        answer = berekenInterval(minimum, maximum);
        self.firstPointx = answer.firstPoint;
        self.stapx = answer.stap;
        self.aantalintervallenx = answer.aantalintervallen;


        self.aantalbars = Math.round((self.maximumx - self.minimumx) / self.samen);
        //nu de labels op de x-as bepalen

    };

    this.tekenxas_discreet = function (context) {
        // dimensies zijn al bepaald
        var posx1, cbar, aantalbars, i, rechts, stepx, aantalsteps, stapx, firststep;
        context.beginPath();
        cbar = self.minimum * self.fx + self.cx;
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillStyle = "Black";
        context.lineWidth = 1;
        context.font = assenfont;
        aantalsteps = self.aantalbars;
        stepx = 1;
        stapx = self.stapx;
        while (aantalsteps > 50) {
            if (isInteger(stapx / 5)) { // falsestapx  deelbaar door 5){
                stepx = 5 * stepx;
                aantalsteps = aantalsteps / 5;
            } else {
                if (isInteger(stapx / 2)) {
                    stepx = 2 * stepx;
                    aantalsteps = aantalsteps / 2;
                } else {
                    if (isInteger(stapx / 3)) {
                        stepx = 3 * stepx;
                        aantalsteps = aantalsteps / 3;
                    }
                }
            }
        }

        firststep = self.firstPointx % stepx;
        for (i = firststep; i < self.aantalbars; i += stepx) {
            posx1 = Math.round(self.fx * self.samen * i + cbar);
            if (posx1 <= self.rechts) {
                context.moveTo(posx1, self.onder);
                context.lineTo(posx1, self.onder + 3);
                context.stroke();
            }
        }
        //grote strepen
        rechts = posx1 + 2 * self.fx;
        for (i = -1; i <= self.aantalintervallenx + 1; i += 1) {
            posx1 = (self.firstPointx + i * self.stapx) * self.fx + self.cx;
            if ((posx1 > cbar - self.fx) && (posx1 < rechts)) {
                if (parseInt(i * self.stapx, 10) == i * self.stapx) {
                    context.moveTo(posx1, self.onder);
                    context.lineTo(posx1, self.onder + 10);
                    context.fillText(Math.round(i * self.stapx + self.firstPointx), posx1, self.onder + 12);
                }
            }
        }
        context.moveTo(self.links, self.onder);
        context.lineTo(self.rechts, self.onder);
        context.stroke();
        context.beginPath();
        context.font = defaultfont;
    };
    this.zetdots = function (van, tot, positions, straal) {
        "use strict";
        var eerstegrens, tweedegrens, all, maxhoog, i, positie, hoog0, hoog1;

        function positiebepalen(position, straal, maxhoog) { //all is result
            var i, hoogte, positie, position1;
            hoogte = straal;
            positie = position.possx;
            for (i = van; i < tot; i++) {
                position1 = positions[i];
                if (position1.gezet) {
                    if ((positie - position1.possx < 2 * straal) && (position1.possx - positie < 2 * straal) && (position1.possy > hoogte - straal)) {
                        hoogte = Math.round(Math.sqrt(4 * straal * straal - sqr(positie - position1.possx))) + position1.possy;
                        if (hoogte > maxhoog) {
                            return false;
                        }
                    }
                }
            }
            if (hoogte <= maxhoog) {
                position.possy = hoogte;
                position.gezet = true;
            }
            return true;
        }
        maxhoog = 2 * straal;
        for (i = van; i < tot; i++) {
            positions[i].gezet = false;
            positions[i].possy = 0;
        }
        do {
            all = true;
            for (i = van; i < tot; i++) {
                if (!positions[i].gezet) {
                    all = positiebepalen(positions[i], straal, maxhoog) && all;
                }
            }
            maxhoog = maxhoog + straal;
        } while (!all);
        if (maxhoog > self.rangey) {
            for (i = van; i < tot; i++) {
                positions[i].possy = Math.round(positions[i].possy * self.rangey / maxhoog);
            }
            maxhoog = self.rangey;
        }
        for (i = van; i < tot; i++) {
            positions[i].possy = self.onder - positions[i].possy;
        }
        return maxhoog;
    }
    this.zetdotslabels = function (van, tot, positions, straal) {
        var i, j, hoogte, max, maxhoog;
        max = 0;
        maxhoog = 0;
        for (i = van; i < tot; i += 1) {
            if (positions[i].waarde > max) {
                max = positions[i].waarde;
            }
        }

        for (j = 0; j <= max; j += 1) {
            hoogte = straal;
            for (i = van; i < tot; i += 1) {
                if (positions[i].waarde == j) {
                    positions[i].possy = hoogte;
                    hoogte += 2 * straal;
                }
            }
            if (hoogte > maxhoog) {
                maxhoog = hoogte;
            }
        }
        if (maxhoog > self.rangey) {
            for (i = van; i < tot; i++) {
                positions[i].possy = Math.round(positions[i].possy * self.rangey / maxhoog);
            }
            maxhoog = self.rangey;
        }
        for (i = van; i < tot; i++) {
            positions[i].possy = self.onder - positions[i].possy;
        }
        return maxhoog;
    }
    this.tekenpunt = function (posx, posy, context) {
        context.beginPath();
        context.moveTo(posx - 5, posy - 5);
        context.lineTo(posx + 5, posy + 5);
        context.moveTo(posx + 5, posy - 5);
        context.lineTo(posx - 5, posy + 5);
        context.stroke();
    }
    this.tekenboxplot = function (sortarray, bessta, showextremes, hoogte, dikte, kleur, context) { //sortarray alleen nodig by showextremes
        var onderhange, bovenhange, range, i, van, tot, posx;
        var yboven = hoogte - dikte / 2;
        var yonder = hoogte + dikte / 2;
        var onderpunt, bovenpunt;
        //hoogte is midden van de boxplot;
        if (bessta.aantal = 0) {
            return;
        }
        van = bessta.van;
        tot = bessta.tot - 1;

        if (tot <= van) {
            return;
        }
        if (tot - van < 3) {
            this.tekenpunt(bessta.minimum * this.fx + this.cx, hoogte, context);
            this.tekenpunt(bessta.maximum * this.fx + this.cx, hoogte, context);
            this.tekenpunt(bessta.q2 * this.fx + this.cx, hoogte, context);
            return;
        }
        range = bessta.q3 - bessta.q1;
        if (showextremes) {
            onderhange = bessta.q1 - 1.5 * range;
            bovenhange = bessta.q3 + 1.5 * range;

            if (onderhange <= sortarray[van][1]) {
                onderhange = sortarray[van][1];
                onderpunt = van;
            } else {
                onderpunt = van;

                while (sortarray[onderpunt][1] < onderhange) {
                    onderpunt += 1;
                }
                onderhange = sortarray[onderpunt][1];
            };
            if (bovenhange >= sortarray[tot][1]) {
                bovenhange = sortarray[tot][1];
                bovenpunt = tot;
            } else {
                //er zijn extremen
                bovenpunt = tot;
                while (sortarray[bovenpunt][1] > bovenhange) {
                    bovenpunt -= 1
                };
                bovenhange = sortarray[bovenpunt][1];
            }
        } else {
            onderhange = bessta.minimum;
            bovenhange = bessta.maximum;
        }
        context.fillStyle = kleur;
        context.fillRect(bessta.q1 * this.fx + this.cx, yboven, range * this.fx, dikte);
        context.strokeRect(bessta.q1 * this.fx + this.cx, yboven, range * this.fx, dikte)

        context.moveTo(bessta.q2 * this.fx + this.cx, yboven);
        context.lineTo(bessta.q2 * this.fx + this.cx, yonder);
        context.moveTo(onderhange * this.fx + this.cx, yboven);
        context.lineTo(onderhange * this.fx + this.cx, yonder);
        context.moveTo(onderhange * this.fx + this.cx, hoogte);
        context.lineTo(bessta.q1 * this.fx + this.cx, hoogte);
        context.moveTo(bessta.q3 * this.fx + this.cx, hoogte);
        context.lineTo(bovenhange * this.fx + this.cx, hoogte);
        context.moveTo(bovenhange * this.fx + this.cx, yboven);
        context.lineTo(bovenhange * this.fx + this.cx, yonder);
        context.stroke();
        context.beginPath();
        context.arc(bessta.q2 * this.fx + this.cx, hoogte, 4, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        if (showextremes) {
            for (i = van; i < onderpunt; i += 1) {
                posx = sortarray[i][1] * this.fx + this.cx;
                this.tekenpunt(posx, hoogte, context);
            }
            for (i = bovenpunt + 1; i <= tot; i += 1) {
                posx = sortarray[i][1] * this.fx + this.cx;
                this.tekenpunt(posx, hoogte, context);
            }
        }
    }
    this.tekentitels = function (naamxas, commentxas, context, canvas) {
        context.strokeStyle = "Black";
        context.fillStyle = "Black";
        context.lineWidth = 1;
        context.stroke();
        context.beginPath();
        context.font = titelfont;
        context.textAlign = 'center';
        context.fillText(naamxas, (self.links + self.rechts) / 2, self.onder + self.omhoogy + 35);
        context.fill();
        context.beginPath();
        context.font = assenfont;
        context.textalAlign = 'center';
        context.fillText(commentxas, (self.links + self.rechts) / 2, self.onder + self.omhoogy + 60);
        context.beginPath();
    };
    this.tekengroep = function (naamgroep, kleur, context) {
        context.beginPath();
        context.fillStyle = kleur;
        context.font = assenfont;
        context.textBaseline = "middle";
        context.strokeStyle = "Black";
        context.arc(self.rechts - context.measureText(naamgroep).width - 10, self.boven - 10, 5, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        // context.fillRect(assen.links + 20, assen.boven - 10, 20, 20);
        //context.strokeRect(assen.links + 20, assen.boven - 10, 20, 20);
        context.beginPath();

        context.textAlign = "right";

        context.fillText(naamgroep, this.rechts, self.boven - 10);
        context.beginPath();
        context.font = assenfont;
    }
    this.tekengroepen = function (context, namen) {
        var i, vanaf;
        context.font = assenfont;
        context.textBaseline = "middle";
        context.strokeStyle = "Black";
        context.textAlign = "left";
        vanaf = this.links + 40;
        for (i in namen) {
            context.fillStyle = kleuren[i];
            context.arc(vanaf - 10, this.boven, 5, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            context.fillText(namen[i].naamgroep, vanaf, this.boven);
            vanaf += context.measureText(namen[i].naamgroep).width + 50;
            context.beginPath();
        }
        context.font = assenfont;

    }
    this.tekenMean = function (context, mean) {
        var posm;

        posm = this.fx * mean + this.cx;
        context.beginPath();
        context.fillStyle = "Red";
        context.strokeStyle = "Red";
        context.moveTo(posm, this.onder);
        context.lineTo(posm - 10, this.onder + 15);
        context.lineTo(posm + 10, this.onder + 15);
        context.closePath();
        context.fill();
        context.stroke();
    }
    this.tekenMedian = function (context, mean) {
        var posm;
        posm = this.fx * mean + this.cx;
        context.beginPath();
        context.fillStyle = "Blue";
        context.strokeStyle = "Blue";
        context.moveTo(posm - 4, this.onder);
        context.lineTo(posm - 4, this.onder + 15);
        context.lineTo(posm + 4, this.onder + 15);
        context.lineTo(posm + 4, this.onder);
        context.closePath();
        context.fill();
        context.stroke();
    }

}
