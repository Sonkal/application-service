import * as express from "express";
import {Server, Path, GET, PathParam} from "typescript-rest";
import {ApplicationService} from "./applications/application-service"

import {connect} from "mongoose"
connect("mongodb://192.168.99.100/mydb");

ApplicationService.use = true;

let app: express.Application = express();
Server.buildServices(app);

app.listen(3000, function() {
    console.log('Rest Server listening on port 3000!');
});
