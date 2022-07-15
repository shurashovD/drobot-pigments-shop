import { model, Model, Schema } from 'mongoose';
import { ISdekPointDoc } from '../../shared';

const PointSchema = new Schema<ISdekPointDoc, Model<ISdekPointDoc>>({
	code: String,
	name: String,
	location: {
		country_code: String,
		region_code: Number,
		region: String,
		city_code: Number,
		city: String,
		fias_guid: String,
		postal_code: String,
		longitude: Number,
		latitude: Number,
		address: String,
		address_full: String,
	},
	address_comment: String,
	nearest_station: String,
	nearest_metro_station: String,
	work_time: String,
	phones: [
		{
			number: String,
			additional: String,
		},
	],
	email: String,
	note: String,
	type: String,
	owner_сode: String,
	take_only: Boolean,
	is_handout: Boolean,
	is_reception: Boolean,
	is_dressing_room: Boolean,
	have_cashless: Boolean,
	have_cash: Boolean,
	allowed_cod: Boolean,
	site: String,
	office_image_list: [
		{
			url: String,
			number: Number,
		},
	],
	work_time_list: [
		{
			day: String,
			time: String,
		},
	],
	work_time_exceptions: [
		{
			date: String,
			time: String,
			is_working: Boolean,
		},
	],
	weight_min: Number,
	weight_max: Number,
	fulfillment: Boolean,
	dimensions: [
		{
			width: Number,
			height: Number,
			depth: Number,
		},
	],
})

export default model('SdeckPoint', PointSchema)