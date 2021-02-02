let cardData = [];
let areaData = [];
let min = 0;
let sec = 0;
let allSuits = ['spades', 'heart', 'diamonds', 'clubs'];
let test;
// { number: 1, suits: "spades", color: "black" }


function buildAll() { // 創造牌組  //可以改用餘數跟除法後無條件捨去的方式，一層for完成工作
    for (let i = 1; i <= 52; i++) {
        let num1 = (i % 13 == 0) ? Math.floor((i) / 13) - 1 : Math.floor((i) / 13);
        let num2 = (i % 13 == 0) ? 13 : (i % 13);
        let c;
        if (allSuits[num1] == 'spades' || allSuits[num1] == 'clubs') {
            c = 'black'
        } else {
            c = 'red'
        }
        cardData.push({
            number: num2,
            suits: allSuits[num1],
            color: c
        })
    }
};

function buildCardArea() { //根據所屬列取出相應牌數組成陣列
    let str = ''
    let len;
    for (let i = 0; i < 8; i++) {
        str = '';
        len = (i < 4) ? 7 : 6;
        for (let j = 0; j < len; j++) {
            let randomNum = parseInt(Math.random() * cardData.length); //取得隨機小於項數的隨機數(從0開始所以沒問題)
            let num = cardData[randomNum].number
            switch (true) { //解決AJQK的顯示問題
                case num > 10:
                    let text = ['J', 'Q', 'K']
                    num = text[num - 11]
                    break;
                case num == 1:
                    num = 'A'
                    break
                default:
                    num = num
                    break
            }
            //根據需求組字串
            str += `<div id="${cardData[randomNum].suits}_${cardData[randomNum].number}" class="card ${cardData[randomNum].suits}" style='top:${j * 50}px' data-color='${cardData[randomNum].color}'>
                <div class="card-top">
                    <p class="num">${num}</p>
                    <i class="iconfont icon-s icon-${cardData[randomNum].suits}"></i>
                </div>
                <div class="card-center">
                    <i class="iconfont icon-l icon-${cardData[randomNum].suits}"></i>
                </div>

                <div class="card-bottom"> <p class="num">${num}</p>
                <i class="iconfont icon-s icon-${cardData[randomNum].suits}"></i>
                </div>
            </div>`
            cardData.splice(randomNum, 1);
        }
        $(`#area${i + 1}`).html(str) //完成所有字串填入
    }
}

function time() {
    let minText = '';
    let secText = '';
    if (sec == 59) {
        sec = 0
        min += 1
    } else {
        sec += 1
    }
    minText = (min < 10) ? `0${min}` : min
    secText = (sec < 10) ? `0${sec}` : sec
    $('.time').html(`${minText}:${secText}`);
}

//分別寫註冊物件的動作
function registerDraggable() {// 根據牌的位置決定是否開啟draggable，但是關閉由丟下的時候再來調整
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 13; j++) {
            if ($(`#${allSuits[i]}_${j}`).nextAll().length == 0) { //判斷是否是最後一個
                $(`#${allSuits[i]}_${j}`).attr('draggable', true)
            }
        };
    }
    for (let i = 1; i <= 8; i++) {
        let area = $(`#area${i}`)
        let len = area.children().length
        for (let j = len - 2; j >= 0; j--) {
            let behindId = area.children()[j + 1].id //後面的牌的id
            let frontId = area.children()[j].id //前面的牌的id
            if ($(`#${behindId}`).attr('draggable') == undefined) {
            } else {
                let behindColor = $(`#${behindId}`).data('color')  // 後面的牌的顏色
                let behindNum = parseInt(behindId.split('_')[1]) // 後面的牌的數字
                let frontColor = $(`#${behindId}`).data('color') // 前面的牌的顏色
                let frontNum = parseInt(frontId.split('_')[1]) // 前面的牌的數字
                if (behindColor != frontColor && behindNum == frontNum - 1) {
                    $(`#${frontId}`).attr('draggable', true)
                } else {
                }
            }
        }
    }
}

