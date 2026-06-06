import mongoose from 'mongoose'

async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('Please add MONGO_URI in your .env file')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB Atlas connected')
}

export default connectDB
