figma.showUI(__html__,{width:400,height:300,title:"Fixed-Hug-Fill"}),figma.ui.onmessage=(i=>{if(console.log(i),"start"===i.type){for(var e in 0==figma.currentPage.selection.length&&figma.closePlugin("You need to select something to use this plugin."),figma.currentPage.selection){var o=figma.currentPage.selection[e],t=o;switch(i.width){case"fix":"VERTICAL"==t.layoutMode?(t.counterAxisSizingMode="FIXED",console.log("get here")):t.primaryAxisSizingMode="FIXED";break;case"hug":"VERTICAL"==t.layoutMode?t.counterAxisSizingMode="AUTO":t.primaryAxisSizingMode="AUTO";break;case"fill":"VERTICAL"==t.layoutMode?t.counterAxisSizingMode="FIXED":t.primaryAxisSizingMode="FIXED"}switch(i.height){case"fix":"HORIZONTAL"==t.layoutMode?(t.counterAxisSizingMode="FIXED",console.log("get here")):t.primaryAxisSizingMode="FIXED";break;case"hug":"HORIZONTAL"==t.layoutMode?t.counterAxisSizingMode="AUTO":t.primaryAxisSizingMode="AUTO";break;case"fill":"HORIZONTAL"==t.layoutMode?t.counterAxisSizingMode="FIXED":t.primaryAxisSizingMode="FIXED"}if("children"in o){var a=o.findAll();if("fill"==i.width||"hug"==i.width)for(var r of a)"fill"==i.width&&"FRAME"==r.type||"COMPONENT"==r.type||"INSTANCE"==r.type?"VERTICAL"==r.layoutMode?(r.counterAxisSizingMode="FIXED",r.layoutAlign="INHERIT"):(r.primaryAxisSizingMode="FIXED",r.layoutGrow=0):"hug"==i.width&&"FRAME"==r.type&&("HORIZONTAL"==r.layoutMode?r.counterAxisSizingMode="FIXED":r.primaryAxisSizingMode="FIXED");if("fill"==i.height||"hug"==i.width)for(var r of a)"fill"!=i.height||"FRAME"!=r.type&&"COMPONENT"!=r.type&&"INSTANCE"!=r.type?"fill"!=i.height||"FRAME"!=r.type&&"COMPONENT"!=r.type&&"INSTANCE"!=r.type||("VERTICAL"==r.layoutMode?(r.counterAxisSizingMode="FIXED",r.layoutAlign="INHERIT"):(r.primaryAxisSizingMode="FIXED",r.layoutGrow=0)):"HORIZONTAL"==r.layoutMode?(r.counterAxisSizingMode="FIXED",r.layoutAlign="INHERIT"):(r.primaryAxisSizingMode="FIXED",r.layoutGrow=0);for(var r of a)if("FRAME"==r.type||"COMPONENT"==r.type||"INSTANCE"==r.type){var l;switch(r.type){case"FRAME":case"COMPONENT":case"INSTANCE":l=r}switch(i.width){case"fix":l.layoutGrow=0,"VERTICAL"==l.layoutMode?l.counterAxisSizingMode="FIXED":l.primaryAxisSizingMode="FIXED",l.layoutAlign="INHERIT";break;case"hug":"VERTICAL"==l.layoutMode?l.counterAxisSizingMode="AUTO":l.primaryAxisSizingMode="AUTO";break;case"fill":switch(l.parent.type){case"FRAME":var n=l.parent}"HORIZONTAL"==n.layoutMode?l.layoutGrow=1:l.layoutAlign="STRETCH"}switch(i.height){case"fix":l.layoutGrow=0,"HORIZONTAL"==l.layoutMode?l.counterAxisSizingMode="FIXED":l.primaryAxisSizingMode="FIXED",l.layoutAlign="INHERIT";break;case"hug":"HORIZONTAL"==l.layoutMode?l.counterAxisSizingMode="AUTO":l.primaryAxisSizingMode="AUTO";break;case"fill":switch(l.parent.type){case"FRAME":n=l.parent}"VERTICAL"==n.layoutMode?l.layoutGrow=1:l.layoutAlign="STRETCH"}}}}figma.closePlugin(i.width)}else figma.closePlugin()});