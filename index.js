const WebSocket = require('ws');
//const wssec = require('wss');

const connectws = new WebSocket.Server({ port: process.env.PORT });
//const testing = new wssec.createServer({ port: 3001 });

//const cws = new WebSocket.Server({ port: 8082 });

//const hws = new WebSocket.Server({ port: 8081 });


testing.on("connection", ws => {
    console.log("New connection");

    var DeterminedType = false;

    ws.on("message", data => {
        if (DeterminedType)
            return;

        if (data == 'client') {
            var GameId;

            var PlayerId;

            //setTimeout(function() {SendData(JSON.stringify({type: "Vote", messageData: JSON.stringify([{Id: 0, text: "Number 0"}, {Id: 1, text: "Number 1"}, {Id: 2, text: "Number 2"}])}))}, 10000);
            //setTimeout(function() {SendData(JSON.stringify({type: "Respond", messageData: JSON.stringify("My favorite color is ___")}))}, 5000);
            //setTimeout(function() {SendData(JSON.stringify({type: "Place", messageData: JSON.stringify({place : 1, score : 69420})}))}, 3000);
            //setTimeout(function() {SendData(JSON.stringify({type: "Look", messageData: JSON.stringify(0)}))}, 5000);
            //setTimeout(function() {SendData(JSON.stringify({type: "End", messageData: JSON.stringify(0)}))}, 5000);

            ws.on("message", data => {
                var Message = JSON.parse(data);

                console.log(Message);

                if (Message.type == 'GameId') {

                    GameId = JSON.parse(Message.messageData).Id;
                    PlayerName = JSON.parse(Message.messageData).Name;

                    if (ConnectHost[GameId] == null) {
                        SendData(JsonMessage('Handshake', false));
                        console.log("No server found");
                        return;
                    }

                    ConnectHost[GameId](SendData, false, PlayerName, SetPlayerId);
                    //PlayerId = ConnectHost[GameId].indexOf(ws);
                    
                    return;
                }

                if (GameId == null)
                    return;

                MessageHost[GameId](JSON.stringify({type: Message.type, Id: PlayerId, messageData: Message.messageData}));

                
                
            })

            function SetPlayerId(Num) {
                PlayerId = Num;
            }

            function SendData(JsonData) {
                console.log(JsonData);
                ws.send(JsonData);
            }
        }
        else if (data == 'host') {
            console.log("New Host");

            var GameId;

            var PlayerMessage = Array();

            var GameStarted = false;

            var FoundId = false;

            do {
                GameId = Math.floor(Math.random() * 10000);
                console.log("Trying gameid " + GameId);
                if (ConnectHost[GameId] == null)
                    FoundId = true;
            }
            while (FoundId = false);

            ConnectHost[GameId] = RegisterPlayer;
            MessageHost[GameId] = SendData;
            ws.send(JsonMessage('GameId', GameId));
            

            function SendData(JsonData) {
                ws.send(JsonData);
            }

            function RegisterPlayer(PlayerMsg, Disconnect, Name, SetIdFunc) {
                if (Disconnect) {
                    var PlayerIdn = PlayerMessage.indexOf(PlayerMsg);
                    PlayerMessage.splice(PlayerIdn, 1);
                    ws.SendData(JsonMessage("PlayerConnection", { PlayerId: PlayerIdn, Name: "-", Disconnect: true}))
                    return;
                }
                if (GameStarted) {
                    console.log("Game Started");
                    PlayerMsg(JsonMessage('Handshake', false));
                    return;
                }

                var PlayerId = PlayerMessage.length;

                PlayerMessage.push(PlayerMsg);
                PlayerMsg(JsonMessage('Handshake', true));
                SendData(JsonMessage("PlayerConnection", { PlayerId: PlayerId, Name: Name, Disconnect: false}));
                SetIdFunc(PlayerId);
            }

            ws.on("message", data => {
                Message = JSON.parse(data);

                MessageData = Message.messageData;

                switch (Message.type) {
                    case "All" :
                        for (var i = 0; i < PlayerMessage.length; i++) {
                            PlayerMessage[i](MessageData);
                        }
                        break;

                    case "Select" :
                        MessageData = JSON.parse(MessageData);
                        PlayerMessage[MessageData.Id](MessageData.SendData);
                        break;

                    case "Server" :
                        break;
                }
            });

            ws.on("close", () => {
                ConnectHost[GameId] = null;
            });
        }
    })
})

