import { model, Schema, Document } from "mongoose";

// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
interface IPlayground extends Document {
  _id: string;
}
const PlaygroundSchema = new Schema(
  {
    _id: { type: String },
    type: {
      type: String,
      enum: ["dind", "kind", "c", "python", "node", "react", "angular"],
    },
  },
  { timestamps: true }
);
const Playgrounds = model<IPlayground>("Playground", PlaygroundSchema);

export { IPlayground, Playgrounds };
