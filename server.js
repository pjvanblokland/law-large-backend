var express = require('express');
var cors = require('cors');
var http = require('http');
var socketIo = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// No static file serving needed - this is a pure API service

// Socket.IO server with real-time communication
server.listen(process.env.PORT || 3002, () => {
    console.log("Law Large Backend server with Socket.IO started on port", process.env.PORT || 3002);
});

// Socket.IO connection handling
var SOCKET_LIST = {};

io.on('connection', function(socket) {
    console.log('New socket connection:', socket.id);
    SOCKET_LIST[socket.id] = socket;
    
    socket.on('disconnect', function() {
        console.log('Socket disconnected:', socket.id);
        delete SOCKET_LIST[socket.id];
        
        // Remove socket from all datasets
        for (var datasetId in DATASET_LIST) {
            var dataset = DATASET_LIST[datasetId];
            var index = dataset.aangesloten.indexOf(socket.id);
            if (index > -1) {
                dataset.aangesloten.splice(index, 1);
            }
        }
    });
    
    socket.on('dataset', function(data) {
        var datasetId = +data.dataset;
        console.log('Socket', socket.id, 'joining dataset', datasetId);
        
        if (DATASET_LIST[datasetId]) {
            var dataset = DATASET_LIST[datasetId];
            
            // Remove from other datasets first
            for (var id in DATASET_LIST) {
                var ds = DATASET_LIST[id];
                var index = ds.aangesloten.indexOf(socket.id);
                if (index > -1) {
                    ds.aangesloten.splice(index, 1);
                }
            }
            
            // Add to requested dataset
            if (dataset.aangesloten.indexOf(socket.id) === -1) {
                dataset.aangesloten.push(socket.id);
            }
            
            // Send current data to the newly connected socket
            socket.emit('verstuur_data', {
                keep: dataset.keep,
                change: dataset.change
            });
        }
    });
});



// No socket list needed for REST API
var DATASET_LIST = {};
var Dataset = function (id, name) {
    self = {};
    self.id = +id;
    self.name = name;
    self.aantalkeep = 0;
    self.aantalchange = 0;
    self.values = [];
    self.keep = [];
    self.change = [];
    self.aangesloten = []; // Keep for compatibility but not used in REST API
    self.lastActivity = Date.now(); // Track last activity for auto-cleanup
    DATASET_LIST[id] = self;


    self.verwerk = function (keep, won) { // verwerk een worp won 0 is false 1=true 
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
        
        // Update last activity timestamp for auto-cleanup
        self.lastActivity = Date.now();
        
        console.log(self.keep.length, self.keep);
        console.log(self.change.length, self.change);

        console.log("gegooid ")

        console.log('aangesloten ', self.aangesloten, self.aangesloten.length)
        // Send update to all connected sockets for this dataset
        for (i = 0; i < self.aangesloten.length; i += 1) {
            var socketId = self.aangesloten[i];
            socket = SOCKET_LIST[socketId];
            if (socket) {
                console.log('verzend naar socket ', socketId, verzend)
                socket.emit("gegooid", verzend);
            }
        }

    }
    self.verwerkclear = function () {
        console.log('verwerkclear');
        var i, socket;
        self.aantalkeep = 0;
        self.aantalchange = 0;
        self.keep = [];
        self.change = [];
        console.log('voor  ', self.aangesloten.length);
        // Send clear signal to all connected sockets for this dataset
        for (i = 0; i < self.aangesloten.length; i += 1) { //alle kijkers
            var socketId = self.aangesloten[i];
            socket = SOCKET_LIST[socketId];
            if (socket) {
                console.log('schhoon');
                socket.emit("clear", {
                    "clear": 0
                });
            }
        }
        console.log('na  ', self.aangesloten.length);

    }

    return self;
}

