import {connect} from "mongoose"
import {Mongoose} from "mongoose";

const MONGO_HOST = process.env.MONGO_HOST || "mymongo";
const CONNECTION_STRING= `mongodb://${MONGO_HOST}/mydb`;

let connectedStatus = false;
let retryRunningId = 0;
let retryRunSeq = 1;

const MAX_RETRY = 5;

export function connectMongo() {
    let mongoose = openConnection();

    mongoose.connection.on('connected', function () {
        connectedStatus = true;
        console.log("DB Connected");
    });

// When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        connectedStatus = false;
        console.log('Mongoose default connection disconnected');
        startBackofConnect(mongoose);
    });
// ERROR
    mongoose.connection.on("error", (error) => {
        console.error("Mongo error:" + error);
        console.error(error);
        mongoose.disconnect();
        startBackofConnect(mongoose);
    });
// Process termination
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    console.log("Opening connection ... Done");
}

let openConnection = function () {
    console.log(`Opening connection ...${CONNECTION_STRING}`);
    return connect(CONNECTION_STRING);
};

function startBackofConnect(mongoose) {
    console.log("New retry");
    retryRunSeq += 1;
    retryBackoffConnect(MAX_RETRY, mongoose, retryRunSeq);
}

function retryBackoffConnect(retry: number, mongoose: Mongoose, runId: number) {
    if (retryRunningId && runId != retryRunningId) {
        console.log(`Retry (${runId}) stopped. Active run=${retryRunningId}`);
        return;
    }
    retryRunningId = runId;
    console.log(`Reconnect (${runId}) ... trial: ${retry}`);

    if (retry < 0) {
        if (!connectedStatus) {
            console.log(`Reconnect (${runId}) failed .... trying again`);
            retryBackoffConnect(5, mongoose, runId);
            return;
        }
        console.log(`Reconnect (${runId}) reached end and connected`);
        retryRunningId = 0;
        return;
    }

    setTimeout(() => {
        if (connectedStatus) {
            console.log(`Retry (${runId}) stopped. Connection successful.`);
            retryRunningId = 0;
            return;
        }
        console.log(`Trying to open a new connection (${runId}).... number=${retry} ...`);
        openConnection();
        retryBackoffConnect(retry - 1, mongoose, runId);
    }, 1000 * Math.pow(2, MAX_RETRY - retry));
}
