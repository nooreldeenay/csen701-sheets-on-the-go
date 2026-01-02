
// Basic heuristics for height calculation
// A4 height is roughly 297mm. Let's work in px or "units".
// A safe print height per column is around 1000-1200px depending on font size.
// Let's assume 2 columns per page.

const COLUMNS_PER_PAGE = 2; // 2 columns
const PAGE_HEIGHT_PX = 1122; // A4 @ 96 DPI (approx). Let's be conservative: 1000px safe area.
const SAFE_HEIGHT = 1050;
const COL_WIDTH_MM = 90; // Approx

// Estimate height of a module
// Estimate height of a module
const estimateHeight = (submodule, fontSize = 10) => {
    // scale relative to default 10px
    const scale = fontSize / 10;

    let baseHeight = 40; // Title + Padding (approx constant)

    if (submodule.type === 'text') {
        // Rough estimate: 1 line = 20px at 10px font. 
        // 50 chars per line at 10px. 
        // If font implies larger width, fewer chars per line.
        // Let's approximate: line height scales with font size.
        const charsPerLine = Math.floor(50 / scale);
        const lines = Math.ceil(submodule.content.length / Math.max(1, charsPerLine));
        baseHeight += lines * (14 * scale);
    } else if (submodule.type === 'image') {
        // Image height we set to fontSize * 15 in render
        baseHeight += (fontSize * 15);
    } else if (submodule.type === 'formula') {
        baseHeight += 60 * scale;
    } else if (submodule.type === 'code') {
        const lines = submodule.content.split('\n').length;
        baseHeight += lines * (16 * scale);
    }

    return baseHeight;
};

export const calculateLayout = (modules, selectedIds, weights) => {
    // 1. Flatten selected submodules
    const selectedItems = [];

    modules.forEach(mod => {
        mod.submodules.forEach(sub => {
            if (selectedIds.has(sub.id)) {
                selectedItems.push({
                    ...sub,
                    parentTitle: mod.title,
                    weight: weights[sub.id] || 10,
                    estimatedHeight: estimateHeight(sub, weights[sub.id] || 10)
                });
            }
        });
    });

    // 2. Simple Bin Packing (First Fit Decreasing or just strictly sequential for order preservation?)
    // User probably wants order preserved (Lec 1 then Lec 2). So sequential.

    const pages = [
        { id: 1, columns: [[], []], currentColsH: [0, 0] },
        { id: 2, columns: [[], []], currentColsH: [0, 0] }
    ];

    const overflow = [];

    let currentPageIdx = 0;
    let currentColIdx = 0;

    selectedItems.forEach(item => {
        // Try to fit in current column
        let page = pages[currentPageIdx];

        if (!page) {
            overflow.push(item);
            return;
        }

        // Check if fits in current column
        if (page.currentColsH[currentColIdx] + item.estimatedHeight <= SAFE_HEIGHT) {
            page.columns[currentColIdx].push(item);
            page.currentColsH[currentColIdx] += item.estimatedHeight;
        } else {
            // Try next column
            currentColIdx++;
            if (currentColIdx >= COLUMNS_PER_PAGE) {
                // Next Page
                currentColIdx = 0;
                currentPageIdx++;
                page = pages[currentPageIdx];

                if (!page) {
                    overflow.push(item);
                    return;
                }
            }

            // Add to new column (assuming it fits on empty column, if not, it's too big, but we add it anyway effectively overflow visual)
            page.columns[currentColIdx].push(item);
            page.currentColsH[currentColIdx] += item.estimatedHeight;
        }
    });

    return { pages, overflow };
};
