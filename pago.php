<?php
// ── MAMEMI Madera · Pasarela de pago Redsys/CaixaBank ──
// Integración Hosted/Redirección con firma SHA-256
// Datos de tu TPV Virtual CaixaBank

// ══ CONFIGURACIÓN ══════════════════════════════════════════
// IMPORTANTE: Cambiar a producción cuando Redsys valide tu web
define('REDSYS_URL_TEST', 'https://sis-t.redsys.es:25443/sis/realizarPago');
define('REDSYS_URL_REAL', 'https://sis.redsys.es/sis/realizarPago');
define('MODO_TEST', true); // ← Cambiar a false cuando pases a producción

define('DS_MERCHANT_MERCHANTCODE', '369618186');   // Nº Comercio
define('DS_MERCHANT_TERMINAL',     '1');            // Nº Terminal
define('DS_MERCHANT_CURRENCY',     '978');          // EUR
define('CLAVE_SHA256',             'sq7HjrUOBfKmC576ILgskD5srU870gJ7'); // Clave secreta

define('URL_OK',  'https://mamemimadera.es/pago-ok.html');
define('URL_KO',  'https://mamemimadera.es/pago-ko.html');
define('URL_NOTIF', 'https://mamemimadera.es/notificacion.php');
// ══════════════════════════════════════════════════════════

// Validar datos recibidos del carrito
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$amount      = isset($_POST['amount']) ? intval($_POST['amount']) : 0;
$order       = isset($_POST['order'])  ? preg_replace('/[^a-zA-Z0-9]/', '', $_POST['order']) : '';
$description = isset($_POST['description']) ? substr(htmlspecialchars($_POST['description']), 0, 125) : 'Pedido MAMEMI Madera';

if ($amount <= 0 || strlen($order) < 4) {
    header('Location: index.html');
    exit;
}

// Asegurar que el pedido tenga mínimo 4 dígitos numéricos al inicio
$order = str_pad($order, 4, '0', STR_PAD_LEFT);
$order = substr($order, 0, 12);

// ── Construir parámetros ──
$params = [
    'DS_MERCHANT_AMOUNT'        => $amount,
    'DS_MERCHANT_ORDER'         => $order,
    'DS_MERCHANT_MERCHANTCODE'  => DS_MERCHANT_MERCHANTCODE,
    'DS_MERCHANT_CURRENCY'      => DS_MERCHANT_CURRENCY,
    'DS_MERCHANT_TRANSACTIONTYPE' => '0',
    'DS_MERCHANT_TERMINAL'      => DS_MERCHANT_TERMINAL,
    'DS_MERCHANT_MERCHANTURL'   => URL_NOTIF,
    'DS_MERCHANT_URLOK'         => URL_OK,
    'DS_MERCHANT_URLKO'         => URL_KO,
    'DS_MERCHANT_PRODUCTDESCRIPTION' => $description,
    'DS_MERCHANT_MERCHANTNAME'  => 'MAMEMI Madera',
    'DS_MERCHANT_CONSUMERLANGUAGE' => '001',
];

// ── Codificar en Base64 ──
$json          = json_encode($params);
$base64Params  = base64_encode($json);

// ── Generar firma SHA-256 ──
// 1. Derivar clave con 3DES usando el número de pedido
$key = base64_decode(CLAVE_SHA256);
$iv  = "\0\0\0\0\0\0\0\0";
$derivedKey = openssl_encrypt(
    $order,
    'des-ede3-cbc',
    $key,
    OPENSSL_RAW_DATA | OPENSSL_NO_PADDING,
    $iv
);

// 2. Calcular HMAC-SHA256 de los parámetros en Base64
$hmac = hash_hmac('sha256', $base64Params, $derivedKey, true);
$signature = base64_encode($hmac);

$redsys_url = MODO_TEST ? REDSYS_URL_TEST : REDSYS_URL_REAL;
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirigiendo al pago seguro... – MAMEMI Madera</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Nunito', sans-serif; background: #fdf8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .loading-box { text-align: center; padding: 3rem 2rem; }
    .loading-box img { height: 60px; margin-bottom: 1.5rem; }
    .spinner { width: 48px; height: 48px; border: 4px solid #f5e9d6; border-top: 4px solid #8b5e3c; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 1.2rem; color: #5a3a1a; margin-bottom: 0.5rem; }
    p { font-size: 0.88rem; color: #6b4c2a; font-weight: 300; }
    .secure-badge { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; font-size: 0.78rem; color: #6a9e8a; font-weight: 600; }
  </style>
</head>
<body>
  <div class="loading-box">
    <img src="images/logo.png" alt="MAMEMI Madera">
    <div class="spinner"></div>
    <h2>Redirigiendo al pago seguro...</h2>
    <p>Serás redirigida a la pasarela de CaixaBank · Redsys</p>
    <div class="secure-badge">🔒 Conexión segura · Pago 100% protegido</div>
  </div>

  <form id="redsysForm" method="POST" action="<?= htmlspecialchars($redsys_url) ?>">
    <input type="hidden" name="Ds_SignatureVersion"   value="HMAC_SHA256_V1">
    <input type="hidden" name="Ds_MerchantParameters" value="<?= htmlspecialchars($base64Params) ?>">
    <input type="hidden" name="Ds_Signature"          value="<?= htmlspecialchars($signature) ?>">
  </form>

  <script>
    // Auto-submit tras 1 segundo (da tiempo a ver la pantalla)
    setTimeout(() => document.getElementById('redsysForm').submit(), 1000);
  </script>
</body>
</html>