function create_datasets() {

    /*   let dataset = Dataset(1000, "1a");
       var vanaf = 0;
       for (let i = 0; i < 10; i += 1) {

           if (Math.random() < (1 / 3)) {
               vanaf += 1
           }
           dataset.keep.push(vanaf);

       }
       vanaf = 0;
       for (let i = 0; i < 10; i += 1) {

           if (Math.random() < (2 / 3)) {
               vanaf += 1
           }
           dataset.change.push(vanaf);

       }
       dataset = Dataset(3000, "3a");
       dataset.aantalkeep = 0
       for (let i = 0; i < 20; i += 1) {

           if (Math.random() < (1 / 3)) {
               dataset.aantalkeep += 1
           }
           dataset.keep.push(dataset.aantalkeep);

       }
       dataset.aantalchange = 0;
       for (let i = 0; i < 10; i += 1) {

           if (Math.random() < (2 / 3)) {
               dataset.aantalchange += 1.
           }
           dataset.change.push(dataset.aantalchange);

       }*/
    dataset = Dataset(123446, "3a");

}
create_datasets();

// Auto-cleanup function for dataset 123446
function cleanupDemoDataset() {
    var demoDataset = DATASET_LIST[123446];
    if (demoDataset) {
        var inactiveTime = Date.now() - demoDataset.lastActivity;
        var oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (inactiveTime > oneHour) {
            console.log('Cleaning up demo dataset 123446 after 1 hour of inactivity');
            demoDataset.aantalkeep = 0;
            demoDataset.aantalchange = 0;
            demoDataset.keep = [];
            demoDataset.change = [];
            demoDataset.lastActivity = Date.now(); // Reset timestamp
        }
    }
}

// Check for cleanup every 15 minutes
setInterval(cleanupDemoDataset, 15 * 60 * 1000);

console.log('Auto-cleanup for dataset 123446 enabled (1 hour inactivity)');
app.get('/exist', (req, res) => {
    var dataset = DATASET_LIST[+req.query.number];
    //console.log(dataset);
    if (dataset) {
        res.json({
            exists: true,
            number: +req.query.number,
            name: dataset.name
        })
    } else {
        res.json({
            exists: false
        })

    }
});
app.get('/new', (req, res) => {
    //console.log("maak dataset " + req.query.number);
    var dataset = DATASET_LIST[+req.query.number];
    if (dataset) { //eigenlijk mag dit niet voorkomen
        res.json({
            exist: true,
            name: dataset.name
        });
    } else {
        Dataset(+req.query.number, req.query.name)
        res.json({
            exists: false,
            number: +req.query.number,
            name: req.query.name
        });
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
            name: dataset.name
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
    var dataset = DATASET_LIST[+req.query.number];
    res.json({})
    dataset.verwerk(keep, won);


});
app.get('/delete', (req, res) => {
    delete DATASET_LIST[+req.query.number];
});
app.get('/info', (req, res) => {
    var number = +req.query.number; // Convert to number
    if (number && DATASET_LIST[number]) {
        var dataset = DATASET_LIST[number];
        res.json({
            dataset: {
                id: dataset.id,
                name: dataset.name,
                keep: dataset.keep,
                change: dataset.change,
                aantalkeep: dataset.aantalkeep,
                aantalchange: dataset.aantalchange
            }
        });
    } else {
        // General info about all datasets
        var info = {};
        info.verbonden = Object.keys(SOCKET_LIST).length; // Count active sockets
        info.aantaltafels = Object.keys(DATASET_LIST).length;
        info.tafels = [];
        for (var datasetId in DATASET_LIST) {
            var dataset = DATASET_LIST[datasetId];
            info.tafels.push({
                "number": dataset.id,
                "keep": dataset.keep.length,
                "change": dataset.change.length,
                "connected": dataset.aangesloten.length
            });
        }
        res.json(info);
    }
});


function create_dataset(nummer, name) {
    let dataset = Dataset(nummer, naam);

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

// Socket.IO code removed - using REST API only
