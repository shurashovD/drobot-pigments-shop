/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./server/models/CatalogModel.ts":
/*!***************************************!*\
  !*** ./server/models/CatalogModel.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const CatalogSchema = new mongoose_2.Schema({
    archived: { type: Boolean, default: false },
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    parent: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Catalog' }
});
exports["default"] = (0, mongoose_1.model)('Catalog', CatalogSchema);


/***/ }),

/***/ "./server/models/CategoryModel.ts":
/*!****************************************!*\
  !*** ./server/models/CategoryModel.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const ProductModel_1 = __importDefault(__webpack_require__(/*! ./ProductModel */ "./server/models/ProductModel.ts"));
const FilterSchema = new mongoose_1.Schema({
    fields: [{
            products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }],
            value: { type: String, required: true }
        }],
    title: { type: String, required: true }
});
const filterModel = (0, mongoose_1.model)('Filter', FilterSchema);
const CategorySchema = new mongoose_1.Schema({
    archived: { type: Boolean, default: false },
    description: String,
    filters: [FilterSchema],
    frontEndKey: String,
    photo: [String],
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }],
    title: { type: String, required: true, unique: true }
});
// получить товары в категории;
CategorySchema.methods.getProducts = function (filters = [], limit, page, sortByPrice) {
    let result = this.products;
    for (const i in filters) {
        const filter = filters[i];
        result = result.filter(({ properties }) => properties.some((prop) => filter.some((item) => item === prop.toString())));
    }
    result = result
        .map((item) => {
        const variants = item.variants.map((variant) => {
            var _a;
            return (Object.assign(Object.assign({}, variant.toObject()), { id: (_a = variant._id) === null || _a === void 0 ? void 0 : _a.toString() }));
        });
        return Object.assign(Object.assign({}, item.toObject()), { id: item._id.toString(), variants });
    });
    const { length } = result;
    if (sortByPrice) {
        result = result.sort((a, b) => {
            if (!(a.price && b.price)) {
                return 1;
            }
            return a.price - b.price;
        });
    }
    if (limit && page) {
        const start = limit * (page - 1);
        const end = limit * page;
        return { length, products: result.slice(start, end) };
    }
    return { length, products: result };
};
// добавить фильтр в категорию;
CategorySchema.methods.addFilter = function (title) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.filters.some((item) => item.title === title)) {
                const filter = new filterModel({ title });
                this.filters.push(filter);
            }
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// удалить фильтр из категории;
CategorySchema.methods.rmFilter = function (filterId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = this.filters;
            const index = filters.findIndex(({ _id }) => _id.toString() === filterId);
            if (index === -1) {
                throw new Error('Фильтр не найден').userError = true;
            }
            const filterIsUsed = filters[index].fields.some(({ products }) => products.length > 0);
            if (filterIsUsed) {
                throw new Error('Есть продукты, использующие этот фильтр, фильтр не удалён').userError = true;
            }
            this.filters.splice(index, 1);
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// изменить название фильтра;
CategorySchema.methods.updFilter = function (filterId, title) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = this.filters;
            const index = filters.findIndex(({ _id }) => _id.toString() === filterId);
            if (index === -1) {
                const error = new Error(`Фильтр не найден`);
                error.userError = true;
                throw error;
            }
            this.filters[index].title = title;
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// добавить значение фильтра;
CategorySchema.methods.addField = function (filterId, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = this.filters;
            const index = filters.findIndex(({ _id }) => _id.toString() === filterId);
            if (index === -1) {
                const error = new Error(`Фильтр не найден`);
                error.userError = true;
                throw error;
            }
            const fieldExists = filters[index].fields.some(item => item.value.toLowerCase() === value.toLowerCase());
            if (fieldExists) {
                const error = new Error(`Критерий с названием ${value} уже существует в фильтре ${filters[index].title}`);
                error.userError = true;
                throw error;
            }
            this.filters[index].fields.push({ products: [], value });
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// сменить название значения фильтра;
CategorySchema.methods.updField = function (filterId, fieldId, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = this.filters;
            const index = filters.findIndex(({ _id }) => _id.toString() === filterId);
            if (index === -1) {
                const error = new Error(`Фильтр не найден`);
                error.userError = true;
                throw error;
            }
            const fieldIndex = filters[index].fields.findIndex(({ _id }) => (_id === null || _id === void 0 ? void 0 : _id.toString()) === fieldId);
            if (fieldIndex === -1) {
                const error = new Error(`Поле не найдено`);
                error.userError = true;
                throw error;
            }
            this.filters[index].fields[fieldIndex].value = value;
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// удаление значения фильтра;
CategorySchema.methods.rmField = function (filterId, fieldId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = this.filters;
            const index = filters.findIndex(({ _id }) => _id.toString() === filterId);
            if (index === -1) {
                const error = new Error(`Фильтр не найден`);
                error.userError = true;
                throw error;
            }
            const fieldIndex = filters[index].fields.findIndex(({ _id }) => (_id === null || _id === void 0 ? void 0 : _id.toString()) === fieldId);
            if (fieldIndex === -1) {
                const error = new Error(`Поле не найдено`);
                error.userError = true;
                throw error;
            }
            const fieldIsUsed = filters[index].fields[fieldIndex].products.length > 0;
            if (fieldIsUsed) {
                const error = new Error(`Есть продукты, использующие этот критерий, критерий не удалён`);
                error.userError = true;
                throw error;
            }
            this.filters[index].fields.splice(fieldIndex, 1);
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// добавление товара в категорию;
CategorySchema.methods.addProduct = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield ProductModel_1.default.findById(productId);
            if (!product) {
                const error = new Error(`Товар не найден`);
                error.userError = true;
                throw error;
            }
            if (product.parentCategory) {
                const error = new Error(`Товар находится в другой категории`);
                error.userError = true;
                throw error;
            }
            product.parentCategory = this._id;
            yield product.save();
            this.products.push(product._id);
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
// удаление товара из категории;
CategorySchema.methods.rmProduct = function (productId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield ProductModel_1.default.findById(productId);
            if (!product) {
                const error = new Error(`Товар не найден`);
                error.userError = true;
                throw error;
            }
            if (((_a = product.parentCategory) === null || _a === void 0 ? void 0 : _a.toString()) !== this._id.toString()) {
                const error = new Error(`Товар не из этой категории`);
                error.userError = true;
                throw error;
            }
            if (product.properties.length > 0) {
                const error = new Error(`Сначала удалите все значения фильтров товара`);
                error.userError = true;
                throw error;
            }
            yield ProductModel_1.default.findByIdAndUpdate(productId, {
                $unset: { parentCategory: true },
            });
            const products = this.products;
            const index = products.findIndex(item => item.toString() === productId);
            if (index !== -1) {
                this.products.splice(index, 1);
            }
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
exports["default"] = (0, mongoose_1.model)("Category", CategorySchema);


/***/ }),

/***/ "./server/models/ClientModel.ts":
/*!**************************************!*\
  !*** ./server/models/ClientModel.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const ClientSchema = new mongoose_1.Schema({
    addresses: [String],
    mail: String,
    name: String,
    orders: [{ type: mongoose_1.Types.ObjectId, ref: 'Order' }],
    tel: { type: String, required: true }
});
exports["default"] = (0, mongoose_1.model)('Client', ClientSchema);


/***/ }),

/***/ "./server/models/CurrencyModel.ts":
/*!****************************************!*\
  !*** ./server/models/CurrencyModel.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const CurrencySchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    identifier: { type: String, required: true },
    isoCode: { type: String, required: true },
    name: { type: String, required: true }
});
exports["default"] = (0, mongoose_1.model)('Currency', CurrencySchema);


/***/ }),

