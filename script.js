readTextFile("plover.json", function(text){
	ploverData = JSON.parse(text);
});
const searchBox = document.getElementById("search");
const resultBox = document.getElementById("resultBox")
const linebreak = document.createElement("br");

searchBox.addEventListener("input", updateResults);

function updateResults(event) {
	resultBox.innerHTML = "";

	if (searchBox.value == "") return;
	else results = ploverData[searchBox.value];

	if (!results) {
		resultBox.innerHTML = "<div class='result' style='text-align: center;'>No Results</div>";
		return;
	}

	// adding results to page
	for (let i in smartSort(results)) {
		let container = document.createElement("div");
		container.classList.add("result");

		let div1 = document.createElement("div");
		div1.classList.add("collapsible");
		div1.innerText = results[i];
		container.appendChild(div1);

		let div2 = document.createElement("div");
		div2.classList.add("content");

		let boardresults = generateBoards(results[i]);
		// if (boardresults.length > 1) {
		// 	let firstboard = generateBoards(results[i])[0];
		// 	firstboard.style.padding = "0 2px"
		// 	firstboard.children[0].style.transform = "scale(0, 0)";
		// 	firstboard.style.width = "0px";
		// 	firstboard.style.height = "0px";
		// 	div2.appendChild(firstboard);
		// }
		for (let board of boardresults) {
			div2.appendChild(board);
		}
		container.appendChild(div2);

		resultBox.appendChild(container);
	}

	let resultArray = document.getElementsByClassName("collapsible");
	for (let rslt of resultArray) {
		collapseResult(rslt);
	}
	if (resultArray[0]) expandResult(resultArray[0], noTransition=true);

	for (let i=0; i<resultArray.length; i++) {
		resultArray[i].addEventListener("click", function(e) {
			if (this.nextElementSibling.style.height) {
				collapseResult(this);
			}
			else {
				for (let r=0; r<resultArray.length; r++) {
					if (resultArray[r].classList.contains("active")) collapseResult(resultArray[r]);
				}
				expandResult(this);
			}
		});
	}
}

function expandResult(result, noTransition=false) {
	let content = result.nextElementSibling;
	let container = content.children[0];
	let firstboard = container.children[0];
	if (noTransition) {
		result.classList.add("notransition");
		content.classList.add("notransition");
		container.classList.add("notransition");
		firstboard.classList.add("notransition");
	}
	for (let b of content.children) {
		b.children[0].style.transform = "scale(0.5, 0.5)";
		b.style.width = boardwidth*0.5 + "px";
		b.style.height = boardheight*0.5 + "px";
	}
	firstboard.style.transform = "scale(1, 1)";
	container.style.width = boardwidth + "px";
	container.style.height = boardheight + "px";
	content.style.height = "202px";
	result.style.fontSize = "150%";
	result.classList.add("active");

	if (noTransition) setTimeout(function() {
		result.classList.remove("notransition");
		content.classList.remove("notransition");
		container.classList.remove("notransition");
		firstboard.classList.remove("notransition");
	}, 10);
}

function collapseResult(result) {
	let content = result.nextElementSibling;
	let container = content.children[0];
	let firstboard = container.children[0];
	for (let b of content.children) {
		b.children[0].style.transform = "scale(0.33, 0.33)";
		b.style.width = boardwidth*0.3 + "px";
		b.style.height = boardheight*0.3 + "px";
	}
	// if (content.children.length > 1) {
	// 	firstboard.style.transform = "scale(0, 0)";
	// 	container.style.width = "0px";
	// 	container.style.height = "0px";
	// }
	content.style.height = null;
	result.style.fontSize = "100%";
	result.classList.remove("active");
}

function smartSort(results) {
	results.sort((a, b) => a.replace("-", "").replace("*", "**").length - b.replace("-", "").replace("*", "**").length);
	results.sort((a, b) => a.split("/").length - b.split("/").length);
	return results;
}


// https://stackoverflow.com/a/34579496
function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
}
