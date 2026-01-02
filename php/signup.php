<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

include('connection.php');
include('functions.php');

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password_hash'];

    if (!empty($name) && !empty($email) && !empty($phone) && !empty($password) && !is_numeric($name)) {

        $user_id = random_num(10);
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $query = "INSERT INTO Users (user_id, name, email, phone, password_hash)
                  VALUES ('$user_id', '$name', '$email', '$phone', '$password')";

        mysqli_query($conn, $query);

        header("Location: ../html/login.html");
        exit;
    }
}
?>