const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const average = require('../utils/for_testing').average
const listHelper = require('../utils/list_helper')
const totalLikes = require('../utils/list_helper').totalLikes
const reverse = require('../utils/for_testing').reverse

describe('dummy test', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('Blogs to json', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('blog without title or url', () => {
  test('POST /api/blogs returns status code 400 if title or url is missing', async () => {
    const newBlog = {
      title: '',
      author: 'John Doe',
      url: '',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('Empty likes', () => {
  test('Blog likes set to 0', () => {
    const blogs = [
      {
        title: 'Empty likes',
        author: 'John Doe',
        likes: ''
      }
    ]
    function setLikesToZero(blog) {
      if (blog.likes === '') {
        blog.likes = 0
      }
    }
    setLikesToZero(blogs[0])
    expect(blogs[0].likes).toBe(0)
  })
})

describe('average', () => {
  test('of one value is the value itself', () => {
      expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
      expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
      expect(average([])).toBe(0)
  })
})

describe('favorite blog', () => {
  const blogs = [
      {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 15,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
        },
        {
          _id: "5a422b891b54a676234d17fa",
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10,
          __v: 0
        },
        {
          _id: "5a422ba71b54a676234d17fb",
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0,
          __v: 0
        },
        {
          _id: "5a422bc61b54a676234d17fc",
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2,
          __v: 0
        } 
  ]
  const mostLikes = (blogs) => {
      if (blogs.length === 0) {
        return null
      }
    
      let maxLikes = -1
      let maxLikesBlog = null
    
      blogs.forEach((blog) => {
        if (blog.likes > maxLikes) {
          maxLikes = blog.likes
          maxLikesBlog = blog
        }
      })
    
      return maxLikesBlog
    }
    const sortByLikes = (blogs) => {
      return blogs.sort((a, b) => b.likes - a.likes)
    }

    test('blog with most likes is returned', () => {
      const sortedBlogs = sortByLikes(blogs)
      const result = mostLikes(blogs)
      expect(result).toEqual(sortedBlogs[0])
      console.log(result)
    })
})

describe('total likes', () => {
  const listWithOneBlog = [
      {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 8,
          __v: 0
        }
    ]

  test('of empty list is zero', () => {
      expect(totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
      const result = totalLikes(listWithOneBlog)
      expect(result).toBe(listWithOneBlog[0].likes)
  })

  test('of a bigger list is calculated right', () => {
      expect(totalLikes([
          { likes: 1 },
          { likes: 2 },
          { likes: 3 },
          { likes: 4 },
          { likes: 5 },
          { likes: 6 }
      ])).toBe(21)
  })
})

describe('most blogs', () => {
  const blogs = [
      {
          author: "Michael Chan",
          blogs: 1
      },
      {
          author: "Edsger W. Dijkstra",
          blogs: 2
      },
      {
          author: "Robert C. Martin",
          blogs: 6
      },
      {
          author: "Martin Fowler",
          blogs: 6
      }
  ]
  const mostBlogs = (blogs) => {
      if (blogs.length === 0) {
        return null
      }
    
      let maxBlogs = -1
      let maxBlogsAuthor = null
    
      blogs.forEach((blog) => {
        if (blog.blogs > maxBlogs) {
          maxBlogs = blog.blogs
          maxBlogsAuthor = blog.author
        }
      })
    
      return maxBlogsAuthor
  }
  const sortByBlogs = (blogs) => {
      return blogs.sort((a, b) => b.blogs - a.blogs)
  }

  test('author with most blogs is returned', () => {
      const result = mostBlogs(blogs)
      expect(result).toEqual(blogs[2].author)
      console.log(sortByBlogs(blogs)[0])
  })
})

describe('reverse test', () => {
  test('reverse of a', () => {
    const result = reverse('a')

    expect(result).toBe('a')
  })

  test('reverse of react', () => {
    const result = reverse('react')

    expect(result).toBe('tcaer')
  })

  test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    expect(result).toBe('saippuakauppias')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})

