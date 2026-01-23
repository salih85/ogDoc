const Blog = require('../models/Blog')
const slugify = require('slugify')

exports.addBlog = async (req, res) => {
    console.log('REQ BODY:')
    // console.dir(req.body,{depth:null})

  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Missing fields' })
    }

    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true }),
      content
    })

    console.log(blog)

    res.status(201).json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}


exports.getBlog =async(req,res)=>{
    try{
        const blog = await Blog.findOne({slug:req.params.slug})
        if(!blog){
            return res.status(404).json({
                message:'blog not found',
                success:false
        })
        }
        return res.status(200).json({
            blog:blog
        })
    }catch(e){
        return res.status(500).json({
            message:'sever error while fetching',
            success:false
        })
    }
}

