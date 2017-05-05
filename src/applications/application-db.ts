import * as mongoose from "mongoose";
import {Promise} from 'es6-promise';
import {Application} from "@sonkal/application-type"

(<any>mongoose).Promise = Promise;

interface IApplicationModel extends Application, mongoose.Document{};
let ApplicationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    personalId: String,
    email: String,
    phone: String,
});


export let ApplicationDb = mongoose.model<IApplicationModel>("applications", ApplicationSchema);