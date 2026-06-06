import mongoose from 'mongoose'

async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  await mongoose.connect(mongoUri)
  console.log('MongoDB Atlas connected')
}

export default connectDB
