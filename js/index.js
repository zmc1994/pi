document.addEventListener("DOMContentLoaded", () => {

    const welcomePage = document.getElementById('welcomePage');
    const introducePage = document.getElementById('introducePage');
    const studyPage = document.getElementById('studyPage');
    const playPage = document.getElementById('playPage');
    const resultPage = document.getElementById("resultPage");
    const uploadPage = document.getElementById("uploadPage");
    const failPage = document.getElementById("failPage");
    const chartsPage = document.getElementById("chartsPage");

    const startBtn = document.getElementById('startBtn');
    const timeNumber = document.getElementById("timeNumber");
    const playTime = document.getElementById("playTime");
    const studyMs = document.getElementById("study-ms");
    const playMs = document.getElementById("play-ms");
    const timeOver = document.getElementById("timeOver");
    const inputWrong = document.getElementById("inputWrong");
    const correctNumber = document.getElementById("correctNumber");
    const hideNumber = document.getElementById("hideNumber");
    const otherGameResult = document.getElementById("otherGameResult");
    const gameResult = document.getElementById("gameResult");


    welcomePage.onclick = (e) => {
        e.target.className = 'page inactive';
        introducePage.className = 'page active';
    };
    startBtn.onclick = (e) => {
        let parentNodeEle = e.target["parentNode"];
        parentNodeEle["parentNode"].className = 'page inactive';
        studyPage.classList.add('active');
        // 记忆页面倒计时
        let rememberCount = 8;
        let msNumber = 99;
        let timer = setInterval(function () {
            msNumber--;
            if(msNumber < 10){
                studyMs.innerText = "0" + msNumber;
            }else {
                studyMs.innerText = msNumber;
            }
            if(msNumber <= 0 ){
                rememberCount--;
                timeNumber.innerText = '0'+rememberCount;
                msNumber = 99;
                if(rememberCount <= 0){
                    clearInterval(timer);
                    studyPage.className = 'page inactive';
                    playPage.classList.add('active');
                    playPageTime();
                }
            }
        },10)
    };
    //游戏页面倒计时
    let playTimer = "";
    function playPageTime() {
        let playCount = 15;
        let msNumber = 99;
        playTimer = setInterval(function () {
            msNumber--;
            if(msNumber < 10){
                playMs.innerText = "0" + msNumber;
            }else {
                playMs.innerText = msNumber;
            }
            if(msNumber <= 0 ){
                playCount--;
                if(playCount < 10){
                    playTime.innerText = '0'+playCount;
                }else{
                    playTime.innerText = playCount;
                }
                msNumber = 99;
                if(playCount <= 0){
                    let correctNum = hideNumber.innerText.length;
                    clearInterval(playTimer);
                    correctNumber.innerText = correctNum;
                    timeOver.style.display = "block";
                    inputWrong.style.display = "none";
                    playPage.className = 'page inactive';
                    resultPage.classList.add('active');
                    //游戏正常结束判断是否进入排行榜，跳转到游戏结束页面
                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if(xhr.readyState == 4 && xhr.status == 200 ){
                            // do something
                            let result = JSON.parse(xhr.responseText);
                            let id = result.id;
                            let rank = result.rank;
                            if(rank <= 10){
                                setTimeout(function () {
                                    gameResult.innerText = rank;
                                    resultPage.className = 'page inactive';
                                    uploadPage.classList.add("active");
                                    uploadRank(id);
                                }, 2000);
                            }else{
                                setTimeout(function () {
                                    otherGameResult.innerText = rank;
                                    resultPage.className = 'page inactive';
                                    failPage.classList.add("active");
                                }, 2000);
                            }
                        }
                    };
                    xhr.open("GET","http://47.101.11.24:8088/api/save-score.php?score="+correctNum,true);
                    xhr.send();
                }
            }
        },10)
    }
    // Play page elements
    (function playGame() {
        const numberBtns = document.getElementById('number-pad').querySelectorAll('span');
        const inputNums = document.getElementById('inputNumber').querySelectorAll('span');
        const checkString = "1592653589793238462643383279502884197169399375105820974944592307816406";
        const failTime = document.getElementById("failTime");
        const failNumber = document.getElementById("failNumber");
        let inputCount = 0;
        numberBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                inputCount++;
                let number = e.target.innerHTML;
                inputNums[inputCount].innerText = number;
                hideNumber.innerHTML += number;
                if (checkString.indexOf(hideNumber.innerHTML) === 0) {
                    console.log(true); // 输入正确
                } else {
                    console.log(false);
                    clearInterval(playTimer);
                    let alreadyInputNum = inputCount-1;//输入正确个数
                    let alreadyTime = 15-parseInt(playTime.innerText);//游戏时间
                    console.log(alreadyInputNum,alreadyTime);
                    failTime.innerText = alreadyTime;
                    failNumber.innerText = alreadyInputNum;

                    timeOver.style.display = "none";
                    inputWrong.style.display = "block";
                    playPage.className = 'page inactive';
                    resultPage.classList.add('active');
                    //输入错误游戏结束判断是否进入排行榜，跳转到游戏结束页面
                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if(xhr.readyState == 4 && xhr.status == 200 ){
                            // do something
                            let result = JSON.parse(xhr.responseText);
                            let id = result.id;
                            let rank = result.rank;
                            if(rank <= 10){
                                setTimeout(function () {
                                    gameResult.innerText = rank;
                                    resultPage.className = 'page inactive';
                                    uploadPage.classList.add("active");
                                    uploadRank(id);
                                }, 2000);
                            }else{
                                setTimeout(function () {
                                    otherGameResult.innerText = rank;
                                    resultPage.className = 'page inactive';
                                    failPage.classList.add("active");
                                }, 2000);
                            }
                        }
                    };
                    xhr.open("GET","http://47.101.11.24:8088/api/save-score.php?score="+alreadyInputNum,true);
                    xhr.send();
                }
            })
        });
    })();
    //top10提交姓名
    function uploadRank(id) {
        const upBtn = document.getElementById("upBtn");
        const nameInput = document.getElementsByClassName("nameInput")[0];
        upBtn.onclick = function () {
            let nameVal = nameInput.value;
            console.log(nameVal);
            if(nameVal != ""){
                //提交分数，姓名给后台，进入排行榜页面
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if(xhr.readyState == 4 && xhr.status == 200 ){
                        // do something
                        getListRank();
                        uploadPage.className = 'page inactive';
                        chartsPage.classList.add("active");
                    }
                };
                xhr.open("GET","http://47.101.11.24:8088/api/save-name.php?id="+id+"&name="+nameVal,true);
                xhr.send();
            }
        };
    }
    //获取排行榜
    function getListRank(){
        const listRank = document.getElementById("listRank");
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200){
                let listArr = JSON.parse(xhr.responseText);
                let len = listArr.length;
                let listElement = "";
                for(let i = 0;i < len;i++){
                    let listNum = i+1;
                    listElement += '<li class="clear"><span class="listNum">'+listNum+'</span><span class="listName">'+listArr[i].name+'</span><span class="listRanking">'+listArr[i].score+'</span></li>';
                }
                listRank.innerHTML = listElement;
            }
        };
        xhr.open("GET","http://47.101.11.24:8088/api/leader-board.php",true);
        xhr.send();
    }
    chartsPage.onclick = (e) => {
        // chartsPage.className = 'page inactive';
        // welcomePage.className = 'page active';
        window.location.reload();
    };
    failPage.onclick = (e) => {
        // failPage.className = 'page inactive';
        // welcomePage.className = 'page active';
        window.location.reload();
    };



    // Page turning controller

    // const pages = document.querySelectorAll('.page');
    // pages.forEach(function(page, key) {
    //     if (key < 3) {
    //         page.onclick = (e) => {
    //             e.target.className = 'page inactive';
    //             pages[key + 1].classList.add('active');
    //         }
    //     }
    // });
});