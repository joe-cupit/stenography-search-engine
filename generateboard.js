const keywidth = 35;
const keyheight = 55;
const boardwidth = (keywidth+5)*10+10;
const boardheight = (keyheight+5)*3+5;

function getBoardDict(chord) {
	let boardDict = {};

	boardDict["left-*"] = false;
	if (chord.includes("*")) {
		boardDict["left-*"] = true;
		chord = chord.replace("*", "");
	}

	for (let c of "STKPWHRAO") {
		if (chord[0] == "-") {
			chord = chord.substring(1);
			break;
		}
		let key = "left-" + c;
		if (chord[0] == c) {
			boardDict[key] = true;
			chord = chord.substring(1);
		}
		else boardDict[key] = false;
	}
	for (let c of "EUFRPBLGTSDZ") {
		let key = "right-" + c;
		if (chord[0] == c) {
			boardDict[key] = true;
			chord = chord.substring(1);
		}
		else boardDict[key] = false;
	}

	return boardDict;
}

function individualBoard(chord) {
	const boardCanvas = document.createElement("canvas");
	boardCanvas.classList.add("stenoBoard");
	boardCanvas.width = boardwidth;
	boardCanvas.height = boardheight;
	const ctx = boardCanvas.getContext("2d");
	ctx.font = keywidth-1 + "px Tahoma";
	ctx.textAlign = "center";

	let side = "left-";
	let row = 0;
	let col = 0;

	let boardDict = getBoardDict(chord);

	for (var c of "STPH*/FPLTD+ KWR /RBGSZ+AO/EU") {
		if (c == " ") {
			col += 1;
			continue;
		}
		if (c == "/") {
			side = "right-";
			continue;
		}
		if (c == "+") {
			side = "left-";
			row += 1;
			col = 0;
			continue;
		}

		// colours for key
		ctx.strokeStyle = "#0c0b12";
		if (boardDict[side+c]) ctx.fillStyle = "#716aba";
		else ctx.fillStyle = "#1b1a26";

		let x = col*(keywidth+5)+3;
		let y = row*(keyheight+5)+3;
		if (row == "2") {
			x += keywidth*2.75;
			y += 5;
			if (side == "right-") x += keywidth*0.45;
		}
		else {
			if (c == "*") x += 5;
			else if (side == "right-") x += 10;
		}

		let textx = x + keywidth/2;
		let texty = y + 2*keyheight/3;
		if ((c == "S" && side == "left-") || c == "*") {
			ctx.roundRect(x, y, keywidth, 5+keyheight*2, 5);  // taller keys
			texty += 2*keyheight/3;
		}
		else ctx.roundRect(x, y, keywidth, keyheight, 5);   // normal keys

		ctx.fill();
		ctx.stroke();

		// colours for text
		if (boardDict[side+c]) ctx.fillStyle = "white";
		else ctx.fillStyle = "#d1cef2";
		ctx.fillText(c, textx, texty);

		col += 1;
	}
	return boardCanvas;
}

function generateBoards(chords) {
	let canvasArray = new Array();
	chords.split("/").forEach(item => {
		let bdiv = document.createElement("div");
		bdiv.appendChild(individualBoard(item));
		bdiv.classList.add("boardContainer");
		bdiv.style.width = boardwidth + "px";
		bdiv.style.height = boardheight + "px";

		canvasArray.push(bdiv);
	});

	return canvasArray;
}


// https://stackoverflow.com/a/7838871
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
}
