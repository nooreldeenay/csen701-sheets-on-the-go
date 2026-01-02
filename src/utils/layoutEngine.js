
// Basic heuristics for height calculation
// A4 height is roughly 297mm. Let's work in px or "units".
// A safe print height per column is around 1000-1200px depending on font size.
// Let's assume 2 columns per page.

const COLUMNS_PER_PAGE = 2; // 2 columns
const PAGE_HEIGHT_PX = 1122; // A4 @ 96 DPI (approx). Let's be conservative: 1000px safe area.
const SAFE_HEIGHT = 1085; // ~287mm (297mm - 3mm padding - margins). Prevents "3rd column" overflow.

// Estimate height of a module
const estimateHeight = (submodule, fontSize = 10) => {
    // scale relative to default 10px
    const scale = fontSize / 10;

    let baseHeight = 14; // Safer overhead to prevent column overflow

    if (submodule.type === 'text') {
        const charsPerLine = Math.floor(55 / scale); // Conservative wrapping
        const lines = Math.ceil(submodule.content.length / Math.max(1, charsPerLine));
        baseHeight += lines * (13 * scale); // Taller lines
    } else if (submodule.type === 'image') {
        baseHeight += (fontSize * 16);
    } else if (submodule.type === 'formula') {
        baseHeight += 38 * scale;
    } else if (submodule.type === 'code') {
        const lines = submodule.content.split('\n').length;
        baseHeight += lines * (13 * scale); // Safer code block height
    } else if (submodule.type === 'row') {
        // Estimate height of a row container
        const numItems = submodule.content.length || 1;
        const widthFactor = numItems;
        const heights = submodule.content.map(subItem => {
            // When in a row, width is divided, so height increases for text/code
            let h = estimateHeight(subItem, fontSize);
            if (subItem.type === 'text' || subItem.type === 'code') {
                // Width factor adjustment
                h = h * (0.8 * widthFactor);
            }
            return h;
        });
        baseHeight = Math.max(...heights, 18);
    }

    return baseHeight;
};

export const getFlattenedItems = (modules, selectedIds, weights, itemOrder = []) => {
    const selectedItems = [];
    const itemMap = new Map(); // Build a map of id -> item for ordering

    modules.forEach(mod => {
        if (mod.submodules) {
            mod.submodules.forEach(sub => {
                if (selectedIds.has(sub.id)) {
                    // Simplify parent title
                    let conciseParent = (sub.parentTitle || mod.title).split(' - ')[0];
                    const isTutorial = (mod.title || "").toLowerCase().includes('tutorial');
                    const isLecture = (mod.title || "").toLowerCase().includes('lecture');
                    const prefix = isTutorial ? 'T' : (isLecture ? 'L' : '');

                    conciseParent = conciseParent
                        .replace(/T\/L\s+/i, prefix)
                        .replace(/Tutorial\s+/i, 'T')
                        .replace(/Lecture\s+/i, 'L')
                        .replace(/Tut\s+/i, 'T')
                        .replace(/Lec\s+/i, 'L')
                        .trim();

                    const item = {
                        ...sub,
                        parentTitle: conciseParent,
                        weight: weights[sub.id] || 10
                    };
                    itemMap.set(sub.id, item);
                }
            });
        }
    });

    // If itemOrder is provided and has items, use it to order the results
    if (itemOrder && itemOrder.length > 0) {
        itemOrder.forEach(id => {
            if (itemMap.has(id)) {
                selectedItems.push(itemMap.get(id));
            }
        });
        // Add any items that might be in selectedIds but not in itemOrder (edge case)
        itemMap.forEach((item, id) => {
            if (!itemOrder.includes(id)) {
                selectedItems.push(item);
            }
        });
    } else {
        // Fallback to map order if no itemOrder provided
        itemMap.forEach(item => selectedItems.push(item));
    }

    return selectedItems;
};

export const calculateLayout = (modules, selectedIds, weights, measuredHeights = {}, itemOrder = []) => {
    // 1. Flatten selected submodules
    // Note: We used to do this here, but now we assume we might want them separate. 
    // Actually, let's reuse the helper for consistency, OR expect the caller to pass flattened items?
    // To keep API simple, we'll call the helper, but then map estimateHeight on top.

    const baseItems = getFlattenedItems(modules, selectedIds, weights, itemOrder);

    // 2. Add Heights
    const sizedItems = baseItems.map(item => ({
        ...item,
        estimatedHeight: measuredHeights[item.id]
            ? measuredHeights[item.id]
            : estimateHeight(item, item.weight)
    }));

    // 3. Preserve user order instead of sorting by height
    // Use the order from itemOrder (already applied in getFlattenedItems)
    const orderedItems = sizedItems;

    // Define 4 discrete columns (Bin Packing)
    // 2 Pages * 2 Columns/Page = 4 Columns
    const MAX_COLS = 4;
    const columns = Array(MAX_COLS).fill(null).map(() => ({
        currentH: 0,
        items: []
    }));
    const overflow = [];

    orderedItems.forEach(item => {
        let placed = false;
        // Try to fit in the first available column bin (First Fit)
        // This naturally fills earlier gaps because we process columns 0..3 for every item.
        for (let c = 0; c < MAX_COLS; c++) {
            if (columns[c].currentH + item.estimatedHeight <= SAFE_HEIGHT) {
                columns[c].items.push(item);
                columns[c].currentH += item.estimatedHeight;
                placed = true;
                break;
            }
        }

        if (!placed) {
            overflow.push({ ...item, isOverflow: true });
        }
    });

    // 3. Reconstruct Pages
    // Page 1 contains items from Col 0 and Col 1
    // Page 2 contains items from Col 2 and Col 3
    const pages = [
        { id: 1, items: [...columns[0].items, ...columns[1].items] },
        { id: 2, items: [...columns[2].items, ...columns[3].items] }
    ];

    return { pages, overflow };
};
