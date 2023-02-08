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

		for (var i in figma.currentPage.selection) {
			var currentNode = figma.currentPage.selection[i]
			// change current node
			var node = currentNode as FrameNode
			switch (msg.width) {
				case 'fix':
					node.counterAxisSizingMode = 'FIXED'
					console.log("get here")
				break
				case 'hug':
					node.counterAxisSizingMode = 'AUTO'
					node.layoutAlign = 'INHERIT'
				break
				case 'fill':
					node.counterAxisSizingMode = 'FIXED'
				break
				case '':
					break
				default:
			}

			switch (msg.height) {
				case 'fix':
					node.primaryAxisSizingMode = 'FIXED'
					//childNode.layoutAlign = 'INHERIT'
					node.layoutGrow = 0
					console.log("get here2")
				break
				case 'hug':
					node.primaryAxisSizingMode = 'AUTO'
					node.layoutAlign = 'INHERIT'
				break
				case 'fill':
					node.primaryAxisSizingMode = 'FIXED'
					node.layoutGrow = 0

					//parent.layoutMode = 'VERTICAL'
					
				break
				case '':
					break
				default:
			}


			// look at all children of the selected node
			if ('children' in currentNode) {
				var childrenNodes = currentNode.findAll()


				// making sure all frames are "fix" before "fill"
				if(msg.width == 'fill') {
					for (var child of childrenNodes) {
						if (child.type == 'FRAME') {
							child.primaryAxisSizingMode = 'FIXED'
						}

					}
				}
				if(msg.height == 'fill') {
					for (var child of childrenNodes) {
						if (child.type == 'FRAME') {
							child.counterAxisSizingMode = 'FIXED'
						}

					}
				}


				for (var child of childrenNodes) {
					if(child.type == 'FRAME') {
						var childNode = child as FrameNode
						var parent = child.parent as FrameNode

						switch (msg.width) {
							case 'fix':
								childNode.layoutGrow = 0
								if (childNode.layoutMode == 'VERTICAL') {
									childNode.counterAxisSizingMode = 'FIXED'
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
								if (childNode.layoutMode == 'VERTICAL') {
									parent.primaryAxisSizingMode = 'FIXED'
									childNode.layoutGrow = 1
								} else {
									parent.counterAxisSizingMode = 'FIXED'
									childNode.layoutAlign = 'STRETCH'
								}

							break
							case '':
								break
							default:
						}

						switch (msg.height) {
							case 'fix':
								childNode.layoutGrow = 0
								if (childNode.layoutMode == 'HORIZONTAL') {
									childNode.counterAxisSizingMode = 'FIXED'
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
								if (childNode.layoutMode == 'HORIZONTAL') {
									parent.primaryAxisSizingMode = 'FIXED'
									childNode.layoutGrow = 1
								} else {
									parent.counterAxisSizingMode = 'FIXED'
									childNode.layoutAlign = 'STRETCH'
								}
								
							break
							case '':
								break
							default:
						}

						
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
