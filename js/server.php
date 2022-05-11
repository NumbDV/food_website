<?php
$_POST = json_decode(file_get_contents("php://input"), true); // получем JSON данные
echo var_dump($_POST); // беред данные с клиента, превращает в строку и показывает в клиенте

