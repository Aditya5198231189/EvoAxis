setTimeout(() => {

    document.getElementById("splash").style.opacity = "0";

    setTimeout(() => {

        document.getElementById("splash").style.display = "none";

        document.getElementById("home").style.display = "block";

        document.body.style.overflow = "auto";

    }, 1000);

}, 2200);