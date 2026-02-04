import React from 'react'

const ImageWidget = ({ url, readOnly }) => {
    return (
        <div className="w-full h-full overflow-hidden rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#1e293b] flex items-center justify-center">
            <img
                src={url}
                alt="Post content"
                className="w-full h-full object-cover pointer-events-none"
            />
        </div>
    )
}

export default ImageWidget
