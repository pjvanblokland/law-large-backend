var heroku="https://law-large-2025-98c26f98a985.herokuapp.com/"

//var heroku = "https://law-large-2025.herokuapp.com/";

//var heroku="http://localhost:3000/";//"https://three-door.herokuapp.com/";
var ontoptekst = "";
var random1;
var model = null;
var timer1 = null;
var plek = [0, 1, 2];
var simul = [3, 3, 3];
pictures = ['images/car.png', 'images/geit1.jpg', 'images/geit2.jpg', 'images/vraagteken.gif', 'images/vraagkeuze.gif']; //0 car 1 geit1  2 geit 2  3 questionmark 4 first choice 5 alternative
var kleuren = ["Blue", "Green", "Red", "Fuchsia", "#660000", "maroon", "lime", "purple", "gray", "teal", "black"];
var plaatjes = [3, 3, 3];

var keuze1, keuze2, random1, open1, dicht1;
var totSort = [];
var memory = [];
var aantalsteps = 0;
var aantalgeheugen = 10;
memory.length = aantalgeheugen;
var som1 = 0;
var som2 = 0;
var kwart1, kwart2, kwart3;
var onderpunt, bovenpunt;
var onderhange, bovenhange;
var assen = null;
var assen1 = null;
var minimum = NaN;
var maximum = NaN;
var som, som2;
var q1 = NaN;
var q2 = NaN;
var q3 = NaN;
var mean = NaN;
var sd = NaN;
var kans = 0;
var kans1 = 1 / 3;
var kans2 = 2 / 3;
var canvas = null;
var context = null;
var canvas1 = null;
var context1 = null;
var defaultfont = "20px Arial";
var titelfont = "24px Arial";
var assenfont = "12px Arial";
var aantal1 = 0;
var aantalGraph1 = 0;
var vallen = false;
var maaktabel = '';
var showtabel = '';
var geheugenmat = [];
var aantalgroep = 0;
var internetcode = null;
var notgespiekt = true;
var numcode = null;
var invullen = 0; //bij de start
var toon = 1; //vraag om grafiek
var nieuw = 2 //nieuwe dataset
var schoon = 3 //clear datset
var verwijder = 4 //delete dataset;
var active_code = -2;

function vulin(tekst, nummer) {
    return tekst.replace('%s', nummer)
}

function simdraaien() {
    var allplek = [0, 1, 2],
        i, nummer;
    simul = [];
    nummer = Math.floor(3 * Math.random());
    simul.push(nummer);
    allplek.splice(nummer, 1);
    nummer = Math.floor(2 * Math.random());
    simul.push(allplek[nummer]);
    simul.push(allplek[1 - nummer]);
    zetsimul();

}

function draaien() {
    var allplek = [0, 1, 2],
        i, nummer;
    plek = [];
    nummer = Math.floor(3 * Math.random());
    plek.push(nummer);
    allplek.splice(nummer, 1);
    nummer = Math.floor(2 * Math.random());
    plek.push(allplek[nummer]);
    plek.push(allplek[1 - nummer]);
    for (i in plek) {
        if (plek[i] == 0) {
            random1 = i
        }
    };
    model.imageCheat0(pictures[plek[0]]);
    model.imageCheat1(pictures[plek[1]]);
    model.imageCheat2(pictures[plek[2]]);
}

function zetplaatjes() {
    model.imagePath0(pictures[plaatjes[0]]);
    model.imagePath1(pictures[plaatjes[1]]);
    model.imagePath2(pictures[plaatjes[2]]);

}

function zetsimul() {
    model.imageSimul0(pictures[simul[0]]);
    model.imageSimul1(pictures[simul[1]]);
    model.imageSimul2(pictures[simul[2]]);


}
var kleurkeep = "blue"; //"#99D9E9";
var kleurchange = "lime";
var alleen_keeps = [];
var alleen_changes = [];

function memoryleeg() {
    var i;
    for (i = 0; i < aantalgeheugen; i += 1) {
        memory[i] = [];
    }
}
memoryleeg();


