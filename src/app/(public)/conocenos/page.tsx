import type { Metadata } from "next";
import { ConocenosClient } from "./ConocenosClient";

export const metadata: Metadata = {
  title: "Conócenos – ICCI",
  description:
    "Historia, misión, visión, pastores y campus de Iglesias Comunidad De Cristo Internacional.",
};

export default function ConocenosPage() {
  return <ConocenosClient />;
}