/***/ "./server/models/OrderModel.ts":
/*!*************************************!*\
  !*** ./server/models/OrderModel.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const OrderSchema = new mongoose_1.Schema({
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' },
    date: { type: Date, default: Date.now },
    delivery: {
        address: { type: String }
    },
    products: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true }
        }],
    number: { type: Number, default: 1 },
    status: { type: String, default: 'new' },
    total: Number
});
exports["default"] = (0, mongoose_1.model)('Order', OrderSchema);


/***/ }),

/***/ "./server/models/ProductModel.ts":
/*!***************************************!*\
  !*** ./server/models/ProductModel.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const CurrencyModel_1 = __importDefault(__webpack_require__(/*! ./CurrencyModel */ "./server/models/CurrencyModel.ts"));
const UomModel_1 = __importDefault(__webpack_require__(/*! ./UomModel */ "./server/models/UomModel.ts"));
const CategoryModel_1 = __importDefault(__webpack_require__(/*! ./CategoryModel */ "./server/models/CategoryModel.ts"));
const VariantSchema = new mongoose_1.Schema({
    identifier: String,
    name: String,
    photo: String,
    photoUpdate: String,
    price: Number,
    value: String
});
const variantModel = (0, mongoose_1.model)("Variant", VariantSchema);
const ProductSchema = new mongoose_1.Schema({
    archived: { type: Boolean, default: false },
    available: { type: Number, default: 0 },
    currency: { type: mongoose_1.Schema.Types.ObjectId, ref: "Currency" },
    description: String,
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Catalog" },
    parentCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
    photo: [String],
    photoUpdated: String,
    properties: [mongoose_1.Schema.Types.ObjectId],
    price: { type: Number },
    uom: { type: mongoose_1.Schema.Types.ObjectId, ref: "Uom" },
    variantsLabel: String,
    variants: [VariantSchema],
    weight: { type: Number },
});
ProductSchema.statics.getProduct = function (id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield this.findById(id).populate([
                { path: "currency", model: CurrencyModel_1.default, select: "name" },
                { path: "uom", model: UomModel_1.default, select: "name" },
            ]);
            if (!product)
                return null;
            const variants = ((_a = product.variants) === null || _a === void 0 ? void 0 : _a.map(item => {
                var _a;
                return (Object.assign(Object.assign({}, item.toObject()), { id: ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) || '' }));
            })) || [];
            const result = {
                archived: product.archived,
                available: product.available,
                category: (_b = product.parentCategory) === null || _b === void 0 ? void 0 : _b.toString(),
                currency: product.currency,
                description: product.description,
                id: product._id.toString(),
                name: product.name,
                photo: product.photo,
                price: product.price,
                properties: product.properties.map((item) => item.toString()),
                uom: product.uom,
                variants
            };
            if (product.variantsLabel) {
                result.variantsLabel = product.variantsLabel;
            }
            return result;
        }
        catch (e) {
            throw e;
        }
    });
};
ProductSchema.methods.setFilter = function (fieldId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield CategoryModel_1.default.findById(this.parentCategory);
            if (!category) {
                const error = new Error("Категория товара не найдена");
                error.userError = true;
                throw error;
            }
            const filterIndex = category.filters.findIndex(({ fields }) => fields.some(({ _id }) => (_id === null || _id === void 0 ? void 0 : _id.toString()) === fieldId.toString()));
            if (filterIndex === -1) {
                const error = new Error("Категория не содержит фильтра с таким значением");
                error.userError = true;
                throw error;
            }
            const fieldIndex = category.filters[filterIndex].fields.findIndex(({ _id }) => (_id === null || _id === void 0 ? void 0 : _id.toString()) === fieldId.toString());
            const productInField = category.filters[filterIndex].fields[fieldIndex].products.some(item => item.toString() === this._id.toString());
            if (!productInField) {
                category.filters[filterIndex].fields[fieldIndex].products.push(this._id);
                yield category.save();
            }
            const productHasProperty = this.properties.some((item) => item.toString() === fieldId.toString());
            if (!productHasProperty) {
                this.properties.push(fieldId);
            }
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
ProductSchema.methods.resetFilter = function (fieldId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield CategoryModel_1.default.findById(this.parentCategory);
            if (!category) {
                const error = new Error("Категория товара не найдена");
                error.userError = true;
                throw error;
            }
            const filterIndex = category.filters.findIndex(({ fields }) => fields.some(({ _id }) => (_id === null || _id === void 0 ? void 0 : _id.toString()) === fieldId.toString()));
            if (filterIndex === -1) {
                const error = new Error("Категория не содержит фильтра с таким значением");
                error.userError = true;
                throw error;
            }
            const fieldIndex = category.filters[filterIndex].fields.findIndex(({ _id }) => (_id === null || _id === void 0 ? void 0 : _id.toString()) === fieldId.toString());
            const productIndex = category.filters[filterIndex].fields[fieldIndex].products.findIndex(item => item.toString() === this._id.toString());
            if (productIndex !== -1) {
                category.filters[filterIndex].fields[fieldIndex].products.splice(productIndex, 1);
                yield category.save();
            }
            const propertyIndex = this.properties.findIndex((item) => item.toString() === fieldId.toString());
            if (propertyIndex !== -1) {
                this.properties.splice(propertyIndex, 1);
            }
            return yield this.save();
        }
        catch (e) {
            throw e;
        }
    });
};
/*
ProductSchema.methods.createBind = async function(this: IProduct, bindTitle: string, productLabel: string): Promise<IProduct> {
    try {
        if ( this.parentBind.length > 0 ) {
            const error = new Error("Связанный товар не может содержать связь")
            error.userError = true
            throw error
        }

        const productHasBind = this.binds.some(({ title }) => title === bindTitle)
        if ( productHasBind ) {
            const error = new Error('Товар уже содержит связь с таким названием')
            error.userError = true
            throw error
        }

        this.binds.push(new bindModel({ products: [], productLabel, title: bindTitle }))
        return await this.save()
    }
    catch (e) { throw e }
}

ProductSchema.methods.updateBind = async function(this: IProduct, bindId: string, bindTitle: string, productLabel: string): Promise<IProduct> {
    try {
        const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
        if ( bindIndex === -1 ) {
            const error = new Error("Связь не найдена")
            error.userError = true
            throw error
        }

        this.binds[bindIndex].title = bindTitle
        this.binds[bindIndex].productLabel = productLabel
        return await this.save()
    }
    catch (e) { throw e }
}

ProductSchema.methods.deleteBind = async function(this: IProduct, bindId: string): Promise<IProduct> {
    try {
        const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
        if ( bindIndex === -1 ) {
            const error = new Error("Связь не найдена")
            error.userError = true
            throw error
        }

        if (this.binds[bindIndex].products.length > 0) {
            const error = new Error("Сначала отвяжите все товары")
            error.userError = true
            throw error
        }

        this.binds.splice(bindIndex, 1)
        return await this.save()
    }
    catch (e) { throw e }
}

ProductSchema.methods.bindProduct = async function(this: IProduct, bindId: string, bindLabel: string, productId: string): Promise<IProduct> {
    try {
        if ( this.parentBind.length > 0 ) {
            const error = new Error("Связанный товар не может содержать связь")
            error.userError = true
            throw error
        }
        const product: IProduct | null = await model('Product').findById(productId)
        if ( !product ) {
            const error = new Error("Товар для связи не найден")
            error.userError = true
            throw error
        }
        const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
        if ( bindIndex === -1 ) {
            const error = new Error("Связь не найдена")
            error.userError = true
            throw error
        }

        const productExistsParentBind = product.parentBind.some(item => item.toString() === this._id?.toString())
        if ( !productExistsParentBind ) {
            product.parentBind.push(this._id)
            await product.save()
        }

        const productIsBinded = this.binds.some(({ products }) =>
            products.some(({ product }) => product.toString() === productId)
        )
        if ( !productIsBinded ) {
            this.binds[bindIndex].products.push({
                label: bindLabel,
                product: product._id,
            })
        }

        return await this.save()
    }
    catch (e) { throw e }
}

ProductSchema.methods.reBindProduct = async function(this: IProduct, bindId: string, productId: string): Promise<IProduct> {
    try {
        const product: IProduct | null = await model('Product').findById(productId)
        if ( !product ) {
            const error = new Error("Связанный товар не найден")
            error.userError = true
            throw error
        }

        const parentBindIndex = product.parentBind.findIndex(item => item.toString() === this._id.toString())
        if ( parentBindIndex !== -1 ) {
            product.parentBind.splice(parentBindIndex, 1)
            await product.save()
        }

        const bindIndex = this.binds.findIndex(({ _id }) => _id?.toString() === bindId)
        if ( bindIndex === -1 ) {
            const error = new Error("Связь не найдена")
            error.userError = true
            throw error
        }

        const bindProductIndex = this.binds[bindIndex].products.findIndex(({ product }) => product.toString() === productId)
        if ( bindProductIndex !== -1 ) {
            this.binds[bindIndex].products.splice(bindProductIndex, 1)
        }

        return await this.save()
    }
    catch (e) { throw e }
}
*/
exports["default"] = (0, mongoose_1.model)("Product", ProductSchema);


