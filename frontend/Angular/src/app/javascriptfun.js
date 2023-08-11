exports.showErrorMessage = function (message) {
    let div_msg = document.getElementById("msg_perso");
    let span_msg_perso = document.getElementById("span_msg_perso");

    div_msg.style.backgroundColor = "lightcoral";

    if (message == "") {
        div_msg.hidden = true;
        span_msg_perso.textContent = message;
    } else {
        div_msg.hidden = false;
        span_msg_perso.textContent = message;
    }
}

exports.showInfoMessage = function (message) {
    let div_msg = document.getElementById("msg_perso");
    let span_msg_perso = document.getElementById("span_msg_perso");

    div_msg.style.backgroundColor = "lightcyan";

    if (message == "") {
        div_msg.hidden = true;
        span_msg_perso.textContent = message;
    } else {
        div_msg.hidden = false;
        span_msg_perso.textContent = message;
    }
}

exports.toggleShowProfileMenu = function () {
    let menu = document.getElementById("profile_menu");
    if (menu.style.visibility == "visible") {
        menu.style.visibility = "hidden";
    } else {
        menu.style.visibility = "visible";
    }
}

exports.toggleShowBurgerMenu = function () {
    let menu = document.getElementById("burger_menu");
    let burger = document.getElementById("burger");

    burger.classList.toggle("open");

    if (menu.style.visibility == "visible") {
        menu.style.visibility = "hidden";
    } else {
        menu.style.visibility = "visible";
    }
}

exports.setConnectedEmail = function (email, isAdmin) {
    let burger_menu = document.getElementById("burger_menu");
    let menu = document.getElementById("profile_menu");
    let logged = document.getElementById("logged");
    let nav_horaire = document.getElementById("nav_horaire");
    let nav_bulletin = document.getElementById("nav_bulletin");
    let nav_absence = document.getElementById("nav_absence");

    if (isAdmin) {
        menu.style.height = "20em";
    }
    burger_menu.style.height = "20em";
    logged.style.visibility = "visible";
    nav_horaire.style.visibility = "";
    nav_horaire.routerlink = "/login";
    nav_bulletin.style.visibility = "";
    nav_absence.style.visibility = "";
    logged.textContent = "Loggé : " + email;
}

exports.toggleIfAdminTrue = function (isAdmin) {
    let nav_admin = document.getElementById("nav_admin");
    let btn_delpubli = document.getElementsByClassName("btn_delpubli");

    if (!isAdmin) {
        nav_admin.style.visibility = "hidden";
        for (var i = 0; i < btn_delpubli.length; i++) {
            btn_delpubli[i].style.visibility = "hidden";
        }
    }
}

exports.ShowCoursPanel = function () {
    let cours_panel = document.getElementById("cours_panel");
    let publi_panel = document.getElementById("publi_panel");

    cours_panel.style.visibility = "visible";
    publi_panel.style.visibility = "hidden";
}

exports.ShowPubliPanel = function () {
    let cours_panel = document.getElementById("cours_panel");
    let publi_panel = document.getElementById("publi_panel");

    cours_panel.style.visibility = "hidden";
    publi_panel.style.visibility = "visible";
}


exports.ClearInputs = function () {
    let txt_area = document.getElementById("input_publi");
    let all_inputs = document.getElementsByTagName("input");
    let sel_tag = document.getElementById("sel_tag");

    txt_area.value = "";
    for (var i = 0; i < all_inputs.length; i++) {
        all_inputs.item(i).value = "";
        sel_tag.value = "Annonce";
    }
}

