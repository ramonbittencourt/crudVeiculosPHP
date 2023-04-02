$(document).ready(function(){
	$("#btnEdtVeiculo").hide();
	montaTabela();
	listarVeiculos();
	
	$("#formVeiculo").submit(function(event){
		event.preventDefault();

		var idVeiculo = $("#idVeiculo").val();
		var nome = $("#nome").val();
		var marca = $("#marca").val();
		var ano = $("#ano").val();
		var valorVenda = $("#valorVenda").val();

		if(idVeiculo == ""){
			criarVeiculo(nome, marca, ano, valorVenda);
		}else{
			editarVeiculo(idVeiculo, nome, marca, ano, valorVenda);
		}
	});

	$("#tabelaVeiculos").on('click', '.acaoTable', function(event){
		event.preventDefault();
		var linha = $(event.target).closest("tr");
		var rowData = $('#tabelaVeiculos').DataTable().row(linha).data();
        var idVeiculo = rowData.idVeiculo;
		if($(this).hasClass('excluir')){
			$('#modalExcluirVeiculo').modal('show');

			$('#btnExcluirVeiculo').off('click').click(function(){
				excluirVeiculo(idVeiculo);
				$('#modalExcluirVeiculo').modal('hide');
			});
			$('.fechaModalExcluir').click(function(){
				$('#modalExcluirVeiculo').modal('hide');
			});
		}else if($(this).hasClass('editar')){
			var nome = rowData.nome;
			var marca = rowData.marca;
			var ano = rowData.ano;
			var valorVenda = numeroParaDecimal(rowData.valorVenda);
			
			$("#idVeiculo").val(idVeiculo);
			$("#nome").val(nome);
			$("#marca").val(marca);
			$("#ano").val(ano);
			$("#valorVenda").val(valorVenda);
			$("#nome, #marca, #ano, #valorVenda").addClass("edicaoVeiculo");
			$("#nome").focus();
			$("#marca").focus();
			$("#ano").focus();
			$("#valorVenda").focus();
			$("#btnCadVeiculo").hide();
			$("#btnEdtVeiculo").show();
		}
	});
});

// FUNÇÂO PARA MONTAR A TABELA DE VEÍCULOS, TABELA ESTÁ UTILIZANDO A BIBLIOTECA "https://datatables.net/"
function montaTabela(){
	var mydata = [];
	$('#tabelaVeiculos').DataTable({						      
		dom: 'lBfrtip',   
		data: mydata,
		buttons: [{
			extend: 'excel',	
			responsive: true,
			title: '',
			exportOptions: {
				columns: ':visible'
			}
		}],	       		
		"scrollX": true,
		columns: [ 
			{data: 'idVeiculo', visible: false},
			{data: 'nome', 'title': 'Nome'},
	        {data: 'marca', 'title': 'Marca'},
	        {data: 'ano', 'title': 'Ano'},
			{data: 'valorVenda', 'title': 'Valor', class: 'text-right'},
	        {data: 'acaoTable', 'title': 'Ações'}          	        		        		        	
		],
		"language": {
			"emptyTable": "Nenhum Registro Encontrado."	            
		}
	});
	
	$(".buttons-excel").hide();
}

// FUNÇÃO QUE CARREGA OS DADOS NA TABELA DE VEÍCULOS
function listarVeiculos() {
	var mydata = [];
	$('#tabelaVeiculos').dataTable().fnClearTable();
	$.ajax({
		url:"../server/veiculosClass.php",
		dataType: 'json',
		success: function (data) {
			$.each(data, function(index, item) {
							var idVeiculo = item.id;
							var nome = item.nome;
							var marca = item.marca;
							var ano = item.ano;
							var valorVenda = numeroParaReal(item.valorVenda);
							var acaoTable = '<img class="acaoTable excluir" id="excVeic_'+item.id+'" alt="Excluir" title="Excluir Veículo" data-units="px" src="../img/trash_32.png"/>'+
							'<img class="acaoTable editar" id="edtVeic_'+item.id+'" alt="Editar" title="Editar Veículo" data-units="px" src="../img/write_32.png"/>';

							mydata.push({
								idVeiculo,
								nome,
								marca,
								ano,
								valorVenda,
								acaoTable
							});
			});
			$('#tabelaVeiculos').dataTable().fnAddData(mydata);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			mensagemAlerta('Ocorreu um erro na busca dos Veículos!', 'danger');
		}
	}); 
	
}

// FUNÇÃO QUE ENVIA OS DADOS DO VEÍCULOS QUE SERÁ CADASTRADO
function criarVeiculo(nome, marca, ano, valorVenda){
	$.ajax({
		type: "POST",
		url: "../server/veiculosClass.php",
		data: { nome: nome, marca: marca, ano: ano , valorVenda: valorVenda },
		success: function (response) {
			mensagemAlerta(response, 'success');
			console.log("POST:" + response);
			listarVeiculos();
			$("#nome").val("");
			$("#marca").val("");
			$("#ano").val("");
			$("#valorVenda").val("");
		},
		error: function(jqXHR, textStatus, errorThrown) {
			mensagemAlerta(response, 'danger');
			console.log("Erro: " + textStatus);
		}
	});

}
// FUNÇÃO QUE ENVIA OS DADOS DO VEÍCULOS QUE SERÁ ALTERADO
function editarVeiculo(idVeiculo, nome, marca, ano, valorVenda){
	$.ajax({
		type: "POST",
		url: "../server/veiculosClass.php",
		data: { idVeiculo: idVeiculo, nome: nome, marca: marca, ano: ano , valorVenda: valorVenda },
		success: function (response) {
			mensagemAlerta(response, 'success');
			console.log("POST:" + response);
			$("#btnCadVeiculo").show();
			$("#btnEdtVeiculo").hide();
			listarVeiculos();
			$("#nome, #marca, #ano, #valorVenda").removeClass("edicaoVeiculo");
			$("#idVeiculo").val("");
			$("#nome").val("");
			$("#marca").val("");
			$("#ano").val("");
			$("#valorVenda").val("");
		},
		error: function(jqXHR, textStatus, errorThrown) {
			mensagemAlerta(response, 'danger');
			console.log("Erro: " + textStatus);
		}
	});
}
// FUNÇÃO QUE ENVIA OS DADOS DO VEÍCULOS QUE SERÁ EXCLUÍDO
function excluirVeiculo(idVeiculo){
	$.ajax({
		type: "POST",
		url: "../server/veiculosClass.php",
		data: { idVeiculo: idVeiculo},
		success: function (response) {
			mensagemAlerta(response, 'success');
			console.log("POST:" + response);
			listarVeiculos();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			mensagemAlerta(response, 'danger');
			console.log("Erro: " + textStatus);
		}
	});
}
// FUNÇÃO QUE RETORNA A MENSAGEM EM TELA CONFORME O RETORNO DE CADA FUNÇÃO
function mensagemAlerta(mensagem, tipo) {
    var htmlAlerta = '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' + mensagem + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button></div>';
    $('#alertasTela').append(htmlAlerta);
}

//FUNÇÃO TRANSFORMA O NÚMERO PARA REAL 
function numeroParaReal(numero) {
    var numero = parseFloat(numero).toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}
//FUNÇÃO TRANSFORMA O NÚMERO PARA DECIMAL
function numeroParaDecimal(valor) {
	valor = valor.replace(".","");
	valor = valor.replace(",",".");
	return valor;
}
