<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['title'])) {
    $filename = 'notes/' . preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['title']) . '.json';
    
    if (file_exists($filename) && unlink($filename)) {
        echo 'success';
    } else {
        echo 'error';
    }
} else {
    echo 'error';
}
?>-