import * as express from "express";
import {Server, Path, GET, PathParam} from "typescript-rest";

@Path("/dummy")
class Dummy {
    @Path(":what")
    @GET
    medhotd(@PathParam('what') what: string) {
        return {ok:"ok",what:what};
    }
}

let app: express.Application = express();

Server.buildServices(app,Dummy);

app.listen(3000, function () {
    console.log('Rest Server listening on port 3000!');
});



