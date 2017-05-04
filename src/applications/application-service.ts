import {Server, Path, GET, PathParam, POST, DELETE, Errors} from "typescript-rest";
import {IApplication, ApplicationDb} from "./application-db";
import {Promise} from 'es6-promise';

@Path("/api/applications")
export class ApplicationService {
    static use:boolean;
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
    @Path("")
    @POST
    create(app:IApplication): Promise<any> {
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
            var query = {personalId: personalId};
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
            var query = {_id: id};
            ApplicationDb.findOneAndRemove(query, function (err, application) {
                if (err) {
                    return reject({info: 'cannot find, cannot delete', error: err});
                }
                if (application) {
                    return resolve({info: 'ApplicationDb with _id:' + id+" deleted", data: application});
                }
                reject({info: 'app does not exist: _id='+id});
            });
        });
    }

    @Path(":personalId")
    @DELETE
    delete(@PathParam('personalId') personalId: string): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            var query = {personalId: personalId};
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



