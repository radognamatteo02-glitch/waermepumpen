<?php
header('Content-Type: application/json');

// Datenbank-Konfiguration (Bitte an deine Daten anpassen)
$host = 'database-5020727330.webspace-host.com';
$dbname = 'dbs15802930';
$username = 'dbu2176469';
$password = 'F)N980ur320JWD=)FS?K_s';
$table  = 'leads';

try {
    // Verbindung zur Datenbank herstellen
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Fehler werfen, falls etwas schiefgeht
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // POST-Daten als JSON einlesen
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        throw new Exception("Keine Daten empfangen oder ungültiges Format.");
    }

    // SQL-Statement vorbereiten (Tabelle "leads" muss existieren)
    $sql = "INSERT INTO leads (
        name, telefon, email, plz, dsgvo,
        wohnflaeche, baujahr, daemmstandard, heizungsart,
        anlagenalter, heizkosten, heizverteilung, strompreis
    ) VALUES (
        :name, :telefon, :email, :plz, :dsgvo,
        :wohnflaeche, :baujahr, :daemmstandard, :heizungsart,
        :anlagenalter, :heizkosten, :heizverteilung, :strompreis
    )";

    $stmt = $pdo->prepare($sql);
    
    // Daten sicher binden und ausführen
    $stmt->execute([
        ':name'           => $data['name'] ?? '',
        ':telefon'        => $data['telefon'] ?? '',
        ':email'          => $data['email'] ?? '',
        ':plz'            => $data['plz'] ?? '',
        ':dsgvo'          => !empty($data['dsgvo']) ? 1 : 0,
        ':wohnflaeche'    => $data['wohnflaeche'] ?? null,
        ':baujahr'        => $data['baujahr'] ?? null,
        ':daemmstandard'  => $data['daemmstandard'] ?? null,
        ':heizungsart'    => $data['heizungsart'] ?? null,
        ':anlagenalter'   => $data['anlagenalter'] ?? null,
        ':heizkosten'     => $data['heizkosten'] ?? null,
        ':heizverteilung' => $data['heizverteilung'] ?? null,
        ':strompreis'     => $data['strompreis'] ?? null,
    ]);

    // Erfolgsrückmeldung an das Frontend
    echo json_encode(['success' => true, 'message' => 'Anfrage erfolgreich gespeichert.']);

} catch (Exception $e) {
    // Fehlerbehandlung
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>