import * as mongoose from "mongoose";

interface IApplication{
    first_name:string;
    last_name:string;
    email:string;
}

interface IApplicationModel extends IApplication, mongoose.Document{};
var ApplicationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    personalId: String,
    email: String,
    phoneNumber: String,
});

var Application = mongoose.model<IApplicationModel>("applications", ApplicationSchema);

export = Application;