// File: models/ScheduledMatch.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ScheduledMatchSchema = new Schema({
    team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    date: { type: String, required: true },
}, { timestamps: true });

export default models.ScheduledMatch || model('ScheduledMatch', ScheduledMatchSchema);