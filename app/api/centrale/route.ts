import { NextResponse } from "next/server";
import mqtt from "mqtt";

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "";
const MQTT_USERNAME = process.env.MQTT_USERNAME || "";
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || "";

export async function POST(req: Request) {
  const { topic, message } = await req.json();

  return new Promise((resolve) => {
    const client = mqtt.connect(MQTT_BROKER_URL, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    });

    client.on("connect", () => {
      client.publish(topic, message, {}, (err) => {
        if (err) {
          resolve(NextResponse.json({ error: "Erreur MQTT" }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ success: true }));
        }
        client.end();
      });
    });

    client.on("error", (err) => {
      resolve(NextResponse.json({ error: "Erreur de connexion MQTT" }, { status: 500 }));
    });
  });
}