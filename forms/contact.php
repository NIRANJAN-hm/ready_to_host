<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=UTF-8');

$receiving_email_address = 'sriguruconstruction555@gmail.com';
$receiving_whatsapp_number = '917795444954';
// If your host does not support environment variables, paste your CallMeBot key between these quotes.
$manual_callmebot_api_key = '';
$callmebot_api_key = getenv('CALLMEBOT_API_KEY') ?: $manual_callmebot_api_key;

function clean_text(string $value): string
{
    $value = trim(strip_tags($value));
    return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';
}

function clean_header(string $value): string
{
    return str_replace(["\r", "\n"], '', clean_text($value));
}

function field_value(string $key): string
{
    return isset($_POST[$key]) ? clean_text((string) $_POST[$key]) : '';
}

function send_whatsapp_message(string $phone_number, string $api_key, string $message): bool
{
    if ($phone_number === '' || $api_key === '') {
        return false;
    }

    $url = 'https://api.callmebot.com/whatsapp.php?phone=' . rawurlencode($phone_number)
        . '&text=' . rawurlencode($message)
        . '&apikey=' . rawurlencode($api_key);

    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        curl_exec($ch);
        $http_code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $http_code >= 200 && $http_code < 300;
    }

    if (ini_get('allow_url_fopen')) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 20,
            ],
        ]);

        return @file_get_contents($url, false, $context) !== false;
    }

    return false;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Only POST requests are allowed.';
    exit;
}

$name = field_value('name');
$email = filter_var(field_value('email'), FILTER_VALIDATE_EMAIL) ?: '';
$phone = field_value('phone');
$subject = clean_header(field_value('subject')) ?: 'New Website Enquiry';
$message = field_value('message');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo 'Please provide a valid name, email address, and message.';
    exit;
}

$extra_fields = [
    'Phone' => $phone,
    'Project Type' => field_value('project_type'),
    'Consultation Type' => field_value('consultation_type'),
    'Site Location' => field_value('site_location'),
    'Preferred Contact' => field_value('preferred_contact'),
    'Budget' => field_value('budget'),
    'Timeline' => field_value('timeline'),
    'Privacy Consent' => field_value('privacy') !== '' ? 'Accepted' : '',
];

$body_lines = [
    'New enquiry from the SRI GURU CONSTRUCTION & INTERIORS website.',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
];

foreach ($extra_fields as $label => $value) {
    if ($value !== '') {
        $body_lines[] = $label . ': ' . $value;
    }
}

$body_lines[] = '';
$body_lines[] = 'Message:';
$body_lines[] = $message;
$body_lines[] = '';
$body_lines[] = 'Submitted from: ' . ($_SERVER['HTTP_HOST'] ?? 'website');
$body_lines[] = 'Submitted at: ' . date('Y-m-d H:i:s');

$domain = preg_replace('/[^A-Za-z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? 'sriguruconstruction.com');
$from = 'website@' . ($domain ?: 'sriguruconstruction.com');

$headers = [
    'From: SRI GURU Website <' . $from . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$email_body = implode("\n", $body_lines);
$email_sent = false;

if (function_exists('mail')) {
    $email_sent = mail(
        $receiving_email_address,
        $subject,
        $email_body,
        implode("\r\n", $headers)
    );
}

$customer_whatsapp = preg_replace('/\D+/', '', $phone);
$whatsapp_lines = array_merge($body_lines, [
    '',
    'Reply on WhatsApp: ' . ($customer_whatsapp !== '' ? 'https://wa.me/' . $customer_whatsapp : 'Phone number not provided'),
]);
$whatsapp_sent = send_whatsapp_message(
    $receiving_whatsapp_number,
    $callmebot_api_key,
    implode("\n", $whatsapp_lines)
);

if ($email_sent || $whatsapp_sent) {
    echo 'OK';
    exit;
}

http_response_code(500);
echo 'Unable to send your message right now. Please call +91 7795 444 954 or email sriguruconstruction555@gmail.com. For WhatsApp delivery, configure CALLMEBOT_API_KEY on the server.';
