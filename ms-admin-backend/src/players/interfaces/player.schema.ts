import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: String,
    ranking: String,
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    rankingPosition: Number
  },
  { timestamps: true, collection: 'players' },
);
