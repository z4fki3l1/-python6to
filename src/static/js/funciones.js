function jsVentanaModal(Titulo,Header,Contenido,Botones){
	var MODAL = document.getElementById("ModalSistema");
	var ContenidoModal = '';
	ContenidoModal += '<div class="modal fade" id="innerModal" tabindex="-1" aria-hidden="true">';
	ContenidoModal += '<div class="modal-dialog" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">';
	ContenidoModal += '<div class="modal-content">';
	ContenidoModal += '<div class="modal-header '+Header+'" style="cursor:move;">';
	ContenidoModal += '<h1 class="modal-title fs-5" id="exampleModalLabel">'+Titulo+'</h1>';
	ContenidoModal += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
	ContenidoModal += '</div>';
	ContenidoModal += '<div class="modal-body">';
	///////////// C O N T E N I D O ///////////////
	ContenidoModal += Contenido;
	///////////// C O N T E N I D O ///////////////
	ContenidoModal += '</div>';
	ContenidoModal += '<div class="modal-footer">';
	///////////// B O T O N E S ///////////////	
	VecBotones = Botones.split("@"); // Parsea o divide la cadena en un array, según el carácter que le proporcionemos.
	for(i=0; i<VecBotones.length; i++){
		var Boton = VecBotones[i];
		VecPartesBoton 	= Boton.split("|");
		var TextoBoton 	= VecPartesBoton[0];
		var ColorBoton 	= VecPartesBoton[1];
		var MetodoBoton = VecPartesBoton[2];
		if(TextoBoton == "Cancelar" || TextoBoton == "Cerrar"){
			ContenidoModal += '<button type="button" class="btn btn-'+ColorBoton+'" data-bs-dismiss="modal">'+TextoBoton+'</button>';
		}else{
			ContenidoModal += '<button type="button" class="btn btn-'+ColorBoton+'" onclick="'+MetodoBoton+'">'+TextoBoton+'</button>';
		}
	}
	///////////// B O T O N E S ///////////////	
	ContenidoModal += '</div>';
	ContenidoModal += '</div>';
	ContenidoModal += '</div>'; // cierre innerModal
	MODAL.innerHTML = ContenidoModal;

	var modalEl = document.getElementById('innerModal');
	var dialogEl = modalEl.querySelector('.modal-dialog');
	var headerEl = modalEl.querySelector('.modal-header');
	var myModal = new bootstrap.Modal(modalEl, {
		keyboard: true,
		backdrop: 'static'
	});
	myModal.show();

	// Implementación nativa de arrastre (drag) sobre el header
	(function(){
		var isDown = false;
		var startX = 0, startY = 0;
		var origLeft = 0, origTop = 0;

		function getStyleNumber(el, prop){
			return parseFloat(window.getComputedStyle(el)[prop]) || 0;
		}

		function onDown(e){
			isDown = true;
			e = e.type.startsWith('touch') ? e.touches[0] : e;
			startX = e.clientX;
			startY = e.clientY;

			// compute current left/top in pixels
			var rect = dialogEl.getBoundingClientRect();
			// convert to document coordinates
			origLeft = rect.left + window.scrollX;
			origTop = rect.top + window.scrollY;

			// remove transform to allow direct positioning
			dialogEl.style.transform = 'none';
			dialogEl.style.left = (origLeft) + 'px';
			dialogEl.style.top = (origTop) + 'px';
			dialogEl.style.position = 'absolute';
			dialogEl.style.margin = '0';

			document.addEventListener('mousemove', onMove);
			document.addEventListener('mouseup', onUp);
			document.addEventListener('touchmove', onMove, {passive:false});
			document.addEventListener('touchend', onUp);
			e.preventDefault && e.preventDefault();
		}

		function onMove(e){
			if(!isDown) return;
			e = e.type.startsWith('touch') ? e.touches[0] : e;
			var dx = e.clientX - startX;
			var dy = e.clientY - startY;
			dialogEl.style.left = (origLeft + dx) + 'px';
			dialogEl.style.top = (origTop + dy) + 'px';
			e.preventDefault && e.preventDefault();
		}

		function onUp(e){
			if(!isDown) return;
			isDown = false;
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			document.removeEventListener('touchmove', onMove);
			document.removeEventListener('touchend', onUp);
		}

		if(headerEl && dialogEl){
			headerEl.addEventListener('mousedown', onDown);
			headerEl.addEventListener('touchstart', onDown, {passive:false});
		}
	})();
}

