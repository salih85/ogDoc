import { useState } from "react"

function BlogView() {
    const [slug, setSlug] = useState("")
    const [blog, setBlog] = useState(null)
    const [error, setError] = useState("")

    //   const fetchBlog = async () => {
    //     if (!slug) return

    //     try {
    //       const response = await fetch(
    //         `http://localhost:5000/api/blogs/${slug}`
    //       )

    //       if (!response.ok) {
    //         throw new Error("Blog not found")
    //       }

    //       const data = await response.json()
    //       setBlog(data)
    //       setError("")
    //     } catch (err) {
    //       setError(err.message)
    //       setBlog(null)
    //     }
    //   }
    const fetchBlog = async () => {
        if (!slug) return

        if (slug === "test-blog") {
            setBlog({
                title: "Test Blog Title",
                content: "This is a fake blog used for testing the view page UI.hshshhsehe dbhj eb ecj  dhcnhbchhecb  cehenkwc ecekn e ece enkcn  c herc dhdrbhrbrf chjchjebchjebchc cnnehcbec enjinceire dn xjidhen xwjnie d3edhdn3e xu3bd 3ubxuh3dbd  db3cidjcndx cji3ewn3e "
            })
            setError("")
        } else {
            setError("Blog not found")
            setBlog(null)
        }
    }
    return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">  
    <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl p-6 md:p-10">

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-100"> View Blog </h1>

        {/* Slug Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input type="text" placeholder="Enter blog slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-400
                border border-slate-700 rounded-xl px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

            <button onClick={fetchBlog} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-md">
                View
            </button>
        </div>

        {/* Error Message */}
        {error && (
            <p className="text-rose-400 text-center mb-6"> {error} </p>
        )}

        {/* Blog Content */}
        {blog && (
            <div className="border-t border-slate-800 pt-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-indigo-400">
                    {blog.title}
                </h2>

                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {blog.content}
                </p>
            </div>
        )}
    </div>
    </div>
    )
}

export default BlogView
