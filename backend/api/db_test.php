<?php
// Erfasse alle Fehler und zeige sie an
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/html; charset=utf-8');

// 1. HIER DEINE DATEN EINTRAGEN
$host   = 'database-5020727330.webspace-host.com';         // Meistens 'localhost'
$dbname = 'dbs15802930';   // Name deiner Datenbank
$user   = 'dbu2176469';     // Dein Datenbank-Benutzername
$pass   = 'F)N980ur320JWD=)FS?K_s';     // Dein Datenbank-Passwort
$table  = 'leads';     // Name deiner Tabelle (z.B. 'kunden' oder 'anfragen')    

echo "<h3>Starte Datenbank-Test...</h3>";

try {
    // 2. Verbindung aufbauen
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Verbindung zum Datenbank-Server erfolgreich!<br><br>";

    // 3. Test-Eintrag vorbereiten
    $sql = "INSERT INTO $table (
                name, telefon, email, plz, dsgvo, 
                wohnflaeche, baujahr, daemmstandard, heizungsart, 
                anlagenalter, heizkosten, heizverteilung, strompreis
            ) VALUES (
                :name, :telefon, :email, :plz, :dsgvo, 
                :wohnflaeche, :baujahr, :daemmstandard, :heizungsart, 
                :anlagenalter, :heizkosten, :heizverteilung, :strompreis
            )";

    $stmt = $pdo->prepare($sql);

    $testdaten = [
        ':name'           => 'Test Max',
        ':telefon'        => '12345',
        ':email'          => 'test@test.de',
        ':plz'            => '12345',
        ':dsgvo'          => 1,
        ':wohnflaeche'    => 100,
        ':baujahr'        => 2000,
        ':daemmstandard'  => 'Normal',
        ':heizungsart'    => 'Gas',
        ':anlagenalter'   => 10,
        ':heizkosten'     => 1000,
        ':heizverteilung' => 'Heizkörper',
        ':strompreis'     => 0.30
    ];

    $stmt->execute($testdaten);
    echo "🎉 ERFOLG! Der Datensatz wurde sauber in die Tabelle '$table' eingetragen.";

} catch (PDOException $e) {
    // Falls die Verbindung oder das SQL fehlschlägt:
    echo "❌ <b>Datenbank-Fehler aufgetreten:</b><br>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
} catch (Exception $e) {
    // Falls irgendetwas anderes schiefgeht:
    echo "❌ <b>Allgemeiner Fehler:</b><br>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}
?>