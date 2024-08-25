<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['note'])) {
    $note = json_decode($_POST['note'], true);
    $filename = 'notes/' . preg_replace('/[^a-zA-Z0-9_-]/', '_', $note['title']) . '.json';
    
    if (file_put_contents($filename, $_POST['note'])) {
        echo 'success';
    } else {
        echo 'error';
    }
} else {
    echo 'error';
}
?>