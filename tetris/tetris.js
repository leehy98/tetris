import Blocks from "./blocks.js"

//dom

const playground = document.querySelector(".playground > ul");

//setting
const game_rows = 20;
const game_cols = 10;


//val
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;



const MovingItem = {
    type: "tree",
    direction: 1,
    top: 0,
    left: 0,
};

init()

//functions
function init(){
    tempMovingItem = { ...MovingItem  } ;
    for(let i = 0; i < game_rows; i++){
        prependNewLine()
    }
    renderBlocks()
}

function prependNewLine() {
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        for(let j = 0; j < game_cols; j++){
            const matrix = document.createElement("li");
            ul.prepend(matrix);
        }
        li.prepend(ul)
        playground.prepend(li)
}

function renderBlocks(moveType=""){
    const {type, direction, top, left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type,"moving");
    })
    Blocks[type][direction].some(block => {
        const x = block[0]+left;
        const y = block[1]+top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
             target.classList.add(type,"moving")
        }else{
            tempMovingItem = { ...MovingItem }
            setTimeout(() => {
                renderBlocks();
                if(moveType === "top"){
                    seizeBlock();
                }

            },0)
            return true;
        }

    })
    MovingItem.left = left;
    MovingItem.top = top;
    MovingItem.direction = direction;
}
function seizeBlock(){
     const movingBlocks = document.querySelectorAll(".moving");
        movingBlocks.forEach(moving => {
            moving.classList.remove("moving");
            moving.classList.add("seized");
        })
        generateNewBlock()
}
function generateNewBlock(){

    clearInterval(downInterval) ;
    downInterval = setInterval(()=>{

    })

    const blockArray = Object.entries(Blocks);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    MovingItem.type = blockArray[randomIndex][0]
    MovingItem.top = 0;
    MovingItem.left = 3;
    MovingItem.direction = 0;
    tempMovingItem = { ...MovingItem };
    renderBlocks();
}


function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}

function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}


//event handling
document.addEventListener("keydown",e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left",1);
                break;
        case 37:
             moveBlock("left",-1);
                break;
        case 40:
            moveBlock("top",  1);
                break;
        case 38 :
            changeDirection();
                break;
        default:
                break;
    }
   // console.log(e)
})