/***/ }),

/***/ "./server/models/UomModel.ts":
/*!***********************************!*\
  !*** ./server/models/UomModel.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const UomSchema = new mongoose_1.Schema({
    description: { type: String },
    identifier: { type: String, required: true },
    name: { type: String, required: true }
});
exports["default"] = (0, mongoose_1.model)('Uom', UomSchema);


/***/ }),

/***/ "./server/moyskladAPI/hooks.ts":
/*!*************************************!*\
  !*** ./server/moyskladAPI/hooks.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteHook = exports.disableHook = exports.enableHook = exports.createHook = exports.getHooks = void 0;
const node_fetch_1 = __importDefault(__webpack_require__(/*! node-fetch */ "node-fetch"));
const config_1 = __importDefault(__webpack_require__(/*! config */ "config"));
const moysklad_1 = __importDefault(__webpack_require__(/*! moysklad */ "moysklad"));
const moyskladCredentails = config_1.default.get("moysklad");
const ms = (0, moysklad_1.default)(Object.assign({ fetch: node_fetch_1.default }, moyskladCredentails));
const paths = {
    webhook: "entity/webhook",
};
const getHooks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hooks = yield ms.GET(paths.webhook);
        return hooks.rows;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.getHooks = getHooks;
const createHook = (action, url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            action,
            url,
            entityType: "service",
        };
        yield ms.POST({ path: paths.webhook, payload });
        return true;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.createHook = createHook;
