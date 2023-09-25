/* This plugin allows you to select multiple objects from which all layers will be effected 
on how to change the width or height settings (no change, to 'fixed', 'hug' or 'fill')*/

// create a type that includes all types that have autolayout
type AutolayoutFrame = FrameNode | ComponentNode | InstanceNode | ComponentSetNode
type FixedHugFill = AutolayoutFrame | TextNode

if (checkSelectionType(figma.currentPage.selection)) {
	figma.showUI(__html__, { width: 400, height: 300, title: "Fixed-Hug-Fill" });
}

// use message from UI to do the following:
figma.ui.onmessage = msg => {
	if (msg.type === 'start') {
		if (msg.ignore_hidden) {
			figma.skipInvisibleInstanceChildren = true
		}
		var selection = figma.currentPage.selection
		if (checkSelectionType(selection)) {

			// loop over all selected objects
			for (var i in selection) {
				var currentNode = selection[i]
				changeAutolayoutResizing(currentNode as AutolayoutFrame, false, msg.width, msg.height)
				if ('children' in currentNode) {
					var childrenNodes

					// ignore hidden nodes if requested (this is faster)
					if (msg.ignore_hidden) {
						childrenNodes = currentNode.findAll(node => node.visible === true)
					} else {
						childrenNodes = currentNode.findAll()
					} 

					// get all children from the selected node and categorise them by type
					for (var child of childrenNodes) {
						var childFrame = child as FrameNode

						if (child.type == 'FRAME' || child.type == 'INSTANCE' || child.type == 'COMPONENT' || child.type == 'COMPONENT_SET') {
							changeAutolayoutResizing(child as AutolayoutFrame, true, msg.width, msg.height)
						} else if (child.type ==  'TEXT') {
							changeShapeResizing(child, childFrame, child.parent as FrameNode, msg.width, msg.height)
						} else if (msg.include_shapes && (child.type == 'RECTANGLE' || child.type == 'GROUP' || child.type == 'ELLIPSE' || child.type == 'LINE' || child.type == 'POLYGON' || child.type == 'STAR' || child.type == 'VECTOR')) {
							changeShapeResizing(child, childFrame, child.parent as FrameNode, msg.width, msg.height)
						} 
					}
				}
			}
		}
		figma.closePlugin();
	} else {
		// user pressed cancel
		figma.closePlugin();
	}
};

function changeAutolayoutResizing(node: AutolayoutFrame, isChild: Boolean, msgWidth: String, msgHeight: String) {

	if (node.layoutMode == 'NONE') {
		return
	}

	// if width has to be changed to fixed or this is the outermost node that will have filled children
	if (msgWidth == 'fix' || (msgWidth == 'fill' && !isChild)) {
		// than we change the width setting to 'fixed'
		fix(node, true)
	} else if (msgWidth == 'hug') {
		hug(node, true)
	} else if (msgWidth == 'fill' && isChild) {
		fill(node, true)
	}

	// if height has to be changed to fixed or this is the outermost node that will have filled children
	if (msgHeight == 'fix' || (msgHeight == 'fill' && !isChild)) {
		// than we change the height setting to 'fixed'
		fix(node, false)
	} else if (msgHeight == 'hug') {
		hug(node, false)
	} else if (msgHeight == 'fill' && isChild) {
		fill(node, false)
	}

}

