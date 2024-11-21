import { MongoClient } from 'mongodb'

const uri =
  'mongodb+srv://jatin:jatin@jatin.a9ieo.mongodb.net/?retryWrites=true&w=majority&appName=jatin' // Replace with your MongoDB URI
const client = new MongoClient(uri)

export async function POST(req) {
  try {
    const body = await req.json() // Parse the incoming request body
    console.log('Received POST request:', body) // Log the request body
    return new Response(
      JSON.stringify({ message: 'Data received successfully' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
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
