/* This plugin allows you to select multiple objects from which all layers will be effected
on how to change the width or height settings (no change, to 'fixed', 'hug' or 'fill')*/
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 300, title: "Fixed-Hug-Fill" });
// use message from UI to do the following:
figma.ui.onmessage = msg => {
    if (msg.type === 'start') {
        if (figma.currentPage.selection.length == 0) {
            figma.closePlugin("You need to select something to use this plugin.");
        }
        // loop over all selected object
        for (var i in figma.currentPage.selection) {
            var currentNode = figma.currentPage.selection[i];
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
        figma.closePlugin();
    }
    else {
        // user pressed cancel
        figma.closePlugin();
    }
};
function changeAlignProperties(sceneNode, isChild, msgWidth, msgHeight) {
    var node = sceneNode;
    /*
    // was used to typecast but it seems as if that is not neccesary anymore...
    switch (sceneNode.type) {
        case 'FRAME':
            node = sceneNode as FrameNode
        break
        case 'COMPONENT':
            node = sceneNode as ComponentNode
        break
        case 'INSTANCE':
            node = sceneNode as InstanceNode
        break
        default:
            return
    }*/
    // if width has to be changed to fixed or this is the outermost node that will have filled children
    if (msgWidth == 'fix' || (msgWidth == 'fill' && !isChild)) {
        // than we change the width setting to 'fixed'
        fix(sceneNode, true);
    }
    else if (msgWidth == 'hug') {
        hug(sceneNode, true);
    }
    else if (msgWidth == 'fill' && isChild) {
        fill(sceneNode, true);
    }
    // if height has to be changed to fixed or this is the outermost node that will have filled children
    if (msgHeight == 'fix' || (msgHeight == 'fill' && !isChild)) {
        // than we change the height setting to 'fixed'
        fix(sceneNode, false);
    }
    else if (msgHeight == 'hug') {
        hug(sceneNode, false);
    }
    else if (msgHeight == 'fill' && isChild) {
        fill(sceneNode, false);
    }
}
// method to either change the width or height setting to 'Fixed'
function fix(sceneNode, isForWidth) {
    var node = sceneNode;
    // changes width settings
    if (isForWidth) {
        if (node.layoutMode == 'HORIZONTAL') {
            node.primaryAxisSizingMode = 'FIXED';
        }
        else {
            node.counterAxisSizingMode = 'FIXED';
        }
    }
    else {
        //changes height settings
        if (node.layoutMode == 'VERTICAL') {
            node.primaryAxisSizingMode = 'FIXED';
        }
        else {
            node.counterAxisSizingMode = 'FIXED';
        }
    }
    getAlignmentFill(node, isForWidth);
}
// method to either change the width or height setting to 'Hug'
function hug(sceneNode, isForWidth) {
    var node = sceneNode;
    // changes width settings
    if (isForWidth) {
        if (node.layoutMode == 'HORIZONTAL') {
            node.primaryAxisSizingMode = 'AUTO';
        }
        else {
            node.counterAxisSizingMode = 'AUTO';
        }
    }
    else {
        // changes height settings
        if (node.layoutMode == 'VERTICAL') {
            node.primaryAxisSizingMode = 'AUTO';
        }
        else {
            node.counterAxisSizingMode = 'AUTO';
        }
    }
    getAlignmentFill(node, isForWidth);
}
//method to either change the width or height setting to 'Fill'
function fill(sceneNode, isForWidth) {
    var node = sceneNode;
    var parentNode = sceneNode.parent;
    if (isForWidth) {
        if (node.layoutMode == 'HORIZONTAL') {
            node.primaryAxisSizingMode = 'FIXED';
        }
        else {
            node.counterAxisSizingMode = 'FIXED';
        }
    }
    else {
        //changes height settings
        if (node.layoutMode == 'VERTICAL') {
            node.primaryAxisSizingMode = 'FIXED';
        }
        else {
            node.counterAxisSizingMode = 'FIXED';
        }
    }
    // changes width settings
    if (isForWidth) {
        if (parentNode.layoutMode == 'VERTICAL') {
            node.layoutAlign = 'STRETCH';
        }
        else {
            node.layoutGrow = 1;
        }
    }
    else {
        //changes height settings
        if (parentNode.layoutMode == 'HORIZONTAL') {
            node.layoutAlign = 'STRETCH';
        }
        else {
            node.layoutGrow = 1;
        }
    }
}
// method to determine whether the width or height propoerty was set to 'filled' before changing it
function getAlignmentFill(sceneNode, isForWidth) {
    var parent = sceneNode.parent;
    var node = sceneNode;
    if (parent.layoutMode == 'VERTICAL') {
        if (isForWidth) {
            node.layoutAlign = 'INHERIT';
        }
        else {
            node.layoutGrow = 0;
        }
    }
    if (parent.layoutMode == 'HORIZONTAL') {
        if (!isForWidth) {
            node.layoutAlign = 'INHERIT';
        }
        else {
            node.layoutGrow = 0;
        }
    }
}
