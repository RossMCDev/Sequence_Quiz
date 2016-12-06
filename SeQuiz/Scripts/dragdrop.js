
//buttons
function start() {

        $.get("Home/StartQuiz", null, function (data) {
            $('#QuizPane').html(data);
        });

        document.getElementById("startButton").removeEventListener("click", start, false);
        document.getElementById("timer").setAttribute("style", "visibility:initial;");
        theCountDown = setInterval(countingDown, 1000);
        document.getElementById("status").innerHTML = "Go!";

    
}

function next() {
    document.getElementById("nextButton").removeEventListener("click", next, false);
    var dz1 = document.getElementById("dragzone").firstElementChild;
    var dz2 = document.getElementById("dragzone2").firstElementChild;
    var dz3 = document.getElementById("dragzone3").firstElementChild;
    var dz4 = document.getElementById("dragzone4").firstElementChild;
    var result;
    if (dz1 != null && dz2 != null && dz3 != null && dz4 != null) {
        var position = dz1.getAttribute("src");
        var position2 = dz2.getAttribute("src");
        var position3 = dz3.getAttribute("src");
        var position4 = dz4.getAttribute("src");
        var num = document.getElementById("CurrentImageset_ImageOrder").getAttribute("value")
        var order = [num.charAt(0), num.charAt(1), num.charAt(2), num.charAt(3)];
        if (
        position.charAt(position.length - 5) == order[0]
     && position2.charAt(position2.length - 5) == order[1]
     && position3.charAt(position3.length - 5) == order[2]
     && position4.charAt(position4.length - 5) == order[3]) {

            document.getElementById("status").innerHTML = "You got it!";
            result = true;
            animate(result);
        }
        else {
            document.getElementById("status").innerHTML = "Thats not it...";
            result = false;
            animate(result);
        }
    }
    else {
        document.getElementById("status").innerHTML = "Error";
    }
    setTimeout(function () { document.getElementById("status").innerHTML = "Go!"; }, 800);
}



function animate(result) {
    $('#question').addClass('animated slideOutLeft');
    $('#question').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', setTimeout(function() {advance(result)}, 500));
}
function advance(result) {
    var nxt = document.getElementById("nextButton").textContent;
    if (nxt == "Next") {
        $.get("Home/NextQuestion", { match: result, minute: timerminutes, secound: timersecounds }, function (data) {
            $('#QuizPane').html(data);
        });
    }
    else {
        clearInterval(theCountDown);
        window.location.href = "Home/NextQuestion?match=" + result + "&minute=" + timerminutes + "&secound=" + timersecounds;
    }
}


//timer 
var timersecounds = 1;
var timerminutes = 2;
var theCountDown;

function countingDown() {

    timersecounds--;



    if (timersecounds < 1 && timerminutes != 0) {
        timerminutes--;
        timersecounds = 59;
    }

    document.getElementById("timer").innerHTML = zeros(timerminutes) + ":" + zeros(timersecounds);
    if (timerminutes < 1 && timersecounds < 1) {
        clearInterval(theCountDown);
        document.getElementById("status").innerHTML =
        "Times Up";
        window.location.href = "Home/ScoresOnBoard";

    }
}

function zeros(t) {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

//drag, drop and swap
var draggedfrom;
function enableDrop(ev) {
    ev.preventDefault();
}

function draging(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    draggedfrom = ev.target.parentElement.id;
}

function droping(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (ev.target.nodeName == "DIV") {
        if (ev.target.firstElementChild == null) {
            ev.target.appendChild(document.getElementById(data));
        }
    }
    else {
        ev.target.parentElement.appendChild(document.getElementById(data));
        document.getElementById(draggedfrom).appendChild(ev.target);
    }
}


//applying event handlers
 events();
 $(document).ajaxComplete(function () {
    events();
});

function events() {
    document.getElementById("startButton").addEventListener("click", start, false);
    document.getElementById("nextButton").addEventListener("click", next, false);

    var images = document.querySelectorAll(".images");
    var dragzones = document.querySelectorAll(".dragzones");


    //setTimeout(function () {
        //for (var i = 0; i < images.length; i++) {
        //    images[i].setAttribute("style", "visibility:initial;");
        //    $('#' + images[i].id).addClass('animated pulse');
        //}
    //}, 1500);
    document.getElementById("answerpane").addEventListener("load", iloaded, false);
    $('#answerpane').addClass('animated fadeIn');


    //setTimeout(function () {
    //    for (var i = 0; i < images.length; i++) {

    //        $('#' + images[i].id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () { $(this).removeClass("animated bounce"); });
    //    }
    //}, 1700);

    for (var i = 0; i < images.length; i++) {
        images[i].addEventListener("dragstart", draging, false);

    }

    for (var i = 0; i < dragzones.length; i++) {
        dragzones[i].addEventListener("dragover", enableDrop, false);
        dragzones[i].addEventListener("drop", droping, false);
    }



}
function iloaded() {
    document.getElementById("answerpane").setAttribute("style", "visibility:hidden;");
    $('#answerpane').addClass('animated fadeIn');
}