const enableHook = (hookId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { enabled: true };
        yield ms.PUT({ path: `${paths.webhook}/${hookId}`, payload });
        return true;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.enableHook = enableHook;
const disableHook = (hookId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { enabled: true };
        yield ms.PUT({ path: `${paths.webhook}/${hookId}`, payload });
        return true;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.disableHook = disableHook;
const deleteHook = (hookId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ms.DELETE(`${paths.webhook}/${hookId}`);
        return true;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.deleteHook = deleteHook;


/***/ }),

/***/ "./server/moyskladAPI/synchronization.ts":
/*!***********************************************!*\
  !*** ./server/moyskladAPI/synchronization.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.variantSync = exports.productSync = exports.productFolderSync = exports.uomSync = exports.currencySync = void 0;
const node_fetch_1 = __importStar(__webpack_require__(/*! node-fetch */ "node-fetch"));
const config_1 = __importDefault(__webpack_require__(/*! config */ "config"));
const moysklad_1 = __importDefault(__webpack_require__(/*! moysklad */ "moysklad"));
const CurrencyModel_1 = __importDefault(__webpack_require__(/*! ../models/CurrencyModel */ "./server/models/CurrencyModel.ts"));
const UomModel_1 = __importDefault(__webpack_require__(/*! ../models/UomModel */ "./server/models/UomModel.ts"));
const CatalogModel_1 = __importDefault(__webpack_require__(/*! ../models/CatalogModel */ "./server/models/CatalogModel.ts"));
const ProductModel_1 = __importDefault(__webpack_require__(/*! ../models/ProductModel */ "./server/models/ProductModel.ts"));
const promises_1 = __webpack_require__(/*! fs/promises */ "fs/promises");
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const fs_1 = __webpack_require__(/*! fs */ "fs");
const moyskladCredentails = config_1.default.get("moysklad");
const ms = (0, moysklad_1.default)(Object.assign({ fetch: node_fetch_1.default }, moyskladCredentails));
const paths = {
    assortiment: "entity/assortment",
    currency: "entity/currency",
    product: "entity/product",
    productFolder: "entity/productfolder",
    token: "security/token",
    varaint: "entity/variant",
    uom: "entity/uom",
};
const downloadPhoto = (props) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Authorization, id, photo } = props;
        const image = yield ms.GET(photo);
        if (!image.rows[0]) {
            return { filename: null, updated: null };
        }
        const downloadUrl = image.rows[0].meta.downloadHref;
        const filename = image.rows[0].filename;
        const updated = image.rows[0].updated;
        if (updated === props.updated) {
            return { filename, updated };
        }
        const res = yield (0, node_fetch_1.default)(downloadUrl, {
            redirect: "follow",
            headers: new node_fetch_1.Headers({
                Authorization,
            }),
        }).then((res) => {
            if (res.redirected) {
                const text = (0, node_fetch_1.default)(res.url);
                return text;
            }
        });
        if (res) {
            const dirPath = path_1.default.join(__dirname, 'static', 'img', id);
            const filePath = path_1.default.join(dirPath, filename);
            try {
                yield (0, promises_1.access)(dirPath);
                const files = yield (0, promises_1.readdir)(dirPath);
                for (const i in files) {
                    yield (0, promises_1.rm)(path_1.default.join(dirPath, files[i]));
                }
                const fd = yield (0, promises_1.open)(filePath, 'w');
                yield fd.close();
            }
            catch (_a) {
                try {
                    yield (0, promises_1.mkdir)(dirPath, { recursive: true });
                    const fd = yield (0, promises_1.open)(filePath, "w");
                    yield fd.close();
                }
                catch (e) {
                    throw e;
                }
            }
            const fileStream = (0, fs_1.createWriteStream)(filePath);
            yield new Promise((resolve, reject) => {
                res.body.pipe(fileStream);
                res.body.on("error", reject);
                fileStream.on("finish", resolve);
            });
        }
        return { filename, updated };
    }
    catch (e) {
        throw e;
    }
});
const currencySync = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currency = yield ms.GET(paths.currency);
        for (let i in currency.rows) {
            const { id, name, fullName, isoCode } = currency.rows[i];
            const cursor = yield CurrencyModel_1.default.findOne({ identifier: { $eq: id } });
            if (cursor) {
                cursor.name = name;
                cursor.fullName = fullName;
                cursor.isoCode = isoCode;
                yield cursor.save();
            }
            else {
                yield new CurrencyModel_1.default({
                    identifier: id,
                    name,
                    fullName,
                    isoCode,
                }).save();
            }
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.currencySync = currencySync;
const uomSync = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uom = yield ms.GET(paths.uom);
        for (let i in uom.rows) {
            const { id, name, description } = uom.rows[i];
            const cursor = yield UomModel_1.default.findOne({
                identifier: { $eq: id },
            });
            if (cursor) {
                cursor.name = name;
                cursor.description = description;
                yield cursor.save();
            }
            else {
                yield new UomModel_1.default({ identifier: id, name, description }).save();
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.uomSync = uomSync;
const productFolderSync = () => __awaiter(void 0, void 0, void 0, function* () {
    const getLevel = function (arr, item, level = 0) {
        if (!item.parentId)
            return level;
        return getLevel(arr, arr.find((el) => el.id === item.parentId), ++level);
    };
    try {
        const folders = yield ms.GET(paths.productFolder);
        const rows = folders.rows.map(({ id, archived, name, productFolder }) => ({
            id,
            archived,
            name,
            parentId: productFolder === null || productFolder === void 0 ? void 0 : productFolder.meta.href.split("/").pop(),
        }));
        const sortRows = rows.sort((a, b) => getLevel(rows, b) - getLevel(rows, a));
        const categories = yield CatalogModel_1.default.find();
        // удаление категорий, не содержащихся в "Мой склад";
        const deletedIdentifier = categories.map(({ identifier }) => identifier)
            .filter((item) => sortRows.every(({ id }) => id !== item));
        yield CatalogModel_1.default.deleteMany({
            identifier: { $in: deletedIdentifier },
        });
        // добавление категорий, не содержащихся в БД;
        const identifierInDB = categories.map(({ identifier }) => identifier);
        const addedRows = sortRows.filter(({ id }) => identifierInDB.every((item) => item !== id));
        for (let i in addedRows) {
            const { id, archived, name, parentId } = addedRows[i];
            const parent = yield CatalogModel_1.default.findOne({
                identifier: { $eq: parentId },
            });
            if (parent) {
                yield new CatalogModel_1.default({
                    identifier: id,
                    archived,
                    name,
                    parent: parent._id,
                }).save();
            }
            else {
                yield new CatalogModel_1.default({ identifier: id, archived, name }).save();
            }
        }
        // обновление данных из "Мой склад";
        for (let i in sortRows) {
            const { id, archived, name, parentId } = sortRows[i];
            const parent = yield CatalogModel_1.default.findOne({
                identifier: { $eq: parentId },
            });
            if (parent) {
                yield CatalogModel_1.default.findOneAndUpdate({ identifier: { $eq: id } }, { archived, name, parent: parent._id });
            }
            else {
                yield CatalogModel_1.default.findOneAndUpdate({ identifier: { $eq: id } }, { archived, name });
                yield CatalogModel_1.default.findOneAndUpdate({ identifier: { $eq: id } }, { $unset: { parent: true } });
            }
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.productFolderSync = productFolderSync;
const productSync = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    try {
        const goods = yield ms.GET(paths.product);
        const Authorization = ms.getAuthHeader();
        const normalize = goods.rows.map(({ id, archived, description, images, name, productFolder, salePrices, uom, weight, }) => {
            var _a;
            return ({
                id,
                archived,
                description,
                name,
                price: salePrices[0].value,
                weight,
                parentId: productFolder === null || productFolder === void 0 ? void 0 : productFolder.meta.href.split("/").pop(),
                currency: salePrices[0].currency.meta.href.split("/").pop(),
                photo: (_a = images === null || images === void 0 ? void 0 : images.meta) === null || _a === void 0 ? void 0 : _a.href,
                uom: uom === null || uom === void 0 ? void 0 : uom.meta.href.split("/").pop(),
            });
        });
        const products = yield ProductModel_1.default.find();
        const categories = yield CatalogModel_1.default.find();
        const currencies = yield CurrencyModel_1.default.find();
        const uoms = yield UomModel_1.default.find();
        // удаление продуктов, не содержащихся в "Мой склад";
        const deletedIdentifier = products
            .map(({ identifier }) => identifier)
            .filter((item) => normalize.every(({ id }) => id !== item));
        for (const i in deletedIdentifier) {
            const id = deletedIdentifier[i];
            const product = yield ProductModel_1.default.findByIdAndDelete(id);
            if (product === null || product === void 0 ? void 0 : product.photo[0]) {
                try {
                    yield (0, promises_1.rm)(path_1.default.resolve(product.photo[0]), { recursive: true });
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        // добавление продуктов, не содержащихся в БД;
        const addedRows = normalize.filter(({ id }) => products.every(({ identifier }) => identifier !== id));
        for (let i in addedRows) {
            console.log(i, addedRows.length);
            const item = addedRows[i];
            const { archived, description, id, name, parentId, photo, price, weight, } = item;
            const currency = currencies.find(({ identifier }) => identifier === item.currency);
            const parent = (_b = categories.find(({ identifier }) => identifier === parentId)) === null || _b === void 0 ? void 0 : _b._id;
            const uom = uoms.find(({ identifier }) => identifier === item.uom);
            let product;
            if (parent) {
                product = yield new ProductModel_1.default({
                    archived,
                    currency,
                    description,
                    identifier: id,
                    name,
                    parent,
                    price,
                    uom,
                    weight,
                }).save();
            }
            else {
                product = yield new ProductModel_1.default({
                    archived,
                    currency,
                    identifier: id,
                    name,
                    price,
                    uom,
                    weight,
                }).save();
            }
            if (photo && product) {
                const { filename, updated } = yield downloadPhoto({ Authorization, photo, id: ((_c = product._id) === null || _c === void 0 ? void 0 : _c.toString()) || '' });
                if (filename && updated) {
                    product.photo = [
                        `/static/img/${(_d = product._id) === null || _d === void 0 ? void 0 : _d.toString()}/${filename}`,
                    ];
                    product.photoUpdated = updated;
                    yield product.save();
                }
            }
        }
        // обновление измененных продуктов;
        for (let i in normalize) {
            console.log(i, normalize.length);
            const item = normalize[i];
            const { archived, description, id, name, parentId, photo, price, weight, } = item;
            const currency = currencies.find(({ identifier }) => identifier === item.currency);
            const parent = (_e = categories.find(({ identifier }) => identifier === parentId)) === null || _e === void 0 ? void 0 : _e._id;
            const uom = uoms.find(({ identifier }) => identifier === item.uom);
            const product = yield ProductModel_1.default.findOne({
                identifier: { $eq: id },
            });
            if (product) {
                product.archived = archived;
                if (currency) {
                    product.currency = currency._id;
                }
                product.description = description;
                product.name = name;
                if (parent) {
                    product.parent = parent._id;
                }
                product.price = price;
                if (uom) {
                    product.uom = uom._id;
                }
                product.weight = weight;
                if (photo) {
                    const { filename, updated } = yield downloadPhoto({
                        Authorization,
                        photo,
                        id: product._id.toString(),
                        updated: product.photoUpdated,
                    });
                    if (filename && updated) {
                        product.photo = [
                            `/static/img/${(_f = product._id) === null || _f === void 0 ? void 0 : _f.toString()}/${filename}`,
                        ];
                        product.photoUpdated = updated;
                    }
                    else {
                        product.photoUpdated = undefined;
                        if (product.photo[0]) {
                            try {
                                yield (0, promises_1.rm)(path_1.default.resolve(__dirname, product.photo[0]), { recursive: true });
                            }
                            catch (e) {
                                console.log(e);
                            }
                            product.photo = [];
                        }
                    }
                }
                else {
                    product.photoUpdated = undefined;
                    if (product.photo[0]) {
                        try {
                            yield (0, promises_1.rm)(path_1.default.resolve(__dirname, product.photo[0]), { recursive: true });
                        }
                        catch (e) {
                            console.log(e);
                        }
                        product.photo = [];
                    }
                }
                yield product.save();
            }
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.productSync = productSync;
const variantSync = () => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j;
    try {
        const variants = yield ms.GET(paths.varaint);
        const Authorization = ms.getAuthHeader();
        const normalize = variants.rows.map((item) => {
            var _a, _b;
            return ({
                identifier: item.id,
                name: item.name,
                photo: (_b = (_a = item.images) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.href,
                price: item.salePrices[0].value,
                productId: item.product.meta.href.split('/').pop(),
                value: item.characteristics[0].value,
                variantsLabel: item.characteristics[0].name
            });
        });
        const products = yield ProductModel_1.default.find({ archived: false });
        // удаление вариантов;
        for (const i in products) {
            const rmIds = [];
            const product = products[i];
            for (const i in product.variants) {
                const variant = product.variants[i];
                const removeFlag = !normalize.some(({ identifier }) => variant.identifier === identifier);
                if (removeFlag) {
                    rmIds.push((_g = variant._id) === null || _g === void 0 ? void 0 : _g.toString());
                }
            }
            for (const i in rmIds) {
                const id = rmIds[i];
                const index = product.variants.findIndex(({ _id }) => id === (_id === null || _id === void 0 ? void 0 : _id.toString()));
                if (index !== -1) {
                    if (typeof product.variants[index].photo === 'string') {
                        const rmPath = path_1.default.join(__dirname, product.variants[index].photo || '');
                        try {
                            yield (0, promises_1.rm)(rmPath);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                    product.variants.splice(index, 1);
                    yield product.save();
                }
            }
            if (product.variants.length === 0) {
                yield ProductModel_1.default.findByIdAndUpdate(product._id, { $unset: { variantsLabel: true } });
            }
        }
        // добавление и обновление вариантов;
        for (const i in normalize) {
            console.log(i, normalize.length);
            const mod = normalize[i];
            const product = yield ProductModel_1.default.findOne({
                identifier: mod.productId,
            });
            if (!product) {
                console.log(`Товар ${mod.productId} не найден`);
                continue;
            }
            if (product.variantsLabel !== mod.variantsLabel) {
                product.variantsLabel = mod.variantsLabel;
            }
            const index = product.variants.findIndex(({ identifier }) => identifier === mod.identifier);
            if (index === -1) {
                product.variants.push({
                    identifier: mod.identifier,
                    name: mod.name,
                    price: mod.price,
                    value: mod.value
                });
            }
            else {
                product.variants[index].name = mod.name;
                product.variants[index].price = mod.price;
                product.variants[index].value = mod.value;
            }
            yield product.save();
            const ind = product.variants.findIndex(({ identifier }) => identifier === mod.identifier);
            if (ind !== -1) {
                const { filename, updated } = yield downloadPhoto({
                    Authorization,
                    photo: mod.photo,
                    id: ((_h = product.variants[ind]._id) === null || _h === void 0 ? void 0 : _h.toString()) || "",
                    updated: product.variants[ind].photoUpdate,
                });
                if (filename && updated) {
                    product.variants[ind].photo = `/static/img/${(_j = product.variants[ind]._id) === null || _j === void 0 ? void 0 : _j.toString()}/${filename}`;
                    product.variants[ind].photoUpdate = updated;
                    yield product.save();
                }
            }
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.variantSync = variantSync;


/***/ }),

/***/ "./server/routes/admin.routes.ts":
/*!***************************************!*\
  !*** ./server/routes/admin.routes.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __webpack_require__(/*! express */ "express");
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const config_1 = __importDefault(__webpack_require__(/*! config */ "config"));
const promises_1 = __webpack_require__(/*! fs/promises */ "fs/promises");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    try {
        return res.render("login");
    }
    catch (e) {
        console.log(e);
        return res.send('Что-то пошло не так...');
    }
});
router.post("/", body_parser_1.default.urlencoded({ extended: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, pass } = req.body;
        const { login: configLogin, password: configPassword } = config_1.default.get('panel');
        if (login === configLogin && pass === configPassword) {
            req.session.isAdmin = true;
            return res.redirect("/admin/panel");
        }
        return res.redirect("/admin");
    }
    catch (e) {
        console.log(e);
        return res.send("Что-то пошло не так...");
    }
}));
router.get('/panel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.isAdmin) {
            const tempPath = path_1.default.join(__dirname, "static", "admin", "index.html");
            const template = yield (0, promises_1.readFile)(tempPath, { encoding: "utf-8" });
            return res.send(template);
        }
        return res.redirect('/admin');
    }
    catch (e) {
        console.log(e);
        return res.send("Что-то пошло не так...");
    }
}));
router.get('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw err;
            }
            return res.redirect("/admin");
        });
    }
    catch (e) {
        console.log(e);
        return res.send('Что-то пошло не так...');
    }
});
router.get('*', (req, res) => {
    return res.redirect('/admin/panel');
});
exports["default"] = router;


/***/ }),

