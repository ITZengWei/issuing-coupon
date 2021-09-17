/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(6);
const base_validate_pipe_1 = __webpack_require__(25);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useStaticAssets('uploads', {
        prefix: '/uploads'
    });
    app.useStaticAssets('blog_front', {
        prefix: '/'
    });
    app.useGlobalPipes(new base_validate_pipe_1.BaseValidationPipe());
    const options = new swagger_1.DocumentBuilder()
        .setTitle('个人博客前台接口')
        .setDescription('The Nest Project')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    console.log('blog');
    const PORT = process.env.BLOG_PORT || 3065;
    await app.listen(PORT);
    console.log(`server is running port at ${PORT}`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const app_controller_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(5);
const common_2 = __webpack_require__(7);
const articles_module_1 = __webpack_require__(30);
const categories_module_1 = __webpack_require__(34);
const tags_module_1 = __webpack_require__(37);
const records_module_1 = __webpack_require__(40);
const albums_module_1 = __webpack_require__(43);
const files_module_1 = __webpack_require__(46);
const comments_module_1 = __webpack_require__(51);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            common_2.CommonModule,
            articles_module_1.ArticlesModule,
            categories_module_1.CategoriesModule,
            tags_module_1.TagsModule,
            records_module_1.RecordsModule,
            albums_module_1.AlbumsModule,
            files_module_1.FilesModule,
            comments_module_1.CommentsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_service_1 = __webpack_require__(5);
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(6);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
};
AppController = __decorate([
    swagger_1.ApiTags('文件操作'),
    common_1.Controller(''),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(8));
__export(__webpack_require__(9));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const common_service_1 = __webpack_require__(9);
const config_1 = __webpack_require__(10);
const db_1 = __webpack_require__(11);
const base_validate_pipe_1 = __webpack_require__(25);
const jwt_1 = __webpack_require__(29);
console.log('common');
let CommonModule = class CommonModule {
};
CommonModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            db_1.DbModule,
            base_validate_pipe_1.BaseValidationPipe,
            jwt_1.JwtModule.registerAsync({
                useFactory() {
                    let { SECRET: secret = 'xiaolibingzengweiyongyuanaini' } = process.env;
                    return {
                        secret
                    };
                }
            }),
        ],
        providers: [common_service_1.CommonService],
        exports: [common_service_1.CommonService, base_validate_pipe_1.BaseValidationPipe, jwt_1.JwtModule],
    })
], CommonModule);
exports.CommonModule = CommonModule;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let CommonService = class CommonService {
};
CommonService = __decorate([
    common_1.Injectable()
], CommonService);
exports.CommonService = CommonService;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/config");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(12));
__export(__webpack_require__(13));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const db_service_1 = __webpack_require__(13);
const nestjs_typegoose_1 = __webpack_require__(14);
const category_model_1 = __webpack_require__(15);
const user_model_1 = __webpack_require__(17);
const record_model_1 = __webpack_require__(19);
const image_model_1 = __webpack_require__(20);
const comment_model_1 = __webpack_require__(21);
const tag_model_1 = __webpack_require__(23);
const album_model_1 = __webpack_require__(24);
const article_model_1 = __webpack_require__(22);
const models = nestjs_typegoose_1.TypegooseModule.forFeature([
    category_model_1.CategoryModel,
    user_model_1.UserModel,
    record_model_1.RecordModel,
    image_model_1.ImageModel,
    comment_model_1.CommentModel,
    tag_model_1.TagModel,
    album_model_1.AlbumModel,
    article_model_1.ArticleModel,
]);
let DbModule = class DbModule {
};
DbModule = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [
            nestjs_typegoose_1.TypegooseModule.forRootAsync({
                useFactory() {
                    let { DB: DBHost = 'mongodb://localhost:27017/nest-blog-project' } = process.env;
                    return {
                        uri: DBHost,
                        useCreateIndex: true,
                        useFindAndModify: true,
                        useUnifiedTopology: true,
                        useNewUrlParser: true
                    };
                }
            }),
            models
        ],
        providers: [db_service_1.DbService],
        exports: [db_service_1.DbService, models],
    })
], DbModule);
exports.DbModule = DbModule;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let DbService = class DbService {
};
DbService = __decorate([
    common_1.Injectable()
], DbService);
exports.DbService = DbService;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("nestjs-typegoose");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
let CategoryModel = class CategoryModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '分类名称', example: '水果' }),
    __metadata("design:type", String)
], CategoryModel.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({}),
    swagger_1.ApiProperty({ title: '父级分类ID', example: '5' }),
    __metadata("design:type", String)
], CategoryModel.prototype, "parentCategory", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '父级以上ID集合', example: '1,2,3,4' }),
    __metadata("design:type", String)
], CategoryModel.prototype, "grandparentCategory", void 0);
CategoryModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true
        }
    })
], CategoryModel);
exports.CategoryModel = CategoryModel;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("@typegoose/typegoose");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
const bcryptjs_1 = __webpack_require__(18);
let UserModel = class UserModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '账号', example: 'Bill' }),
    __metadata("design:type", String)
], UserModel.prototype, "account", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '手机号码', example: '13407943933' }),
    __metadata("design:type", String)
], UserModel.prototype, "tel", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '微信标识', example: 'weixin' }),
    __metadata("design:type", String)
], UserModel.prototype, "openid", void 0);
__decorate([
    typegoose_1.prop({
        select: false,
        get: (val) => val,
        set: (val) => val ? bcryptjs_1.hashSync(val, 12) : val
    }),
    swagger_1.ApiProperty({ description: '密码', example: '110349' }),
    __metadata("design:type", String)
], UserModel.prototype, "psw", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '审核状态 -1 审核不通过 0 审核中 1 审核通过', example: '-1' }),
    __metadata("design:type", String)
], UserModel.prototype, "audit", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '用户类型 0 普通 1 商家 2 管理员', example: '0' }),
    __metadata("design:type", String)
], UserModel.prototype, "type", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '性别 -1 保密 0 女 1 男', example: '-1' }),
    __metadata("design:type", String)
], UserModel.prototype, "sex", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '昵称', example: '陌琼' }),
    __metadata("design:type", String)
], UserModel.prototype, "nickname", void 0);
UserModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true
        }
    })
], UserModel);
exports.UserModel = UserModel;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
let RecordModel = class RecordModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '记录话题', example: '开始重写个人博客' }),
    __metadata("design:type", String)
], RecordModel.prototype, "content", void 0);
RecordModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true,
        }
    })
], RecordModel);
exports.RecordModel = RecordModel;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
let ImageModel = class ImageModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '图片地址', example: 'XXX' }),
    __metadata("design:type", String)
], ImageModel.prototype, "src", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '图片类型', example: '1 文章,2 相册, 9 其他' }),
    __metadata("design:type", Number)
], ImageModel.prototype, "imgType", void 0);
ImageModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true,
        }
    })
], ImageModel);
exports.ImageModel = ImageModel;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
const user_model_1 = __webpack_require__(17);
const article_model_1 = __webpack_require__(22);
let CommentModel = class CommentModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '评论内容', example: 'Bill' }),
    __metadata("design:type", String)
], CommentModel.prototype, "content", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '来自哪里', example: '博客' }),
    __metadata("design:type", String)
], CommentModel.prototype, "from", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '是否显示', example: '0隐藏 ,1 显示' }),
    __metadata("design:type", String)
], CommentModel.prototype, "status", void 0);
__decorate([
    typegoose_1.prop({
        ref: 'UserModel'
    }),
    swagger_1.ApiProperty({ description: '谁发表的评论', example: 'Bill' }),
    __metadata("design:type", user_model_1.UserModel)
], CommentModel.prototype, "userId", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '评论类型', example: '1 博客留言 ,2 文章留言' }),
    __metadata("design:type", String)
], CommentModel.prototype, "commentType", void 0);
__decorate([
    typegoose_1.prop({
        ref: 'ArticleModel'
    }),
    swagger_1.ApiProperty({ description: '谁发表的评论', example: '评论文章' }),
    __metadata("design:type", article_model_1.ArticleModel)
], CommentModel.prototype, "article", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '评论对象', example: '' }),
    __metadata("design:type", Object)
], CommentModel.prototype, "top", void 0);
CommentModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true
        }
    })
], CommentModel);
exports.CommentModel = CommentModel;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
const user_model_1 = __webpack_require__(17);
const category_model_1 = __webpack_require__(15);
let ArticleModel = class ArticleModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '标题', example: '标题' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "title", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '署名', example: '署名' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "author", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '展示图片', example: '展示图片' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "traitImg", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ description: '审核状态 -1 审核不通过 0 审核中 1 审核通过', example: '-1' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "status", void 0);
__decorate([
    typegoose_1.prop({
        ref: 'CategoryModel'
    }),
    swagger_1.ApiProperty({ title: '所属分类', example: '学习' }),
    __metadata("design:type", category_model_1.CategoryModel)
], ArticleModel.prototype, "category", void 0);
__decorate([
    typegoose_1.arrayProp({
        ref: 'TagModel',
    }),
    swagger_1.ApiProperty({ title: '所贴标签', example: 'JavaScript' }),
    __metadata("design:type", Array)
], ArticleModel.prototype, "tags", void 0);
__decorate([
    typegoose_1.prop({
        ref: 'UserModel'
    }),
    swagger_1.ApiProperty({ title: '用户ID', example: '5' }),
    __metadata("design:type", user_model_1.UserModel)
], ArticleModel.prototype, "userId", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '正文(html)', example: '正文(html)' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "contentHTML", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '正文(md)', example: '正文(md)' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "contentMD", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '总结', example: '总结' }),
    __metadata("design:type", String)
], ArticleModel.prototype, "summary", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '阅读量', example: '10' }),
    __metadata("design:type", Number)
], ArticleModel.prototype, "readCount", void 0);
ArticleModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true
        }
    })
], ArticleModel);
exports.ArticleModel = ArticleModel;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
let TagModel = class TagModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '标签名称', example: 'JavaScript' }),
    __metadata("design:type", String)
], TagModel.prototype, "name", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '标签颜色', example: '#FFF2E8' }),
    __metadata("design:type", String)
], TagModel.prototype, "color", void 0);
TagModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true
        }
    })
], TagModel);
exports.TagModel = TagModel;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(16);
const swagger_1 = __webpack_require__(6);
let AlbumModel = class AlbumModel {
};
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '图景', example: 'image' }),
    __metadata("design:type", String)
], AlbumModel.prototype, "prospect", void 0);
__decorate([
    typegoose_1.prop(),
    swagger_1.ApiProperty({ title: '备注', example: '好美的风景' }),
    __metadata("design:type", String)
], AlbumModel.prototype, "remark", void 0);
AlbumModel = __decorate([
    typegoose_1.modelOptions({
        schemaOptions: {
            timestamps: true,
        }
    })
], AlbumModel);
exports.AlbumModel = AlbumModel;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(26);
const class_transformer_1 = __webpack_require__(27);
const ApiException_1 = __webpack_require__(28);
let BaseValidationPipe = class BaseValidationPipe {
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = class_transformer_1.plainToClass(metatype, value);
        const errors = await class_validator_1.validate(object);
        if (errors.length > 0) {
            let error = errors.shift();
            const { contexts, constraints } = error;
            console.log(contexts, constraints, '===');
            for (let key in constraints) {
                console.log(constraints[key], contexts[key]);
                throw new common_1.BadRequestException(new ApiException_1.ApiException(constraints[key], common_1.HttpStatus.BAD_REQUEST));
            }
        }
        return object;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
};
BaseValidationPipe = __decorate([
    common_1.Injectable()
], BaseValidationPipe);
exports.BaseValidationPipe = BaseValidationPipe;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("class-validator");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("class-transformer");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
class ApiException extends common_1.HttpException {
    constructor(errorMessage, errorStatusCode) {
        super(errorMessage, errorStatusCode);
        console.log('进来了', errorMessage, errorStatusCode);
        this.errorMessage = errorMessage;
    }
    getErrorMessage() {
        return this.errorMessage;
    }
}
exports.ApiException = ApiException;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const articles_controller_1 = __webpack_require__(31);
const articles_service_1 = __webpack_require__(33);
let ArticlesModule = class ArticlesModule {
};
ArticlesModule = __decorate([
    common_1.Module({
        controllers: [articles_controller_1.ArticlesController],
        providers: [articles_service_1.ArticlesService]
    })
], ArticlesModule);
exports.ArticlesModule = ArticlesModule;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const nestjs_mongoose_crud_1 = __webpack_require__(32);
const swagger_1 = __webpack_require__(6);
const article_model_1 = __webpack_require__(22);
const nestjs_typegoose_1 = __webpack_require__(14);
const tag_model_1 = __webpack_require__(23);
const articles_service_1 = __webpack_require__(33);
let ArticlesController = class ArticlesController {
    constructor(model, TagModel, ArticlesService) {
        this.model = model;
        this.TagModel = TagModel;
        this.ArticlesService = ArticlesService;
    }
    async init() {
    }
    async addReadCount(id) {
        return await this.ArticlesService.addReadCount(id);
    }
};
__decorate([
    common_1.Get('addRead/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "addReadCount", null);
ArticlesController = __decorate([
    nestjs_mongoose_crud_1.Crud({
        model: article_model_1.ArticleModel,
        routes: {}
    }),
    swagger_1.ApiTags('文章相关接口'),
    common_1.Controller('articles'),
    __param(0, nestjs_typegoose_1.InjectModel(article_model_1.ArticleModel)),
    __param(1, nestjs_typegoose_1.InjectModel(tag_model_1.TagModel)),
    __metadata("design:paramtypes", [Object, Object, articles_service_1.ArticlesService])
], ArticlesController);
exports.ArticlesController = ArticlesController;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("nestjs-mongoose-crud");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const article_model_1 = __webpack_require__(22);
const nestjs_typegoose_1 = __webpack_require__(14);
let ArticlesService = class ArticlesService {
    constructor(model) {
        this.model = model;
    }
    async addReadCount(id) {
        try {
            const result = await this.model.findById(id);
            const newCount = result.readCount ? ++result.readCount : 1;
            await this.model.findByIdAndUpdate(id, { readCount: newCount });
            return { code: 200, msg: '增加成功' };
        }
        catch (error) {
            return {
                error: error,
                msg: '错误',
                code: -1
            };
        }
    }
};
ArticlesService = __decorate([
    common_1.Injectable(),
    __param(0, nestjs_typegoose_1.InjectModel(article_model_1.ArticleModel)),
    __metadata("design:paramtypes", [Object])
], ArticlesService);
exports.ArticlesService = ArticlesService;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const categories_controller_1 = __webpack_require__(35);
const categories_service_1 = __webpack_require__(36);
let CategoriesModule = class CategoriesModule {
};
CategoriesModule = __decorate([
    common_1.Module({
        controllers: [categories_controller_1.CategoriesController],
        providers: [categories_service_1.CategoriesService]
    })
], CategoriesModule);
exports.CategoriesModule = CategoriesModule;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const nestjs_mongoose_crud_1 = __webpack_require__(32);
const swagger_1 = __webpack_require__(6);
const category_model_1 = __webpack_require__(15);
const nestjs_typegoose_1 = __webpack_require__(14);
let CategoriesController = class CategoriesController {
    constructor(model) {
        this.model = model;
    }
};
CategoriesController = __decorate([
    nestjs_mongoose_crud_1.Crud({
        model: category_model_1.CategoryModel,
        routes: {}
    }),
    swagger_1.ApiTags('分类相关接口'),
    common_1.Controller('categories'),
    __param(0, nestjs_typegoose_1.InjectModel(category_model_1.CategoryModel)),
    __metadata("design:paramtypes", [Object])
], CategoriesController);
exports.CategoriesController = CategoriesController;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let CategoriesService = class CategoriesService {
};
CategoriesService = __decorate([
    common_1.Injectable()
], CategoriesService);
exports.CategoriesService = CategoriesService;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const tags_controller_1 = __webpack_require__(38);
const tags_service_1 = __webpack_require__(39);
let TagsModule = class TagsModule {
};
TagsModule = __decorate([
    common_1.Module({
        controllers: [tags_controller_1.TagsController],
        providers: [tags_service_1.TagsService]
    })
], TagsModule);
exports.TagsModule = TagsModule;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(6);
const tag_model_1 = __webpack_require__(23);
const nestjs_typegoose_1 = __webpack_require__(14);
const tags_service_1 = __webpack_require__(39);
let TagsController = class TagsController {
    constructor(TagsService, model) {
        this.TagsService = TagsService;
        this.model = model;
    }
    async getAllTags() {
        return await this.TagsService.getAllTags();
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "getAllTags", null);
TagsController = __decorate([
    swagger_1.ApiTags('标签相关接口'),
    common_1.Controller('tags'),
    __param(1, nestjs_typegoose_1.InjectModel(tag_model_1.TagModel)),
    __metadata("design:paramtypes", [tags_service_1.TagsService, Object])
], TagsController);
exports.TagsController = TagsController;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const tag_model_1 = __webpack_require__(23);
const nestjs_typegoose_1 = __webpack_require__(14);
let TagsService = class TagsService {
    constructor(model) {
        this.model = model;
    }
    async getAllTags() {
        return {
            code: 200,
            data: await this.model.find()
        };
    }
};
TagsService = __decorate([
    common_1.Injectable(),
    __param(0, nestjs_typegoose_1.InjectModel(tag_model_1.TagModel)),
    __metadata("design:paramtypes", [Object])
], TagsService);
exports.TagsService = TagsService;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const records_controller_1 = __webpack_require__(41);
const records_service_1 = __webpack_require__(42);
let RecordsModule = class RecordsModule {
};
RecordsModule = __decorate([
    common_1.Module({
        controllers: [records_controller_1.RecordsController],
        providers: [records_service_1.RecordsService]
    })
], RecordsModule);
exports.RecordsModule = RecordsModule;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const nestjs_mongoose_crud_1 = __webpack_require__(32);
const swagger_1 = __webpack_require__(6);
const record_model_1 = __webpack_require__(19);
const nestjs_typegoose_1 = __webpack_require__(14);
let RecordsController = class RecordsController {
    constructor(model) {
        this.model = model;
    }
};
RecordsController = __decorate([
    nestjs_mongoose_crud_1.Crud({
        model: record_model_1.RecordModel,
        routes: {}
    }),
    swagger_1.ApiTags('记录相关接口'),
    common_1.Controller('records'),
    __param(0, nestjs_typegoose_1.InjectModel(record_model_1.RecordModel)),
    __metadata("design:paramtypes", [Object])
], RecordsController);
exports.RecordsController = RecordsController;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let RecordsService = class RecordsService {
};
RecordsService = __decorate([
    common_1.Injectable()
], RecordsService);
exports.RecordsService = RecordsService;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const albums_controller_1 = __webpack_require__(44);
const albums_service_1 = __webpack_require__(45);
let AlbumsModule = class AlbumsModule {
};
AlbumsModule = __decorate([
    common_1.Module({
        controllers: [albums_controller_1.AlbumsController],
        providers: [albums_service_1.AlbumsService]
    })
], AlbumsModule);
exports.AlbumsModule = AlbumsModule;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const album_model_1 = __webpack_require__(24);
const nestjs_mongoose_crud_1 = __webpack_require__(32);
const swagger_1 = __webpack_require__(6);
const nestjs_typegoose_1 = __webpack_require__(14);
let AlbumsController = class AlbumsController {
    constructor(model) {
        this.model = model;
    }
};
AlbumsController = __decorate([
    nestjs_mongoose_crud_1.Crud({
        model: album_model_1.AlbumModel,
        routes: {
            create: {
                decorators: [swagger_1.ApiOperation({ summary: '创建相册', description: 'id 商品ID' })]
            },
            update: {
                decorators: [swagger_1.ApiOperation({ summary: '修改相册', description: 'id 相册ID' })]
            },
            delete: {
                decorators: [swagger_1.ApiOperation({ summary: '删除相册', description: 'id 相册ID' })]
            },
            find: {
                decorators: [swagger_1.ApiOperation({ summary: '查找所有', description: 'id 相册ID' })]
            },
            findOne: {
                decorators: [swagger_1.ApiOperation({ summary: '查找单个', description: 'id 相册ID' })]
            }
        }
    }),
    swagger_1.ApiTags('相册相关接口'),
    common_1.Controller('albums'),
    __param(0, nestjs_typegoose_1.InjectModel(album_model_1.AlbumModel)),
    __metadata("design:paramtypes", [Object])
], AlbumsController);
exports.AlbumsController = AlbumsController;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let AlbumsService = class AlbumsService {
};
AlbumsService = __decorate([
    common_1.Injectable()
], AlbumsService);
exports.AlbumsService = AlbumsService;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const files_controller_1 = __webpack_require__(47);
const platform_express_1 = __webpack_require__(49);
const files_service_1 = __webpack_require__(48);
const MAO = __webpack_require__(50);
let FilesModule = class FilesModule {
};
FilesModule = __decorate([
    common_1.Module({
        imports: [
            platform_express_1.MulterModule.register({
                dest: 'uploads'
            })
        ],
        controllers: [files_controller_1.FilesController],
        providers: [files_service_1.FilesService]
    })
], FilesModule);
exports.FilesModule = FilesModule;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const files_service_1 = __webpack_require__(48);
const swagger_1 = __webpack_require__(6);
const platform_express_1 = __webpack_require__(49);
let FilesController = class FilesController {
    constructor(FilesService) {
        this.FilesService = FilesService;
    }
    async upload(file) {
        if (!file)
            return {
                code: -1,
                msg: '请上传图片'
            };
        console.log(file);
        return this.FilesService.upload(file);
    }
};
__decorate([
    common_1.Post('/upload'),
    swagger_1.ApiOperation({ summary: '上传文件接口' }),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('image')),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "upload", null);
FilesController = __decorate([
    swagger_1.ApiTags('文件操作'),
    common_1.Controller(''),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
exports.FilesController = FilesController;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let FilesService = class FilesService {
    async upload(file) {
        console.log(file);
        let { filename, url } = file;
        if (true) {
            const PORT = process.env.BLOG_PORT || 3065;
            url = `http://localhost:${PORT}/uploads/${file.filename}`;
        }
        return {
            data: { filename, url },
            code: 200
        };
    }
};
FilesService = __decorate([
    common_1.Injectable()
], FilesService);
exports.FilesService = FilesService;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("multer-aliyun-oss");

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const comments_controller_1 = __webpack_require__(52);
const comments_service_1 = __webpack_require__(53);
let CommentsModule = class CommentsModule {
};
CommentsModule = __decorate([
    common_1.Module({
        controllers: [comments_controller_1.CommentsController],
        providers: [comments_service_1.CommentsService]
    })
], CommentsModule);
exports.CommentsModule = CommentsModule;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
const nestjs_mongoose_crud_1 = __webpack_require__(32);
const swagger_1 = __webpack_require__(6);
const nestjs_typegoose_1 = __webpack_require__(14);
const comment_model_1 = __webpack_require__(21);
let CommentsController = class CommentsController {
    constructor(model) {
        this.model = model;
    }
};
CommentsController = __decorate([
    nestjs_mongoose_crud_1.Crud({
        model: comment_model_1.CommentModel,
        routes: {}
    }),
    swagger_1.ApiTags('评论相关接口'),
    common_1.Controller('comments'),
    __param(0, nestjs_typegoose_1.InjectModel(comment_model_1.CommentModel)),
    __metadata("design:paramtypes", [Object])
], CommentsController);
exports.CommentsController = CommentsController;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(3);
let CommentsService = class CommentsService {
};
CommentsService = __decorate([
    common_1.Injectable()
], CommentsService);
exports.CommentsService = CommentsService;


/***/ })
/******/ ]);