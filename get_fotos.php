<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Evita problemas de CORS
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0'); // Previne cache no navegador
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

// Tenta encontrar a pasta 'fotos', ignorando se está em maiúsculo ou minúsculo no Linux
$possible_dirs = ['fotos', 'Fotos', 'FOTOS'];
$found_dir = null;

foreach ($possible_dirs as $d) {
    if (is_dir(__DIR__ . '/' . $d)) {
        $found_dir = $d;
        break;
    }
}

$fotos = [];

if ($found_dir) {
    $dir_path = __DIR__ . '/' . $found_dir;
    $files = scandir($dir_path);
    
    if ($files !== false) {
        foreach ($files as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            // Suporta os formatos mais comuns de imagem
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                // Adiciona na array usando o caminho relativo correto
                $fotos[] = $found_dir . '/' . $file;
            }
        }
    }
}

// Retorna as fotos embaralhadas opcionalmente, ou em ordem
// shuffle($fotos); 

echo json_encode($fotos);
?>
