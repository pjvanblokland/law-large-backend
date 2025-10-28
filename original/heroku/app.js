var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

var serv = require('http').Server(app);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use("/js", express.static("js"));
app.use('/client', express.static(__dirname + '/client'));
serv.listen(process.env.PORT || 3000);
console.log("Server 3000 started.");
var invullen = 0; //bij de start
var toon = 1; //vraag om grafiek
var nieuw = 2 //nieuwe dataset
var schoon = 3 //clear datset
var verwijder = 4 //delete dataset;


var SOCKET_LIST = {};

var DATASET_LIST = {};
var Dataset = function (id, wachtwoord) {
        self = this;
    this.id = +id;
    this.wachtwoord = wachtwoord;
    this.aantalkeep = 0;
    this.aantalchange = 0;
    this.values = [];
    this.keep = [];
    this.change = [];
    this.aangesloten = []; //de id socket die kijken
    DATASET_LIST[id] = self;


    this.verwerk = function (keep, won) { // verwerk een worp won 0 is false 1=true 
        var i, socket, verzend = {};
        verzend.keep = keep;
        verzend.won = won;
        console.log('WON  ', won, self.aantalkeep, self.aantalchange, won)
        if (keep == 1) {
            self.aantalkeep += won;
            self.keep.push(self.aantalkeep);
            verzend.count = self.aantalkeep

        } else {

            self.aantalchange += won;

            self.change.push(self.aantalchange);
            verzend.count = self.aantalchange;


        }
        console.log(self.keep.length, self.keep);
        console.log(self.change.length, self.change);

        console.log("gegooid ")

        console.log('aangesloten ', self.aangesloten, self.aangesloten.length)
        for (i = 0; i < self.aangesloten.length; i += 1) {
            socket = SOCKET_LIST[self.aangesloten[i]];
            console.log('verzend  ', verzend)
            socket.emit("gegooid", verzend);
        }

    }
    this.verwerkclear = function () {
        console.log('verwerkclear');
        var i, socket;
        self.aantalkeep = 0;
        self.aantalchange = 0;
        self.keep = [];
        self.change = [];
        console.log('voor  ', self.aangesloten.length);
        for (i = 0; i < self.aangesloten.length; i += 1) { //alle kijkers
            socket = SOCKET_LIST[self.aangesloten[i]];
            console.log('schhoon');
            socket.emit("clear", {
                "clear": 0
            })
        }
        console.log('na  ', self.aangesloten.length);

    }

    return self;
}
    