function changeShapeResizing(child: SceneNode, childFrame: FrameNode, parent: FrameNode, msgWidth: String, msgHeight: String) {
	if (msgWidth == 'fix') {
		if (childFrame.layoutMode != 'NONE') {
			childFrame.layoutSizingHorizontal = 'FIXED'
		}
	} else if (msgWidth == 'hug' && child.type == 'TEXT') {
		if (hasAutolayoutCharacteristics(childFrame) && parent.layoutMode != 'NONE' && child.parent.type != 'GROUP') {
			childFrame.layoutSizingHorizontal = 'HUG'
		}
	} else if (msgWidth == 'fill') {
		if (parent.layoutMode != 'NONE' && childFrame.layoutPositioning == 'AUTO' && child.parent.type != 'GROUP') {
			childFrame.layoutSizingHorizontal = 'FILL'
		}
	}

	if (msgHeight == 'fix') {
		if (childFrame.layoutMode != 'NONE') {
			childFrame.layoutSizingVertical = 'FIXED'
		}
	} else if (msgHeight == 'hug' && child.type == 'TEXT') {
		if (hasAutolayoutCharacteristics(childFrame) && child.parent.type != 'GROUP') {
			childFrame.layoutSizingVertical = 'HUG'
		}
	} else if (msgHeight == 'fill') {
		if (parent.layoutMode != 'NONE' && childFrame.layoutPositioning == 'AUTO' && child.parent.type != 'GROUP') {
			childFrame.layoutSizingVertical = 'FILL'
		}
	}
}

// method to either change the width or height setting to 'Fixed'
function fix(node: AutolayoutFrame, isForWidth: Boolean) {
	fixOrStretch(node, isForWidth, true)
	fixOrHug(node, isForWidth, true)
}

// method to either change the width or height setting to 'Hug'
function hug(node: AutolayoutFrame, isForWidth: Boolean) {
	fixOrStretch(node, isForWidth, true)
	fixOrHug(node, isForWidth, false)
}

//method to either change the width or height setting to 'Fill'
function fill(node: AutolayoutFrame, isForWidth: Boolean) {
	fixOrStretch(node, isForWidth, false)
	fixOrHug(node, isForWidth, true)
}

type FixedAuto = 'FIXED' | 'AUTO'

function fixOrHug(node: AutolayoutFrame, isForWidth: Boolean, isFixed: Boolean) {
	var changeSetting: FixedAuto
	if (isFixed) {
		changeSetting = 'FIXED'
	} else {
		changeSetting = 'AUTO'
	}

	// changes width settings
	if (isForWidth) {
		if (node.layoutMode == 'HORIZONTAL') {
			node.primaryAxisSizingMode = changeSetting
		} else if (node.layoutMode == 'VERTICAL') {
			node.counterAxisSizingMode = changeSetting
		}

	} else {
		// changes height settings
		if (node.layoutMode == 'VERTICAL') {
			node.primaryAxisSizingMode = changeSetting
		} else if (node.layoutMode == 'HORIZONTAL') {
			node.counterAxisSizingMode = changeSetting
		}
	}
}

type StretchInheritOptions = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT'

function fixOrStretch(node: AutolayoutFrame, isForWidth: Boolean, isFixed: Boolean) {
	var parent = node.parent as AutolayoutFrame
	var changeSetting
	var changeSetting2: StretchInheritOptions
	if (isFixed) {
		changeSetting = 0
		changeSetting2 = 'INHERIT'
	} else {
		changeSetting = 1
		changeSetting2 = 'STRETCH'
	}

	// changes width settings
	if (isForWidth) {
		if (parent.layoutMode == 'HORIZONTAL') {
			node.layoutGrow = changeSetting
		} else if (parent.layoutMode == 'VERTICAL') {
			node.layoutAlign = changeSetting2
		}
	} else {
		//changes height settings
		if (parent.layoutMode == 'VERTICAL') {
			node.layoutGrow = changeSetting
		} else if (parent.layoutMode == 'HORIZONTAL') {
			node.layoutAlign = changeSetting2
		}
	}
}

function checkSelectionType(selection: readonly SceneNode[]) {
	if (selection.length == 0) {
		figma.closePlugin("You need to select something to use this plugin.");
		return false
	}

	for (var i in selection) {
		if (selection[i].type != 'FRAME' && selection[i].type != 'COMPONENT' && selection[i].type != 'INSTANCE' && selection[i].type != 'COMPONENT_SET') {
			figma.closePlugin("You need to select frames, components or instances to use this plugin.");
			return false
		}
	}
	return true
}

function hasAutolayoutCharacteristics(node: FrameNode) {
	return (node.layoutMode != 'NONE' && node.layoutPositioning == 'AUTO')
}
