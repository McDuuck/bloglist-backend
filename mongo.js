const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackilmo:${password}@cluster0.ve4fzml.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    likes: {
        type: Number,
        default: 0
    }
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    author: 'Test Person',
    title: 'Test Title',
    url: 'Test URL',
    likes: 'Test Likes'
})


blog.find({}).then(result => {
    result.forEach(blog => {
        console.log(blog)
    })
    mongoose.connection.close()
})
