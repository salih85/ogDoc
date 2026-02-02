import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import TextWidget from './TextWidget';
import ImageWidget from './ImageWidget';
import VideoWidget from './VideoWidget';
import _ from 'lodash';

// Custom hook for measuring width
const useContainerWidth = () => {
    const [width, setWidth] = useState(1200);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    const newWidth = Math.floor(entry.contentRect.width);
                    // Threshold to prevent loops - slightly increased to 5px
                    setWidth(prev => {
                        if (Math.abs(prev - newWidth) > 5) {
                            return newWidth;
                        }
                        return prev;
                    });
                }
            }
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return { width, ref };
};


const GridEditor = ({ widgets, setWidgets, readOnly = false }) => {
    // Generate layout from widgets prop
    // We treat 'widgets' as the single source of truth to avoid de-sync.
    // We only use local state if we need intermediate drag states, 
    // but RGL's 'layouts' prop can simpler be derived if we are careful.

    // However, for smooth dragging, RGL usually needs a stable 'layouts' object.
    const generatedLayout = useMemo(() => {
        return widgets.map(w => ({
            i: w.id,
            x: w.layout.x,
            y: w.layout.y,
            w: w.layout.w,
            h: w.layout.h,
            minW: 2,
            minH: 2
        }));
    }, [widgets]);

    const [layouts, setLayouts] = useState({ lg: generatedLayout });
    const { width, ref: containerRef } = useContainerWidth();

    // Sync state when props change (e.g. initial load, or external update)
    useEffect(() => {
        setLayouts({ lg: generatedLayout });
    }, [generatedLayout]);

    const handleLayoutChange = (currentLayout, allLayouts) => {
        setLayouts(allLayouts);
    };

    const onLayoutStop = (layout) => {
        const updatedWidgets = widgets.map(w => {
            const l = layout.find(item => item.i === w.id);
            if (l) {
                return {
                    ...w,
                    layout: { x: l.x, y: l.y, w: l.w, h: l.h }
                };
            }
            return w;
        });
        setWidgets(updatedWidgets);
    }

    const handleContentChange = (id, newContent) => {
        const updatedWidgets = widgets.map(w =>
            w.id === id ? { ...w, content: newContent } : w
        );
        setWidgets(updatedWidgets);
    };

    const removeWidget = (id) => {
        setWidgets(widgets.filter(w => w.id !== id));
    };

    return (
        // FORCE OVERFLOW-Y SCROLL to prevent scrollbar toggle loop
        <div className="w-full min-h-[500px] overflow-x-hidden overflow-y-scroll" ref={containerRef}>
            <Responsive
                className="layout min-h-[500px] rounded-xl"
                layouts={layouts}
                width={width}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={30}
                onLayoutChange={handleLayoutChange}
                onDragStop={onLayoutStop}
                onResizeStop={onLayoutStop}
                isDraggable={!readOnly}
                isResizable={!readOnly}
                margin={[10, 10]}
                containerPadding={[20, 20]}
                useCSSTransforms={true}
                draggableHandle=".grid-drag-handle"
            >
                {widgets.map(widget => (
                    <div key={widget.id} className="relative group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg transition-colors flex flex-col">

                        {!readOnly && (
                            <div className="absolute top-0 left-0 w-full h-6 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-start px-1 pt-1 pointer-events-none">
                                {/* DRAG HANDLE */}
                                <div className="grid-drag-handle cursor-grab active:cursor-grabbing bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-200 rounded px-2 shadow-sm pointer-events-auto hover:bg-slate-200">
                                    <span className="material-icons-outlined text-sm">drag_indicator</span>
                                </div>
                                {/* DELETE BUTTON */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeWidget(widget.id);
                                    }}
                                    className="p-0.5 bg-white text-red-500 rounded shadow-md hover:bg-red-50 dark:bg-slate-700 pointer-events-auto"
                                    title="Remove Item"
                                >
                                    <span className="material-icons-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}

                        <div className="h-full w-full overflow-hidden flex-grow" onMouseDown={e => e.stopPropagation()}>
                            {/* Content Render */}
                            {widget.type === 'text' && (
                                <TextWidget
                                    id={widget.id}
                                    content={widget.content}
                                    onChange={handleContentChange}
                                    readOnly={readOnly}
                                />
                            )}
                            {widget.type === 'image' && (
                                <ImageWidget url={widget.content} readOnly={readOnly} />
                            )}
                            {widget.type === 'video' && (
                                <VideoWidget url={widget.content} />
                            )}
                        </div>
                    </div>
                ))}
            </Responsive>
        </div>
    );
};

export default GridEditor;
