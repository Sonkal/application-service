import {connect, Mongoose} from "mongoose";
import {ApplicationDb} from "../applications/application-db";

const CONNECTION_STRING = `mongodb://dockerm:27017/mydb`;

let mongoose = new Mongoose();
let connection = mongoose.connection;

function doSimpleSearch() {
    console.log("Searching ...");
    ApplicationDb.find((err, data) => {
        console.log("Mongo search result (handler):" + JSON.stringify(err), " ," + JSON.stringify(data));
    }).then((data) => {
        console.log("Mongo search result (promise.then):" + JSON.stringify(data));
    }).catch((err) => {
        console.log("Mongo search result (promise.catch):" + JSON.stringify(err));
    });
}

function doSave() {
    let data = `
        {
          "firstName": "a",
          "lastName": "a",
          "address": {
            "street": "a",
            "city": "a",
            "postCode": "11111"
          },
          "email": "a",
          "personalId": "111111/1111",
          "phone": "1",
          "phoneMother": "1",
          "phoneFather": "1",
          "subscribe": true
        }
    `;
    console.log("Saving ...");
    let newObj = new ApplicationDb(JSON.parse(data));
    newObj.save((err, data) => {
        console.log("Saved (handler):" + JSON.stringify(err), " ," + JSON.stringify(data));
    }).then((data) => {
        console.log("Saved (primise.then): " + JSON.stringify(data));
    }).catch((err) => {
        console.log("Saved (promise.catch):" + JSON.stringify(err));
    });;
}

console.log(`Opening connection ...${CONNECTION_STRING}`);
// new Mongoose().Promise = global.Promise;
let options = {
    user: "mongo_us",
    pass: "changeit",
    useMongoClient: true
};
// let connection = createConnection(CONNECTION_STRING,options);
let ret = connect(CONNECTION_STRING, options, (err) => {
    //looks like this is called ALWAYS but err is NULL if OK
    console.log("Eroor?:" + JSON.stringify(err));
});

ret.then<any>(() => {
    console.log("Connection THEN");
    doSave();
    doSimpleSearch();
}, (err) => {
    console.log("Eroor?:" + JSON.stringify(err));

});


connection.on('connected', function () {
    console.log("DB Connected");
    doSimpleSearch();
});

// When the connection is disconnected
connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
// ERROR
connection.on("error", (error) => {
    console.error("Mongo error:" + error);
    console.error(error);
});
// Process termination
process.on('SIGINT', function () {
    connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

console.log("Opening connection ... Done");


