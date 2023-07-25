/* This plugin allows you to select multiple objects from which all layers will be effected 
on how to change the width or height settings (no change, to 'fixed', 'hug' or 'fill')*/

// create a type that includes all types that have autolayout
type AutolayoutFrame = FrameNode | ComponentNode | InstanceNode
type NoAutolayoutFrame = EllipseNode | GroupNode | LineNode | PolygonNode | RectangleNode | TextNode | VectorNode

if (figma.currentPage.selection.length == 0) {
	figma.closePlugin("You need to select something to use this plugin.");
} else {
	figma.showUI(__html__, { width: 400, height: 300, title: "Fixed-Hug-Fill" });
}


// use message from UI to do the following:
figma.ui.onmessage = msg => {
	if (msg.type === 'start') {
		var selection = figma.currentPage.selection
		if (selection.length == 0) {
			figma.closePlugin("You need to select something to use this plugin.");
		} else {

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
				figma.closePlugin("made it");
			})

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
	} else {
		// user pressed cancel
		figma.closePlugin();
	}
};

function changeAlignProperties(node: AutolayoutFrame, isChild: Boolean, msgWidth: String, msgHeight: String) {

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

// method to either change the width or height setting to 'Fixed'
function fix(node: AutolayoutFrame, isForWidth: Boolean) {
	changeLayout(node, isForWidth, true)
	changeAlignmentSizingMode(node, isForWidth, true)
}

// method to either change the width or height setting to 'Hug'
function hug(node: AutolayoutFrame, isForWidth: Boolean) {
	changeLayout(node, isForWidth, true)
	changeAlignmentSizingMode(node, isForWidth, false)
}

//method to either change the width or height setting to 'Fill'
function fill(node: AutolayoutFrame, isForWidth: Boolean) {
	changeLayout(node, isForWidth, false)
	changeAlignmentSizingMode(node, isForWidth, true)
}

type FixedAuto = 'FIXED' | 'AUTO'

function changeAlignmentSizingMode(node: AutolayoutFrame, isForWidth: Boolean, isFixed: Boolean) {
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

function changeLayout(node: AutolayoutFrame, isForWidth: Boolean, isFixed: Boolean) {
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

