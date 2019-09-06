document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelectorAll(".addbtn");
    const name = document.getElementsByClassName("name");
    const number = document.getElementsByClassName("number");
    const resEle = document.getElementsByClassName("result");
    btn.forEach(function (btn,key) {
        btn.onclick = function () {
            let nameVal = name[key].value;
            let numVal = number[key].value;
            if(nameVal != "" && numVal != ""){
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if(xhr.readyState == 4 && xhr.status == 200 ){
                        // do something
                        let result = JSON.parse(xhr.responseText);
                        let id = result.id;
                        xhr.onreadystatechange = function () {
                            if(xhr.readyState == 4 && xhr.status == 200 ){
                                console.log("添加成功");
                                resEle[key].innerText = "添加成功";
                            }
                        };
                        xhr.open("GET","http://47.101.11.24:8088/api/save-name.php?id="+id+"&name="+nameVal,true);
                        xhr.send();
                    }
                };
                xhr.open("GET","http://47.101.11.24:8088/api/save-score.php?score="+numVal,true);
                xhr.send();
            }

        }
    })
});