function create_datasets() {


    dataset = Dataset(123446, "");
    console.log("dataset 123446 aangemaakt")
    //  Dataset(123000, "ww");
    //console.log("dataset 123000 aangemaakt")

}
create_datasets();
app.get('/bestaat', (req, res) => {
    var dataset = DATASET_LIST[+req.query.nummer];
    console.log('dataset  bestaat ', dataset);

    if (dataset == null) {
        console.log('bestaat false')
        res.json({
            exists: false
        })

    } else {
        console.log('bestaat true')
        res.json({
            exists: true
        })

    }
});
app.get('/exists', (req, res) => {
    console.log(req.query)
    var dataset = DATASET_LIST[+req.query.number],
        i, socket;
    var wachtwoord = req.query.wachtwoord;
    console.log("wachtwoord  ", wachtwoord);
    //console.log('dataset ', dataset.aangesloten)
    var code = req.query.code;
    if (dataset == null) {
        if (code == nieuw) { //wachtwoord is ingevuld Gecontroleerd bij client
            console.log('Dataset bestaat nog niet');
            Dataset(+req.query.number, req.query.wachtwoord)
            res.json = {
                exists: true,
                number: +req.query.number,
                wachtwoord: req.query.wachtwoord
            };
            console.log('dataset bestaat nu')

        } else {
            console.log('Dataset bestaat niet');
            res.json({
                exists: false
            })
        }
    } else { //eerst controleren op wachtwoord
        if ((code == schoon) || (code == verwijder)) {
            console.log('wachtwoord gecontroleerd', wachtwoord, dataset);
            console.log('lengte ', wachtwoord.length);
            wachtwoord = wachtwoord.replace(/"/g, "");
            if (wachtwoord.toLowerCase() != dataset.wachtwoord.toLowerCase().toString()) {
                res.json = {
                    exists: true,
                    wachtwoord: false,
                    gedaan: false
                }
                console.log('wachtwoord fout', wachtwoord.toLowerCase(), dataset.wachtwoord.toLowerCase())

                return;
            }
        }

        switch (+code) {

            case nieuw:
                console.log('nieuw ', nieuw)
                res.json = {
                    exists: true,
                    number: +req.query.number,
                };

                break;
            case schoon:
                console.log(' schhoon  ', schoon);
                console.log('aangesloten clear ', dataset.aangesloten);
                dataset.aantalkeep = 0;
                dataset.aantalchange = 0;
                dataset.keep = [];
                dataset.change = [];
                for (i = 0; i < dataset.aangesloten.length; i += 1) { //alle kijkers
                    socket = SOCKET_LIST[dataset.aangesloten[i]];
                    console.log('schhoon in socket');
                    socket.emit("clear", {
                        "clear": 0
                    })
                }
                res.json = {
                    exists: true,
                    gedaan: true
                };

                break;
            case verwijder:
                delete DATASET_LIST[+req.query.number];
                res.json = {
                    exists: true,
                    gedaan: true
                }

                break;

        }


    }
});



app.get('/join', (req, res) => {
    //console.log("join " + req.query.number);
    var dataset = DATASET_LIST[+req.query.number];
    //console.log(dataset);
    if (dataset)
        res.json({
            exists: true,
            number: +req.query.number,
            wachtwoord: req.query.wachtwoord
        })
});
app.get('/clear', (req, res) => {
    var dataset = DATASET_LIST[+req.query.number];
    console.log('clear ');
    dataset.verwerkclear();
    res.json({
        gedaan: true
    })
});

app.get('/geg', (req, res) => {
    //req.query.keep,req.query.won,req.query.number
    console.log('geg   ', req.query);
    var keep = +req.query.keep;
    var won = +req.query.won;
    console.log('keep   won  ', keep, won)
    var dataset = DATASET_LIST[+req.query.number];
    if (dataset == null) {
        res.json = {
            verwerkt: false
        }
    } else {
        res.json({
            verwerkt: true
        })
    }
    dataset.verwerk(keep, won);


});

app.get('/delete', (req, res) => {
    delete DATASET_LIST[+req.query.number];
});
app.get('/info', (req, res) => {
    var info = {};
    info.verbonden = SOCKET_LIST.keys(obj).length;
    info.aantaltafels = DATASET_LIST.keys(obj).length;
    info.tafels = [];
    for (dataset in DATASET_LIST) {
        info.tafels.push({
            "number": dataset.id,
            "keep": dataset.keep,
            length,
            "change": dataset.change.length
        });
    }
    res.json(info);

})


function create_dataset(nummer, wachtwoord) {
    let dataset = Dataset(nummer, wachtwoord);

}

function verstuurdata(socket, dataset) {
    //	console.log(socket.verzonden_keep)
    var verstuur_keep = dataset.keep.slice(socket.verzonden_keep);
    socket.verzonden_keep = dataset.keep.length;
    var verstuur_change = dataset.change.slice(socket.verzonden_change);
    socket.verzonden_change = dataset.change.length;
    //	console.log('keep  ', socket.verzonden_keep, verstuur_keep);
    //	console.log('change ', socket.verzonden_change, verstuur_change);
    socket.emit('verstuur_data', {
        "keep": verstuur_keep,
        "change": verstuur_change
    })

}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    socket.verzonden_keep = 0;
    socket.verzonden_change = 0;
    SOCKET_LIST[socket.id] = socket;

    socket.on('disconnect', function () {
        var nummer;
        console.log('disconnect')
        if (socket.datasetid >= 100000) {
            var dataset = DATASET_LIST[socket.datasetid];
            console.log('socket verwijder  ', dataset, socket.id)
            nummer = dataset.aangesloten.indexOf(socket.id);
            console.log('nummer  ', nummer);
            if (nummer >= 0) {
                dataset.aangesloten.splice(nummer, 1)
            }
        }



        delete SOCKET_LIST[socket.id];
    });
    socket.on("dataset", function (data) {
        console.log('from dataset ');
        console.log('from dataset ', data.dataset, socket.id);
        var dataset = DATASET_LIST[data.dataset];
        console.log("dataset  ", dataset)
        socket.datasetid = dataset.id
        if (dataset.aangesloten.indexOf(socket.id) == -1) {
            dataset.aangesloten.push(socket.id);
        }
        console.log('dataset wordt aangesloten ', dataset, 'socket.id  ', socket.id)
        verstuurdata(socket, dataset)
    });
  
});


/* oude vervangen door inspectie
app.get('/exist', (req, res) => {
    var dataset = DATASET_LIST[+req.query.number];
    //console.log(dataset);
    if (dataset) {
        res.json({
            exists: true,
            number: +req.query.number,
            wachtwoord: dataset.wachtwoord
        })
    } else {
        res.json({
            exist: false
        })

    }
});
app.get('/new', (req, res) => {
    //console.log("maak dataset " + req.query.number);
    var dataset = DATASET_LIST[+req.query.number];
    if (dataset) { //eigenlijk mag dit niet voorkomen
        res.json({
            exist: true,
            wachtwoord: dataset.wachtwoord
        });
    } else {
        Dataset(+req.query.number, req.query.wachtwoord)
        res.json({
            exists: false,
            number: +req.query.number,
            wachtwoord: req.query.wachtwoord
        });
    }
});*/