/***/ "./server/routes/categroies.routes.ts":
/*!********************************************!*\
  !*** ./server/routes/categroies.routes.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const express_1 = __webpack_require__(/*! express */ "express");
const promises_1 = __webpack_require__(/*! fs/promises */ "fs/promises");
const multer_1 = __importStar(__webpack_require__(/*! multer */ "multer"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const CategoryModel_1 = __importDefault(__webpack_require__(/*! ../models/CategoryModel */ "./server/models/CategoryModel.ts"));
const ProductModel_1 = __importDefault(__webpack_require__(/*! ../models/ProductModel */ "./server/models/ProductModel.ts"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dirPath = path_1.default.join(__dirname, 'static', 'img', id);
        try {
            yield (0, promises_1.access)(dirPath);
            const files = yield (0, promises_1.readdir)(dirPath);
            for (const i in files) {
                const file = files[i];
                try {
                    yield (0, promises_1.rm)(path_1.default.join(dirPath, file), { recursive: true });
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        catch (_a) {
            try {
                yield (0, promises_1.mkdir)(dirPath, { recursive: true });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }
        cb(null, dirPath);
    }),
    filename: (req, file, cb) => {
        const filename = Date.now() + path_1.default.extname(file.originalname);
        cb(null, filename);
    }
});
const upload = (0, multer_1.default)({ storage });
// получение всех категорий;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryModel_1.default.find({ archived: false });
        return res.json(categories);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// получение отдельной категории;
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        return res.json(category);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// получение товаров категории;
router.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filters, limit, page, sortByPrice } = req.query;
        const { id } = req.params;
        const category = yield CategoryModel_1.default.findById(id).populate({ path: 'products', model: ProductModel_1.default });
        if (!category) {
            return res.status(500).json({ message: "Категория не найдена" });
        }
        const products = category.getProducts(filters ? JSON.parse(filters) : undefined, limit, page, sortByPrice);
        return res.json(products);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// добавление товаров в категорию;
router.post('/products/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { products } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: "Категория не найдена" });
        }
        for (const productId of products) {
            yield category.addProduct(productId);
        }
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// удаление товара из категории;
router.delete('/products/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { productId } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: "Категория не найдена" });
        }
        yield category.rmProduct(productId);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// создание категории;
router.post("/", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        yield CategoryModel_1.default.create({ title });
        return res.end();
    }
    catch (e) {
        if (e.code === 11000) {
            return res.status(500).json({ message: "Категория с таким именем уже существует" });
        }
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// изменение название и описания категории;
router.put("/:id", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json('Категория не найдена');
        }
        const { description, title } = req.body;
        category.description = description;
        category.title = title;
        yield category.save();
        return res.end();
    }
    catch (e) {
        if (e.code === 11000) {
            return res
                .status(500)
                .json({ message: "Категория с таким именем уже существует" });
        }
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// удаление категории;
router.delete("/:id", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield CategoryModel_1.default.findByIdAndUpdate(id, { archived: true });
        return res.end();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// добавление фотографии категории;
router.put("/photo/:id", upload.single('photo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json('Категория не найдена');
        }
        const filename = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
        if (filename) {
            category.photo = [`/static/img/${id}/${filename}`];
        }
        yield category.save();
        return res.end();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// удаление фотографии категории;
router.delete("/photo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json('Категория не найдена');
        }
        const dirPath = path_1.default.join(__dirname, 'static', 'img', id);
        try {
            const imgDir = yield (0, promises_1.readdir)(dirPath);
            for (const i in imgDir) {
                const file = path_1.default.join(dirPath, imgDir[i]);
                yield (0, promises_1.rm)(file);
            }
        }
        catch (e) {
            console.log(e);
        }
        category.photo = [];
        yield category.save();
        return res.end();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
// создание фильтра категории;
router.post('/filter/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        yield category.addFilter(title);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// изменение названия фильтра категории;
router.put("/filter/:id", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filterId, title } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        yield category.updFilter(filterId, title);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// удаление фильтра категории;
router.delete('/filter/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filterId } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        yield category.rmFilter(filterId);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// добавление значения фильтра;
router.post('/filter/value/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filterId, value } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        yield category.addField(filterId, value);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// изменение названия значения фильтра;
router.put('/filter/value/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filterId, fieldId, value } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        yield category.updField(filterId, fieldId, value);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// удаление значения фильтра;
router.delete('/filter/value/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { filterId, fieldId } = req.body;
        const category = yield CategoryModel_1.default.findById(id);
        if (!category) {
            return res.status(500).json({ message: 'Категория не найдена' });
        }
        yield category.rmField(filterId, fieldId);
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
exports["default"] = router;


/***/ }),

/***/ "./server/routes/moySklad.routes.ts":
/*!******************************************!*\
  !*** ./server/routes/moySklad.routes.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const hooks_1 = __webpack_require__(/*! ./../moyskladAPI/hooks */ "./server/moyskladAPI/hooks.ts");
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const express_1 = __webpack_require__(/*! express */ "express");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const ProductModel_1 = __importDefault(__webpack_require__(/*! ../models/ProductModel */ "./server/models/ProductModel.ts"));
const CatalogModel_1 = __importDefault(__webpack_require__(/*! ../models/CatalogModel */ "./server/models/CatalogModel.ts"));
const synchronization_1 = __webpack_require__(/*! ../moyskladAPI/synchronization */ "./server/moyskladAPI/synchronization.ts");
const router = (0, express_1.Router)();
router.get("/folder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogs = yield CatalogModel_1.default.find({
            archived: false,
            parent: { $exists: false },
        });
        const products = yield ProductModel_1.default.find({
            archived: false,
            parent: { $exists: false },
        });
        return res.json({ catalogs, products });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.get("/folder-free-products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogs = yield CatalogModel_1.default.find({
            archived: false,
            parent: { $exists: false },
        });
        const products = yield ProductModel_1.default.find({
            archived: false,
            parent: { $exists: false },
        });
        return res.json({ catalogs, products });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.get('/folder-free-products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const catalog = yield CatalogModel_1.default.findById(id);
        if (!catalog) {
            return res.status(500).json({ message: 'Папка не найдена в БД "Мой склад"' });
        }
        const catalogs = yield CatalogModel_1.default.find({
            archived: false,
            parent: new mongoose_1.Types.ObjectId(id),
        });
        const products = yield ProductModel_1.default.find({
            archived: false,
            parent: new mongoose_1.Types.ObjectId(id),
            parentCategory: { $exists: false }
        });
        return res.json({ catalog, catalogs, products });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.get("/folder/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const catalog = yield CatalogModel_1.default.findById(id);
        if (!catalog) {
            return res
                .status(500)
                .json({ message: 'Папка не найдена в БД "Мой склад"' });
        }
        const catalogs = yield CatalogModel_1.default.find({
            archived: false,
            parent: new mongoose_1.Types.ObjectId(id),
        });
        const products = yield ProductModel_1.default.find({
            archived: false,
            parent: new mongoose_1.Types.ObjectId(id),
        });
        return res.json({ catalog, catalogs, products });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.get('/sync', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, synchronization_1.currencySync)();
        yield (0, synchronization_1.uomSync)();
        yield (0, synchronization_1.productFolderSync)();
        yield (0, synchronization_1.productSync)();
        yield (0, synchronization_1.variantSync)();
        return res.end();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Что-то пошло не так...' });
    }
}));
router.get('/hooks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hooks = yield (0, hooks_1.getHooks)();
        return res.json(hooks);
    }
    catch (e) {
        console.log(e);
    }
}));
router.post("/hooks", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { action, url } = req.body;
        yield (0, hooks_1.createHook)(action, url);
        return res.end();
    }
    catch (e) {
        console.log(e);
    }
}));
router.put("/hooks/enable/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, hooks_1.enableHook)(id);
        return res.end();
    }
    catch (e) {
        console.log(e);
    }
}));
router.put("/hooks/disable/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, hooks_1.disableHook)(id);
        return res.end();
    }
    catch (e) {
        console.log(e);
    }
}));
router.delete("/hooks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, hooks_1.deleteHook)(id);
        return res.end();
    }
    catch (e) {
        console.log(e);
    }
}));
exports["default"] = router;


