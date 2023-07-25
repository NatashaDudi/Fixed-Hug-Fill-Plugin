/* This plugin allows you to select multiple objects from which all layers will be effected
on how to change the width or height settings (no change, to 'fixed', 'hug' or 'fill')*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if (figma.currentPage.selection.length == 0) {
    figma.closePlugin("You need to select something to use this plugin.");
}
else {
    figma.showUI(__html__, { width: 400, height: 300, title: "Fixed-Hug-Fill" });
}
// use message from UI to do the following:
figma.ui.onmessage = msg => {
    if (msg.type === 'start') {
        var selection = figma.currentPage.selection;
        if (selection.length == 0) {
            figma.closePlugin("You need to select something to use this plugin.");
        }
        else {
            let fontNames = new Set();
            // Gather all selected TextNodes
            var textNodes = [];
            for (var i = 0; i < selection.length; i++) {
                var frameNode = selection[i];
                var textNodeList = frameNode.findAll(n => (n.type == "TEXT"));
                for (var j = 0; j < textNodeList.length; j++) {
                    textNodes.push(textNodeList[j]);
                }
            }
            // Gather all fonts from the TextNodes
            for (var i = 0; i < textNodes.length; i++) {
                if (!fontNames.has(textNodes[i].fontName)) {
                    fontNames.add(textNodes[i].fontName);
                }
            }
            // Get allowance to use fonts
            const loadFonts = () => __awaiter(this, void 0, void 0, function* () {
                for (let fontName of fontNames) {
                    yield figma.loadFontAsync({ family: fontName['family'], style: fontName["style"] });
                }
            });
            // Start to update table
            loadFonts().then(() => {
                figma.closePlugin("made it");
            });
            /*
                        let fontNames = new Set<FontName>()
            
                        // Gather all selected TextNodes
                        var textNodes: TextNode[] = []
                        for (var i = 0; i < selection.length; i++) {
                            var frameNode = selection[i] as FrameNode
                            var textNodeList = frameNode.findAll(n => (n.type == "TEXT"))
                            for (var j = 0; j < textNodeList.length; j++) {
                                textNodes.push(textNodeList[j] as TextNode)
                            }
                        }
            
                        // Gather all fonts from the TextNodes
                        for (var i = 0; i < textNodes.length; i++) {
                            if (!fontNames.has(textNodes[i].fontName as FontName)) {
                                fontNames.add(textNodes[i].fontName as FontName)
                            }
                        }
            
                        // Get allowance to use fonts
                        const loadFonts = async () => {
                            for (let fontName of fontNames) {
                                await figma.loadFontAsync({ family: fontName['family'], style: fontName["style"] })
                            }
                        }
            
                        // Start to update table
                        loadFonts().then(() => {
                            // loop over all selected objects
                            for (var i in selection) {
                                var currentNode = selection[i]
                                changeAlignProperties(currentNode as AutolayoutFrame, false, msg.width, msg.height)
            
                                if ('children' in currentNode) {
                                    var childrenNodes = currentNode.findAll()
            
                                    for (var child of childrenNodes) {
                                        var parent = child.parent as FrameNode
                                        if (child.type == 'ELLIPSE' || child.type == 'GROUP' || child.type == 'RECTANGLE') {
                                            console.log("get here?");
                                            parent.primaryAxisAlignItems = 'MAX'
                                            parent.counterAxisAlignItems = 'MAX'
                                        } else if (child.type == "TEXT") {
                                            console.log("get to Text");
                                            var textNode = child as TextNode
                                            textNode.textAlignHorizontal = 'RIGHT'
                                            parent.primaryAxisAlignItems = 'MAX'
                                            parent.counterAxisAlignItems = 'MAX'
                                        } else if (child.type == 'FRAME' || child.type == 'COMPONENT' || child.type == 'INSTANCE') {
                                            changeAlignProperties(child as AutolayoutFrame, true, msg.width, msg.height)
                                        }
                                    }
                                }
                            }
                            figma.closePlugin();
                        })*/
        }
        figma.closePlugin();
    }
    else {
        // user pressed cancel
        figma.closePlugin();
    }
};
function changeAlignProperties(node, isChild, msgWidth, msgHeight) {
    // if width has to be changed to fixed or this is the outermost node that will have filled children
    if (msgWidth == 'fix' || (msgWidth == 'fill' && !isChild)) {
        // than we change the width setting to 'fixed'
        fix(node, true);
    }
    else if (msgWidth == 'hug') {
        hug(node, true);
    }
    else if (msgWidth == 'fill' && isChild) {
        fill(node, true);
    }
    // if height has to be changed to fixed or this is the outermost node that will have filled children
    if (msgHeight == 'fix' || (msgHeight == 'fill' && !isChild)) {
        // than we change the height setting to 'fixed'
        fix(node, false);
    }
    else if (msgHeight == 'hug') {
        hug(node, false);
    }
    else if (msgHeight == 'fill' && isChild) {
        fill(node, false);
    }
}
// method to either change the width or height setting to 'Fixed'
function fix(node, isForWidth) {
    changeLayout(node, isForWidth, true);
    changeAlignmentSizingMode(node, isForWidth, true);
}
// method to either change the width or height setting to 'Hug'
function hug(node, isForWidth) {
    changeLayout(node, isForWidth, true);
    changeAlignmentSizingMode(node, isForWidth, false);
}
//method to either change the width or height setting to 'Fill'
function fill(node, isForWidth) {
    changeLayout(node, isForWidth, false);
    changeAlignmentSizingMode(node, isForWidth, true);
}
function changeAlignmentSizingMode(node, isForWidth, isFixed) {
    var changeSetting;
    if (isFixed) {
        changeSetting = 'FIXED';
    }
    else {
        changeSetting = 'AUTO';
    }
    // changes width settings
    if (isForWidth) {
        if (node.layoutMode == 'HORIZONTAL') {
            node.primaryAxisSizingMode = changeSetting;
        }
        else if (node.layoutMode == 'VERTICAL') {
            node.counterAxisSizingMode = changeSetting;
        }
    }
    else {
        // changes height settings
        if (node.layoutMode == 'VERTICAL') {
            node.primaryAxisSizingMode = changeSetting;
        }
        else if (node.layoutMode == 'HORIZONTAL') {
            node.counterAxisSizingMode = changeSetting;
        }
    }
}
function changeLayout(node, isForWidth, isFixed) {
    var parent = node.parent;
    var changeSetting;
    var changeSetting2;
    if (isFixed) {
        changeSetting = 0;
        changeSetting2 = 'INHERIT';
    }
    else {
        changeSetting = 1;
        changeSetting2 = 'STRETCH';
    }
    // changes width settings
    if (isForWidth) {
        if (parent.layoutMode == 'HORIZONTAL') {
            node.layoutGrow = changeSetting;
        }
        else if (parent.layoutMode == 'VERTICAL') {
            node.layoutAlign = changeSetting2;
        }
    }
    else {
        //changes height settings
        if (parent.layoutMode == 'VERTICAL') {
            node.layoutGrow = changeSetting;
        }
        else if (parent.layoutMode == 'HORIZONTAL') {
            node.layoutAlign = changeSetting2;
        }
    }
}
