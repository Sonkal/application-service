import * as express from "express";
import {Server} from "typescript-rest";
import {ApplicationService, AppBadReqError} from "./applications/application-service";
import {connectMongo} from "./mongo/mongo-utils";


process.on('uncaughtException', function (err) {
    console.error("Unexpected error:" + err);
    console.error(err)
});


connectMongo();

let app: express.Application = express();

Server.buildServices(app, ApplicationService);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Handling error");
    if (err instanceof AppBadReqError) {
        let myErr = <AppBadReqError> err;
        console.log("App error:" + myErr.info);
        res.set("Content-Type", "application/json");
        res.status(myErr.statusCode);
        res.json({info: myErr.info, data: myErr.data});
    } else {
        console.log("Not app error");
        next(err);
    }
});

app.listen(3000, function () {
    console.log('Rest Server listening on port 3000!');
});

