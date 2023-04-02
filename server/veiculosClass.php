<?php    
    require_once "conectaBanco.php";

    class Veiculo{
        private $bd;

        public function __construct() {
            $this->bd = new BancoDeDados();
        }
        //FUNÇÃO QUE FAZ A BUSCA DE VEÍCULOS NO DB
        public function listarVeiculos() {
            $resultadoQuery = $this->bd->executar_query('SELECT id, nome, marca, ano, valorVenda FROM veiculos');
            $veiculos = $resultadoQuery->fetch_all(MYSQLI_ASSOC);
            $this->fechar_conexao();
            return $veiculos;
             
        }
        //FUNÇÃO QUE INSERE O VEÍCULO NO DB CONFORME O QUE FOI PASSADO POR POST
        public function criarVeiculos($nome, $marca, $ano, $valorVenda) {
            $resultadoQuery = $this->bd->executar_query("INSERT INTO veiculos (nome, marca, ano, valorVenda) VALUES ('$nome', '$marca', '$ano', '$valorVenda')");
            $this->fechar_conexao();
            if ($resultadoQuery) {
                echo 'Veículo cadastrado com sucesso!';
            } else {
                echo 'Ocorreu um erro no cadastro do veículo!';
            }
        }
        //FUNÇÃO QUE REALIZA O UPDATE DO VEÍCULO NO DB CONFORME O QUE FOI PASSADO POR POST
        public function editarVeiculos($idVeiculo, $nome, $marca, $ano, $valorVenda) {
            $resultadoQuery = $this->bd->executar_query("UPDATE veiculos SET nome = '$nome', marca = '$marca', ano = '$ano', valorVenda = '$valorVenda'  WHERE id = $idVeiculo");
            $this->fechar_conexao();
            if ($resultadoQuery) {
                echo 'Veículo alterado com sucesso!';
            } else {
                echo 'Ocorreu um erro na edição do veículo!';
            }
        }
        //FUNÇÃO QUE DELETA O VEÍCULO NO DB CONFORME O QUE FOI PASSADO POR POST
        public function excluirVeiculos($idVeiculo) {
            $resultadoQuery = $this->bd->executar_query("DELETE FROM veiculos WHERE id = $idVeiculo");
            $this->fechar_conexao();
            if ($resultadoQuery) {
                echo 'Veículo excluído com sucesso!';
            } else {
                echo 'Ocorreu um erro na exclusão do veículo!';
            }
        }
        //FUNÇÃO FECHA A CONEXÃO COM O DB
        public function fechar_conexao() {
            $this->bd->fechar_conexao();
        }
    }

    $veiculo = new Veiculo();
    
    //VERIFICAÇÃO DE POST, ID E NOME PARA CHAMADA DA FUNÇÃO CORRETA
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(isset($_POST['nome']) && !empty($_POST['nome'])){
            $nome = $_POST['nome'];
            $marca = $_POST['marca'];
            $ano = $_POST['ano'];
            $valorVenda = $_POST['valorVenda'];
            if(isset($_POST['idVeiculo']) && !empty($_POST['idVeiculo'])){
                $idVeiculo = $_POST['idVeiculo'];
                $veiculo->editarVeiculos($idVeiculo, $nome, $marca, $ano, $valorVenda);
            }else{
                $veiculo->criarVeiculos($nome, $marca, $ano, $valorVenda);
            }
        }else{
            $idVeiculo = $_POST['idVeiculo'];
            $veiculo->excluirVeiculos($idVeiculo);
        }
        
    }else{
        header('Content-Type: application/json');
        echo json_encode($veiculo->listarVeiculos());
    }
   
    
    
    
?>
