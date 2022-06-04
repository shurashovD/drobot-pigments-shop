import { model } from 'mongoose';
import { Model } from 'mongoose';
import { ICatalog } from './../../shared/index.d';
import { Schema } from 'mongoose';

const CatalogSchema = new Schema<ICatalog, Model<ICatalog>>({
	archived: { type: Boolean, default: false },
	identifier: { type: String, required: true },
	name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Catalog' }
})

export default model('Catalog', CatalogSchema)