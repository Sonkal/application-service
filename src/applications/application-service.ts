import {Path, GET, PathParam, POST, DELETE, Errors, ContextRequest} from "typescript-rest";
import {ApplicationDb} from "./application-db";
import {Promise} from "es6-promise";
//ToDo: ID is clashing with mongo id - type definiton must be different
import {Application} from "@sonkal/application-type";
import {Request} from "express";
import {HttpError} from "typescript-rest";

export class AppBadReqError extends Errors.BadRequestError {
    info: string;
    data: any;

    constructor(message: string, data?: any) {
        super(message);
        this.info = message;
        this.data = data;
        (<any>this).__proto__ = AppBadReqError.prototype;
    };
}
export class AppServerError extends HttpError {
    info: string;
    data: any;

    constructor(name: string, message: string, data?: any) {
        super(name, 500, message);
        this.info = message;
        this.data = data;
        (<any>this).__proto__ = AppBadReqError.prototype;
    };
}

/**
 * Response handler - if error, reject
 * if success, resolve
 * @returns {(err:any, data:any)=>any}
 */
function respH(reject: (error?: any) => void, errorInfo: string,
               resolve: (value?: any) => void, dataInfo: string): (err: any, data: any) => any {
    return (err, data) => {
        if (err) {
            if (err.name === "ValidationError")
                return reject(new AppBadReqError(errorInfo, err));
            else
                return reject(new AppServerError(err.name, errorInfo, err));
        }
        console.log("OK, got data");
        console.log(data);
        resolve({info: dataInfo, data: data});
    };
}

/**
 * Generates promise and invokes logic inside
 * It catches error and reject with Error
 */
function promiseGenerator(logic: (resolve, reject) => void): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
        logic(resolve, (err) => {
            console.error("DB call finished with error:");
            console.error(err);
            reject(err);
        });
    });
    // MUST NOT catch it here, it must propagate to the caller (type-rest middleware), instead, intercept reject method
}

@Path("/api/applications")
export class ApplicationService {
    @Path("")
    @GET
    getAll(): Promise<any> {
        return promiseGenerator((resolve, reject) => {
            ApplicationDb.find(respH(reject, 'Error during find Applications', resolve, 'Applications found successfully'));
        });
    }

    //ToDo: new type has differnt name for phone number - check with Mongo how to save it
    @Path("")
    @POST
    create(app: Application, @ContextRequest request: Request): Promise<any> {
        console.log("Create application" + request.originalUrl);
        console.log(JSON.stringify(app, null, 2));
        return promiseGenerator((resolve, reject) => {
            let newApplication = new ApplicationDb(app);
            newApplication.save(respH(reject, "Error during Application create", resolve, "Application saved successfully"));
        });
    }

    //ToDo: reuse code for all rest methods and remove duplication - generalize: if data == nul =>
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
                    reject({info: 'ApplicationDb not found with personalId:' + personalId});
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
                // ToDo: why does it fail with ;id=32???
                if (err) {
                    return reject(new AppBadReqError('cannot find, cannot delete', err));
                }
                if (application) {
                    return resolve({info: 'ApplicationDb with _id:' + id + " deleted", data: application});
                }
                reject(new AppBadReqError('app does not exist:' + id, {data: "some"}));
            });
        }).catch<any>((error) => {
            return error;
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
                    return resolve({info: 'Application with personalId:' + personalId + " deleted", data: application});
                }
                reject({info: 'cannot find personalId=' + personalId});
            });
        });
    }
}