function trekkingkort(n) {
    var a = [];
    var i ,
        j, temp;
    a.length = n;
    for (i = 0; i < n; i += 1) {
        a[i] = i;
    };
    i=n;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = a[j];
        a[j] = a[i];
        a[i] = temp;
    }
    return a;
}

function maakshowtabel(nummer, n) {
    showtabel = "<table> <tr>";
    for (i = 0; i < n; i += 1) {
        if (geheugenmat[nummer][i] == i) {
            klasse = "class='blink trek'";
        } else {
            klasse = "class='trek'";
        }
        showtabel += "<td " + klasse + " >" + (i + 1) + "</td>";
    };
    showtabel += '</tr>';
    for (i = 0; i < n; i += 1) {
        if (geheugenmat[nummer][i] == i) {
            klasse = "class='blink trek'";
        } else {
            klasse = "class='trek'";
        }
        showtabel += '<td ' + klasse + '>' + (geheugenmat[nummer][i] + 1) + '</td>';
    }
    showtabel += '</tr></table>';
    $("#showtabel").html(showtabel);
}

function trekking(n) {
    var a = [];
    var enkel = true;
    showtabel = "<table> <tr>";
    a.length = n;
    for (i = 0; i < n; i += 1) {
        a[i] = i;
        showtabel += "<td>" + (i + 1) + "</td>";
    };
    for (i = 0; i < n; i += 1) {
        j = Math.floor(n * Math.random());
        h = a[j];
        a[j] = a[i];
        a[i] = h;
    }
    showtabel += '</tr>';
    for (i = 0; i < n; i += 1) {
        klasse = '';
        if (a[i] == i) {
            klasse = "class='blink'";
            enkel = false;
        }
        showtabel += '<td ' + klasse + '>' + (a[i] + 1) + '</td>';
    }
    showtabel += '</tr></table>';
    $("#showtabel").html(showtabel);
    return enkel;
}

function sluitdialogs() {
    if ($("#dialog-code").dialog("isOpen")) {
        $("#dialog-code").dialog("close")
    };

    if ($("#dialog-internet").dialog("isOpen")) {
        $("#dialog-internet").dialog("close")
    }
}


function bestaat_nummer_paswoord_code(nummer, wachtwoord, code, dialogs) {
    var url;
    var naamurl = heroku + 'exists/?number=' + nummer + '&wachtwoord="' + wachtwoord + '"&code=' + code;
    console.log(naamurl);

    sluitdialogs();
    if (nummer == "123446") {
        switch (code) {
            case nieuw:
                alert(dataset_betaat_al[taal]);
                break;
            case schoon:
                if (confirm(vulin(ben_zeker[taal], 123446))) {
                    naamurl = heroku + "clear?number=123446";
                    $.getJSON(naamurl, function (data) {
                        alert(vulin(made_empty[taal], 123446));
                    })
                }
                break;
            case verwijder:
                alert(dataset_niet_verwijderen[taal]);
                break;
        }

    } else {
        //  if ((code == schoon) || (code == nieuw) || (code == verwijder)) {
        if (wachtwoord == '') {
            alert(wachtwoord_vereist[taal]);
            return false;
            exit;
        }
        //  }

        //"testen op 123446"
        $.getJSON(naamurl, function (data) {
            console.log('antwoord naamurl ', naamurl, 'data ', data);
            switch (code) {
                case nieuw: //wachtwoord vereist
                    if (data.exists) { //nieuw
                        alert(vulin(dataset_created, nummer));
                    } else {
                        alert(vulin(dataset_betaat_al[taal], nummer));
                    }
                    break;
                case schoon: //clear  wachtwword vereist
                    if (data.exists) {
                        if (data.wachtwoord) {
                            alert(vulin(made_empty[taal], 123446));
                        } else {
                            alert(invalid_password[taal]);
                        }
                    } else {
                        alert(vulin(dataset_bestaat_niet[taal], nummer));
                    }
                    break;
                case verwijder:
                    if (data.exists) {
                        if (data.wachtwoord) {
                            alert(dataset_verwijderd[taal]);
                        } else {
                            alert(invalid_password[taal]);
                        }
                    } else {
                        alert(vulin(data_set_bestaat_niet[taal], nummer));
                    }
                    break;
            }
        })
    }
}
