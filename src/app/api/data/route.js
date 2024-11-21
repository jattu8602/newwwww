import { MongoClient } from 'mongodb'

const uri =
  'mongodb+srv://jatin:jatin@jatin.a9ieo.mongodb.net/?retryWrites=true&w=majority&appName=jatin' // Replace with your MongoDB URI
const client = new MongoClient(uri)

export async function POST(req) {
  try {
    const body = await req.json() // Parse JSON body

    const { temperature, humidity } = body


    if (!temperature || !humidity) {
      return new Response(
        JSON.stringify({ error: 'Missing temperature or humidity data' }),
        { status: 400,headers: { 'Content-Type': 'application/json' } }
      )
    }

    await client.connect()
    const db = client.db('esp_database') // Replace with your database name
    const collection = db.collection('sensor_data') // Replace with your collection name

    const result = await collection.insertOne({
      temperature,
      humidity,
      timestamp: new Date(),
    })

    return new Response(
      JSON.stringify({ message: 'Data inserted successfully', result }),
      { status: 201 ,headers: { 'Content-Type': 'application/json' }}
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    await client.close()
  }
}

export async function GET() {
  try {
    await client.connect()
    const db = client.db('esp_database')
    const collection = db.collection('sensor_data')

    const data = await collection.find().toArray()

    return new Response(
      JSON.stringify({ message: 'Data fetched successfully', data }),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  } finally {
    await client.close()
  }
}
