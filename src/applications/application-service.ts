import {Server, Path, GET, PathParam, POST, DELETE, Errors} from "typescript-rest";
import {ApplicationDb} from "./application-db";
import {Promise} from 'es6-promise';
//ToDo: ID is clashing with mongo id - type definiton must be different
import {Application} from "@sonkal/application-type"

export class AppBadError extends Errors.BadRequestError{
    data;
    constructor(message?: string, data?:any){
        super(message);
        this.data = data;
    };
}

@Path("/api/applications")
export class ApplicationService {
    constructor(){
    }

    @Path("")
    @GET
    getAll(): Promise<String> {
        return new Promise<any>(function (resolve, reject) {
            ApplicationDb.find((err, applications) => {
                if (err) {
                    return reject({info: 'error during find Applications', error: err});
                }
                resolve({info: 'Applications found successfully', data: applications});
            });
        });
    }

    //ToDo: new type has differnt name for phone number - check with Mongo how to save it
    //ToDo: return promise from mongo direclty
    //ToDo: reuse code for all rest methods and remove duplication
    @Path("")
    @POST
    create(app:Application): Promise<any> {
        let newApplication = new ApplicationDb(app);
        return new Promise<any>(function (resolve, reject) {
            newApplication.save((err)=>{
                if (err){
                    return reject({info: 'error during ApplicationDb create', error: err});
                }
                resolve({info: 'ApplicationDb saved successfully', data: newApplication});
            });
        });
    }

    @Path(":personalId")
    @GET
    getApplication(@PathParam('personalId') personalId: string): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            let query = {personalId: personalId};
            ApplicationDb.findOne(query, function (err, application) {
                if (err) {
                    return reject({info: 'error during find ApplicationDb', error: err});
                }
                if (application) {
                    return resolve({info: 'ApplicationDb found successfully', data: application});
                } else {
                    resolve({info: 'ApplicationDb not found with personalId:' + personalId});
                }
            });
        });
    }

    @Path(";id=:id")
    @DELETE
    deleteBySystemId(@PathParam('id') id: string): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            let query = {_id: id};
            ApplicationDb.findOneAndRemove(query, function (err, application) {
                console.log(`BadError ${err}, ${application}`);
                // ToDo: why does it fail with ;id=32???
                if (err) {
                    console.error(JSON.stringify(err));
                    return reject({info: 'cannot find, cannot delete', error: err});
                }
                if (application) {
                    return resolve({info: 'ApplicationDb with _id:' + id+" deleted", data: application});
                }
                throw new AppBadError('app does not exist:'+id);
                //reject({info: 'app does not exist: _id='+id});
            });
        });
    }

    @Path(":personalId")
    @DELETE
    delete(@PathParam('personalId') personalId: string): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            let query = {personalId: personalId};
            ApplicationDb.findOneAndRemove(query, function (err, application) {
                if (err) {
                    return reject({info: 'cannot find, cannot delete', error: err});
                }
                if (application) {
                    return resolve({info: 'Application with personalId:' + personalId+" deleted", data: application});
                }
                reject({info: 'cannot find personalId='+personalId});
            });
        });
    }
}



