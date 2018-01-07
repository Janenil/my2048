var board = new Array();
var score = 0;
var hasConflictd = new Array();

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if(documentWidth>500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	
	
	$("#grid-container").css('width', gridContainerWidth-2*cellSpace);
	$("#grid-container").css('height', gridContainerWidth-2*cellSpace);
	$("#grid-container").css('padding', cellSpace);
	$("#grid-container").css('border-radius', 0.02*gridContainerWidth);
	
	$(".grid-cell").css('width', cellSideLength);
	$(".grid-cell").css('height', cellSideLength);
	$(".grid-cell").css('border-radius', 0.02*cellSideLength);
	
}

function newgame(){
	//初始化操作
	init();
	//在随机两个格子生成2/4
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i = 0;i < 4;i++){
		for(var j = 0;j < 4;j++){
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css('top',getPosTop( i , j ));
			gridCell.css('left',getPosLeft(i , j));
			
		}
	}
	
	for(var i = 0 ; i < 4 ; i++){
		board[i] = new Array();
		hasConflictd[i] = new Array();
		for(var j = 0 ; j < 4 ; j++){
			board[i][j] = 0;
			hasConflictd[i][j] = false;
		}
	}
	
	updateBorderView();
	
	score = 0;
}
//根据border的值对number-cell进行操作
function updateBorderView(){
	$(".number-cell").remove();
	
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0; j < 4 ; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+ i +'-'+ j +'"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j);
			
			if(board[i][j] == 0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
				
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			
			hasConflictd[i][j] = false;
		}
	}
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

//随机找一个空闲的格子生成数
function generateOneNumber(){
	if(nospace(board))
	   return false;
	
	
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));
	
	var times = 0;
	while(times < 50){
		if(board[randx][randy] == 0)
			break;
		
		randx = parseInt(Math.floor(Math.random()*4));
		randy = parseInt(Math.floor(Math.random()*4));
		times++;
	}
	
	if(times == 50){
		for(var i = 0;i < 4;i++){
			for(var j = 0;j < 4;j++){
				if(board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}
		}
	}
	
	//随机生成数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	
	//随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	
	
	return true;
}

$(document).keydown(function(event){
	//阻止所有event默认效果
//	event.preventDefault();
	switch(event.keyCode){
		case 37://left
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38://up
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39://right
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40://down
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
});


document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

//touchmove

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltaX = endx - startx;
	var deltaY = endy - starty;
	
	if(Math.abs(deltaX) < 0.3*documentWidth && Math.abs(deltaY) < 0.3*documentWidth ) return;
	//x轴
	if(Math.abs(deltaX) >= Math.abs(deltaY)){
		if(deltaX > 0){
			//right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			//left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}else{
		
		//y轴
		if(deltaY>0){
			//down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{
			//up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}
});


function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	alert("gameover!");
}

function moveLeft(){
	if(!canMoveLeft(board)) return false;
	
	//moveleft
	for(var i = 0;i<4;i++){
		for(var j = 1;j<4;j++){
			if(board[i][j] != 0){
				for(var k = 0;k < j;k++){
					if(board[i][k] == 0 && noBlockHorizontal(i , k , j , board)){
						//move
						showMoveAnimation(i , j , i , k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i , k , j , board) && !hasConflictd[i][k]){
						//move
						showMoveAnimation(i , j , i , k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						
						//score
						score += board[i][k];
						updateScore(score);
						
						hasConflictd[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBorderView()",200);
	return true;
}

function moveUp(){
	if( !canMoveUp(board)) return false;
	
	//moveup
		for(var i = 1;i < 4;i++){
			for(var j = 0;j < 4;j++){
				if(board[i][j] != 0){
					for(var k = 0;k < i;k++){
						if(board[k][j] == 0 && noBlockHorizontalY(j,k,i,board)){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockHorizontalY(j,k,i,board) && !hasConflictd[k][j]){
							showMoveAnimation(i,j,k,j);
							board[k][j] += board[i][j];
							board[i][j] = 0;
						
							//score
							score += board[k][j];
							updateScore(score);
							hasConflictd[k][j] = true;
							continue;
						}
					}
				}
			}
		}
	setTimeout("updateBorderView()",200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)) return false;
	
		//moveright
	for(var i = 0;i<4;i++){
		for(var j = 2;j >=0;j--){
			if(board[i][j] != 0){
				for(var k = 3;k >j;k--){
					if(board[i][k] == 0 && noBlockHorizontal(i , j , k, board)){
						//move
						showMoveAnimation(i , j , i , k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i , j, k, board) && !hasConflictd[i][k]){
						//move
						showMoveAnimation(i , j , i , k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						
						//score
						score += board[i][k];
						updateScore(score);
						
						hasConflictd[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBorderView()",200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board)) return false;
	
	for(var i = 2;i >= 0;i--){
		for(var j = 0;j < 4;j++){
			if(board[i][j] != 0){
				for(var k = 3;k > i;k--){
					if(board[k][j] == 0 && noBlockHorizontalY(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j] == board[i][j] && noBlockHorizontalY(j,i,k,board) && !hasConflictd[k][j]){
							showMoveAnimation(i,j,k,j);
							board[k][j] += board[i][j];
							board[i][j] = 0;
						
							//score
							score += board[k][j];
							updateScore(score);
							hasConflictd[k][j] = true;
							continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBorderView()",200);
	return true;
}