/***/ }),

/***/ "./server/routes/orders.routes.ts":
/*!****************************************!*\
  !*** ./server/routes/orders.routes.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const express_1 = __webpack_require__(/*! express */ "express");
const ClientModel_1 = __importDefault(__webpack_require__(/*! ../models/ClientModel */ "./server/models/ClientModel.ts"));
const OrderModel_1 = __importDefault(__webpack_require__(/*! ../models/OrderModel */ "./server/models/OrderModel.ts"));
const ProductModel_1 = __importDefault(__webpack_require__(/*! ../models/ProductModel */ "./server/models/ProductModel.ts"));
const formatter = Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit'
});
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderModel_1.default.find().populate([
            { path: "client", model: ClientModel_1.default },
            { path: "products", populate: { path: 'product', model: ProductModel_1.default } },
        ]).then(doc => doc.map((item) => {
            const date = formatter.format(Date.parse(item.date.toString()));
            return Object.assign(Object.assign({}, item.toObject()), { date });
        }));
        return res.json(orders);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Что-то пошло не так...' });
    }
}));
router.get("/cart-total", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = JSON.parse(req.query.products);
        const ids = products.map(({ productId }) => productId);
        const prices = yield ProductModel_1.default.find({ _id: { $in: ids } }).select('price');
        if (!prices) {
            return res.status(500).json({ message: 'Не удалось посчитать сумму заказа' });
        }
        const total = prices.reduce((total, { _id, price }) => {
            var _a;
            const quantity = ((_a = products.find(({ productId }) => productId === (_id === null || _id === void 0 ? void 0 : _id.toString()))) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
            return total + (price || 0) * quantity;
        }, 0);
        return res.json(total);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield OrderModel_1.default.findById(id)
            .populate([
            { path: "client", model: ClientModel_1.default },
            {
                path: "products",
                populate: { path: "product", model: ProductModel_1.default },
            },
        ])
            .then((doc) => {
            if (!doc)
                return doc;
            const date = formatter.format(Date.parse(doc.date.toString()));
            return Object.assign(Object.assign({}, doc.toObject()), { date });
        });
        if (!order) {
            return res.status(500).json({ message: 'Завка не найдена' });
        }
        if (order.status === "new") {
            yield OrderModel_1.default.findByIdAndUpdate(id, { status: "isReading" });
        }
        return res.json(order);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.post("/", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, products, tel } = req.body;
        let client = yield ClientModel_1.default.findOne({ tel });
        if (!client) {
            client = yield new ClientModel_1.default({ addresses: [address], tel }).save();
        }
        if (!client.addresses.some(item => item === address)) {
            client.addresses.push(address);
            yield client.save();
        }
        const orderProducts = [];
        let total = 0;
        const productsArr = JSON.parse(products);
        for (const i in productsArr) {
            try {
                const { productId, quantity } = productsArr[i];
                const product = yield ProductModel_1.default.findById(productId);
                if (product) {
                    orderProducts.push({
                        product: product._id,
                        quantity,
                    });
                    total += product.price || 0;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        const lastOrder = yield OrderModel_1.default.find().sort({ number: -1 }).then(doc => doc === null || doc === void 0 ? void 0 : doc[0]);
        const number = ((lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.number) || 0) + 1;
        const order = yield new OrderModel_1.default({
            client: client._id,
            delivery: { address },
            products: orderProducts,
            number,
            total
        }).save();
        client.orders.push(order._id);
        yield client.save();
        return res.json(number);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Что-то пошло не так..." });
    }
}));
exports["default"] = router;


/***/ }),

