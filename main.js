const score = document.querySelector('.score'),
      game = document.querySelector('.game'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div');
      car.classList.add('car');
      const windows = document.querySelector('.window');
      const autoArrey = ['enemy', 'enemy2'];
      const scoreArrey = [];  
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0, //очки
    speed: 3,
    traffic: 3
}
// console.log(document.documentElement.clientHeight);
// console.log(getQuantyElement(100 * setting.traffic));
// console.log(getQuantyElement(50));
function getQuantyElement(heightElement){
    return document.documentElement.clientHeight / heightElement;
    
}
// console.log(getQuantyElement(50));

function startGame(){
    start.classList.add('head');
    gameArea.innerHTML = '';
    car.style.bottom = '110px';
    car.style.top = 'auto';

    for(let i = 0; i < getQuantyElement(50) + 1; i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.y = 100 * i;
        line.style.top =  line.y + 'px';
        // console.log(line.y);
        gameArea.appendChild(line);
    }

    // console.log(getQuantyElement(100 * setting.traffic));

    for(let i = 0; i < getQuantyElement(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        // console.log(enemy.y);
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url("./image/${autoArrey[Math.floor(Math.random()*autoArrey.length)]}.png") center / cover no-repeat`;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        gameArea.appendChild(enemy);
    }
        setting.score = 0;
        setting.start = true;
        gameArea.appendChild(car);
        car.style.left = (gameArea.offsetWidth/2 - car.offsetWidth/2) + 'px';
        setting.x = car.offsetLeft;
        setting.y = car.offsetTop;

        requestAnimationFrame(playGame);
}

function playGame(){
        setting.score += setting.speed;
        // console.log(setting.score);
        score.innerHTML = 'SCORE: ' + setting.score;
        
    if(setting.start){
        windows.classList.remove('active'); 
        moveRoad();
        moveEnemy();
        loadTrack();
        requestAnimationFrame(playGame); //рекурсия - цикличное выполнение одного действия
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }
        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }
        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
    }
    else{
        +localStorage.setItem('current', setting.score);
        let currentNum = +setting.score;
        // console.log(currentNum);
        scoreArrey.push(currentNum);
        let maxNum = Math.max.apply(null, scoreArrey);
    //    console.log(scoreArrey);
        if(currentNum === maxNum && currentNum !== scoreArrey[0]){
            windows.classList.add('active');
            windows.innerHTML = 'Вы побили свой предыдущий рекорд: ' + localStorage.getItem('max');
        }
        +localStorage.setItem('max', maxNum);
        
    }
  
}
function startRun(event){
    // event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    // event.preventDefault();
    keys[event.key] = false;
}

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item){
        item.y += setting.speed;
        item.style.top = item.y + 'px';
        if(item.y >= document.documentElement.clientHeight){
            item.y = -100;
            item.style.top = item.y + 'px';
        }
    })
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >=enemyRect.top){
                setting.start = false;
                console.warn('ДТП')

                start.classList.remove('head');
                start.style.top = 20 + 'px';
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if(item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';

        }
    })
}

// Музыкальное сопровождение
const audioPlayer = document.querySelector('.audio-player');
function loadTrack(){
    audioPlayer.play();
    if(setting.start == false){
        audioPlayer.pause();
    }
}

// Сложноть уровни
const button = document.querySelector('.button');
const level = document.querySelectorAll('.level');

const selectButton = (elem) => {
    level.forEach(item => item.classList.remove('active'));
    elem.classList.add('active');
}
// console.log(button);
button.addEventListener('click', event => {
    const target = event.target;
    const parent = target.closest('.level');
   
    console.log(target);
  
    if(target.className === 'level complicated'){
       setting.traffic = +1;
       console.log(setting);
    }
    if(target.className === 'level middle'){
        setting.traffic = +2;
        console.log(setting);
     }
     if(target.className === 'level easy'){
        setting.traffic = +3;
        console.log(setting);
     } 
      selectButton(parent);
})


