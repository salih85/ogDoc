import isHotkey from 'is-hotkey'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { Editor, Node, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'
import axios from '../api/axios'

// --- CONSTANTS ---
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'Start writing your story here...' },
    ],
  },
]

// --- LOCAL STYLED COMPONENTS ---

const ToolbarContainer = ({ children }) => (
  <div className="flex flex-wrap gap-1 items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
    {children}
  </div>
)

const ToolbarButton = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`
      p-2 rounded-md transition-all duration-200
      ${active 
        ? 'bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-900 shadow-sm' 
        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800'
      }
    `}
  >
    {children}
  </button>
)

const ToolbarIcon = ({ children }) => (
  <span className="material-icons-outlined text-[20px] leading-none">
    {children}
  </span>
)


// --- MAIN COMPONENT ---
const CreatePost = () => {
  const [value, setValue] = useState(initialValue)
  const [title, setTitle] = useState('')

  // --- DARK MODE LOGIC ---
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const handleSave = async () => {
    try {
      const res = await axios.post("/api/blog/postblog", {
        title,
        content: value
      });
      alert("Blog published");
    } catch (error) {
      alert("You must be logged in to post");
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 py-10 px-4 bg-slate-50 dark:bg-[#0f172a] font-['Inter',_sans-serif]">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800&display=swap');
          @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
        `}
      </style>

      {/* --- HEADER NAVIGATION --- */}
      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <h2 className="font-['Outfit',_sans-serif] text-xl font-bold tracking-tight text-slate-900 dark:text-indigo-500 text-secondary"
        >
          New Story
        </h2>
        
        <div className="flex items-center gap-6">
           <button
            onClick={() => setIsDark(!isDark)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {isDark ? "Light" : "Dark"}
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-2xl bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95"
          style={{borderRadius:'5px'}}        

          >
            Publish
          </button>
        </div>
      </nav>

      {/* --- EDITOR CARD --- */}
      <div className="max-w-4xl mx-auto">
        {/* Added specific dark background #1e293b (Slate 800) */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-colors duration-500">
          
          <div className="p-8 sm:p-12 min-h-[80vh] dark:bg-slate-800 rounded-2xl">
            
            {/* Title Input */}
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{fontSize:'2rem'}}
              className="w-full mb-8 font-['Outfit',_sans-serif] text-lg md:text-5xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0
              text-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-600 mb-3 dark:text-slate-300"
              autoFocus
            />

            {/* Slate Editor */}
            <Slate 
              editor={editor} 
              initialValue={initialValue} 
              onChange={newValue => setValue(newValue)}
              className='dark:bg-slate-800'
            >
              {/* Sticky Toolbar with Blur */}
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm transition-colors duration-500 d-flex justify-content-center align-items-center rounded mb-5">
                <ToolbarContainer>
                  <MarkButton format="bold" icon="format_bold" />
                  <MarkButton format="italic" icon="format_italic" />
                  <MarkButton format="underline" icon="format_underlined" />
                  <MarkButton format="code" icon="code" />
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                  <BlockButton format="heading-one" icon="looks_one" />
                  <BlockButton format="heading-two" icon="looks_two" />
                  <BlockButton format="block-quote" icon="format_quote" />
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                  <BlockButton format="numbered-list" icon="format_list_numbered" />
                  <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                  <BlockButton format="left" icon="format_align_left" />
                  <BlockButton format="center" icon="format_align_center" />
                  <BlockButton format="right" icon="format_align_right" />
                  <BlockButton format="justify" icon="format_align_justify" />
                </ToolbarContainer>
              </div>

              <Editable
                // Explicitly setting text color here ensures it applies even if Leaf doesn't catch it
                className="focus:outline-none min-h-[400px] text-lg leading-relaxed text-slate-800 text-secondary dark:bg-slate-700 rounded-lg p-1"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Tell your story..."
                spellCheck
                onKeyDown={event => {
                  for (const hotkey in HOTKEYS) {
                    if (isHotkey(hotkey, event)) {
                      event.preventDefault()
                      const mark = HOTKEYS[hotkey]
                      toggleMark(editor, mark)
                    }
                  }
                }}
              />
            </Slate>
          </div>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-6 py-12 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          Markdown shortcuts supported
        </p>
      </footer>
    </div>
  )
}

// --- RENDERING HELPERS (Typography Fixes) ---

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }

  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote 
          className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 my-6 italic text-slate-500 dark:text-slate-400 text-xl" 
          style={style} 
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return <ul className="list-disc pl-8 mb-4 text-slate-600 dark:text-slate-300 leading-relaxed" style={style} {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol className="list-decimal pl-8 mb-4 text-slate-600 dark:text-slate-300 leading-relaxed" style={style} {...attributes}>{children}</ol>
    case 'list-item':
      return <li className="mb-2 pl-1" style={style} {...attributes}>{children}</li>
    case 'heading-one':
      // Using slate-900 (dark) and slate-100 (light) for headings to make them pop
      return <h1 className="font-['Outfit',_sans-serif] text-3xl md:text-4xl font-bold mb-4 mt-8 text-slate-900 dark:text-slate-100 tracking-tight" style={style} {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 className="font-['Outfit',_sans-serif] text-2xl font-bold mb-3 mt-8 text-slate-800 dark:text-slate-200 tracking-tight" style={style} {...attributes}>{children}</h2>
    default:
      // Using slate-600 (dark) and slate-300 (light) for body text to be softer on the eyes
      return <p className="mb-4 text-lg text-slate-600 dark:text-slate-300 leading-8" style={style} {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  // Bold Text
  if (leaf.bold) {
    children = <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>
  }
  
  // Inline Code - Adjusted background to match card color for better contrast
  if (leaf.code) {
    children = (
      <code className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-200 font-mono text-sm px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600/50">
        {children}
      </code>
    )
  }

  if (leaf.italic) children = <em className="italic">{children}</em>
  
  if (leaf.underline) {
    children = <u className="underline decoration-slate-300 dark:decoration-slate-500 underline-offset-4">{children}</u>
  }
  
  // IMPORTANT: Explicitly setting the base text color on the span
  // This overrides any parent styles that might be interfering
  return (
    <span 
      className={
        // If no special formatting, force the standard text color
        // Light Mode: text-slate-600
        // Dark Mode: text-slate-300 (Softer than slate-100)
        !leaf.bold && !leaf.code ? "text-slate-600 dark:text-slate-200" : ""
      } 
      {...attributes}
    >
      {children}
    </span>
  )
}

// ... (Slate Logic functions remain unchanged)
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? 'align' : 'type'
  )
  const isList = isListType(format)
  Transforms.unwrapNodes(editor, {
    match: n => Node.isElement(n) && isListType(n.type) && !isAlignType(format),
    split: true,
  })
  let newProperties
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)
  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (Node.isElement(n)) {
          if (blockType === 'align' && isAlignElement(n)) {
            return n.align === format
          }
          return n.type === format
        }
        return false
      },
    })
  )
  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <ToolbarButton
      active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? 'align' : 'type'
      )}
      onPointerDown={event => event.preventDefault()}
      onClick={() => toggleBlock(editor, format)}
    >
      <ToolbarIcon>{icon}</ToolbarIcon>
    </ToolbarButton>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onPointerDown={event => event.preventDefault()}
      onClick={() => toggleMark(editor, format)}
    >
      <ToolbarIcon>{icon}</ToolbarIcon>
    </ToolbarButton>
  )
}

const isAlignType = format => TEXT_ALIGN_TYPES.includes(format)
const isListType = format => LIST_TYPES.includes(format)
const isAlignElement = element => 'align' in element

export default CreatePost