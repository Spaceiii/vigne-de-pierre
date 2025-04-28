import {timestamp} from "drizzle-orm/pg-core";

export default {
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
}