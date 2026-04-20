import mongoose, { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
    name: { type: String, required: true, unique: true },
    // Look here: We are now referencing the Player collection!
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
}, { timestamps: true });

export default models.Team || model('Team', TeamSchema);