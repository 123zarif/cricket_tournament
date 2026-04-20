import mongoose, { Schema, model, models } from 'mongoose';

const PlayerSchema = new Schema({
    name: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true }
}, { timestamps: true });

export default models.Player || model('Player', PlayerSchema);