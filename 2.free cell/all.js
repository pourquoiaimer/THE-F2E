let cardData = [];
let areaData = [];
let min = 0;
let sec = 0;
let allSuits = ['spades', 'heart', 'diamonds', 'clubs'];
let dataId;
let fromId;
let moveToId;
let fromTop;
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
function registerDraggable() {// 根據牌的位置及狀態決定是否開啟draggable
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
    $('.cardArea').off('drop')
    $('.cardArea').on('drop', function (e) {
        e.preventDefault();
        let len;
        dataId = e.originalEvent.dataTransfer.getData('text'); //抓起來的元素id
        fromId = $(`#${dataId}`).parent()[0].id //從哪裡來
        fromTop = $(`#${dataId}`).css('top')
        let dataSuits = dataId.split('_')[0]  //抓起來的花色
        let dataNum = parseInt(dataId.split('_')[1]) //抓起來的數字
        let eId = e.target.id; //丟到的卡牌
        switch (true) {//基本上讓獲取的eId都會是該行的最後一個
            case $(`#${eId}`).children().length == 0: //這是該行已經沒牌的狀況
                len = 0;
                moveToId = e.target.id
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
                moveToId = e.target.parentNode.id
                appendCard(e.target.parentNode, dataId)

            } else {
                moveToId = e.target.id
                appendCard(e.target, dataId)
            }
            $(`#${dataId}`).css('top', `${len * 50}px`)
        }
        function appendCard(dropArea, dataId) { //移動卡牌的動作
            let dataLen = $(`#${dataId}`).nextAll().length
            if (dataLen == 0) { //代表只有一張
                rememberMove(dataId, fromId, moveToId, fromTop)
                dropArea.appendChild(document.getElementById(dataId))
                $(`#${dataId}`).css('top', `${len * 50}px`)
            } else {//代表拖曳不只一張
                let cardId;
                let idArr = []
                let topArr = []
                let arr = $(`#${dataId}`).nextAll().addBack()
                for (let i = 0; i <= dataLen; i++) {
                    cardId = arr[i].id;
                    fromTop = $(`#${cardId}`).css('top')
                    dropArea.appendChild(document.getElementById(cardId))
                    $(`#${cardId}`).css('top', `${(len + i) * 50}px`)
                    idArr.push(cardId)
                    topArr.push(fromTop)
                }
                rememberMove(idArr, fromId, moveToId, topArr)
            }
        }
        registerDraggable()
    })
}
function registeredCard() { //各種關於card的行為的註冊 基本上e.target代表被丟到的位置，data抓的都是被丟的元素
    $('.card').off('dragstart')
    $('.card').off('dragend')
    $('.card').off('dblclick')
    $('.card').on('dragover', function (e) {
        e.preventDefault()
    })
    $('.card').on('dragstart', function (e) {
        $(e.target).css('opacity', "0.1")
        let parentId = e.target.parentNode.id //得出現在所在位置
        e.originalEvent.dataTransfer.setData("Text", e.target.id);
    })
    $('.card').on('dragend', function (e) {
        $(e.target).css('opacity', "1")
    })
    $('.card').on('dblclick', function (e) { //首先確認被雙擊的牌是否是該列最後或者在free區
        if (e.target.parentNode.className.indexOf('freeCell') <= 0 && //若不在free區
            $(e.target).nextAll().length != 0) { //或不是最後一個時
            return
        }
        dataId = e.target.id //雙擊對象的id
        fromId = $(`#${dataId}`).parent()[0].id
        fromTop = $(`#${dataId}`).css('top')
        let eSuits = dataId.split('_')[0]  //雙擊的花色
        let eNum = parseInt(dataId.split('_')[1]) //雙擊的數字
        let homeNowNum = $(`#${eSuits}_0`).children().length //目標花色現在的數字

        if (eNum == homeNowNum) {
            document.querySelector(`#${eSuits}_0`).appendChild(document.getElementById(dataId));
            $(`#${dataId}`).css({ 'top': '', 'position': 'absolute' })
        }

        moveToId = `${eSuits}_0`
        rememberMove(dataId, fromId, moveToId, fromTop)
        registerDraggable()
        registerFreeCells()
        checkWin()
    })
}

