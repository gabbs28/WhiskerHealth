#!/usr/bin/env node

import 'dotenv/config';

import { prisma } from '../database/client.js';
import { port } from '../config/index.js';
import { app } from '../app.js';

async function main() {
    // Enable to attempt database connection on start, can be a bit slow so might not be worth it
    try {
        // Attempt to connect and perform a simple query
        const result = await prisma.$queryRaw`SELECT 1+1 as result`;
        console.log('✓ Successfully connected to the database');
        console.log('Query result:', result);
    } catch (error) {
        console.error('✗ Unable to connect to the database:', error);
        process.exit(1);
    }

    // Start listening for connections
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
