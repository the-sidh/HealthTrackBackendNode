$(document).ready(function() {

	hideAlert();


  $("#desc").blur(function(){
	validaDesc($(this));
   });
    $("#cal").blur(function(){
	validaCalorias($(this));
   });
    $("#data").blur(function(){
	validaData($(this));
   });
 
});

function hideAlert(){
	  $("#alerta").hide();
	
}
	
function validaDesc(input){
	if(verificaVazio($(input))){
		tratamentoErro($(input),"Preenchimento obrigatório");
	}
	else{
		tratamentoSucesso();
	}
	
}

function validaEmail(input){
	if(verificaVazio($(input))){
		tratamentoErro($(input),"Preenchimento obrigatório");
	}
	else{
		if(!verificaFormatoEmail($(input))){
			tratamentoErro($(input),"Formato inválido");
		}else{
			tratamentoSucesso();
		}		
	}	
}


function validaCalorias(input){
	if(verificaVazio($(input))){
		tratamentoErro($(input),"Preenchimento obrigatório");
	}
	else{
		if(!verificaNumerico($(input))){
			tratamentoErro($(input),"Campo numérico");
		}else{
			tratamentoSucesso();
		}		
	}	
}


function validaData(input){
	if(verificaVazio($(input))){
		tratamentoErro($(input),"Preenchimento obrigatório");
	}
	else{
		if(!verificaFormatoData($(input))){
			tratamentoErro($(input),"Formato inválido");
		}else{
			tratamentoSucesso();
		}		
	}	
}

function verificaVazio(input){
  return ($(input).val().length == 0) ; ;
}

function verificaNumerico(input){
  var val = $(input).val();
  var num = new RegExp('\d+');
  return num.test(val);
}

function verificaFormatoData(input){
  var val = $(input).val();
  var num = new RegExp('[0-9]{2}\/[0-9]{2}\/[0-9]{4}\\s[0-9]{2}:[0-9]{2}');
  console.log(num.test(val));
  return num.test(val);
}

function verificaFormatoEmail(input){
  var val = $(input).val();
  var num = new RegExp('.+?@.+');
  console.log(num.test(val));
  return num.test(val);
}


function tratamentoErro(input,msg){
	console.log(msg);
	$(input).next().text(msg);
	 $(input).next().show();
	input.focus();
}

function tratamentoSucesso(){
	hideAlert();
}
