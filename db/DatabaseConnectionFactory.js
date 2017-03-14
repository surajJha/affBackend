/**
 * Created by surajkumar on 14/03/17.
 */
import MongodbConnection from "MongodbConnection";

class DatabaseConnectionFactory
{
    constructor (database) {
        if(!database) {
            return {};
        }
        if(database === "redis") {
            return new RedisConnection();
        }
        else if(database === "mongodb") {
            return new MongodbConnection();
        }
    }
}