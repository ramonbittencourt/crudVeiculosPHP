<?php
	class BancoDeDados {
	    private $servername = "localhost";
	    private $username = "root";
	    private $password = "123456";
	    private $dbname = "crudveiculos";
	    private $conn;

	    public function __construct() {
	        $this->conn = mysqli_connect($this->servername, $this->username, $this->password, $this->dbname);
	        if (!$this->conn) {
	            die("Conexão falhou: " . mysqli_connect_error());
	        }
	    }

	    public function executar_query($sql) {
	        $result = mysqli_query($this->conn, $sql);
	        return $result;
	    }

	    public function fechar_conexao() {
	        mysqli_close($this->conn);
	    }
	}
	//$conexao = new PDO('mysql:host=localhost;dbname=desafioramon', 'root', '123456');
?>
