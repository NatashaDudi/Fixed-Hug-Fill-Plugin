// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// import Papa from "papaparse";
// documentation: https://www.npmjs.com/package/papaparse


// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 300, title: "Fixed-Hug-Fill" });

  
figma.ui.onmessage = msg => {
	console.log(msg);

	if (msg.type === 'start') {

		if(figma.currentPage.selection.length == 0) {
			figma.closePlugin("You need to select something to use this plugin.");
		}

		// do the following code with all selected objects
		for (var i in figma.currentPage.selection) {
			var currentNode = figma.currentPage.selection[i]
			/* change current node. 
			When 'fix' or 'filled' the current node always has to be fixed
			whereas with 'hug' it is also set to 'hug'. */
			var node = currentNode as FrameNode
			switch (msg.width) {
				case 'fix':
					if (node.layoutMode == 'VERTICAL') {
						node.counterAxisSizingMode = 'FIXED'
						console.log("get here")
					} else {
						node.primaryAxisSizingMode = 'FIXED'
					}

				break
				case 'hug':
					if (node.layoutMode == 'VERTICAL') {
						node.counterAxisSizingMode = 'AUTO'
					} else {
						node.primaryAxisSizingMode = 'AUTO'
					}
				break
				case 'fill':
					if (node.layoutMode == 'VERTICAL') {
						node.counterAxisSizingMode = 'FIXED'
					} else {
						node.primaryAxisSizingMode = 'FIXED'
					}
				break
				case '':
					break
				default:
			}

			switch (msg.height) {
				case 'fix':
					if (node.layoutMode == 'HORIZONTAL') {
						node.counterAxisSizingMode = 'FIXED'
						console.log("get here")
					} else {
						node.primaryAxisSizingMode = 'FIXED'
					}

				break
				case 'hug':
					if (node.layoutMode == 'HORIZONTAL') {
						node.counterAxisSizingMode = 'AUTO'
					} else {
						node.primaryAxisSizingMode = 'AUTO'
					}
				break
				case 'fill':
					
					if (node.layoutMode == 'HORIZONTAL') {
						node.counterAxisSizingMode = 'FIXED'
					} else {
						node.primaryAxisSizingMode = 'FIXED'
					}
				break
				case '':
					break
				default:
			}

			// look at all children of the selected node
			if ('children' in currentNode) {
				var childrenNodes = currentNode.findAll()
				// making sure all frames are 'fix' before 'fill' or 'hug'
				if(msg.width == 'fill' || msg.width == 'hug') {
					for (var child of childrenNodes) {
						if ((msg.width == 'fill' && child.type == 'FRAME' || child.type == 'COMPONENT' || child.type == 'INSTANCE')) {
							if (child.layoutMode == 'VERTICAL') {
								child.counterAxisSizingMode = 'FIXED'
								child.layoutGrow = 0
							} else {
								child.primaryAxisSizingMode = 'FIXED'
								
							}
							child.layoutAlign = 'INHERIT'

						} else if (msg.width == 'hug' && (child.type == 'FRAME' /*|| child.type == "COMPONENT" || child.type == 'INSTANCE'*/)) {
							if (child.layoutMode == 'HORIZONTAL') {
								child.counterAxisSizingMode = 'FIXED'
								child.layoutGrow = 0
								
							} else {
								child.primaryAxisSizingMode = 'FIXED'
							}
							child.layoutAlign = 'INHERIT'
							
							
						}

					}
				}
				if(msg.height == 'fill' || msg.width == 'hug') {
					for (var child of childrenNodes) {
						if (msg.height == 'fill' && (child.type == 'FRAME' || child.type == 'COMPONENT' || child.type == 'INSTANCE')) {
							if (child.layoutMode == 'HORIZONTAL') {
								child.counterAxisSizingMode = 'FIXED'
								child.layoutGrow = 0
							} else {
								child.primaryAxisSizingMode = 'FIXED'
								
							}
							child.layoutAlign = 'INHERIT'
						} else if (msg.height == 'hug' && (child.type == 'FRAME' || child.type == 'COMPONENT' || child.type == 'INSTANCE')) {
							if (child.layoutMode == 'VERTICAL') {
								child.counterAxisSizingMode = 'FIXED'
								child.layoutGrow = 0
								
							} else {
								child.primaryAxisSizingMode = 'FIXED'
								
							}
							child.layoutAlign = 'INHERIT'
						}
					}
				}


				// iterate over all children
				for (var child of childrenNodes) {

					// cast them to their given type to use methods 'layoutAlign' and 'layoutGrow'
					if(child.type == 'FRAME' || child.type == 'COMPONENT' || child.type == 'INSTANCE') {
						var childNode;
						switch(child.type) {
							case 'FRAME':
								childNode = child as FrameNode
							break
							case 'COMPONENT':
								childNode = child as ComponentNode
							break
							case 'INSTANCE':
								childNode = child as InstanceNode
							break
							default:
						}

						// check what width alignment is wished for and change settings according to that wish
						switch (msg.width) {
							case 'fix':
								
								if (childNode.layoutMode == 'VERTICAL') {
									childNode.counterAxisSizingMode = 'FIXED'
									childNode.layoutGrow = 0
								} else {
									childNode.primaryAxisSizingMode = 'FIXED'
									
								}
								childNode.layoutAlign = 'INHERIT'	
							break
							case 'hug':
								if (childNode.layoutMode == 'VERTICAL') {
									childNode.counterAxisSizingMode = 'AUTO'
								} else {
									childNode.primaryAxisSizingMode = 'AUTO'
								}
							break
							case 'fill':
								switch(childNode.parent.type) {
									case 'FRAME':
										var parent = childNode.parent as FrameNode
									break /*
									case 'COMPONENT':
										var parent = childNode.parent as ComponentNode
									break
									case 'INSTANCE':
										var parent = childNode.parent as InstanceNode
									break
									default:*/
								}
								if (parent.layoutMode == 'HORIZONTAL') {
									
									childNode.layoutGrow = 1
								} else {
									
									childNode.layoutAlign = 'STRETCH'
								}
							break
							case '':
								break
							default:
						}

						// check what height alignment is wished for and change settings according to that wish
						switch (msg.height) {
							case 'fix':
								if (childNode.layoutMode == 'HORIZONTAL') {
									childNode.counterAxisSizingMode = 'FIXED'
									childNode.layoutGrow = 0
								} else {
									childNode.primaryAxisSizingMode = 'FIXED'
									
								}
								childNode.layoutAlign = 'INHERIT'
							break
							case 'hug':
								if (childNode.layoutMode == 'HORIZONTAL') {
									childNode.counterAxisSizingMode = 'AUTO'
								} else {
									childNode.primaryAxisSizingMode = 'AUTO'
								}
							break
							case 'fill':
								switch(childNode.parent.type) {
									case 'FRAME':
										var parent = childNode.parent as FrameNode
									break /*
									case 'COMPONENT':
										var parent = childNode.parent as ComponentNode
									break
									case 'INSTANCE':
										var parent = childNode.parent as InstanceNode
									break
									default:*/
								}
								if (parent.layoutMode == 'VERTICAL') {
									childNode.layoutGrow = 1
								} else {
									childNode.layoutAlign = 'STRETCH'
								}
							break
							case '':
								break
							default:
						}
						// FOR FURTHER DEVELOPMENT: Line underneath to test for nodes of type 'TEXT'
					} /*else if (child.type == 'TEXT') {
						var childNode2 = child as TextNode

						switch (msg.width) {
							case 'fix':
								childNode2.layoutAlign = 'INHERIT'
							break
							case 'hug':
								childNode2.layoutAlign = 'MIN'
							break
							case 'fill':
								childNode2.layoutAlign = 'STRETCH'
							break
							case '':
								break
							default:
						}

						switch (msg.height) {
							case 'fix':
								childNode2.layoutGrow = 0
							break
							case 'hug':

							break
							case 'fill':
								childNode2.layoutGrow = 1
							break
							case '':
								break
							default:
							}
					}*/
				}
			}
		}
		figma.closePlugin(msg.width);
	} else {
		// user pressed cancel
		figma.closePlugin();
	}
};