function registeredCardArea() {
    $('.cardArea').on('dragover', function (e) {
        e.preventDefault()
    })
    $('.card').on('dragover', function (e) {
        e.preventDefault()
    })
    $('.cardArea').on('drop', function (e) {
        e.preventDefault();
        let len;
        let dataId = e.originalEvent.dataTransfer.getData('text'); //抓起來的元素id
        let dataSuits = dataId.split('_')[0]  //抓起來的花色
        let dataNum = parseInt(dataId.split('_')[1]) //抓起來的數字
        let eId = e.target.id; //丟到的卡牌
        switch (true) {//基本上讓獲取的eId都會是該行的最後一個
            case $(`#${eId}`).children().length == 0: //這是該行已經沒牌的狀況
                len = 0;
                appendCard(e.target, dataId)
                $(`#${dataId}`).css('top', "")
                registerDraggable()
                return
            case eId.indexOf('area') < 0: //當不是放到area上
                eId = document.getElementById(`${eId}`).parentNode.lastChild.id
                break;
            default: //當放在area上時
                eId = document.getElementById(`${eId}`).lastChild.id
                break;
        }
        eFatherId = document.getElementById(`${eId}`).parentNode.id || eId//抓到該行cardArea的id
        let eSuits = eId.split('_')[0]  //該行最後一個的花色
        let eNum = parseInt(eId.split('_')[1]) //該行最後一個的數字
        let eColor = document.getElementById(`${eId}`).getAttribute('data-color') //最後一張牌的顏色
        let dataColor = document.getElementById(`${dataId}`).getAttribute('data-color') //
        if (eColor != dataColor && dataNum == eNum - 1) {
            len = $(`#${eFatherId}`).children().length || 0;
            if (e.target.id.indexOf('area') < 0) {
                appendCard(e.target.parentNode, dataId)
            } else {
                appendCard(e.target, dataId)
            }
            $(`#${dataId}`).css('top', `${len * 50}px`)
        }
        function appendCard(dropArea, dataId) { //移動卡牌的動作
            let dataLen = $(`#${dataId}`).nextAll().length
            if (dataLen == 0) { //代表只有一張
                dropArea.appendChild(document.getElementById(dataId))
                $(`#${dataId}`).css('top', `${len * 50}px`)
            } else {//代表拖曳不只一張
                let cardId;
                let arr = $(`#${dataId}`).nextAll().addBack()
                test = $(`#${dataId}`).nextAll().addBack()
                for (let i = 0; i <= dataLen; i++) {
                    cardId = arr[i].id;
                    dropArea.appendChild(document.getElementById(cardId))
                    $(`#${cardId}`).css('top', `${(len + i) * 50}px`)
                }
            }
        }
        registerDraggable()
    })
}
function registeredCard() { //各種關於card的行為的註冊 基本上e.target代表被丟到的位置，data抓的都是被丟的元素
    $('.card').on('dragstart', function (e) {
        $(e.target).css('opacity', "0.1")
        let parentId = e.target.parentNode.id //得出現在所在位置
        e.originalEvent.dataTransfer.setData("Text", e.target.id);
        if ($(e.target).parent().hasClass('freeCell')) {
            $(e.target).parent().on('drop', function (e) {
                e.preventDefault();
                var data = e.originalEvent.dataTransfer.getData("Text"); //抓起來的元素id;
                e.target.appendChild(document.getElementById(data));
                $(e.target).off('drop')
                if (e.target.className.indexOf('cells') == 0) {
                    $(`#${data}`).css({ 'top': 0, 'position': 'static' })
                }
            })
        }
    })
    $('.card').on('dragend', function (e) {
        $(e.target).css('opacity', "1")
    })
    $('.card').on('dblclick', function (e) { //首先確認被雙擊的牌是否是該列最後或者在free區
        if (e.target.parentNode.className.indexOf('freeCell') <= 0 && //若不在free區
            $(e.target).nextAll().length != 0) { //或不是最後一個時
            return
        }
        console.log($(e.target).nextAll().length);
        let eId = e.target.id //雙擊對象的id
        let eSuits = eId.split('_')[0]  //雙擊的花色
        let eNum = parseInt(eId.split('_')[1]) //雙擊的數字
        let homeNowNum = $(`#${eSuits}_0`).children().length //目標花色現在的數字

        if (eNum == homeNowNum) {
            document.querySelector(`#${eSuits}_0`).appendChild(document.getElementById(eId));
            $(`#${eId}`).css({ 'top': '', 'position': 'absolute' })
        }
        registerDraggable()
        registerFreeCells()
        checkWin()
    })
}