/*
cws.on("connection", ws => {
    var GameId;

    var PlayerId;

    //setTimeout(function() {SendData(JSON.stringify({type: "Vote", messageData: JSON.stringify([{Id: 0, text: "Number 0"}, {Id: 1, text: "Number 1"}, {Id: 2, text: "Number 2"}])}))}, 10000);
    //setTimeout(function() {SendData(JSON.stringify({type: "Respond", messageData: JSON.stringify("My favorite color is ___")}))}, 5000);
    //setTimeout(function() {SendData(JSON.stringify({type: "Place", messageData: JSON.stringify({place : 1, score : 69420})}))}, 3000);
    //setTimeout(function() {SendData(JSON.stringify({type: "Look", messageData: JSON.stringify(0)}))}, 5000);
    //setTimeout(function() {SendData(JSON.stringify({type: "End", messageData: JSON.stringify(0)}))}, 5000);

    ws.on("message", data => {
        var Message = JSON.parse(data);

        console.log(Message);

        if (Message.type == 'GameId') {

            GameId = JSON.parse(Message.messageData).Id;
            PlayerName = JSON.parse(Message.messageData).Name;

            if (ConnectHost[GameId] == null) {
                SendData(JsonMessage('Handshake', false));
                console.log("No server found");
                return;
            }

            ConnectHost[GameId](SendData, false, PlayerName, SetPlayerId);
            //PlayerId = ConnectHost[GameId].indexOf(ws);
            
            return;
        }

        if (GameId == null)
            return;

        MessageHost[GameId](JSON.stringify({type: Message.type, Id: PlayerId, messageData: Message.messageData}));

        
        
    })

    function SetPlayerId(Num) {
        PlayerId = Num;
    }

    function SendData(JsonData) {
        console.log(JsonData);
        ws.send(JsonData);
    }
});


var ConnectHost = Array(9999);
var MessageHost = Array(9999);

hws.on("connection", ws => {

    console.log("New Host");

    var GameId;

    var PlayerMessage = Array();

    var GameStarted = false;

    var FoundId = false;

    do {
        GameId = Math.floor(Math.random() * 10000);
        console.log("Trying gameid " + GameId);
        if (ConnectHost[GameId] == null)
            FoundId = true;
    }
    while (FoundId = false);

    ConnectHost[GameId] = RegisterPlayer;
    MessageHost[GameId] = SendData;
    ws.send(JsonMessage('GameId', GameId));
    

    function SendData(JsonData) {
        ws.send(JsonData);
    }

    function RegisterPlayer(PlayerMsg, Disconnect, Name, SetIdFunc) {
        if (Disconnect) {
            var PlayerIdn = PlayerMessage.indexOf(PlayerMsg);
            PlayerMessage.splice(PlayerIdn, 1);
            ws.SendData(JsonMessage("PlayerConnection", { PlayerId: PlayerIdn, Name: "-", Disconnect: true}))
            return;
        }
        if (GameStarted) {
            console.log("Game Started");
            PlayerMsg(JsonMessage('Handshake', false));
            return;
        }

        var PlayerId = PlayerMessage.length;

        PlayerMessage.push(PlayerMsg);
        PlayerMsg(JsonMessage('Handshake', true));
        SendData(JsonMessage("PlayerConnection", { PlayerId: PlayerId, Name: Name, Disconnect: false}));
        SetIdFunc(PlayerId);
    }

    ws.on("message", data => {
        Message = JSON.parse(data);

        MessageData = Message.messageData;

        switch (Message.type) {
            case "All" :
                for (var i = 0; i < PlayerMessage.length; i++) {
                    PlayerMessage[i](MessageData);
                }
                break;

            case "Select" :
                MessageData = JSON.parse(MessageData);
                PlayerMessage[MessageData.Id](MessageData.SendData);
                break;

            case "Server" :
                break;
        }
    });

    ws.on("close", () => {
        ConnectHost[GameId] = null;
    });
});


function JsonMessage(Type, Data) {
    console.log(JSON.stringify({type: Type, messageData: JSON.stringify(Data)}));
    return JSON.stringify({type: Type, messageData: JSON.stringify(Data)});
}
*/