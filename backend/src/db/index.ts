import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from "./schema";
import {eq} from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);


async function main() {
    const user: typeof usersTable.$inferInsert = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        email: 'john@example.com',
    };
    const user2: typeof usersTable.$inferInsert = {
        firstName: 'Oliver',
        lastName: 'Smith',
        password: 'password',
        email: 'oliver@example.com',
    }
    await db.insert(usersTable).values([user, user2]);
    console.log('New user created!')
    const users = await db.select().from(usersTable);
    console.log('Getting all users from the database: ', users)
    /*
    const users: {
      id: number;
      name: string;
      age: number;
      email: string;
    }[]
    */
    await db
        .update(usersTable)
        .set({
            password: 'mysupersecretpassword',
        })
        .where(eq(usersTable.email, user.email));
    console.log('User info updated!')

    const updatedUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.email))
    console.log('Updated user: ', updatedUser)

    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log('User deleted!')
}

main();