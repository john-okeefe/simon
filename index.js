/* global $ */
var simon = [{
        id: "green",
        color: "rgba(81, 186, 20, 1)",
        sound: "sounds/green.mp3"
    }, {
        id: "red",
        color: "rgba(234, 28, 28, 1)",
        sound: "sounds/red.mp3"
    }, {
        id: "yellow",
        color: "rgba(217, 242, 31, 1)",
        sound: "sounds/yellow.mp3"
    }, {
        id: "blue",
        color: "rgba(35, 146, 237, 1)",
        sound: "sounds/blue.mp3"
    }],
    originalColors = ["rgba(47, 112, 10, 0.7)", "rgba(209, 87, 87, 0.7)", "rgba(199, 219, 48, 0.7)", "rgba(45, 156, 229, 0.7)"],
    patternArr = [],
    patternLevel = 1,
    playingArr = [],
    strict = false,
    power = false,
    notifyDefault = {
        "display": "none",
        "width": "350px",
        "background": "rgb(106, 169, 237)"
    };

function resetGame() {
    patternLevel = 1;
}

//function that runs when power button is clicked
$('.power').click(function() {
    if (!power) {
        $('.power button').addClass("active");
        $('.playlevel').text(patternLevel).css("background", "rgba(255,0,0,0.7)");
        power = true;
        resetColors();
    }
    else if (power) {
        resetGame();
        $('.power button').removeClass("active");
        $('.playlevel').text('--').css("background", "rgba(178, 8, 8, 0.5)");
        $('.notify').css(notifyDefault).text("");
        power = false;
        resetColors();
    }
});

//turn strict mode on or off
$('.strict-game').click(function() {
    if (!strict) {
        $('.strict-game button').removeClass("btn-info").addClass('btn-danger');
        strict = true;
    }
    else if (strict) {
        $('.strict-game button').removeClass("btn-danger").addClass('btn-info');
        strict = false;
    }
});


//start button function
$('.startgame').click(function() {
    if (power === true) {
        $('.notify').css(notifyDefault).text("");
        resetGame();
        createPattern();
        runPattern();
    }
    else {
        return false;
    }
});

//populates the playing array as the game goes on until level 20
function runPattern() {
    playingArr = [];
    for (var i = 0; i < patternLevel; i++) {
        playingArr.push(patternArr[i]);
    }
    if (patternLevel <= 20) {
        $(".playlevel").text(patternLevel);
        patternLevel++;
        playPattern(0);
    }
    else if (patternLevel === 21) {
        $('.notify').css(notifyDefault).text("");
        $('.notify').css({
            "display": "block",
            "width": "500px"
        }).text("Congratulations you won the game!");
    }
}

//this is the computer showing the pattern
function playPattern(place) {
    var sound = new Audio(simon[playingArr[place]].sound);

    setTimeout(function() {
        if (power) {
            $("#" + simon[playingArr[place]].id).css("background", simon[playingArr[place]].color);
            sound.play();
        }
    }, 300);
    setTimeout(function() {
        if (power) {
            resetColors();
            place++;
            if (place < playingArr.length) {
                playPattern(place);
                return;
            }
            else if (place === playingArr.length) {
                return checkPattern(place, 0);
            }
        }
    }, 800);
}


//this is the user clicking and the computer checking it all out.
function checkPattern(place, count) {
    //mouse clicks down and lights up the button
    $(".play").off().on("mousedown", function() {
        if (count < place) {
            var click = $(this).attr("id"),
                square = simon.filter(x => {
                    return x.id === click;
                }),
                sound = new Audio(square[0].sound);
            $("#" + click).css("background", square[0].color);
            sound.play();
            console.log("the button pressed on mousedown is " + click);
            console.log("The count on the button press is " + count);
        }
    }).on("mouseup", function() {
        var click = $(this).attr("id");
        if (count < place) {
            if (click === simon[playingArr[count]].id) {
                count++;
                if (count === playingArr.length) {
                    setTimeout(function() {
                        runPattern();
                    }, 500);
                }
            }
            else if (!strict) {
                $('.notify').css(notifyDefault).text("");
                $('.notify').css({
                    "display": "block",
                    "background": "red"
                }).text("You missed at level " + (patternLevel - 1) + ". Try again!");
                resetColors();
                setTimeout(function() {
                    playPattern(0);
                    $('.notify').css(notifyDefault).text("");
                }, 1000);
                return;
            }
            else if (strict) {
                $('.notify').css(notifyDefault).text("");
                $('.notify').css({
                    "display": "block",
                    "background": "red",
                    "width": "600px"
                }).text("You missed at level " + (patternLevel - 1) + ". Starting from Level 1!");
                resetColors();
                setTimeout(function() {
                    resetGame();
                    runPattern();
                    $('.notify').css(notifyDefault).text("");
                }, 1000);
                return;
            }
            resetColors();
        }
    });
}

//this "turns off the lights".
function resetColors() {
    if (power) {
        for (var i = 0; i < originalColors.length; i++) {
            $("#" + simon[i].id).css("background", originalColors[i]);
        }
        return true;
    }
    else if (!power) {
        for (var j = 0; j < originalColors.length; j++) {
            $('#' + simon[j].id).css("background", "rgb(142, 142, 142)");
        }
    }
}

//this creates the initial pattern up to 20 numbers
function createPattern() {
    patternArr = [];
    for (var i = 0; i < 20; i++) {
        patternArr.push(Math.floor(Math.random() * 4));
    }
    return;
}
