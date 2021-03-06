﻿$(document).ready(function () {

    var MTDS = new METODOS();
    var fecha = MTDS.TODAY();

    var Secciones;
    var Lockers;
    var Matriculas;
    var Mensajes;


    var msgYa = $("#msg1").iziModal({
            title: "¡Espera!",
            iconText: '<i class="warning sign icon"></i>',
            headerColor: '#F2BE30',
            zindex: 2000,
            radius: 20,
            padding:20,
            width: 600,
            timeout: 5000,
            timeoutProgressbar: true,
            transitionIn: 'fadeInDown',
            transitionOut: 'fadeOutDown',
            pauseOnHover: true
        });  
    var msgYaAd = $("#msg2").iziModal({
            title: "¡Espera!",
            iconText: '<i class="warning sign icon"></i>',
            headerColor: '#F2BE30',
            zindex: 2000,
            radius: 20,
            padding:20,
            width: 600,
            timeout: 5000,
            timeoutProgressbar: true,
            transitionIn: 'fadeInDown',
            transitionOut: 'fadeOutDown',
            pauseOnHover: true
        });


    if (objSess.idtipo == 1) {
        $('#msg_rentar_user').addClass('elem-hide');
        $('#msg_rentar_admin').removeClass('elem-hide');
        $('#rentarMat').removeClass('elem-hide');
        $('#rentarCom').removeClass('elem-hide');
        }
    else {
        console.log('');
        }


    window.s_usuario = function () {

        var param = {action: "selUsuario"};

        $.ajax({
            type: "POST",
            url: domin,
            data: param,
            dataType: "json",

            success: function (response) {

                var arr = new Array();
                Secciones = response;

                arr.push({ id: 0, Nombre: 'Selecciona matricula' });

                $.each(response, function (indx, obj) {
                    var OBJ = { id: obj.id, Nombre: obj.Matricula };
                    arr.push(OBJ);
                });

                MTDS.FULLER_COMBO('Rentar_Matricula', arr);

             },

            error: function (e) {
                console.log(e);
            }
        });

    };

    window.s_Seccion = function () {

        var param = {action:"selSeccion"}
        
        $.ajax({
            type: "POST",
            url: domin,
            data: param,            
            dataType: "json",

            success: function (response) {

                var arr = new Array();
                Secciones = response;

                arr.push({ id: 0, Nombre: 'NINGUNO' });

                $.each(response, function (indx, obj) {
                    var OBJ = {id: obj.id, Nombre: obj.Nombre };
                    arr.push(OBJ);
                });

                //console.log(Secciones);
                MTDS.FULLER_COMBO('Rentar_Seccion', arr);
            },

            error: function (e) {
                console.log(e);
            }
        });

    };

    window.s_LockerBySeccion = function (idSecc) {

        var param = { action:"selLockerSecc", idsec: idSecc };

        $.ajax({
            type: "POST",
            url: domin,
            data: param,            
            dataType: "json",

            success: function (response) {

                var arr = new Array();
                Lockers = response;

                $.each(response, function (indx, obj) {
                    var OBJ = [obj.id, obj.Numero, obj.Precio, obj.idEstatus, obj.idSeccion, obj.idUsuario];
                    arr.push(OBJ);
                });

                MTDS.FULLER_COMBO('Rentar_NumLocker', Lockers);
                ImgLocker();
            },

            error: function (e) {
                console.log(e);
            }
        });

    };

    window.i_RentaByUsuario = function (idLocker, idUsuario, fecha) {

        var param = { action:"rentUsuario", idl: idLocker, idU: idUsuario, dia:fecha };

        $.ajax({
            type: "POST",
            url: domin,
            data: param,
            
            dataType: "json",

            success: function (response) {
                var msg = JSON.stringify(response[0]);
                
                if (msg != '{"Se guardó":"Se guardó"}') {
                    msgYa.iziModal('open');
                }
                else {
                    console.log(msg);
                    window.location.href = "imprimir.html?Concepto=Apartar&idl=" 
                    + idLocker + "&id=" + idUsuario;
                }  
            },

            error: function (e) {
                console.log(e);
                alertError.iziModal('open'); 
            }
        });

    };

    window.i_RentaByAdmin = function (idLocker, idUsuario, idRentador, Comentarios,fecha) {

        var param = { action:"rentAdmin", idl: idLocker, idU: idUsuario, idRen:idRentador, com:Comentarios, dia:fecha };

        $.ajax({
            type: "POST",
            url: domin,
            data: param,
            
            dataType: "json",

            success: function (response) {
                var msg = JSON.stringify(response);

                if (msg != '{"Se guardó":"Se guardó"}') {
                    msgYaAd.iziModal('open');
                }
                else {
                    window.location.href = "imprimir.html?Concepto=Rentar&idl=" + idLocker + "&id=" + idUsuario;
                }
            },

            error: function (e) {
                console.log(e);
                alertError.iziModal('open'); 
            }
        });

    };

    s_usuario();
    s_Seccion();

    $('#Rentar_Seccion').on('change', function () {
        var idSec = $(this).val();
        s_LockerBySeccion(idSec);
    });

    function resetImgLocker() {
        $('#imgDelLocker').removeClass('img_5')
                        .removeClass('img_1')
                        .removeClass('img_2')
                        .removeClass('img_3')
                        .removeClass('img_4');
        $('#precioLock').empty();
    }

    function ImgLocker() {
        var numeroLocker = $('#Rentar_NumLocker option:selected').text();

        if (numeroLocker.match("^11") || numeroLocker.match("^21")) {
            //console.log('arriba!');           
            resetImgLocker();
            $('#precioLock').text('$80');
            $('#imgDelLocker').addClass('img_1');
        }
        if (numeroLocker.match("^12") || numeroLocker.match("^22")) {
            //console.log('segundo!');
            resetImgLocker();
            $('#precioLock').text('$60');
            $('#imgDelLocker').addClass('img_2');
        }
        if (numeroLocker.match("^13") || numeroLocker.match("^23")) {
            //console.log('tercero!');
            resetImgLocker();
            $('#precioLock').text('$40');
            $('#imgDelLocker').addClass('img_3');
        }
        if (numeroLocker.match("^14") || numeroLocker.match("^24")) {
            //console.log('abajo!');
            resetImgLocker();
            $('#precioLock').text('$20');
            $('#imgDelLocker').addClass('img_4');
        }
    }

    $('#Rentar_NumLocker').on('change', function () {
        ImgLocker();
    });

    $('#Apartar').on('click', function () {     

        var idNumLocker = $('#Rentar_NumLocker').val();
        var byMatri = $('#Rentar_Matricula').val();
        var comment = $('#coment_rent').val();

        var checkCom = '';

        if (comment == '') {
            checkCom = '-';
        }
        else {
            checkCom = comment;
        }

        if (objSess.idtipo != 1) {
            i_RentaByUsuario(idNumLocker, objSess.id, fecha);
            //console.log(idNumLocker, objSess.id, fecha);
        }
        else {
            i_RentaByAdmin(idNumLocker, byMatri, objSess.id, checkCom, fecha);
            //console.log(idNumLocker, byMatri, objSess.id, checkCom, fecha);
        }      
    });

});