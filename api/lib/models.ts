import { model, Schema, Document } from "mongoose";

// https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
interface IPlayground extends Document {}
const PlaygroundSchema = new Schema({}, { timestamps: true });
const Playgrounds = model<IPlayground>("Playground", PlaygroundSchema);

export { IPlayground, Playgrounds };