function jsModalCrearUsuario(){
	var ContenidoModal = "";
	ContenidoModal += '<label class="col-form-label">Nombre:</label>';
	ContenidoModal += '<input type="text" autocomplete="off" class="form-control" id="username">';
	ContenidoModal += '<label class="col-form-label">Contraseña:</label>';
	ContenidoModal += '<input type="text" autocomplete="off" class="form-control" id="password">';
	ContenidoModal += '<label class="col-form-label">Nombre Completo:</label>';
	ContenidoModal += '<input type="text" autocomplete="off" class="form-control" id="fullname">';
	jsVentanaModal("Usuario Nuevo","Header-Verde",ContenidoModal,"Cerrar|danger|@Crear|primary|jsCrearUsuario()");
}

function jsCrearUsuario(){
	var Nombre 	= document.getElementById("username").value;
	var Contraseña 	= document.getElementById("password").value;
	var NombreCompleto 	= document.getElementById("fullname").value;
	var url_ruta = "/crear-usuario";

	var Datos = new FormData();
	Datos.append('nombre', Nombre);	
	Datos.append('password', Contraseña);
	Datos.append('fullname', NombreCompleto);
	$.ajax({
		url: url_ruta,
		data: Datos,
		type: "post",
		dataType:"json",
		cache: false,
		processData: false,  // tell jQuery not to process the data
		contentType: false,  // tell jQuery not to set contentType		
		success: function(cJSON){
			alert(cJSON.Resultado);
		},
		error: function(obj1,TipoError,Error){
		}
	});	
}

function jsModalEditarUsuario(id, username, fullname){
	var ContenidoModal = "";
	ContenidoModal += '<input type="hidden" id="edit_id" value="'+id+'">';
	ContenidoModal += '<label class="col-form-label">Nombre:</label>';
	ContenidoModal += '<input type="text" autocomplete="off" class="form-control" id="edit_username" value="'+username+'">';
	ContenidoModal += '<label class="col-form-label">Contraseña (dejar vacío para no cambiar):</label>';
	ContenidoModal += '<input type="text" autocomplete="off" class="form-control" id="edit_password" value="">';
	ContenidoModal += '<label class="col-form-label">Nombre Completo:</label>';
	ContenidoModal += '<input type="text" autocomplete="off" class="form-control" id="edit_fullname" value="'+fullname+'">';
	jsVentanaModal("Editar Usuario","Header-Amarillo",ContenidoModal,"Cerrar|danger|@Actualizar|primary|jsActualizarUsuario()");
}

function jsActualizarUsuario(){
	var id = document.getElementById('edit_id').value;
	var Nombre = document.getElementById('edit_username').value;
	var Contraseña = document.getElementById('edit_password').value;
	var NombreCompleto = document.getElementById('edit_fullname').value;
	var url_ruta = '/actualizar-usuario';

	var Datos = new FormData();
	Datos.append('id', id);
	Datos.append('nombre', Nombre);
	Datos.append('password', Contraseña);
	Datos.append('fullname', NombreCompleto);
	$.ajax({
		url: url_ruta,
		data: Datos,
		type: 'post',
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		success: function(res){
			alert(res.Resultado);
			if(res.Exito){
				location.reload();
			}
		},
		error: function(){ }
	});
}

function jsEliminarUsuarioConfirm(id){
	var ContenidoModal = "<p>¿Desea eliminar el cliente con ID: "+id+"?</p>";
	jsVentanaModal("Eliminar Usuario","Header-Rojo",ContenidoModal,"Cerrar|secondary|@Eliminar|danger|jsEliminarUsuario("+id+")");
}

function jsEliminarUsuario(id){
	var url_ruta = '/eliminar-usuario';
	var Datos = new FormData();
	Datos.append('id', id);
	$.ajax({
		url: url_ruta,
		data: Datos,
		type: 'post',
		dataType: 'json',
		cache: false,
		processData: false,
		contentType: false,
		success: function(res){
			alert(res.Resultado);
			if(res.Exito){ location.reload(); }
		},
		error: function(){ }
	});
}