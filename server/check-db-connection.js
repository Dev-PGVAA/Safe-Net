const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function checkConnection() {
  console.log('🔍 Проверка подключения к базе данных...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'установлен' : 'НЕ УСТАНОВЛЕН')

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не установлен в переменных окружения')
    console.log('\nСоздайте файл .env в папке server со следующим содержимым:')
    console.log('DATABASE_URL=postgresql://postgres:postgres@localhost:5433/safenet?schema=public')
    process.exit(1)
  }

  // Парсим DATABASE_URL для отображения
  try {
    const url = new URL(process.env.DATABASE_URL.replace('postgresql://', 'http://'))
    console.log('📋 Параметры подключения:')
    console.log('   Хост:', url.hostname)
    console.log('   Порт:', url.port)
    console.log('   База данных:', url.pathname.replace('/', ''))
    console.log('   Пользователь:', url.username)
  } catch (e) {
    console.log('⚠️  Не удалось распарсить DATABASE_URL')
  }

  try {
    console.log('\n🔄 Попытка подключения...')
    const client = await pool.connect()
    const result = await client.query('SELECT NOW(), version()')
    console.log('✅ Подключение успешно!')
    console.log('   Время сервера:', result.rows[0].now)
    console.log('   Версия PostgreSQL:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1])
    client.release()
    await pool.end()
  } catch (error) {
    console.error('\n❌ Ошибка подключения:', error.message)
    console.error('   Код ошибки:', error.code)

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Решение:')
      console.log('1. Убедитесь, что контейнер запущен:')
      console.log('   docker-compose ps')
      console.log('2. Если контейнер не запущен, выполните:')
      console.log('   docker-compose up -d')
      console.log('3. Проверьте логи контейнера:')
      console.log('   docker-compose logs postgres')
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🔧 Решение:')
      console.log('Проверьте правильность хоста в DATABASE_URL (должен быть localhost)')
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n🔧 Решение:')
      console.log('Проверьте правильность пароля в DATABASE_URL')
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('\n🔧 Решение:')
      console.log('База данных не создана. Выполните:')
      console.log('   docker-compose exec postgres psql -U postgres -c "CREATE DATABASE safenet;"')
    } else {
      console.log('\n🔧 Возможные причины:')
      console.log('1. Контейнер PostgreSQL не запущен: docker-compose up -d')
      console.log('2. Неправильный DATABASE_URL в .env файле')
      console.log('3. Порт 5433 занят другим процессом')
      console.log('4. Неверные учетные данные')
      console.log('5. База данных не создана')
    }
    process.exit(1)
  }
}

checkConnection()
