import * as express from "express";
import {Server, Path, GET, PathParam, HttpError} from "typescript-rest";
import {ApplicationService, AppBadError} from "./applications/application-service"

import {connect} from "mongoose"
connect("mongodb://192.168.99.100/mydb");

let app: express.Application = express();

Server.buildServices(app,ApplicationService);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof AppBadError){
        res.set("Content-Type", "application/json")
        res.status(err.statusCode)
        res.json({info : err.message, data: err.data});
    } else {
        next(err);
    }
});

app.listen(3000, function() {
    console.log('Rest Server listening on port 3000!');
});
