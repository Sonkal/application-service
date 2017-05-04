import * as mongoose from "mongoose";
import {Promise} from 'es6-promise';

(<any>mongoose).Promise = Promise;

export interface IApplication{
    firstName: string;
    lastName: string;
    address: string;
    personalId: string;
    email: string;
    phoneNumber: string;
}

interface IApplicationModel extends IApplication, mongoose.Document{};
let ApplicationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    personalId: String,
    email: String,
    phoneNumber: String,
});


export let ApplicationDb = mongoose.model<IApplicationModel>("applications", ApplicationSchema);