function registerFreeCells() { // 註冊freeCell欄位的拖曳事件
    $('.freeCell').on('dragenter', function (e) { //拖曳到上面時的特效
        let eClass = e.target.className;
        if (eClass.indexOf('freeCell') <= 0) {
            $(e.target).parent().css('border', '5px double green')
            return
        }
        $(e.target).css('border', '5px double green')
    })
    $('.freeCell').on('dragleave', function (e) { //拖曳離開時的特效
        let eClass = e.target.className;
        if (eClass.indexOf('freeCell') <= 0) {
            $(e.target).parent().css('border', '5px double white')
            return
        }
        $(e.target).css('border', '5px double white')
    })
    $('.freeCell').on('drop', function (e) {
        e.preventDefault();
        let dataId = e.originalEvent.dataTransfer.getData('text'); //抓起來的元素id
        let eClass = e.target.className;
        switch (true) {
            case eClass.indexOf('freeCell') <= 0:
                $(e.target).parent().css('border', '5px double white')
                return
            case $(`#${dataId}`).nextAll().length >= 1:
                $(e.target).css('border', '5px double white')
                return
            default:
                break;
        }
        $(e.target).css('border', '5px double white')
        e.target.appendChild(document.getElementById(dataId));
        $(e.target).off('drop')
        if (e.target.className.indexOf('cells') == 0) {
            $(`#${dataId}`).css({ 'top': '', 'position': 'absolute' })
        }
        registerDraggable()
    })
}
function registerHomeCells() {//針對homeCell的拖曳設定註冊
    $('.homeCell').on('dragenter', function (e) { //拖曳到上面時的特效
        if (e.target.id.split('_')[1] != 0) {
            $(e.target).parent().css('border', '5px double yellow')
        } else {
            $(e.target).css('border', '5px double yellow')

        }
    })
    $('.homeCell').on('dragleave', function (e) { //拖曳離開時的特效
        if (e.target.id.split('_')[1] != 0) {
            $(e.target).parent().css('border', '5px double white')
        } else {
            $(e.target).css('border', '5px double white')
        }
    })

    $('.homeCell').on('drop', function (e) {  //放下時觸發的事件 //TODO:還要考慮如果之後實做可以一次拿起多張時的拒絕狀況，加在下面if return那一塊
        e.preventDefault();
        console.log(e.originalEvent.dataTransfer);
        let eId = e.target.id //丟下位置的id
        let nowSuits = eId.split('_')[0]  //現在上面的花色
        let nowNum = parseInt(eId.split('_')[1]) //現在上面的數字
        let dataId = e.originalEvent.dataTransfer.getData('text'); //抓起來的元素id
        let dataSuits = dataId.split('_')[0]  //抓起來的花色
        let dataNowNum = parseInt(dataId.split('_')[1]) //抓起來的數字f
        if (eId == dataId || //拿起來又放下的時候
            dataSuits !== nowSuits || //花色不對的時候
            dataNowNum != nowNum + 1 || //數字不對的時候
            $(`#${dataId}`).nextAll().length >= 1) {  //一次拿取多張時
            if (eId.split('_')[1] != 0) {
                //當裡面有牌時
                $(e.target).parent().css('border', '5px double white')
            } else {
                //當裡面還沒有牌時
                $(e.target).css('border', '5px double white')
            }
            return
        }
        $(`#${dataId}`).css({ 'top': '', 'position': 'absolute' })
        if (e.target.id.split('_')[1] != 0) {
            //當裡面有牌時
            $(e.target).parent().css('border', '5px double white')
            e.target.parentNode.appendChild(document.getElementById(dataId));
        } else {
            //當裡面還沒有牌時
            $(e.target).css('border', '5px double white')
            e.target.appendChild(document.getElementById(dataId))
        }
        registerDraggable()
        checkWin()
    })
}

function checkWin() { //確認是否勝利，主要在drop和dblclick的時候檢查
    let spadesNum = $('#spades_0').children().length
    let heartNum = $('#heart_0').children().length
    let diamondsNum = $('#diamonds_0').children().length
    let clubsNum = $('#clubs_0').children().length
    setTimeout(() => {
        if (spadesNum + heartNum + diamondsNum + clubsNum == 56) {
            winAlert()
        }
    }, 100);

}

//設置alert和confirm用插件
function winAlert() {
    $('body').className
    Swal.fire({
        title: '～！恭喜您完成了接龍！～',
        text: '請問要繼續下一局嗎？',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: '當然要',
        cancelButtonText: '先不要',
        heightAuto: false,
    }).then((result) => {
        if (result.value) {
            reset()
            Swal.fire({
                title: '～那就繼續吧～',
                heightAuto: false,
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            return
        }
    })
}
function restratAlert() {
    Swal.fire({
        title: '確定要開新局嗎？',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '當然要',
        cancelButtonText: '先不要',
        heightAuto: false,
    }).then((result) => {
        if (result.value) {
            reset()
            Swal.fire({
                title: '～施主，請重新來過～',
                heightAuto: false,
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            return
        }
    })
}


function iRWinner() { //測試勝利用
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 13; j++) {
            document.querySelector(`#${allSuits[i]}_0`).appendChild(document.getElementById(`${allSuits[i]}_${j}`));
            $(`#${allSuits[i]}_${j}`).css({ 'top': '', 'position': 'absolute' })
        }
    }
    checkWin()
}

function reset() { //重置
    $('.freeCell').html('');
    for (let i = 0; i < 4; i++) {
        $(`#${allSuits[i]}_0`).html(`<i class="iconfont icon-l icon-${allSuits[i]}"></i>`)
    }
    min = 0
    sec = 0
    $('.time').html(`00:00`);
    init()
}

function init() {
    buildAll() //確立了所有牌
    buildCardArea() //這邊已經直接完成陣列的填入了
    $('.newGame').on('click', function () {
        restratAlert()
    })
    registerDraggable()
    registeredCard()
    registerHomeCells()
    registerFreeCells()
    registeredCardArea()
    $('.cells').on('dragover', function (e) { //確保不會一直觸發事件導致損耗效能
        e.preventDefault();
    })
}
init();
setInterval(() => {
    time()
}, 1000);



