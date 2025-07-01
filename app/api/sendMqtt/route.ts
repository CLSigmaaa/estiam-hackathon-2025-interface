import { NextResponse } from "next/server";
import mqtt from "mqtt";

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "";
const MQTT_USERNAME = process.env.MQTT_USERNAME || "";
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || "";

export async function POST(req: Request) {
  const { topic, message } = await req.json();

  console.log("🟡 Requête MQTT reçue :");
  console.log("📌 Topic :", topic);
  console.log("📨 Message :", message);

  return new Promise((resolve) => {
    const client = mqtt.connect(MQTT_BROKER_URL, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    });

    client.on("connect", () => {
      console.log("✅ Connecté au broker, envoi en cours...");
      client.publish(topic, message, {}, (err) => {
        if (err) {
          console.error("❌ Erreur lors de la publication MQTT :", err);
          resolve(NextResponse.json({ error: "Erreur MQTT" }, { status: 500 }));
        } else {
          console.log("📤 Message publié avec succès sur le topic :", topic);
          resolve(NextResponse.json({ success: true }));
        }
        client.end();
      });
    });

    client.on("error", (err) => {
      console.error("❌ Erreur de connexion MQTT :", err);
      resolve(NextResponse.json({ error: "Erreur de connexion MQTT" }, { status: 500 }));
    });
  });
}