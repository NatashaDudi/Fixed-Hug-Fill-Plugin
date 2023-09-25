function changeAutolayoutResizing(t,i,e,o){"NONE"!=t.layoutMode&&("fix"==e||"fill"==e&&!i?fix(t,!0):"hug"==e?hug(t,!0):"fill"==e&&i&&fill(t,!0),"fix"==o||"fill"==o&&!i?fix(t,!1):"hug"==o?hug(t,!1):"fill"==o&&i&&fill(t,!1))}function changeShapeResizing(t,i,e,o,n){"fix"==o?"NONE"!=i.layoutMode&&(i.layoutSizingHorizontal="FIXED"):"hug"==o&&"TEXT"==t.type?hasAutolayoutCharacteristics(i)&&"NONE"!=e.layoutMode&&"GROUP"!=t.parent.type&&(i.layoutSizingHorizontal="HUG"):"fill"==o&&"NONE"!=e.layoutMode&&"AUTO"==i.layoutPositioning&&"GROUP"!=t.parent.type&&(i.layoutSizingHorizontal="FILL"),"fix"==n?"NONE"!=i.layoutMode&&(i.layoutSizingVertical="FIXED"):"hug"==n&&"TEXT"==t.type?hasAutolayoutCharacteristics(i)&&"GROUP"!=t.parent.type&&(i.layoutSizingVertical="HUG"):"fill"==n&&"NONE"!=e.layoutMode&&"AUTO"==i.layoutPositioning&&"GROUP"!=t.parent.type&&(i.layoutSizingVertical="FILL")}function fix(t,i){fixOrStretch(t,i,!0),fixOrHug(t,i,!0)}function hug(t,i){fixOrStretch(t,i,!0),fixOrHug(t,i,!1)}function fill(t,i){fixOrStretch(t,i,!1),fixOrHug(t,i,!0)}function fixOrHug(t,i,e){var o;o=e?"FIXED":"AUTO",i?"HORIZONTAL"==t.layoutMode?t.primaryAxisSizingMode=o:"VERTICAL"==t.layoutMode&&(t.counterAxisSizingMode=o):"VERTICAL"==t.layoutMode?t.primaryAxisSizingMode=o:"HORIZONTAL"==t.layoutMode&&(t.counterAxisSizingMode=o)}function fixOrStretch(t,i,e){var o,n,a=t.parent;e?(o=0,n="INHERIT"):(o=1,n="STRETCH"),i?"HORIZONTAL"==a.layoutMode?t.layoutGrow=o:"VERTICAL"==a.layoutMode&&(t.layoutAlign=n):"VERTICAL"==a.layoutMode?t.layoutGrow=o:"HORIZONTAL"==a.layoutMode&&(t.layoutAlign=n)}function checkSelectionType(t){if(0==t.length)return figma.closePlugin("You need to select something to use this plugin."),!1;for(var i in t)if("FRAME"!=t[i].type&&"COMPONENT"!=t[i].type&&"INSTANCE"!=t[i].type&&"COMPONENT_SET"!=t[i].type)return figma.closePlugin("You need to select frames, components or instances to use this plugin."),!1;return!0}function hasAutolayoutCharacteristics(t){return"NONE"!=t.layoutMode&&"AUTO"==t.layoutPositioning}checkSelectionType(figma.currentPage.selection)&&figma.showUI(__html__,{width:400,height:300,title:"Fixed-Hug-Fill"}),figma.ui.onmessage=(t=>{if("start"===t.type){var i=figma.currentPage.selection;if(checkSelectionType(i))for(var e in i){var o=i[e];if(changeAutolayoutResizing(o,!1,t.width,t.height),"children"in o){var n=o.findAll();for(var a of n){var l=a;"FRAME"==a.type||"INSTANCE"==a.type||"COMPONENT"==a.type||"COMPONENT_SET"==a.type?changeAutolayoutResizing(a,!0,t.width,t.height):"TEXT"!=a.type&&"RECTANGLE"!=a.type&&"GROUP"!=a.type&&"ELLIPSE"!=a.type&&"LINE"!=a.type&&"POLYGON"!=a.type&&"STAR"!=a.type&&"VECTOR"!=a.type||changeShapeResizing(a,l,a.parent,t.width,t.height)}}}figma.closePlugin()}else figma.closePlugin()});