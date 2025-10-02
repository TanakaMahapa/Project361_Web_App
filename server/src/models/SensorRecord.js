import mongoose from "mongoose";

const SensorRecordSchema = new mongoose.Schema(
  {
    ledAlertAt: { type: Date },
    device: { type: String, required: true },
    gasDetectedAt: { type: Date },
    motionDetectedAt: { type: Date },
    password: { type: String, required: true },
    username: { type: String, required: true },
    vibrationAlertAt: { type: Date }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("SensorRecord", SensorRecordSchema);
