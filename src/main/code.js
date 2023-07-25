/* This plugin allows you to select multiple objects from which all layers will be effected
on how to change the width or height settings (no change, to 'fixed', 'hug' or 'fill')*/
if (figma.currentPage.selection.length == 0) {
    figma.closePlugin("You need to select something to use this plugin 3.");
}
else {
    figma.showUI(__html__, { width: 400, height: 300, title: "Fixed-Hug-Fill" });
}
// use message from UI to do the following:
figma.ui.onmessage = msg => {
    if (msg.type === 'start') {
        var selection = figma.currentPage.selection;
        if (selection.length == 0) {
            //figma.closePlugin("You need to select something to use this plugin.");
        }
        else {
            // loop over all selected objects
            for (var i in selection) {
                var currentNode = selection[i];
                changeAlignProperties(currentNode, false, msg.width, msg.height);
                if ('children' in currentNode) {
                    var childrenNodes = currentNode.findAll();
                    for (var child of childrenNodes) {
                        if (child.type == 'FRAME' || child.type == 'COMPONENT' || child.type == 'INSTANCE') {
                            changeAlignProperties(child, true, msg.width, msg.height);
                        }
                    }
                }
            }
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
