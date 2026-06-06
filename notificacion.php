<?php
// ── MAMEMI Madera · Notificación de Redsys ──
// Este archivo recibe la confirmación de pago de Redsys
// y puede usarse para enviar un email de confirmación

define('CLAVE_SHA256', 'sq7HjrUOBfKmC576ILgskD5srU870gJ7');
define('EMAIL_TIENDA', 'hola@mamemimadera.es');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    exit;
}

$signatureVersion   = $_POST['Ds_SignatureVersion']   ?? '';
$merchantParameters = $_POST['Ds_MerchantParameters'] ?? '';
$signature          = $_POST['Ds_Signature']          ?? '';

if (!$merchantParameters || !$signature) {
    http_response_code(400);
    exit;
}

// Decodificar parámetros
$params = json_decode(base64_decode($merchantParameters), true);
$order  = $params['Ds_Order']  ?? '';
$amount = $params['Ds_Amount'] ?? 0;
$response = intval($params['Ds_Response'] ?? 9999);

// Verificar firma
$key = base64_decode(CLAVE_SHA256);
$iv  = "\0\0\0\0\0\0\0\0";
$derivedKey = openssl_encrypt($order, 'des-ede3-cbc', $key, OPENSSL_RAW_DATA | OPENSSL_NO_PADDING, $iv);
$hmac = base64_encode(hash_hmac('sha256', $merchantParameters, $derivedKey, true));
// Normalizar firma recibida
$signatureReceived = strtr($signature, '-_', '+/');
if ($hmac !== $signatureReceived) {
    http_response_code(400);
    exit('Firma incorrecta');
}

// Pago autorizado (código 0000–0099)
if ($response >= 0 && $response <= 99) {
    $amountEuros = number_format($amount / 100, 2, ',', '.') . ' €';

    // Enviar email de notificación a la tienda
    $subject = "Nuevo pedido MAMEMI Madera - Pedido #{$order}";
    $body = "Hola Leticia!\n\nHas recibido un nuevo pedido:\n\nNº Pedido: {$order}\nImporte: {$amountEuros}\nEstado: AUTORIZADO\n\nRevisa el panel de CaixaBank para más detalles.\n\nMAMEMI Madera";
    $headers = "From: noreply@mamemimadera.es\r\nContent-Type: text/plain; charset=UTF-8";
    @mail(EMAIL_TIENDA, $subject, $body, $headers);
}

http_response_code(200);
echo 'OK';
