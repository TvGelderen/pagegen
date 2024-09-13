import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { eq, sql } from 'drizzle-orm';

export const client = postgres({
    host: DB_HOST,
    port: 5432,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
});

export const db = drizzle(client, { schema });

export async function getUserById(id: string) {
    return db.query.users.findFirst({
        where: eq(schema.users.id, id)
    })
}

export async function insertUser(id: string, provider: string, provider_id: string, username: string, email: string | null, avatar: string | null) {
    return db.insert(schema.users).values({
        id,
        provider,
        provider_id,
        username,
        email,
        avatar,
    });
}

export async function updateUser(id: string, username: string, email: string) {
    return db.update(schema.users).set({
        username,
        email,
        updatedAt: sql`NOW()`
    }).where(eq(schema.users.id, id));
}

export async function insertWebsite(userId: string, name: string, description: string | null, logo: string | null) {
    return db.insert(schema.websites).values({
        userId,
        name,
        description,
        logo,
    });
}

export async function updateWebsiteDescription(id: number, description: string) {
    return db.update(schema.websites).set({
        description,
        updatedAt: sql`NOW()`
    }).where(eq(schema.websites.id, id));
}

export async function updateWebsiteLogo(id: number, logo: string) {
    return db.update(schema.websites).set({
        logo,
        updatedAt: sql`NOW()`
    }).where(eq(schema.websites.id, id));
}

export async function getUserWebsites(id: string) {
    return db.query.websites.findMany({
        where: eq(schema.websites.userId, id)
    });
}

export async function insertLogo(userId: string, file: string, url: string) {
    return db.insert(schema.logos).values({
        userId,
        file,
        url,
    })
}

export async function getLogo(file: string) {
    return db.query.logos.findFirst({
        where: eq(schema.logos.file, file)
    });
}

export async function deleteLogo(id: number) {
    return db.delete(schema.logos).where(eq(schema.logos.id, id));
}
