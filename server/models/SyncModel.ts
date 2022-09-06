import { model, Schema } from 'mongoose';
import { ISyncState } from '../../shared';
const SyncSchema = new Schema<ISyncState>({
    running: Boolean,
    state: String
})

export default model<ISyncState>('Sync', SyncSchema)