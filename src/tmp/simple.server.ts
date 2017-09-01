import * as express from "express";
import {Server, Path, GET, PathParam, Errors} from "typescript-rest";
import {Promise} from 'es6-promise';
// import debug = require('express-debug');

@Path("/dummy")
class Dummy {
    @Path("/sync/:what")
    @GET
    medhotd(@PathParam('what') what: string) {
        console.log("Request:" + what);
        return {ok: "ok", what: what};
    }

    @Path("/async/:what")
    @GET
    async(@PathParam('what') what: string) {
        return new Promise((resolve, reject) => {
            console.log("Async:" + what);
            if (what == "throw") {
                throw new Errors.BadRequestError("throwing error");
            }
            if (what == "reject") {
                reject({
                    info: {info: "rejecting request with reject", more: "info"},
                    data: {some: "some", more: "more"}
                });
            } else {
                resolve({info: "ok - sending response:" + what, data: "some data " + what});
            }
        }).catch<any>((err) => err);
    }

    @Path("/simple/:what")
    @GET
    simple(@PathParam('what') what: string) {
        return new Promise((resolve) => {
            console.log("Simple:" + what);
            setTimeout(()=>{
                resolve({info: "ok - sending response:" + what, data: "some data " + what});
            },1000);
        });
    }

    @Path("/real-async/:what")
    @GET
    real_async(@PathParam('what') what: string) {
        return new Promise((resolve, reject) => {
            console.log("Async:" + what);
            setTimeout(() => {
                if (what == "throw") {
                    throw new Errors.BadRequestError("throwing error");
                }
                if (what == "reject") {
                    reject({
                        info: {info: "rejecting request with reject", more: "info"},
                        data: {some: "some", more: "more"}
                    });
                } else {
                    resolve({info: "ok - sending response:" + what, data: "some data " + what});
                }
            }, 1000);
        }).catch<any>((err) => err);
    }
}

let app: express.Application = express();

Server.buildServices(app, Dummy);
// debug(app, {});

app.listen(3000, function () {
    console.log('Rest Server listening on port 3000!');
});