exports.LoopLoadingHoraire = function (list) {
    let selects_lun = document.getElementsByClassName("lun_select");
    let selects_mar = document.getElementsByClassName("mar_select");
    let selects_mer = document.getElementsByClassName("mer_select");
    let selects_jeu = document.getElementsByClassName("jeu_select");
    let selects_ven = document.getElementsByClassName("ven_select");

    let salle_lun = document.getElementsByClassName("lun_salle");
    let salle_mar = document.getElementsByClassName("mar_salle");
    let salle_mer = document.getElementsByClassName("mer_salle");
    let salle_jeu = document.getElementsByClassName("jeu_salle");
    let salle_ven = document.getElementsByClassName("ven_salle");

    for (var i = 0; i < selects_lun.length; i++) {
        if (selects_lun.item(i).value == "") {
            salle_lun.item(i).style.visibility = "hidden"
            salle_lun.item(i).value = "";
        }
        if (selects_mar.item(i).value == "") {
            salle_mar.item(i).style.visibility = "hidden"
            salle_mar.item(i).value = "";
        }
        if (selects_mer.item(i).value == "") {
            salle_mer.item(i).style.visibility = "hidden"
            salle_mer.item(i).value = "";
        }
        if (selects_jeu.item(i).value == "") {
            salle_jeu.item(i).style.visibility = "hidden"
            salle_jeu.item(i).value = "";
        }
        if (selects_ven.item(i).value == "") {
            salle_ven.item(i).style.visibility = "hidden"
            salle_ven.item(i).value = "";
        }

    }

    for (var i = 0; i < selects_lun.length; i++) {
        list.forEach(horaire => {
            if (selects_lun.item(i).id.slice(0, 5) == horaire.codeHoraire) {
                selects_lun.item(i).value = horaire.codeCours;
                salle_lun.item(i).style.visibility = "visible"
                salle_lun.item(i).value = horaire.salle;
            };
        });
    }
    for (var i = 0; i < selects_mar.length; i++) {
        list.forEach(horaire => {
            if (selects_mar.item(i).id.slice(0, 5) == horaire.codeHoraire) {
                selects_mar.item(i).value = horaire.codeCours;
                salle_mar.item(i).style.visibility = "visible"
                salle_mar.item(i).value = horaire.salle;
            };
        });
    }
    for (var i = 0; i < selects_mer.length; i++) {
        list.forEach(horaire => {
            if (selects_mer.item(i).id.slice(0, 5) == horaire.codeHoraire) {
                selects_mer.item(i).value = horaire.codeCours;
                salle_mer.item(i).style.visibility = "visible"
                salle_mer.item(i).value = horaire.salle;
            };
        });
    }
    for (var i = 0; i < selects_jeu.length; i++) {
        list.forEach(horaire => {
            if (selects_jeu.item(i).id.slice(0, 5) == horaire.codeHoraire) {
                selects_jeu.item(i).value = horaire.codeCours;
                salle_jeu.item(i).style.visibility = "visible"
                salle_jeu.item(i).value = horaire.salle;
            };
        });
    }
    for (var i = 0; i < selects_ven.length; i++) {
        list.forEach(horaire => {
            if (selects_ven.item(i).id.slice(0, 5) == horaire.codeHoraire) {
                selects_ven.item(i).value = horaire.codeCours;
                salle_ven.item(i).style.visibility = "visible"
                salle_ven.item(i).value = horaire.salle;
            };
        });
    }

}

exports.LoopLoadingBulletin = function (loaded_notes) {
    let note_er1 = document.getElementsByClassName("note_er1");
    let note_er2 = document.getElementsByClassName("note_er2");
    let moy_semestre = document.getElementById("semestre_moy");
    let notes = [];

    for (let key in loaded_notes) {
        let loaded_note = loaded_notes[key];
        let loaded_cours = loaded_note.codeCours;
        let loaded_er = loaded_note.epreuves;
        let loaded_resultat = loaded_note.resultat;
        let loaded_coefficient = loaded_note.coefficient;

        let elem_note = document.getElementById(loaded_cours + "_ER" + loaded_er + "_note");
        elem_note.value = loaded_resultat;
        let elem_coef = document.getElementById(loaded_cours + "_ER" + loaded_er + "_coef");
        elem_coef.value = loaded_coefficient;
    }

    for (var i = 0; i < note_er1.length; i++) {
        let er1 = note_er1[i];
        let er2 = note_er2[i];
        let coef_er1 = document.getElementById(er1.id.slice(0, 4) + "_ER1_coef");
        let coef_er2 = document.getElementById(er1.id.slice(0, 4) + "_ER2_coef");

        if (er1.value < 4) {
            er1.style.backgroundColor = "lightcoral";
        } else if (er1.value >= 5) {
            er1.style.backgroundColor = "lightgreen";
        } else {
            er1.style.backgroundColor = "lightgoldenrodyellow";
        }

        if (er2.value < 4) {
            er2.style.backgroundColor = "lightcoral";
        } else if (er2.value >= 5) {
            er2.style.backgroundColor = "lightgreen";
        } else {
            er2.style.backgroundColor = "lightgoldenrodyellow";
        }

        let moy = document.getElementById(er1.id.slice(0, 4) + "_moy");
        moy.value = parseFloat(((parseFloat(er1.value) * parseInt(coef_er1.value)) + (parseFloat(er2.value) * parseInt(coef_er2.value))) / (parseInt(coef_er1.value) + parseInt(coef_er2.value)));

        if (moy.value < 4) {
            moy.style.backgroundColor = "lightcoral";
        } else if (moy.value >= 5) {
            moy.style.backgroundColor = "lightgreen";
        } else {
            moy.style.backgroundColor = "lightgoldenrodyellow";
        }

        notes.push(moy.value);


        let somme = 0;
        for (var i = 0; i < notes.length; i++) {
            somme += parseFloat(notes[i]);
        }
        moy_semestre.value = parseFloat(somme / notes.length);

    }
}