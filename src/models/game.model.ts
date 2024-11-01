import { Schema, model } from "mongoose";

import { BingoBall, BingoCard, Game, Player } from "@interfaces/.";
import { UserSchema } from "./user.model";

const PlayerSchema = new Schema<Player>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    correctBallSelections: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const BingoBallSchema = new Schema<BingoBall>(
  {
    name: {
      type: String,
      required: true,
      enum: ["B", "I", "N", "G", "O"],
    },
    number: {
      type: Number,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const BingoCardSchema = new Schema<BingoCard>(
  {
    balls: {
      type: [BingoBallSchema],
      required: true,
    },
    user: { type: UserSchema, required: true },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const GameSchema = new Schema<Game>(
  {
    players: { type: [PlayerSchema], required: true },
    winner: { type: Schema.Types.ObjectId, ref: "users", default: null },
    bingoCards: {
      type: [BingoCardSchema],
      required: true,
    },
    randomBingoBalls: {
      type: [BingoBallSchema],
      required: true,
    },
    gameMode: {
      type: String,
      required: true,
      enum: ["full", "diagonal", "vertical", "horizontal", "corners"],
    },
    gameStatus: {
      type: String,
      required: true,
      enum: ["ended", "in-progress", "waiting", "unstart"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GameModel = model("games", GameSchema);

export default GameModel;
