<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Dummy credentials for demonstration
    $valid_username = "admin";
    $valid_password = "password";

    if ($username === $valid_username && $password === $valid_password) {
        $_SESSION["loggedin"] = true;
        header("Location: ../html/dashboard.html");
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
?>