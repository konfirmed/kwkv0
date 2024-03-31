import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    console.log('about to create a user')
    const { id, name, email, password } = await request.json();
    // validate email and password
    console.log({ id, name, email, password });
    
    const hashedPassword = await hash(password, 10);
    console.log('Hashed' , hashedPassword)
// First, ensure the uuid-ossp extension is available
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

// Then, insert a new user into the database with a generated UUID
    const response = await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (uuid_generate_v4(), ${name}, ${email}, ${hashedPassword})
    RETURNING id;
`;
console.log('response =' , response)
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: 'success' });
}
