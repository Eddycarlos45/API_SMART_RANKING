import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateHourChallenge: { type: Date },
    status: { type: String },
    dateHourOrder: { type: Date },
    dateHourAnswer: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId},
    category: { type: mongoose.Schema.Types.ObjectId},
    players: [
      {
        type: mongoose.Schema.Types.ObjectId
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
