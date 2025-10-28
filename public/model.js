function Taal(id, naam) {
	"use strict";
	this.naam = naam;
	this.id = id;
}

function Keuze(Id, Name) {
	"use strict";
	this.Name = ko.observable(Name);
	this.Id = Id;
}

function Model() {
	"use strict";
	var self = this,
		i;

	this.toonMenu = ko.observable(false);

	this.actief = ko.observable(false);
	this.tempo = ko.observable(0);
	this.nopage = ko.observable(0);

	this.ontop = ko.observable(ontoptekst != "");
	this.zetontop = function () {
		$("#dialog-ontop").dialog("open");
	};
	self.geefKleur = function (vaart) {
		if (vaart == self.tempo()) {
			return "blue";
		} else {
			return "#33CCFF";
		}
	};
     self.bestaat=ko.observable(true)
    self.geefColor = function () {
		if (self.bestaat()) {
			return "white";
		} else {
			return "red";
		}
	};
   


	this.kans = ko.observable(0.5);
	this.kans.subscribe(function () {
		maakSchoon();
	});
	this.zetmenu = function () {
		self.toonMenu(true);
	}
	this.menuuit = function () {
		self.toonMenu(false);
	}



	this.talen = ko.observableArray([
        new Taal("0", "English"),
        new Taal("1", "Deutsch"),
        new Taal("2", "Türkçe"),
        new Taal("3", "Nederlands"),
        new Taal("4", "Polski"),
        new Taal("5", "Español"),
        new Taal("6", "Svenska"),
        new Taal("7", "Français"),
        new Taal("8", "Пусский"),
        new Taal("9", "Italiano"),
       new Taal("10", "中文"),
        new Taal("11", "日本語"),
         new Taal("12", "Português")
    ]);
	this.selectedtaal = ko.observable(taal);
	this.selectedtaal.subscribe(function () {
		taal = self.selectedtaal();
		zettaal(taal);
		self.zetmelding();
		self.keuzes()[0].Name(keep_choice[taal]);
		self.keuzes()[1].Name(change_choice[taal]);
	});
	this.keuzes = ko.observableArray([
        new Keuze("0", keep_choice[taal]),
        new Keuze("1", change_choice[taal])
    ]);
	this.selectedkeuze = ko.observable(0);
	this.selectedkeuze.subscribe(function () {
		maakSchoon();
		initGraph();
	});
	this.cheat = ko.observable(false);
	this.cheat.subscribe(function () {
		notgespiekt = false;
	});
	this.toonSimuleren = ko.observable(false);
	this.toonSimuleren.subscribe(function () {
		if (self.toonSimuleren()) {
			$(".page3").show()
		} else {
			$(".page3").hide()
		}
	})
	this.alleen_keep = ko.observable(true);
	this.alleen_change = ko.observable(true);
	this.alleen_keep.subscribe(function () {
		initGraph3();
	})
	this.alleen_change.subscribe(function () {
		initGraph3();
	})
	this.url = ko.observable('help');
	    this.maakurl = function () {
        var hulp, hulp1;
        hulp1 = +this.selectedtaal();
        switch (hulp1) {
            case 0:
                hulp = 'eng';
                break;
            case 1:
                hulp = 'du';
                break;
            case 2:
                hulp = 'tr';
                break;
            case 3:
                hulp = 'ned';
                break;
            case 4:
                hulp = 'pln';
                break;
            case 5:
                hulp = 'sp';
                break;
            case 6:
                hulp = 'swe';
                break;
            case 7:
                hulp = 'fr';
                break;
            case 8:
                hulp = 'rus';
                break;
            case 9:
                hulp = 'it';
                break;
            case 10:
                hulp = 'chi';
                break;
            case 11:
                hulp = 'jap';
                break;
            case 12:
                hulp = "por";
                break;
        }
      
        if ((hulp == "tr") || (hulp == "pln") || (hulp == "sp") || (hulp == "swe") || (hulp == "fr") || (hulp == "rus") || (hulp == "it") || (hulp == "chi") || (hulp == "jap") || (hulp == "por")) {
            hulp = "eng"
        };
		hulp = "../help/" + hulp + "/index.html?law_large.htm";
		self.url(hulp);

	};
	this.size_group = ko.observable(5);
	this.size_group.subscribe(function () {

		self.number_draw(0);
		self.number_repeat(0);
		maaktabel = "<table align='center' style='text-align:right;' class='trek'> <tr ><th style='background-color:white'>#</th> <th>&nbsp;&nbsp;</th>";
		for (i = 0; i < self.size_group(); i += 1) {
			maaktabel += '<th>' + (i + 1) + '</th>';
		}
		maaktabel += '</tr>';
		$("#maaktabel").html(maaktabel + '</table>');


	})
	this.number_repeat = ko.observable(0);
	this.number_draw = ko.observable(0);
	this.tekst_repeat = ko.computed(function () {
		if (self.number_draw() == 0) {
			return '';
		} else {
			return ': ' + self.number_repeat() + van_de[taal] + self.number_draw() + ' (' + (100 * self.number_repeat() / self.number_draw()).toFixed(1) + ' %)';
		}
	}, this);

	this.doStart = function () {
		maakSchoon();
		totSort = [];
		if (self.simulate() < 3) {
			aantal1 = self.sampleSize();
		} else {
			aantal1 = self.steekproefOmvang();
		}
		aantalgroep = self.size_group();
		aantalsteps = 0;
		som1 = 0;
		som2 = 0;
		minimum = Number.MAX_VALUE;
		maximum = -minimum;
		vallen = false;
		geheugenmat = [];
		q1 = NaN;
		q2 = NaN;
		q3 = NaN;
		mean = NaN;
		sd = NaN;
		switch (+self.simulate()) {
			case 0:
				kans = +self.kans();
				break;
			case 1:
				if (self.selectedkeuze() == 0) {
					kans = 1 / 3;
				} else {
					kans = 2 / 3;
				}
				break;
			case 2:
				kans = 1 / Math.exp(1);
				break;
			case 3:
				kans1 = 2 / 3;
				kans2 = 1 / 3;
				break;
		}
		self.actief(true);
	}
	this.sampleSize = ko.observable(100);
	this.sampleSize.subscribe(function () {
		maakSchoon();
	});
	this.steekproefOmvang = ko.observable(100);
	this.showmemory = ko.observable(true);
	this.showgrid = ko.observable(true);
	this.showgrid.subscribe(function () {
		initGraph();
	});
	this.showmemory.subscribe(function () {
		var i;
		if (!self.showmemory()) {
			for (i = 0; i < aantalgeheugen; i += 1) {
				if (i != aantalsteps) {
					memory[i] = [];
				}
			}
		}
		initGraph();
	});
	this.volgendeStap = function () {
		var i, j, som, hulp, mat = [],
			enkel,
        som = 0;
		if (self.showmemory()) {
			aantalsteps += 1;
			if (aantalsteps >= aantalgeheugen) {
				aantalsteps = 0;
			}
		}
		memory[aantalsteps].length = aantal1;
		for (i = 0; i < aantal1; i += 1) {
			if (self.simulate() < 2) {
				if (Math.random() < kans) {
					som += 1
				}
			} else {
                enkel=true;
				mat = trekkingkort(self.size_group());//echt per getal uitvoeren
			
				for (j in mat) {
					if (mat[j] == j) {
						enkel = false;
					}
				}
				geheugenmat.push(mat);
				if (enkel) {
					som += 1;
				}
			}
			memory[aantalsteps][i] = som;
		}


		if (self.tempo() < 2) {
			self.uitvoer(totSort.length + 1);
			startGooien();
		} else {
			aantalGraph1 = aantal1;
			self.verwerkwaarde();
			initGraph();
			if (model.simulate() == 2) {
				maakshowtabel(geheugenmat.length - 1, self.size_group());
			}
		}
	}

	this.imagePath0 = ko.observable();
	this.imagePath1 = ko.observable();
	this.imagePath2 = ko.observable();
	this.imageCheat0 = ko.observable();
	this.imageCheat1 = ko.observable();
	this.imageCheat2 = ko.observable();
	this.imageSimul0 = ko.observable();
	this.imageSimul1 = ko.observable();
	this.imageSimul2 = ko.observable();
	this.doStop = function () {
		this.actief(false);
		self.tempo(0);
		if (timer1 != null) {
			clearInterval(timer1);
			timer1 = null;
		}
	}
	self.verwerkwaarde = function () {
		var aantal, range;
		var getal = memory[aantalsteps][aantal1 - 1];
		var get1, get2, mid1, mid2;
		totSort.push(getal);
		aantal = totSort.length;
		som1 += getal;
		som2 += getal * getal;
		totSort.sort(function (a, b) {
			return a - b
		});
		self.uitvoer(aantal);
		$("#aantal").text(aantal);
		minimum = totSort[0];
		maximum = totSort[aantal - 1];
		get1 = totSort[Math.floor((aantal - 1) / 2)];
		get2 = totSort[Math.floor(aantal / 2)]
		kwart2 = (get1 + get2) / 2;
		if (aantal > 3) {
			mid1 = Math.floor((aantal - 1) / 2);
			mid2 = Math.floor(aantal / 2) + aantal - 1;
			get1 = totSort[Math.floor(mid1 / 2)];
			get2 = totSort[Math.floor((mid1 + 1) / 2)];
			kwart1 = ((get1 + get2) / 2);
			get1 = totSort[Math.floor(mid2 / 2)];
			get2 = totSort[Math.floor((mid2 + 1) / 2)];
			kwart3 = ((get1 + get2) / 2);
			range = kwart3 - kwart1;
			onderhange = kwart1 - 1.5 * range; //in aantallen
			bovenhange = kwart3 + 1.5 * range;
			if (onderhange <= totSort[0]) {
				onderhange = totSort[0] / aantal1;
				onderpunt = 0;
			} else {
				onderpunt = 0;
				while (totSort[onderpunt] < onderhange) {
					onderpunt++
				};
				onderhange = totSort[onderpunt] / aantal1;
			}
			if (bovenhange >= totSort[aantal - 1]) {
				bovenhange = totSort[aantal - 1] / aantal1;
				bovenpunt = aantal;
			} else { //{er zijn extremen}
				bovenpunt = aantal - 1;
				while (totSort[bovenpunt] > bovenhange) {
					bovenpunt--;
				};
				bovenhange = totSort[bovenpunt] / aantal1;
			};
			kwart1 = kwart1 / aantal1;
			kwart3 = kwart3 / aantal1;
		}
		kwart2 = kwart2 / aantal1;
		minimum = minimum / aantal1;
		maximum = maximum / aantal1;
		mean = som1 / aantal;

		sd = Math.sqrt((som2 - som1 * som1 / aantal) / (aantal - 1));
		$("#minimum").text((100 * minimum).toFixed(1) + ' % ');
		$("#maximum").text((100 * maximum).toFixed(1) + ' % ');
		if (aantal > 3) {
			$("#q1").text((100 * kwart1).toFixed(1) + ' % ');
		}
		$("#q2").text((100 * kwart2).toFixed(1) + ' % ');
		if (aantal > 3) {
			$("#q3").text((100 * kwart3).toFixed(1) + ' % ');
		}
		if (aantal > 1) {
			$("#sd").text((100 * sd / aantal1).toFixed(1) + ' % ');
		}
		$("#mean").text((100 * mean / aantal1).toFixed(1) + ' % ');
	}
	this.showTrechter = ko.observable("0");
	this.showTrechter.subscribe(function () {
		initGraph();
	});

	this.simulate = ko.observable(4);

	this.keepChoice = ko.observable(0);
	this.changeChoice = ko.observable(0);
	this.keep_wins = ko.observable(0);
	this.change_wins = ko.observable(0);
	this.clear_result = function () {
		alleen_keeps = [];
		alleen_changes = [];

		self.keep_wins(0);
		self.change_wins(0);
		self.keep_goat(0);
		self.change_goat(0);
		self.keepChoice(0);
		self.changeChoice(0);
	};
	this.uitvoer = ko.observable(0);


	ko.observable.fn.withCurrencyFormat = function (precision) {
		var observable = this;
		observable.formatted = ko.computed({
			read: function (key) {
				return '$' + (+observable()).toFixed(precision);
			},
			write: function (value) {
				value = parseFloat(value.replace(/[^\.\d]/g, ""));
				observable(isNaN(value) ? null : value); // Write to underlying storage 
			}
		});

		return observable;
	};
	this.doe_trekking = function () {
		var i, j, h, enkel=true, klasse;
		var a = [];
		i = self.number_draw();
		self.number_draw(i + 1);
		a.length = self.size_group();
		for (i = 0; i < self.size_group(); i += 1) {
			a[i] = i
		};
		for (i = 0; i < self.size_group(); i += 1) {
			j = Math.floor(model.size_group() * Math.random());
			h = a[j];
			a[j] = a[i];
			a[i] = h;
		}

		

		maaktabel += '<tr><td style="background-color:white">' + self.number_draw() + '</td><td>&nbsp;&nbsp;</td>';
		for (i = 0; i < self.size_group(); i += 1) {
			klasse = '';
			if (a[i] == i) {
				klasse = "class='blink'";
				enkel = false;
			}
			maaktabel += '<td ' + klasse + '>' + (a[i] + 1) + '</td>';
		}
		if (!enkel) {
			j = self.number_repeat();
			self.number_repeat(j + 1);
		}
		maaktabel += '</tr>';
		$("#maaktabel").html(maaktabel + '</table>');

	};
	this.niet_gekozen = ko.observable(-1);
	this.trek_header = ko.computed(function () {
		var i, hulp;
		hulp = " <tr ><th style='text-align:center;background-color:white'>#</th><th>&nbsp;&nbsp;</th>";
		for (i = 0; i < self.size_group(); i += 1) {
			hulp += '<th>' + (i + 1) + '</th>';
		}
		hulp += '</tr>';
		return hulp;
	}, this);
	this.keepChoice.subscribe(function () {
		var hulp;
		/* switch (+self.keep_wins()) {
		     case 0:
		         hulp = auto0[taal];
		         break;
		     case 1:
		         hulp = auto1[taal];
		         break;
		     default:
		         hulp = self.keep_wins() + ' ' + autos[taal];
		 }*/
		$("#keep_wins_text").text(self.keep_wins());
		if (self.keepChoice() > 0) {
			hulp = '(' + (100 * self.keep_wins() / (+self.keepChoice())).toFixed(1) + '%)'
		} else {
			hulp = '(0%)'
		}
		$("#keep_winsp").text(hulp);
		/* switch (+self.keep_goat()) {
		     case 0:
		         hulp = geit0[taal];
		         break;
		     case 1:
		         hulp = geit1[taal];
		         break;
		     default:
		         hulp = self.keep_goat() + ' ' + geiten[taal];
		 }*/
		$("#keep_goat_text").text(self.keep_goat());
		if (self.keepChoice() > 0) {
			hulp = '(' + (100 * self.keep_goat() / (+self.keepChoice())).toFixed(1) + '%)'
		} else {
			hulp = '(0%)'
		}
		$("#keep_goatp").text(hulp);

	})
	this.changeChoice.subscribe(function () {
		var hulp;
		/*switch (+self.change_wins()) {
		    case 0:
		        hulp = auto0[taal];
		        break;
		    case 1:
		        hulp = auto1[taal];
		        break;
		    default:
		        hulp = self.change_wins() + ' ' + autos[taal];
		}*/
		$("#change_wins_text").text(self.change_wins());
		if (self.changeChoice() > 0) {
			hulp = '(' + (100 * self.change_wins() / (+self.changeChoice())).toFixed(1) + '%)'
		} else {
			hulp = '(0%)'
		}
		$("#change_winsp").text(hulp);
		/*switch (+self.change_goat()) {
		    case 0:
		        hulp = geit0[taal];
		        break;
		    case 1:
		        hulp = geit1[taal];
		        break;
		    default:
		        hulp = self.change_goat() + ' ' + geiten[taal];
		}*/
		$("#change_goat_text").text(self.change_goat());
		if (self.changeChoice() > 0) {
			hulp = '(' + (100 * self.change_goat() / (+self.changeChoice())).toFixed(1) + '%)'
		} else {
			hulp = '(0%)'
		}
		$("#change_goatp").text(hulp);

	})
	this.keep_goat = ko.observable(0);
	this.change_goat = ko.observable(0);
	this.stapdeur = ko.observable(0);
	this.open1 = ko.observable();
	this.keuze1 = ko.observable();
	this.keuze2 = ko.observable();
	this.geeftekst = function (nummer) {
		switch (+self.stapdeur()) {
			case 0:
				$("#foto" + nummer).text(deur[taal] + ' ' + (nummer + 1));
				break;
				//  case 1:if $()


		}
	}

	this.zetmelding = function () {
		var hulp;
		//afhanklijk van taal en toestand meding zetten
		switch (+self.stapdeur()) {
			case 0:
				hulp = kies_een_van_de_drie[taal];
				break;
			case 1:
				hulp = change_keep_choice[taal];
				break;
			case 2:
				if (keuze2 == keuze1) {
					hulp = hou_keuze[taal]
				} else {
					hulp = choice_changed[taal]
				};
				if (keuze2 == random1) {
					hulp += '. ' + jij_wint[taal]
				} else {
					hulp += '. ' + jij_verliest[taal];
				}
				break;
		}
		$("#melding").text(hulp);
		hulp = ': ';

		switch (+self.keepChoice()) {
			case 0:
				hulp += nul_keer[taal];
				break;
			case 1:
				hulp += een_keer[taal];
				break;
			case 2:
				hulp += twee_keer[taal];
				break;
			default:
				hulp += self.keepChoice() + ' ' + keer[taal];
				break;
		}

		$("#keep_choice_keer").text(hulp);
		hulp = ': ';

		switch (+self.changeChoice()) {
			case 0:
				hulp += nul_keer[taal];
				break;
			case 1:
				hulp += een_keer[taal];
				break;
			case 2:
				hulp += twee_keer[taal];
				break;
			default:
				hulp += self.changeChoice() + ' ' + keer[taal];
		}

		$("#change_choice_keer").text(hulp);
	};
	this.zetstap = function (nummer) { //nummer is nummer van de kaart waarop geklikt is
		var fase = +self.stapdeur();
		var keep, won;
		var naarinternet = {},
			internet = 0,
			naamurl;
		switch (fase) {
			case 0:
				keuze1 = nummer; //keuze1 is keuze eerste keer klikken
				if (keuze1 == random1) { //random1 is waar de auto staat
					do {
						open1 = Math.floor(3 * Math.random());
					} while (open1 == random1);

				} else {
					open1 = 3 - keuze1 - random1;
					dicht1 = 3 - keuze1 - open1;
				}
				//open1 is de deur die door de spelleider wordt geopend
				plaatjes[open1] = plek[open1];
				plaatjes[keuze1] = 4; // De vraagtekens met blauw
				//plaatjes 
				//plek[] is de plek van de plaatjes 0 = auto  1 -geit   2=geit  3=vraagtekens 4 blauwe vraagtekens 
				self.stapdeur(1);
				zetplaatjes();
				self.zetmelding();
				$("#foto" + keuze1).text(keep_short[taal]);
				$("#foto" + open1).text(geopend[taal]);
				$("#foto" + dicht1).text(change_short[taal]);
				notgespiekt = true;
				break;
			case 1:
				if (nummer != open1) {
					keuze2 = nummer;
					if (keuze1 == keuze2) {
						if (keuze2 == random1) {
							self.keep_wins(self.keep_wins() + 1);
						} else self.keep_goat(self.keep_goat() + 1)
						self.keepChoice(self.keepChoice() + 1);
					} else {
						if (keuze2 == random1) {
							self.change_wins(self.change_wins() + 1);
						} else {
							self.change_goat(self.change_goat() + 1)
						}
						self.changeChoice(self.changeChoice() + 1);
					}
					if (notgespiekt) {
						if (keuze1 == keuze2) {
							alleen_keeps.push(self.keep_wins())
						} else {
							alleen_changes.push(self.change_wins())
						}
					}

					if (numcode >= 100000) {
						if (notgespiekt) {
							if (keuze1 == keuze2) {
								keep = 1;
							} else {
								keep = 0
							}
							if (keuze2 == random1) {
								won = 1
							} else {
								won = 0
							};

							naamurl = heroku + "geg?number=" + numcode + "&keep=" + keep + "&won=" + won;
							console.log('naamurl  ', naamurl);
							$.getJSON(naamurl, function (data) {
								console.log(data);
                                if (!data.verwerkt){}//enventjes rode punt laten zien
							});

						}
					}
					self.stapdeur(2);
					plaatjes[keuze2] = plek[keuze2];
					self.niet_gekozen(3 - keuze2 - open1);
					zetplaatjes();
					self.zetmelding();
				}
				break;
			case 2:
				self.startdeur()
				break;

		}

	}

	this.zetWachtTellen = function () {
		if (vallen) {
			afrondenWorp();
		} else if (timer1 != null) {
			window.clearInterval(timer1);
			timer1 = null;
		}
		switch (this.tempo()) {
			case 0:
				self.volgendeStap();
				break;
			case 1:
				self.volgendeStap();
				break;
			case 2:
				timer1 = setInterval(function () {
					self.volgendeStap();
				}, 100);

				break;
		}

	};
	this.numcode = ko.observable(123446);
	this.correct_code = function () {
		var number = +self.numcode();
		if (isNaN(number) || (number < 100000)) {
			alert(geen_correcte_code[taal]);
			return false;
		} else {
			return true;
		}
	}
	this.startdeur = function () {
		plaatjes = [3, 3, 3];
		self.niet_gekozen(-1);
		draaien();
		self.stapdeur(0);
		$("#foto0").text(deur[taal] + ' 1');
		$("#foto1").text(deur[taal] + ' 2');
		$("#foto2").text(deur[taal] + ' 3');
		self.stapdeur(0);
		zetplaatjes();
		self.zetmelding();

	}
    this.password=ko.observable('')
	this.tempoMaken = function (tempo) {
		if (this.actief()) {
			if (tempo == this.tempo()) {
				if (tempo == "0") {
					self.verwerkwaarde();
					this.volgendeStap();
				} else {
					if (timer1 != null) {
						clearInterval(timer1);
						timer1 = null;
					}
					this.tempo("0");
				}
			} else {
				afrondenWorp();
				self.tempo(tempo);
				self.zetWachtTellen();
			}
		} else {
			self.tempo(tempo);
			self.doStart();
			self.zetWachtTellen();
			//this.volgendeStap();

		}
	};
}
