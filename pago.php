<?php
// ═══════════════════════════════════════════════════════════════
// MAMEMI Madera · Procesar pago
// 1) Envía automáticamente el email con los datos del pedido
// 2) Genera la firma de Redsys y la devuelve en JSON
// ═══════════════════════════════════════════════════════════════

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: https://mamemimadera.es');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// ══ CONFIGURACIÓN REDSYS ════════════════════════════════════════
define('DS_MERCHANT_MERCHANTCODE', '369618186');   // Nº Comercio
define('DS_MERCHANT_TERMINAL',     '1');            // Nº Terminal
define('DS_MERCHANT_CURRENCY',     '978');          // EUR
define('CLAVE_SHA256',             'sq7HjrUOBfKmC576ILgskD5srU870gJ7');

define('URL_OK',    'https://mamemimadera.es/pago-ok.html');
define('URL_KO',    'https://mamemimadera.es/pago-ko.html');
define('URL_NOTIF', 'https://mamemimadera.es/notificacion.php');
define('EMAIL_TIENDA', 'hola@mamemimadera.es');
// ══════════════════════════════════════════════════════════════

// ── Leer datos enviados desde el carrito ──
$input = json_decode(file_get_contents('php://input'), true);

$amount       = isset($input['importe']) ? intval($input['importe']) : 0;
$order        = isset($input['pedido']) ? preg_replace('/[^a-zA-Z0-9]/', '', $input['pedido']) : '';
$referencia   = isset($input['referencia']) ? preg_replace('/[\r\n]+/', ' ', substr($input['referencia'], 0, 30)) : '';
$resumen      = isset($input['resumen']) ? $input['resumen'] : '';
$emailCliente = isset($input['emailCliente']) ? trim($input['emailCliente']) : '';

if ($amount <= 0 || strlen($order) < 4) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos de pedido inválidos']);
    exit;
}

$order = str_pad($order, 4, '0', STR_PAD_LEFT);
$order = substr($order, 0, 12);

// ── 1. ENVIAR EMAIL AUTOMÁTICO CON LOS DATOS DEL PEDIDO ──
if ($resumen) {
    $subject = "🛍️ Nuevo pedido recibido · Ref: {$referencia}";
    $body  = $resumen . "\n";
    $body .= "────────────────────────\n";
    $body .= "Nº operación banco: {$order}\n";
    $body .= "(Recibirás otro email en cuanto el banco confirme el pago)\n";

    $headers = "From: noreply@mamemimadera.es\r\nContent-Type: text/plain; charset=UTF-8";

    // Reply-To solo si el email del cliente tiene un formato válido
    // (evita inyección de cabeceras y errores de envío)
    $emailCliente = preg_replace('/[\r\n]+/', '', $emailCliente);
    if ($emailCliente && filter_var($emailCliente, FILTER_VALIDATE_EMAIL)) {
        $headers .= "\r\nReply-To: {$emailCliente}";
    }

    @mail(EMAIL_TIENDA, $subject, $body, $headers);
}

// ── 2. GENERAR FIRMA DE REDSYS ──
$params = [
    'DS_MERCHANT_AMOUNT'              => $amount,
    'DS_MERCHANT_ORDER'                => $order,
    'DS_MERCHANT_MERCHANTCODE'         => DS_MERCHANT_MERCHANTCODE,
    'DS_MERCHANT_CURRENCY'              => DS_MERCHANT_CURRENCY,
    'DS_MERCHANT_TRANSACTIONTYPE'      => '0',
    'DS_MERCHANT_TERMINAL'              => DS_MERCHANT_TERMINAL,
    'DS_MERCHANT_MERCHANTURL'           => URL_NOTIF,
    'DS_MERCHANT_URLOK'                 => URL_OK,
    'DS_MERCHANT_URLKO'                 => URL_KO,
    'DS_MERCHANT_PRODUCTDESCRIPTION'    => 'Pedido MAMEMI Madera',
    'DS_MERCHANT_MERCHANTNAME'          => 'MAMEMI Madera',
    'DS_MERCHANT_CONSUMERLANGUAGE'      => '001',
];

$json         = json_encode($params);
$base64Params = base64_encode($json);

$key = base64_decode(CLAVE_SHA256);
$iv  = "\0\0\0\0\0\0\0\0";
$derivedKey = openssl_encrypt(
    $order,
    'des-ede3-cbc',
    $key,
    OPENSSL_RAW_DATA | OPENSSL_NO_PADDING,
    $iv
);

$hmac      = hash_hmac('sha256', $base64Params, $derivedKey, true);
$signature = base64_encode($hmac);

echo json_encode([
    'Ds_MerchantParameters' => $base64Params,
    'Ds_Signature'          => $signature,
]);
