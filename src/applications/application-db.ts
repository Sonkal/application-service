import * as mongoose from "mongoose";
import {Promise} from 'es6-promise';
import {AdminApplication} from "@sonkal/application-type"

(<any>mongoose).Promise = Promise;

interface IApplicationModel extends AdminApplication, mongoose.Document {
}

let ApplicationSchema = new mongoose.Schema({
    firstName: {type: String, required: [true]},
    lastName: {type: String, required: [true]},
    address: {
        street: {type: String, required: [true]},
        city: {type: String, required: [true]},
        postCode: {
            type: String, required: [true],
            validate :{
                validator: (v) => /^\d{5}$/.test(v),
                message: "{VALUE} is not a valid post code (5 numbers please)"
            }
        },
    },
    personalId: {
        type: String, required: [true],
        unique: true,
        validate :{
            validator: (v) => /^\d{6}\/\d{4}$/.test(v),
            message: "{VALUE} is not a valid personal ID (6 numbers '/' 4 numbers please)"
        }
    },
    email: String,
    phone: String,
    meta: {
        submittedOn: {type: Date, default: Date.now}
    }
});


export let ApplicationDb = mongoose.model<IApplicationModel>("applications", ApplicationSchema);