$(document).ready(function () {

	hideAlert();
	$("#data").mask('00/00/0000', { placeholder: "mm/dd/aaaa" });
	$("#nome").blur(function () {
		validaPreenchido($(this));
	});
	$("#altura").blur(function () {
		validaFloat($(this));
	});
	$("#email").blur(function () {
		validaEmail($(this));
	});
	$("#pwd").blur(function () {
		validaPwd($(this));
	});
	$("#pwd2").blur(function () {
		validaPwd2($(this));
	});
	$("#old_pwd").blur(function () {
		validaPreenchido($(this));
	});
	$("#cal").blur(function () {
		validaNumerico($(this));
	});
	$("#data").blur(function () {
		validaData($(this));
	});
	$("#data1").blur(function () {
		validaData1($(this));
	});
	$("#peso").blur(function () {
		validaNumerico($(this));
	});
	$("#sist").blur(function () {
		validaNumerico($(this));
	});
	$("#diast").blur(function () {
		validaNumerico($(this));
	});




});

function hideAlert() {
	$(".myAlert-top").hide();
	$(".myAlert-bottom").hide();
	$(".alerta").hide();

}

function validaPreenchido(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		tratamentoSucesso();
	}

}

function validaPwd(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaPwd($(input))) {
			tratamentoErro($(input), "Senha inválida");
		} else {
			tratamentoSucesso();
		}
	}

}

function validaPwd2(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaPwd2($(input))) {
			tratamentoErroNaoRestritivo($(input), "Senhas diferem");
		} else {
			tratamentoSucesso();
		}
	}

}

function validaEmail(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaFormatoEmail($(input))) {
			tratamentoErro($(input), "Formato inválido");
		} else {
			tratamentoSucesso();
		}
	}
}



function validaNumerico(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaNumerico($(input))) {
			tratamentoErro($(input), "Campo numérico");
		} else {
			tratamentoSucesso();
		}
	}
}

function validaFloat(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaFloat($(input))) {
			tratamentoErro($(input), "Formato inválido");
		} else {
			tratamentoSucesso();
		}
	}
}



function validaData(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaFormatoData($(input))) {
			tratamentoErro($(input), "Formato inválido");
		} else {
			tratamentoSucesso();
		}
	}
}

function validaData1(input) {
	if (verificaVazio($(input))) {
		tratamentoErro($(input), "Preenchimento obrigatório");
	}
	else {
		if (!verificaFormatoData($(input))) {
			tratamentoErro($(input), "Formato inválido");
		} else {
			tratamentoSucesso();
		}
	}
}

function verificaVazio(input) {
	return ($(input).val().length == 0);;
}

function verificaNumerico(input) {
	var val = $(input).val();
	var num = new RegExp('^[0-9]+$');
	return num.test(val);
}

function verificaFloat(input) {
	var val = $(input).val();
	var num = new RegExp('^[0-9]+\.[0-9]$');
	return num.test(val);
}

function verificaPwd(input) {
	var pwd = $(input).val();
	var contemNumeros = new RegExp('[0-9]').test(pwd);
	var contemLetras = new RegExp('[a-zA-Z]').test(pwd);;
	var maior8 = pwd.length > 7;
	return contemNumeros && contemLetras && maior8;
}

function verificaPwd2(input) {
	var pwd = $("#pwd").val();
	var pwd2 = $(input).val();
	return pwd == pwd2;
}

function verificaFormatoData1(input) {
	var val = $(input).val();
	var num = new RegExp('^[0-9]{2}\/[0-9]{2}\/[0-9]{4}\\s[0-9]{2}:[0-9]{2}$');
	console.log(num.test(val));
	return num.test(val);
}

function verificaFormatoData(input) {
	var val = $(input).val();
	var num = new RegExp('^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$');
	console.log(num.test(val));
	return num.test(val);
}

function verificaFormatoEmail(input) {
	var val = $(input).val();
	var num = new RegExp('.+?@.+');
	console.log(num.test(val));
	return num.test(val);
}


function tratamentoErro(input, msg) {
	console.log(msg);
	$(input).next().text(msg);
	$(input).next().show();
	input.focus();
}

function tratamentoErroNaoRestritivo(input, msg) {
	console.log(msg);
	$(input).next().text(msg);
	$(input).next().show();
}

function tratamentoSucesso() {
	hideAlert();
}

function myAlertTop() {
	$(".myAlert-top").show();
	setTimeout(function () {
		$(".myAlert-top").hide();
	}, 5000);
}

function myAlertBottom() {
	$(".myAlert-bottom").show();
	setTimeout(function () {
		$(".myAlert-bottom").hide();
	}, 5000);
}