/***/ "./server/routes/products.routes.ts":
/*!******************************************!*\
  !*** ./server/routes/products.routes.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const express_1 = __webpack_require__(/*! express */ "express");
const promises_1 = __webpack_require__(/*! fs/promises */ "fs/promises");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const multer_1 = __importStar(__webpack_require__(/*! multer */ "multer"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const ProductModel_1 = __importDefault(__webpack_require__(/*! ../models/ProductModel */ "./server/models/ProductModel.ts"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dirPath = path_1.default.join(__dirname, "static", "img", id);
        try {
            yield (0, promises_1.access)(dirPath);
            const files = yield (0, promises_1.readdir)(dirPath);
            for (const i in files) {
                const file = files[i];
                try {
                    yield (0, promises_1.rm)(path_1.default.join(dirPath, file), { recursive: true });
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        catch (_a) {
            try {
                yield (0, promises_1.mkdir)(dirPath, { recursive: true });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }
        cb(null, dirPath);
    }),
    filename: (req, file, cb) => {
        const filename = Date.now() + path_1.default.extname(file.originalname);
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
// получить товар;
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield ProductModel_1.default.getProduct(id);
        if (!product) {
            return res.status(500).json({ message: "Товар не найден" });
        }
        return res.json(product);
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// установить фото товара;
router.put('/photo/:id', upload.single('photo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield ProductModel_1.default.findById(id);
        if (!product) {
            return res.status(500).json({ message: "Товар не найден" });
        }
        if (req.file) {
            product.photo.push(`/static/img/${id}/${req.file.filename}`);
            yield product.save();
        }
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// удалить фото товара;
router.delete('/photo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield ProductModel_1.default.findById(id);
        if (!product) {
            return res.status(500).json({ message: "Товар не найден" });
        }
        const dirPath = path_1.default.join(__dirname, "static", "img", id);
        try {
            const imgDir = yield (0, promises_1.readdir)(dirPath);
            for (const i in imgDir) {
                const file = path_1.default.join(dirPath, imgDir[i]);
                yield (0, promises_1.rm)(file);
            }
        }
        catch (e) {
            console.log(e);
        }
        product.photo = [];
        yield product.save();
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// установить описание товара;
router.put('/description/:id', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const product = yield ProductModel_1.default.findById(id);
        if (!product) {
            return res.status(500).json({ message: "Товар не найден" });
        }
        product.description = description;
        yield product.save();
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// установить фильтр;
router.put("/filter/:id", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fieldId } = req.body;
        const product = yield ProductModel_1.default.findById(id);
        if (!product) {
            return res.status(500).json({ message: "Товар не найден" });
        }
        yield product.setFilter(new mongoose_1.Types.ObjectId(fieldId));
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
// сбросить фильтр;
router.delete("/filter/:id", body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fieldId } = req.body;
        const product = yield ProductModel_1.default.findById(id);
        if (!product) {
            return res.status(500).json({ message: "Товар не найден" });
        }
        yield product.resetFilter(new mongoose_1.Types.ObjectId(fieldId));
        return res.end();
    }
    catch (e) {
        console.log(e);
        const message = e.userError ? e.message : "Что-то пошло не так...";
        return res.status(500).json({ message });
    }
}));
exports["default"] = router;


/***/ }),

/***/ "./server/server.ts":
/*!**************************!*\
  !*** ./server/server.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const express_handlebars_1 = __webpack_require__(/*! express-handlebars */ "express-handlebars");
const config_1 = __importDefault(__webpack_require__(/*! config */ "config"));
const express_session_1 = __importDefault(__webpack_require__(/*! express-session */ "express-session"));
const connect_mongo_1 = __importDefault(__webpack_require__(/*! connect-mongo */ "connect-mongo"));
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const moySklad_routes_1 = __importDefault(__webpack_require__(/*! ./routes/moySklad.routes */ "./server/routes/moySklad.routes.ts"));
const categroies_routes_1 = __importDefault(__webpack_require__(/*! ./routes/categroies.routes */ "./server/routes/categroies.routes.ts"));
const products_routes_1 = __importDefault(__webpack_require__(/*! ./routes/products.routes */ "./server/routes/products.routes.ts"));
const orders_routes_1 = __importDefault(__webpack_require__(/*! ./routes/orders.routes */ "./server/routes/orders.routes.ts"));
const admin_routes_1 = __importDefault(__webpack_require__(/*! ./routes/admin.routes */ "./server/routes/admin.routes.ts"));
const PORT = 3000;
const app = (0, express_1.default)();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connect)(config_1.default.get("mongoURI"));
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}...`);
        });
    }
    catch (e) {
        console.log(e);
    }
});
app.engine('hbs', (0, express_handlebars_1.engine)({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use((0, express_session_1.default)({
    secret: config_1.default.get("sessionSecret"),
    resave: true,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({
        mongoUrl: config_1.default.get("mongoURI"),
    }),
}));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, 'static')));
app.use('/admin', admin_routes_1.default);
app.use('/api/moy-sklad', moySklad_routes_1.default);
app.use("/api/categories", categroies_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.get('*', (req, res) => {
    try {
        const file = path_1.default.join(__dirname, 'static', 'site', 'index.html');
        res.sendFile(file);
    }
    catch (e) {
        console.log(e);
        return res.status(500).end();
    }
});
start();


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "config":
/*!*************************!*\
  !*** external "config" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("config");

/***/ }),

/***/ "connect-mongo":
/*!********************************!*\
  !*** external "connect-mongo" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("connect-mongo");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-handlebars":
/*!*************************************!*\
  !*** external "express-handlebars" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("express-handlebars");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("express-session");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "moysklad":
/*!***************************!*\
  !*** external "moysklad" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("moysklad");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("node-fetch");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./server/server.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=server.js.map