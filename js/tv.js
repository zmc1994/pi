document.addEventListener("DOMContentLoaded",() => {
    const topFive =  document.getElementById("topFive");
    const topTen = document.getElementById("topTen");
    const secondList = document.getElementsByClassName("titleWrap")[1];
    // 获取排行榜,10s刷新一次
    setInterval(function () {
        getList();
    },10000);
    function getList() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                let listArr = JSON.parse(xhr.responseText);
                let len = listArr.length;
                let fiveElement = "";
                let tenElement = "";
                for(let i = 0;i < len;i++){
                    let listNum = i+1;
                    if(i < 5 ){
                        secondList.style.display = "none";
                        fiveElement += '<li><span class="ranking">'+listNum+'</span><span class="name">'+listArr[i].name+'</span><span class="totalNumber">'+listArr[i].score+'</span></li>';
                    }else{
                        secondList.style.display = "block";
                        tenElement += '<li><span class="ranking">'+listNum+'</span><span class="name">'+listArr[i].name+'</span><span class="totalNumber">'+listArr[i].score+'</span></li>';
                    }
                }
                topFive.innerHTML = fiveElement;
                topTen.innerHTML = tenElement;
            }
        };
        xhr.open("GET","http://47.101.11.24:8088/api/leader-board.php",true);
        xhr.send();
    }
    getList();
});