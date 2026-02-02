import isHotkey from 'is-hotkey'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { createEditor, Editor, Transforms, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'

// --- CONSTANTS ---
const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

// --- LOCAL COMPONENTS ---
// Minimal Toolbar for inside the widget
const Toolbar = ({ children }) => (
    <div className="flex flex-wrap gap-1 items-center pb-2 mb-2 border-b border-slate-200 dark:border-slate-700/50">
        {children}
    </div>
)

const ToolbarButton = ({ active, children, ...props }) => (
    <button
        {...props}
        onMouseDown={e => e.preventDefault()} // Prevent losing focus
        className={`
      p-1 rounded-md transition-all duration-200 text-sm
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
    <span className="material-icons-outlined text-[16px] leading-none">
        {children}
    </span>
)

const TextWidget = ({ id, content, onChange, readOnly = false }) => {
    // Each widget needs its own editor instance
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    // Local state for the value to avoid grid re-renders on every keystroke if we were passing it up constantly
    // But for now, we'll pass it up to keep the "single source of truth" simple.
    // Optimization: We could debounce the onChange.

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    return (
        <div className="h-full flex flex-col cursor-text" onMouseDown={e => e.stopPropagation()}>
            {/* Stop propagation so dragging the text doesn't drag the grid item immediately if not intended */}
            <Slate editor={editor} initialValue={content} onChange={val => onChange(id, val)}>
                {!readOnly && (
                    <Toolbar>
                        <MarkButton format="bold" icon="format_bold" />
                        <MarkButton format="italic" icon="format_italic" />
                        <MarkButton format="underline" icon="format_underlined" />
                        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <BlockButton format="left" icon="format_align_left" />
                        <BlockButton format="center" icon="format_align_center" />
                        <BlockButton format="right" icon="format_align_right" />
                        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <BlockButton format="heading-one" icon="looks_one" />
                        <BlockButton format="heading-two" icon="looks_two" />
                        <BlockButton format="numbered-list" icon="format_list_numbered" />
                        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                    </Toolbar>
                )}

                <Editable
                    className="flex-grow focus:outline-none text-slate-800 dark:text-slate-200"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Write something..."
                    spellCheck
                    readOnly={readOnly}
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event)) {
                                event.preventDefault()
                                toggleMark(editor, HOTKEYS[hotkey])
                            }
                        }
                    }}
                />
            </Slate>
        </div>
    )
}

// --- SLATE HELPERS & RENDERERS (Copied/Adapted from CreatePost) ---

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type')
    const isList = isListType(format)

    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && Node.isElement(n) && isListType(n.type) && !isAlignType(format),
        split: true,
    })

    let newProperties
    if (isAlignType(format)) {
        newProperties = { align: isActive ? undefined : format }
    } else {
        newProperties = { type: isActive ? 'paragraph' : isList ? 'list-item' : format }
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
            match: n => !Editor.isEditor(n) && Node.isElement(n) && (blockType === 'align' ? n.align === format : n.type === format),
        })
    )
    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const isAlignType = format => TEXT_ALIGN_TYPES.includes(format)
const isListType = format => LIST_TYPES.includes(format)

const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <ToolbarButton
            active={isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type')}
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

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align || 'left' }
    switch (element.type) {
        case 'block-quote':
            return <blockquote style={style} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 my-2 italic text-slate-500 dark:text-slate-400" {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul style={style} className="list-disc pl-8 mb-2" {...attributes}>{children}</ul>
        case 'numbered-list':
            return <ol style={style} className="list-decimal pl-8 mb-2" {...attributes}>{children}</ol>
        case 'list-item':
            return <li style={style} className="mb-1" {...attributes}>{children}</li>
        case 'heading-one':
            return <h1 style={style} className="text-2xl font-bold mb-2 mt-4" {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 style={style} className="text-xl font-bold mb-2 mt-4" {...attributes}>{children}</h2>
        default:
            return <p style={style} className="mb-2 leading-relaxed" {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>
    if (leaf.code) children = <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded font-mono text-sm">{children}</code>
    if (leaf.italic) children = <em>{children}</em>
    if (leaf.underline) children = <u>{children}</u>
    return <span {...attributes}>{children}</span>
}

export default TextWidget
