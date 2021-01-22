
$(document).ready(function () {
    fetchReservas();
    $('#resultadoAlumno').hide();
    $('#code_usuario').hide();
    $('#search').keyup(function() {
        if($('#search').val()) {
            let search = $('#search').val();
            $.ajax({
                url: './controllers/searchAlumno.php',
                data: {search:search},
                type: 'POST',
                success: function (response) {
                    //console.log(response);
                    let alumnos = JSON.parse(response);
                    let templante='';
                   alumnos.forEach(alumnos=>{
                       templante+=`
                     <li><a href="#" class="alumno-item">${alumnos.nombre_alumno}</a></li>
                    `
                   })
                    $('#container').html(templante);
                    $('#resultadoAlumno').show();
                }
            })
        }

    })
    $('#resgitroAlumno_form').submit(function (e) {
        let code_usuario=$('#code_usuario_num').text();
        const postData={
            code_alumno:$('#code_alumno').val(),
            code_usuario:code_usuario
        };
        $.post('./controllers/insertReserva.php', postData,function (response) {
            fetchReservas();
            console.log(response);
            if(response==0){
                $('#mensaje-envio').show();
                let templante;
                 templante=`
                     <div class="alert alert-success col-lg-7">
                        <a href="#" class="alert-link">Alumno registrado</a>
                    </div>
                    `;
                $('#mensaje-envio').html(templante);
                setTimeout(function() {
                    $("#mensaje-envio").fadeOut(1500);
                },1000);
            }
            else if (response==1){
                $('#mensaje-envio').show();
                let templante;
                templante=`
                     <div class="alert alert-danger col-lg-7" role="alert">
                        <a href="#" class="alert-link">Código duplicado, denegado</a>
                    </div>
                    `;
                $('#mensaje-envio').html(templante);
                setTimeout(function() {
                    $("#mensaje-envio").fadeOut(1500);
                },100);
            }
            else if (response==-1){
                $('#mensaje-envio').show();
                let templante;
                templante=`
                     <div class="alert alert-warning col-lg-7" role="alert">
                        <a href="#" class="alert-link">No existe código</a>
                    </div>
                    `;
                $('#mensaje-envio').html(templante);
                setTimeout(function() {
                    $("#mensaje-envio").fadeOut(1500);
                },1000);

            }
            //console.log(response);
            $('#resgitroAlumno_form').trigger('reset');


        });

        e.preventDefault();
    });
    function fetchReservas() {
        $.ajax({
            url:'./controllers/listAlumno.php',
            type:'GET',
            success:function (response) {
                console.log(response);
                let reservas = JSON.parse(response);
                let template='';
                reservas.forEach(reserva=>{
                    template+=`
                        <tr code_reserva="${reserva.code_reserva}">
                            <td></td>
                            <td>${reserva.code_reserva}</td>
                            <td>${reserva.code_alumno}</td>
                            <td>${reserva.fecha_reserva}</td>
                            <td>${reserva.estado_reserva}</td>
                            <td>${reserva.code_usuario}</td>
                            <td><span class="table-remove">
                                <button class="reserva_btn btn-danger btn-rounded btn-sm my-0">
                                    Cancelar
                                </button></span>
                            </td>                            
                        </tr>
                   `
                });
                $('#reserva_data').html(template);
                $(document).ready(function() {
                    var t = $('#contenidoReserva').DataTable( {
                        "columnDefs": [ {
                            "searchable": false,
                            "orderable": false,
                            "targets": 0
                        } ],
                        "order": [[ 1, 'asc' ]]
                    } );

                    t.on( 'order.dt search.dt', function () {
                        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                            cell.innerHTML = i+1;
                        } );
                    } ).draw();
                } );

            }
        })
    }
    $(document).on('click', '.reserva_delete', function () {
        let element=$(this)[0].parentElement.parentElement;
        let id=$(element).attr('code_reserva');
        console.log(id);
        $.post('./controllers/deleteReserva.php', {id}, function (response) {
                console.log(response);
        })
    })

});
