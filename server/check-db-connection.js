const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function checkConnection() {
  console.log('🔍 Checking database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET')

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    console.log('\nCreate a .env file in the server folder with the following content:')
    console.log('DATABASE_URL=postgresql://postgres:postgres@localhost:5433/safenet?schema=public')
    process.exit(1)
  }

  // Parse DATABASE_URL for display
  try {
    const url = new URL(process.env.DATABASE_URL.replace('postgresql://', 'http://'))
    console.log('📋 Connection parameters:')
    console.log('   Host:', url.hostname)
    console.log('   Port:', url.port)
    console.log('   Database:', url.pathname.replace('/', ''))
    console.log('   User:', url.username)
  } catch (e) {
    console.log('⚠️  Failed to parse DATABASE_URL')
  }

  try {
    console.log('\n🔄 Connecting...')
    const client = await pool.connect()
    const result = await client.query('SELECT NOW(), version()')
    console.log('✅ Connection successful!')
    console.log('   Server time:', result.rows[0].now)
    console.log('   PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1])
    client.release()
    await pool.end()
  } catch (error) {
    console.error('\n❌ Connection error:', error.message)
    console.error('   Error code:', error.code)

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Fix:')
      console.log('1. Make sure the container is running:')
      console.log('   docker-compose ps')
      console.log('2. If the container is not running, run:')
      console.log('   docker-compose up -d')
      console.log('3. Check the container logs:')
      console.log('   docker-compose logs postgres')
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🔧 Fix:')
      console.log('Check the host in DATABASE_URL (should be localhost)')
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Fix:')
      console.log('Check the password in DATABASE_URL')
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('\n🔧 Fix:')
      console.log('The database has not been created. Run:')
      console.log('   docker-compose exec postgres psql -U postgres -c "CREATE DATABASE safenet;"')
    } else {
      console.log('\n🔧 Possible causes:')
      console.log('1. The PostgreSQL container is not running: docker-compose up -d')
      console.log('2. Wrong DATABASE_URL in the .env file')
      console.log('3. Port 5433 is taken by another process')
      console.log('4. Invalid credentials')
      console.log('5. The database has not been created')
    }
    process.exit(1)
  }
}

checkConnection()
