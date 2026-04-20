// File: models/FinishedMatch.ts
import mongoose, { Schema, model, models } from 'mongoose';

const FinishedMatchSchema = new Schema({
    team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    date: { type: String, required: true },
    result: { type: String, required: true },
    innings1: {
        teamName: { type: String, required: true },
        total: { type: String, required: true },
        overs: { type: String, required: true },
        batting: [{
            playerId: { type: Schema.Types.ObjectId, ref: 'Player' }, // THIS IS THE CRUCIAL PART
            runs: Number,
            balls: Number
        }],
        bowling: [{
            playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
            wickets: Number,
            overs: Number,
            runs: Number
        }],
    },
    innings2: {
        teamName: { type: String, required: true },
        total: { type: String, required: true },
        overs: { type: String, required: true },
        batting: [{
            playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
            runs: Number,
            balls: Number
        }],
        bowling: [{
            playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
            wickets: Number,
            overs: Number,
            runs: Number
        }],
    },
}, { timestamps: true });

export default models.FinishedMatch || model('FinishedMatch', FinishedMatchSchema);