function registerFreeCells() { // 註冊freeCell欄位的拖曳事件
    $('.freeCell').off('dragenter')
    $('.freeCell').off('dragleave')
    $('.freeCell').off('drop')

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
        dataId = e.originalEvent.dataTransfer.getData('text'); //抓起來的元素id
        fromId = $(`#${dataId}`).parent()[0].id
        fromTop = $(`#${dataId}`).css('top')
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
        moveToId = e.target.id
        // $(e.target).off('drop')
        if (e.target.className.indexOf('cells') == 0) {
            $(`#${dataId}`).css({ 'top': '', 'position': 'absolute' })
        }
        rememberMove(dataId, fromId, moveToId, fromTop)
        registerDraggable()
    })
}
function registerHomeCells() {//針對homeCell的拖曳設定註冊
    $('.homeCell').off('dragenter')
    $('.homeCell').off('dragleave')
    $('.homeCell').off('drop')
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
        let eId = e.target.id //丟下位置的id
        let nowSuits = eId.split('_')[0]  //現在上面的花色
        let nowNum = parseInt(eId.split('_')[1]) //現在上面的數字
        dataId = e.originalEvent.dataTransfer.getData('text'); //抓起來的元素id
        let dataSuits = dataId.split('_')[0]  //抓起來的花色
        let dataNowNum = parseInt(dataId.split('_')[1]) //抓起來的數字f
        fromId = $(`#${dataId}`).parent()[0].id
        fromTop = $(`#${dataId}`).css('top')
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
            moveToId = e.target.parentNode.id
        } else {
            //當裡面還沒有牌時
            $(e.target).css('border', '5px double white')
            let item = dataId
            moveToId = e.target.id
            e.target.appendChild(document.getElementById(dataId))

            //TODO:基本上跟之前寫BMI時一樣，就是每次都取出然後再加在前面再填入，然後點上一步的時候就是取出然後執行最後一步然後再刪去，統整一下各個位置的移動行為函式？
        }
        rememberMove(dataId, fromId, moveToId, fromTop)
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

//記住移動的步數
function rememberMove(item, fromWhere, goWhere, fromTop) {
    let data = JSON.parse(sessionStorage.getItem('move')) || []
    let saveData = { 'moveItem': item, 'comeFrom': fromWhere, 'moveTo': goWhere, 'top': fromTop }
    data.push(saveData)
    sessionStorage.setItem('move', JSON.stringify(data));
}
function undo() { //註冊回復上一步的動作
    $('#undo').on('click', function () {
        let moveData = JSON.parse(sessionStorage.getItem('move'))
        if (moveData == null || moveData == '') {
            console.log('no move to undo');
            return
        }
        let len = moveData.length
        let undoData = moveData[len - 1]
        let undoItem = undoData.moveItem
        let undoMoveTo = undoData.comeFrom
        let undocomeFrom = undoData.moveTo
        let undoTop = undoData.top
        if (Array.isArray(undoItem)) {
            for (let i = 0; i < undoItem.length; i++) {
                document.querySelector(`#${undoMoveTo}`).appendChild(document.getElementById(undoItem[i]));
                $(`#${undoItem[i]}`).css('top', undoTop[i])
            }
        } else {
            document.querySelector(`#${undoMoveTo}`).appendChild(document.getElementById(undoItem));
            $(`#${undoItem}`).css('top', undoTop)
        }
        moveData.pop()
        sessionStorage.setItem('move', JSON.stringify(moveData));
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
    sessionStorage.removeItem('move');
    undo()
}
init();
setInterval(() => {
    time()
}, 1000);



