/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const cookie_parser_1 = __importDefault(__webpack_require__(62));
const helmet_1 = __importDefault(__webpack_require__(63));
const compression_1 = __importDefault(__webpack_require__(64));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Civic & Nonprofit Platform API')
        .setDescription('API for civic engagement and nonprofit management')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('nonprofits', 'Nonprofit organization management')
        .addTag('campaigns', 'Fundraising campaigns')
        .addTag('donations', 'Payment and donation processing')
        .addTag('volunteering', 'Volunteer opportunities')
        .addTag('events', 'Community events')
        .addTag('petitions', 'Civic petitions')
        .addTag('impact', 'Impact tracking')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Civic Platform API running on http://localhost:${port}`);
    console.log(`📖 API Documentation: http://localhost:${port}/api`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const throttler_1 = __webpack_require__(6);
const bull_1 = __webpack_require__(7);
const schedule_1 = __webpack_require__(8);
const event_emitter_1 = __webpack_require__(9);
const prisma_module_1 = __webpack_require__(10);
const redis_module_1 = __webpack_require__(13);
const auth_module_1 = __webpack_require__(16);
const nonprofits_module_1 = __webpack_require__(26);
const campaigns_module_1 = __webpack_require__(29);
const donations_module_1 = __webpack_require__(32);
const volunteering_module_1 = __webpack_require__(36);
const events_module_1 = __webpack_require__(39);
const petitions_module_1 = __webpack_require__(42);
const impact_module_1 = __webpack_require__(45);
const forums_module_1 = __webpack_require__(48);
const communications_module_1 = __webpack_require__(51);
const analytics_module_1 = __webpack_require__(56);
const admin_module_1 = __webpack_require__(59);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: parseInt(process.env.RATE_LIMIT_TTL) || 60,
                    limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
                }]),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                    password: process.env.REDIS_PASSWORD,
                },
            }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            nonprofits_module_1.NonprofitsModule,
            campaigns_module_1.CampaignsModule,
            donations_module_1.DonationsModule,
            volunteering_module_1.VolunteeringModule,
            events_module_1.EventsModule,
            petitions_module_1.PetitionsModule,
            impact_module_1.ImpactModule,
            forums_module_1.ForumsModule,
            communications_module_1.CommunicationsModule,
            analytics_module_1.AnalyticsModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/bull");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/event-emitter");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(12);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production')
            return;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisModule = void 0;
const common_1 = __webpack_require__(2);
const redis_service_1 = __webpack_require__(14);
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService],
    })
], RedisModule);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(2);
const redis_1 = __webpack_require__(15);
let RedisService = class RedisService {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
            password: process.env.REDIS_PASSWORD,
        });
        this.client.connect().catch(console.error);
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.client.setEx(key, ttl, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async del(key) {
        await this.client.del(key);
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("redis");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(17);
const passport_1 = __webpack_require__(18);
const auth_service_1 = __webpack_require__(19);
const auth_controller_1 = __webpack_require__(22);
const jwt_strategy_1 = __webpack_require__(24);
const prisma_module_1 = __webpack_require__(10);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secret',
                signOptions: { expiresIn: '15m' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 19 */
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(17);
const bcrypt = __importStar(__webpack_require__(20));
const prisma_service_1 = __webpack_require__(11);
const crypto_1 = __webpack_require__(21);
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                profile: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        displayName: `${dto.firstName} ${dto.lastName}`,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.prisma.verificationToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        return {
            message: 'Registration successful. Please check your email to verify your account.',
            user: this.sanitizeUser(user),
        };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                nonprofitAdmin: {
                    include: {
                        nonprofit: true,
                    },
                },
            },
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Account suspended');
        }
        if (!user.emailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
            },
        });
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async verifyEmail(token) {
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!verificationToken || verificationToken.used) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        if (verificationToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Token expired');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: verificationToken.userId },
                data: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    status: 'ACTIVE',
                },
            }),
            this.prisma.verificationToken.update({
                where: { id: verificationToken.id },
                data: { used: true },
            }),
        ]);
        return { message: 'Email verified successfully' };
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
        });
        return { message: 'If the email exists, a reset link has been sent' };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetToken || resetToken.used) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        if (resetToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Token expired');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);
        return { message: 'Password reset successful' };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { profile: true },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                nonprofitAdmin: {
                    include: {
                        nonprofit: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, dto) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                profile: {
                    update: dto,
                },
            },
            include: {
                profile: true,
            },
        });
        return this.sanitizeUser(updated);
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken };
    }
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
    async validateGoogleUser(profile) {
        let user = await this.prisma.user.findUnique({
            where: { googleId: profile.id },
            include: { profile: true },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    emailVerified: true,
                    status: 'ACTIVE',
                    role: 'DONOR',
                    profile: {
                        create: {
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            displayName: profile.displayName,
                            avatar: profile.photos[0]?.value,
                        },
                    },
                },
                include: { profile: true },
            });
        }
        return user;
    }
    async validateFacebookUser(profile) {
        let user = await this.prisma.user.findUnique({
            where: { facebookId: profile.id },
            include: { profile: true },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    facebookId: profile.id,
                    emailVerified: true,
                    status: 'ACTIVE',
                    role: 'DONOR',
                    profile: {
                        create: {
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            displayName: profile.displayName,
                            avatar: profile.photos[0]?.value,
                        },
                    },
                },
                include: { profile: true },
            });
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(19);
const swagger_1 = __webpack_require__(3);
const jwt_auth_guard_1 = __webpack_require__(23);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login(dto) {
        return this.authService.login(dto.email, dto.password);
    }
    async verifyEmail(dto) {
        return this.authService.verifyEmail(dto.token);
    }
    async forgotPassword(dto) {
        return this.authService.requestPasswordReset(dto.email);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
    async refresh(dto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.userId);
    }
    async updateProfile(req, dto) {
        return this.authService.updateProfile(req.user.userId, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email with token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(18);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(18);
const passport_jwt_1 = __webpack_require__(25);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }
    async validate(payload) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonprofitsModule = void 0;
const common_1 = __webpack_require__(2);
const nonprofits_service_1 = __webpack_require__(27);
const nonprofits_controller_1 = __webpack_require__(28);
const prisma_module_1 = __webpack_require__(10);
let NonprofitsModule = class NonprofitsModule {
};
exports.NonprofitsModule = NonprofitsModule;
exports.NonprofitsModule = NonprofitsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [nonprofits_controller_1.NonprofitsController],
        providers: [nonprofits_service_1.NonprofitsService],
        exports: [nonprofits_service_1.NonprofitsService],
    })
], NonprofitsModule);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonprofitsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let NonprofitsService = class NonprofitsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const nonprofit = await this.prisma.nonprofit.create({
            data: {
                ...dto,
                slug: this.generateSlug(dto.name),
                admins: {
                    create: {
                        userId,
                        isOwner: true,
                        permissions: ['ALL'],
                    },
                },
            },
            include: {
                admins: { include: { user: { include: { profile: true } } } },
            },
        });
        return nonprofit;
    }
    async findAll(filters) {
        const where = { status: 'ACTIVE' };
        if (filters?.verified)
            where.verified = true;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.nonprofit.findMany({
            where,
            include: {
                _count: {
                    select: {
                        campaigns: true,
                        events: true,
                        volunteerOpps: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const nonprofit = await this.prisma.nonprofit.findUnique({
            where: { id },
            include: {
                admins: { include: { user: { include: { profile: true } } } },
                teamMembers: true,
                categories: true,
                socialMedia: true,
                campaigns: { take: 5, where: { status: 'ACTIVE' } },
                events: { take: 5, where: { status: 'PUBLISHED' } },
                reviews: { take: 10, orderBy: { createdAt: 'desc' } },
                _count: {
                    select: {
                        campaigns: true,
                        events: true,
                        volunteerOpps: true,
                    },
                },
            },
        });
        if (!nonprofit) {
            throw new common_1.NotFoundException('Nonprofit not found');
        }
        return nonprofit;
    }
    async update(id, userId, dto) {
        await this.checkPermission(id, userId);
        return this.prisma.nonprofit.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id, userId) {
        await this.checkPermission(id, userId);
        return this.prisma.nonprofit.update({
            where: { id },
            data: { status: 'DELETED' },
        });
    }
    async requestVerification(id, userId, documents) {
        await this.checkPermission(id, userId);
        return this.prisma.nonprofit.update({
            where: { id },
            data: {
                verificationStatus: 'PENDING',
                taxExemptDoc: documents.taxExemptDoc,
            },
        });
    }
    async addTeamMember(nonprofitId, userId, dto) {
        await this.checkPermission(nonprofitId, userId);
        return this.prisma.teamMember.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
    async getCampaigns(id) {
        return this.prisma.campaign.findMany({
            where: { nonprofitId: id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getEvents(id) {
        return this.prisma.event.findMany({
            where: { nonprofitId: id },
            orderBy: { startDate: 'desc' },
        });
    }
    async addReview(nonprofitId, userId, dto) {
        const review = await this.prisma.nonprofitReview.create({
            data: {
                nonprofitId,
                userId,
                ...dto,
            },
        });
        const reviews = await this.prisma.nonprofitReview.findMany({
            where: { nonprofitId },
        });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await this.prisma.nonprofit.update({
            where: { id: nonprofitId },
            data: {
                avgRating,
                reviewCount: reviews.length,
            },
        });
        return review;
    }
    async checkPermission(nonprofitId, userId) {
        const admin = await this.prisma.nonprofitAdmin.findFirst({
            where: { nonprofitId, userId },
        });
        if (!admin) {
            throw new common_1.ForbiddenException('You do not have permission to manage this nonprofit');
        }
        return admin;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
};
exports.NonprofitsService = NonprofitsService;
exports.NonprofitsService = NonprofitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NonprofitsService);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonprofitsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const nonprofits_service_1 = __webpack_require__(27);
const jwt_auth_guard_1 = __webpack_require__(23);
let NonprofitsController = class NonprofitsController {
    constructor(nonprofitsService) {
        this.nonprofitsService = nonprofitsService;
    }
    create(req, dto) {
        return this.nonprofitsService.create(req.user.userId, dto);
    }
    findAll(filters) {
        return this.nonprofitsService.findAll(filters);
    }
    findOne(id) {
        return this.nonprofitsService.findOne(id);
    }
    update(id, req, dto) {
        return this.nonprofitsService.update(id, req.user.userId, dto);
    }
    delete(id, req) {
        return this.nonprofitsService.delete(id, req.user.userId);
    }
    requestVerification(id, req, documents) {
        return this.nonprofitsService.requestVerification(id, req.user.userId, documents);
    }
    addTeamMember(id, req, dto) {
        return this.nonprofitsService.addTeamMember(id, req.user.userId, dto);
    }
    getCampaigns(id) {
        return this.nonprofitsService.getCampaigns(id);
    }
    getEvents(id) {
        return this.nonprofitsService.getEvents(id);
    }
    addReview(id, req, dto) {
        return this.nonprofitsService.addReview(id, req.user.userId, dto);
    }
};
exports.NonprofitsController = NonprofitsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create nonprofit organization' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all nonprofits' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nonprofit by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update nonprofit' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete nonprofit' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Request verification' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "requestVerification", null);
__decorate([
    (0, common_1.Post)(':id/team-members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add team member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "addTeamMember", null);
__decorate([
    (0, common_1.Get)(':id/campaigns'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nonprofit campaigns' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Get)(':id/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nonprofit events' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Post)(':id/reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add review' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NonprofitsController.prototype, "addReview", null);
exports.NonprofitsController = NonprofitsController = __decorate([
    (0, swagger_1.ApiTags)('nonprofits'),
    (0, common_1.Controller)('nonprofits'),
    __metadata("design:paramtypes", [typeof (_a = typeof nonprofits_service_1.NonprofitsService !== "undefined" && nonprofits_service_1.NonprofitsService) === "function" ? _a : Object])
], NonprofitsController);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignsModule = void 0;
const common_1 = __webpack_require__(2);
const campaigns_service_1 = __webpack_require__(30);
const campaigns_controller_1 = __webpack_require__(31);
const prisma_module_1 = __webpack_require__(10);
let CampaignsModule = class CampaignsModule {
};
exports.CampaignsModule = CampaignsModule;
exports.CampaignsModule = CampaignsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [campaigns_controller_1.CampaignsController],
        providers: [campaigns_service_1.CampaignsService],
        exports: [campaigns_service_1.CampaignsService],
    })
], CampaignsModule);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let CampaignsService = class CampaignsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(nonprofitId, userId, dto) {
        const admin = await this.prisma.nonprofitAdmin.findFirst({
            where: { nonprofitId, userId },
        });
        if (!admin) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.campaign.create({
            data: {
                nonprofitId,
                ...dto,
                slug: this.generateSlug(dto.title),
            },
        });
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.category)
            where.category = filters.category;
        if (filters?.featured)
            where.featured = true;
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.campaign.findMany({
            where,
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        verified: true,
                    },
                },
                _count: {
                    select: { donations: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                nonprofit: true,
                milestones: { orderBy: { amount: 'asc' } },
                updates: { orderBy: { createdAt: 'desc' } },
                donations: {
                    where: { status: 'COMPLETED', anonymous: false },
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        firstName: true,
                                        displayName: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: { donations: true },
                },
            },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        await this.prisma.campaign.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        return campaign;
    }
    async update(id, userId, dto) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        const admin = await this.prisma.nonprofitAdmin.findFirst({
            where: { nonprofitId: campaign.nonprofitId, userId },
        });
        if (!admin) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.campaign.update({
            where: { id },
            data: dto,
        });
    }
    async addMilestone(campaignId, dto) {
        return this.prisma.campaignMilestone.create({
            data: {
                campaignId,
                ...dto,
            },
        });
    }
    async addUpdate(campaignId, dto) {
        return this.prisma.campaignUpdate.create({
            data: {
                campaignId,
                ...dto,
            },
        });
    }
    async getTrending() {
        return this.prisma.campaign.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [
                { donorCount: 'desc' },
                { currentAmount: 'desc' },
            ],
            take: 10,
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        verified: true,
                    },
                },
            },
        });
    }
    async checkMilestones(campaignId) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: campaignId },
            include: { milestones: true },
        });
        if (!campaign)
            return;
        for (const milestone of campaign.milestones) {
            if (!milestone.reached && campaign.currentAmount >= milestone.amount) {
                await this.prisma.campaignMilestone.update({
                    where: { id: milestone.id },
                    data: {
                        reached: true,
                        reachedAt: new Date(),
                    },
                });
            }
        }
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CampaignsService);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampaignsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const campaigns_service_1 = __webpack_require__(30);
const jwt_auth_guard_1 = __webpack_require__(23);
let CampaignsController = class CampaignsController {
    constructor(campaignsService) {
        this.campaignsService = campaignsService;
    }
    create(dto, req) {
        return this.campaignsService.create(dto.nonprofitId, req.user.userId, dto);
    }
    findAll(filters) {
        return this.campaignsService.findAll(filters);
    }
    getTrending() {
        return this.campaignsService.getTrending();
    }
    findOne(id) {
        return this.campaignsService.findOne(id);
    }
    update(id, req, dto) {
        return this.campaignsService.update(id, req.user.userId, dto);
    }
    addMilestone(id, dto) {
        return this.campaignsService.addMilestone(id, dto);
    }
    addUpdate(id, dto) {
        return this.campaignsService.addUpdate(id, dto);
    }
};
exports.CampaignsController = CampaignsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create campaign' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all campaigns' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trending campaigns' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/milestones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add milestone' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "addMilestone", null);
__decorate([
    (0, common_1.Post)(':id/updates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add update' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "addUpdate", null);
exports.CampaignsController = CampaignsController = __decorate([
    (0, swagger_1.ApiTags)('campaigns'),
    (0, common_1.Controller)('campaigns'),
    __metadata("design:paramtypes", [typeof (_a = typeof campaigns_service_1.CampaignsService !== "undefined" && campaigns_service_1.CampaignsService) === "function" ? _a : Object])
], CampaignsController);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DonationsModule = void 0;
const common_1 = __webpack_require__(2);
const donations_service_1 = __webpack_require__(33);
const donations_controller_1 = __webpack_require__(35);
const prisma_module_1 = __webpack_require__(10);
const campaigns_module_1 = __webpack_require__(29);
let DonationsModule = class DonationsModule {
};
exports.DonationsModule = DonationsModule;
exports.DonationsModule = DonationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, campaigns_module_1.CampaignsModule],
        controllers: [donations_controller_1.DonationsController],
        providers: [donations_service_1.DonationsService],
        exports: [donations_service_1.DonationsService],
    })
], DonationsModule);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DonationsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const stripe_1 = __importDefault(__webpack_require__(34));
const campaigns_service_1 = __webpack_require__(30);
let DonationsService = class DonationsService {
    constructor(prisma, campaignsService) {
        this.prisma = prisma;
        this.campaignsService = campaignsService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16',
        });
    }
    async createOneTimeDonation(userId, dto) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(dto.amount * 100),
                currency: dto.currency || 'usd',
                metadata: {
                    campaignId: dto.campaignId || '',
                    nonprofitId: dto.nonprofitId,
                    userId: userId || 'anonymous',
                },
            });
            const platformFee = dto.amount * 0.02;
            const processingFee = dto.amount * 0.029 + 0.30;
            const netAmount = dto.amount - platformFee - processingFee;
            const donation = await this.prisma.donation.create({
                data: {
                    userId,
                    campaignId: dto.campaignId,
                    nonprofitId: dto.nonprofitId,
                    amount: dto.amount,
                    currency: dto.currency || 'USD',
                    frequency: 'ONE_TIME',
                    stripePaymentId: paymentIntent.id,
                    paymentMethod: dto.paymentMethod,
                    status: 'PENDING',
                    anonymous: dto.anonymous || false,
                    dedicatedTo: dto.dedicatedTo,
                    dedicationMessage: dto.dedicationMessage,
                    message: dto.message,
                    platformFee,
                    processingFee,
                    netAmount,
                },
            });
            return {
                donation,
                clientSecret: paymentIntent.client_secret,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create donation');
        }
    }
    async createRecurringDonation(userId, dto) {
        try {
            const customer = await this.stripe.customers.create({
                email: dto.email,
                metadata: {
                    userId,
                },
            });
            const subscription = await this.stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                        price_data: {
                            currency: dto.currency || 'usd',
                            unit_amount: Math.round(dto.amount * 100),
                            recurring: {
                                interval: dto.frequency === 'MONTHLY' ? 'month' :
                                    dto.frequency === 'QUARTERLY' ? 'month' : 'year',
                                interval_count: dto.frequency === 'QUARTERLY' ? 3 : 1,
                            },
                            product_data: {
                                name: `Recurring donation to ${dto.nonprofitId}`,
                            },
                        },
                    }],
                metadata: {
                    userId,
                    nonprofitId: dto.nonprofitId,
                    campaignId: dto.campaignId || '',
                },
            });
            const recurring = await this.prisma.recurringDonation.create({
                data: {
                    userId,
                    nonprofitId: dto.nonprofitId,
                    campaignId: dto.campaignId,
                    amount: dto.amount,
                    currency: dto.currency || 'USD',
                    frequency: dto.frequency,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: customer.id,
                    active: true,
                    nextBillingDate: new Date(subscription.current_period_end * 1000),
                },
            });
            return recurring;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create recurring donation');
        }
    }
    async completeDonation(paymentIntentId) {
        const donation = await this.prisma.donation.findFirst({
            where: { stripePaymentId: paymentIntentId },
        });
        if (!donation) {
            throw new common_1.BadRequestException('Donation not found');
        }
        await this.prisma.donation.update({
            where: { id: donation.id },
            data: { status: 'COMPLETED' },
        });
        if (donation.campaignId) {
            await this.prisma.campaign.update({
                where: { id: donation.campaignId },
                data: {
                    currentAmount: { increment: donation.amount },
                    donorCount: { increment: 1 },
                },
            });
            await this.campaignsService.checkMilestones(donation.campaignId);
        }
        await this.prisma.nonprofit.update({
            where: { id: donation.nonprofitId },
            data: {
                totalDonations: { increment: donation.amount },
                donorCount: { increment: 1 },
            },
        });
        await this.generateReceipt(donation.id);
        return donation;
    }
    async generateReceipt(donationId) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
            include: {
                user: { include: { profile: true } },
                nonprofit: true,
                campaign: true,
            },
        });
        if (!donation)
            return;
        const receiptNumber = `R-${Date.now()}-${donationId.slice(0, 8)}`;
        await this.prisma.donation.update({
            where: { id: donationId },
            data: {
                taxReceiptIssued: true,
                receiptNumber,
            },
        });
        return { receiptNumber };
    }
    async getMyDonations(userId) {
        return this.prisma.donation.findMany({
            where: { userId, status: 'COMPLETED' },
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                campaign: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyRecurringDonations(userId) {
        return this.prisma.recurringDonation.findMany({
            where: { userId, active: true },
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async cancelRecurring(id, userId) {
        const recurring = await this.prisma.recurringDonation.findUnique({
            where: { id },
        });
        if (!recurring || recurring.userId !== userId) {
            throw new common_1.BadRequestException('Recurring donation not found');
        }
        if (recurring.stripeSubscriptionId) {
            await this.stripe.subscriptions.cancel(recurring.stripeSubscriptionId);
        }
        return this.prisma.recurringDonation.update({
            where: { id },
            data: {
                active: false,
                cancelledAt: new Date(),
            },
        });
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof campaigns_service_1.CampaignsService !== "undefined" && campaigns_service_1.CampaignsService) === "function" ? _b : Object])
], DonationsService);


/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DonationsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const donations_service_1 = __webpack_require__(33);
const jwt_auth_guard_1 = __webpack_require__(23);
let DonationsController = class DonationsController {
    constructor(donationsService) {
        this.donationsService = donationsService;
    }
    async createOneTime(dto, req) {
        const userId = req.user?.userId || null;
        return this.donationsService.createOneTimeDonation(userId, dto);
    }
    createRecurring(dto, req) {
        return this.donationsService.createRecurringDonation(req.user.userId, dto);
    }
    completeDonation(paymentIntentId) {
        return this.donationsService.completeDonation(paymentIntentId);
    }
    getMyDonations(req) {
        return this.donationsService.getMyDonations(req.user.userId);
    }
    getMyRecurring(req) {
        return this.donationsService.getMyRecurringDonations(req.user.userId);
    }
    cancelRecurring(id, req) {
        return this.donationsService.cancelRecurring(id, req.user.userId);
    }
    getReceipt(id) {
        return this.donationsService.generateReceipt(id);
    }
};
exports.DonationsController = DonationsController;
__decorate([
    (0, common_1.Post)('one-time'),
    (0, swagger_1.ApiOperation)({ summary: 'Create one-time donation' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "createOneTime", null);
__decorate([
    (0, common_1.Post)('recurring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create recurring donation' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "createRecurring", null);
__decorate([
    (0, common_1.Post)('complete/:paymentIntentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete donation after payment' }),
    __param(0, (0, common_1.Param)('paymentIntentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "completeDonation", null);
__decorate([
    (0, common_1.Get)('my-donations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my donations' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getMyDonations", null);
__decorate([
    (0, common_1.Get)('my-recurring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my recurring donations' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getMyRecurring", null);
__decorate([
    (0, common_1.Patch)('recurring/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel recurring donation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "cancelRecurring", null);
__decorate([
    (0, common_1.Get)('receipt/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get donation receipt' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getReceipt", null);
exports.DonationsController = DonationsController = __decorate([
    (0, swagger_1.ApiTags)('donations'),
    (0, common_1.Controller)('donations'),
    __metadata("design:paramtypes", [typeof (_a = typeof donations_service_1.DonationsService !== "undefined" && donations_service_1.DonationsService) === "function" ? _a : Object])
], DonationsController);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteeringModule = void 0;
const common_1 = __webpack_require__(2);
const volunteering_service_1 = __webpack_require__(37);
const volunteering_controller_1 = __webpack_require__(38);
const prisma_module_1 = __webpack_require__(10);
let VolunteeringModule = class VolunteeringModule {
};
exports.VolunteeringModule = VolunteeringModule;
exports.VolunteeringModule = VolunteeringModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [volunteering_controller_1.VolunteeringController],
        providers: [volunteering_service_1.VolunteeringService],
        exports: [volunteering_service_1.VolunteeringService],
    })
], VolunteeringModule);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteeringService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let VolunteeringService = class VolunteeringService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProfile(userId, dto) {
        return this.prisma.volunteerProfile.upsert({
            where: { userId },
            update: dto,
            create: { userId, ...dto },
        });
    }
    async createOpportunity(nonprofitId, dto) {
        return this.prisma.volunteerOpportunity.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
    async findOpportunities(filters) {
        const where = { published: true };
        if (filters?.skills) {
            where.requiredSkills = {
                hasSome: Array.isArray(filters.skills) ? filters.skills : [filters.skills],
            };
        }
        if (filters?.remote !== undefined) {
            where.remote = filters.remote === 'true';
        }
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.volunteerOpportunity.findMany({
            where,
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        verified: true,
                    },
                },
                _count: {
                    select: { applications: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async apply(opportunityId, userId, dto) {
        const existing = await this.prisma.volunteerApplication.findFirst({
            where: { opportunityId, userId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already applied');
        }
        return this.prisma.volunteerApplication.create({
            data: {
                opportunityId,
                userId,
                ...dto,
            },
        });
    }
    async updateApplicationStatus(id, status, dto) {
        return this.prisma.volunteerApplication.update({
            where: { id },
            data: {
                status,
                ...dto,
            },
        });
    }
    async logHours(applicationId, dto) {
        const application = await this.prisma.volunteerApplication.findUnique({
            where: { id: applicationId },
        });
        if (!application || application.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Invalid application');
        }
        return this.prisma.volunteerHours.create({
            data: {
                applicationId,
                ...dto,
            },
        });
    }
    async generateCertificate(userId, nonprofitId) {
        const totalHours = await this.prisma.volunteerHours.aggregate({
            where: {
                application: {
                    userId,
                    opportunity: { nonprofitId },
                },
                verified: true,
            },
            _sum: { hours: true },
        });
        if (!totalHours._sum.hours || totalHours._sum.hours < 10) {
            throw new common_1.BadRequestException('Minimum 10 hours required');
        }
        return this.prisma.volunteerCertificate.create({
            data: {
                userId,
                nonprofitId,
                totalHours: totalHours._sum.hours,
                certificateNumber: `CERT-${Date.now()}-${userId.slice(0, 8)}`,
            },
        });
    }
    async getMyApplications(userId) {
        return this.prisma.volunteerApplication.findMany({
            where: { userId },
            include: {
                opportunity: {
                    include: {
                        nonprofit: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyHours(userId) {
        const hours = await this.prisma.volunteerHours.findMany({
            where: {
                application: { userId },
                verified: true,
            },
            include: {
                application: {
                    include: {
                        opportunity: {
                            include: {
                                nonprofit: {
                                    select: {
                                        id: true,
                                        name: true,
                                        logo: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
        const total = await this.prisma.volunteerHours.aggregate({
            where: {
                application: { userId },
                verified: true,
            },
            _sum: { hours: true },
        });
        return {
            hours,
            totalHours: total._sum.hours || 0,
        };
    }
};
exports.VolunteeringService = VolunteeringService;
exports.VolunteeringService = VolunteeringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], VolunteeringService);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteeringController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const volunteering_service_1 = __webpack_require__(37);
const jwt_auth_guard_1 = __webpack_require__(23);
let VolunteeringController = class VolunteeringController {
    constructor(volunteeringService) {
        this.volunteeringService = volunteeringService;
    }
    createProfile(req, dto) {
        return this.volunteeringService.createProfile(req.user.userId, dto);
    }
    createOpportunity(dto) {
        return this.volunteeringService.createOpportunity(dto.nonprofitId, dto);
    }
    findOpportunities(filters) {
        return this.volunteeringService.findOpportunities(filters);
    }
    apply(id, req, dto) {
        return this.volunteeringService.apply(id, req.user.userId, dto);
    }
    updateStatus(id, dto) {
        return this.volunteeringService.updateApplicationStatus(id, dto.status, dto);
    }
    logHours(dto) {
        return this.volunteeringService.logHours(dto.applicationId, dto);
    }
    generateCertificate(req, dto) {
        return this.volunteeringService.generateCertificate(req.user.userId, dto.nonprofitId);
    }
    getMyApplications(req) {
        return this.volunteeringService.getMyApplications(req.user.userId);
    }
    getMyHours(req) {
        return this.volunteeringService.getMyHours(req.user.userId);
    }
};
exports.VolunteeringController = VolunteeringController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create/update volunteer profile' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Post)('opportunities'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create opportunity' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "createOpportunity", null);
__decorate([
    (0, common_1.Get)('opportunities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get opportunities' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "findOpportunities", null);
__decorate([
    (0, common_1.Post)('opportunities/:id/apply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Apply for opportunity' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "apply", null);
__decorate([
    (0, common_1.Patch)('applications/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('hours'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Log volunteer hours' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "logHours", null);
__decorate([
    (0, common_1.Post)('certificate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate certificate' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "generateCertificate", null);
__decorate([
    (0, common_1.Get)('my-applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my applications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)('my-hours'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my hours' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VolunteeringController.prototype, "getMyHours", null);
exports.VolunteeringController = VolunteeringController = __decorate([
    (0, swagger_1.ApiTags)('volunteering'),
    (0, common_1.Controller)('volunteering'),
    __metadata("design:paramtypes", [typeof (_a = typeof volunteering_service_1.VolunteeringService !== "undefined" && volunteering_service_1.VolunteeringService) === "function" ? _a : Object])
], VolunteeringController);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModule = void 0;
const common_1 = __webpack_require__(2);
const events_service_1 = __webpack_require__(40);
const events_controller_1 = __webpack_require__(41);
const prisma_module_1 = __webpack_require__(10);
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService],
        exports: [events_service_1.EventsService],
    })
], EventsModule);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(nonprofitId, dto) {
        return this.prisma.event.create({
            data: {
                nonprofitId,
                ...dto,
                slug: this.generateSlug(dto.title),
            },
        });
    }
    async findAll(filters) {
        const where = { published: true };
        if (filters?.type)
            where.type = filters.type;
        if (filters?.upcoming) {
            where.startDate = { gte: new Date() };
        }
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.event.findMany({
            where: where,
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        verified: true,
                    },
                },
                _count: {
                    select: {
                        registrations: true,
                        tickets: true,
                    },
                },
            },
            orderBy: { startDate: 'asc' },
        });
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                nonprofit: true,
                tickets: true,
                _count: {
                    select: { registrations: true },
                },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return event;
    }
    async register(eventId, userId, dto) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { tickets: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (dto.ticketId) {
            const ticket = event.tickets.find((t) => t.id === dto.ticketId);
            if (!ticket) {
                throw new common_1.BadRequestException('Ticket not available');
            }
        }
        return this.prisma.eventRegistration.create({
            data: {
                eventId,
                userId,
                ticketId: dto.ticketId,
                firstName: dto.firstName || 'Guest',
                lastName: dto.lastName || 'Guest',
                email: dto.email || 'guest@example.com',
                phone: dto.phone,
                status: 'REGISTERED',
            },
        });
    }
    async checkIn(registrationId) {
        return this.prisma.eventRegistration.update({
            where: { id: registrationId },
            data: {
                status: 'CHECKED_IN',
                checkedInAt: new Date(),
            },
        });
    }
    async getMyEvents(userId) {
        return this.prisma.eventRegistration.findMany({
            where: { userId },
            include: {
                event: {
                    include: {
                        nonprofit: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
            orderBy: { event: { startDate: 'desc' } },
        });
    }
    async addTickets(eventId, tickets) {
        return this.prisma.eventTicket.createMany({
            data: tickets.map((ticket) => ({
                eventId,
                ...ticket,
            })),
        });
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], EventsService);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const events_service_1 = __webpack_require__(40);
const jwt_auth_guard_1 = __webpack_require__(23);
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    create(dto) {
        return this.eventsService.create(dto.nonprofitId, dto);
    }
    findAll(filters) {
        return this.eventsService.findAll(filters);
    }
    findOne(id) {
        return this.eventsService.findOne(id);
    }
    register(id, req, dto) {
        return this.eventsService.register(id, req.user.userId, dto);
    }
    checkIn(registrationId) {
        return this.eventsService.checkIn(registrationId);
    }
    getMyEvents(req) {
        return this.eventsService.getMyEvents(req.user.userId);
    }
    addTickets(id, dto) {
        return this.eventsService.addTickets(id, dto.tickets);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create event' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/register'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register for event' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "register", null);
__decorate([
    (0, common_1.Post)(':id/check-in/:registrationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check in attendee' }),
    __param(0, (0, common_1.Param)('registrationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Get)('my/registrations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my events' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getMyEvents", null);
__decorate([
    (0, common_1.Post)(':id/tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add tickets' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "addTickets", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [typeof (_a = typeof events_service_1.EventsService !== "undefined" && events_service_1.EventsService) === "function" ? _a : Object])
], EventsController);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetitionsModule = void 0;
const common_1 = __webpack_require__(2);
const petitions_service_1 = __webpack_require__(43);
const petitions_controller_1 = __webpack_require__(44);
const prisma_module_1 = __webpack_require__(10);
let PetitionsModule = class PetitionsModule {
};
exports.PetitionsModule = PetitionsModule;
exports.PetitionsModule = PetitionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [petitions_controller_1.PetitionsController],
        providers: [petitions_service_1.PetitionsService],
        exports: [petitions_service_1.PetitionsService],
    })
], PetitionsModule);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetitionsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let PetitionsService = class PetitionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.petition.create({
            data: {
                creatorId: userId,
                ...dto,
                slug: this.generateSlug(dto.title),
            },
        });
    }
    async findAll(filters) {
        const where = { status: 'ACTIVE' };
        if (filters?.category)
            where.category = filters.category;
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.petition.findMany({
            where,
            include: {
                _count: {
                    select: { signatures: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const petition = await this.prisma.petition.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                displayName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                updates: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                signatures: {
                    where: { showPublicly: true },
                    orderBy: { signedAt: 'desc' },
                    take: 20,
                    include: {
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        firstName: true,
                                        displayName: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: { signatures: true },
                },
            },
        });
        if (!petition) {
            throw new common_1.NotFoundException('Petition not found');
        }
        await this.prisma.petition.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        return petition;
    }
    async sign(petitionId, userId, dto) {
        const petition = await this.prisma.petition.findUnique({
            where: { id: petitionId },
        });
        if (!petition || petition.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Petition not available for signing');
        }
        const existing = await this.prisma.petitionSignature.findFirst({
            where: { petitionId, userId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already signed');
        }
        const signature = await this.prisma.petitionSignature.create({
            data: {
                petitionId,
                userId,
                ...dto,
            },
        });
        await this.prisma.petition.update({
            where: { id: petitionId },
            data: {
                currentSignatures: { increment: 1 },
            },
        });
        if (petition.signatureGoal &&
            petition.currentSignatures + 1 >= petition.signatureGoal) {
            await this.prisma.petition.update({
                where: { id: petitionId },
                data: { status: 'SUCCESSFUL' },
            });
        }
        return signature;
    }
    async addUpdate(petitionId, userId, dto) {
        const petition = await this.prisma.petition.findUnique({
            where: { id: petitionId },
        });
        if (!petition || petition.creatorId !== userId) {
            throw new common_1.BadRequestException('Not authorized');
        }
        return this.prisma.petitionUpdate.create({
            data: {
                petitionId,
                ...dto,
            },
        });
    }
    async getTrending() {
        return this.prisma.petition.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [
                { currentSignatures: 'desc' },
                { viewCount: 'desc' },
            ],
            take: 10,
            include: {
                _count: {
                    select: { signatures: true },
                },
            },
        });
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
};
exports.PetitionsService = PetitionsService;
exports.PetitionsService = PetitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PetitionsService);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetitionsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const petitions_service_1 = __webpack_require__(43);
const jwt_auth_guard_1 = __webpack_require__(23);
let PetitionsController = class PetitionsController {
    constructor(petitionsService) {
        this.petitionsService = petitionsService;
    }
    create(req, dto) {
        return this.petitionsService.create(req.user.userId, dto);
    }
    findAll(filters) {
        return this.petitionsService.findAll(filters);
    }
    getTrending() {
        return this.petitionsService.getTrending();
    }
    findOne(id) {
        return this.petitionsService.findOne(id);
    }
    sign(id, req, dto) {
        return this.petitionsService.sign(id, req.user.userId, dto);
    }
    addUpdate(id, req, dto) {
        return this.petitionsService.addUpdate(id, req.user.userId, dto);
    }
};
exports.PetitionsController = PetitionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create petition' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PetitionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all petitions' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PetitionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trending petitions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PetitionsController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get petition by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PetitionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sign petition' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PetitionsController.prototype, "sign", null);
__decorate([
    (0, common_1.Post)(':id/updates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add petition update' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PetitionsController.prototype, "addUpdate", null);
exports.PetitionsController = PetitionsController = __decorate([
    (0, swagger_1.ApiTags)('petitions'),
    (0, common_1.Controller)('petitions'),
    __metadata("design:paramtypes", [typeof (_a = typeof petitions_service_1.PetitionsService !== "undefined" && petitions_service_1.PetitionsService) === "function" ? _a : Object])
], PetitionsController);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImpactModule = void 0;
const common_1 = __webpack_require__(2);
const impact_service_1 = __webpack_require__(46);
const impact_controller_1 = __webpack_require__(47);
const prisma_module_1 = __webpack_require__(10);
let ImpactModule = class ImpactModule {
};
exports.ImpactModule = ImpactModule;
exports.ImpactModule = ImpactModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [impact_controller_1.ImpactController],
        providers: [impact_service_1.ImpactService],
        exports: [impact_service_1.ImpactService],
    })
], ImpactModule);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImpactService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let ImpactService = class ImpactService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMetric(nonprofitId, dto) {
        return this.prisma.impactMetric.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
    async createStory(nonprofitId, dto) {
        return this.prisma.impactStory.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
    async getNonprofitImpact(nonprofitId) {
        const metrics = await this.prisma.impactMetric.findMany({
            where: { nonprofitId },
            orderBy: { createdAt: 'desc' },
        });
        const stories = await this.prisma.impactStory.findMany({
            where: { nonprofitId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        const financials = await this.prisma.financialReport.findMany({
            where: { nonprofitId },
            orderBy: { year: 'desc' },
        });
        return { metrics, stories, financials };
    }
    async getStories(filters) {
        const where = { published: true };
        if (filters?.category)
            where.category = filters.category;
        return this.prisma.impactStory.findMany({
            where,
            include: {},
            orderBy: { createdAt: 'desc' },
        });
    }
    async createFinancialReport(nonprofitId, dto) {
        return this.prisma.financialReport.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
};
exports.ImpactService = ImpactService;
exports.ImpactService = ImpactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ImpactService);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImpactController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const impact_service_1 = __webpack_require__(46);
const jwt_auth_guard_1 = __webpack_require__(23);
let ImpactController = class ImpactController {
    constructor(impactService) {
        this.impactService = impactService;
    }
    createMetric(dto) {
        return this.impactService.createMetric(dto.nonprofitId, dto);
    }
    createStory(dto) {
        return this.impactService.createStory(dto.nonprofitId, dto);
    }
    getStories(filters) {
        return this.impactService.getStories(filters);
    }
    getNonprofitImpact(id) {
        return this.impactService.getNonprofitImpact(id);
    }
    createFinancialReport(dto) {
        return this.impactService.createFinancialReport(dto.nonprofitId, dto);
    }
};
exports.ImpactController = ImpactController;
__decorate([
    (0, common_1.Post)('metrics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create impact metric' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpactController.prototype, "createMetric", null);
__decorate([
    (0, common_1.Post)('stories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create impact story' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpactController.prototype, "createStory", null);
__decorate([
    (0, common_1.Get)('stories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get impact stories' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpactController.prototype, "getStories", null);
__decorate([
    (0, common_1.Get)('nonprofit/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nonprofit impact' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImpactController.prototype, "getNonprofitImpact", null);
__decorate([
    (0, common_1.Post)('financial-reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create financial report' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImpactController.prototype, "createFinancialReport", null);
exports.ImpactController = ImpactController = __decorate([
    (0, swagger_1.ApiTags)('impact'),
    (0, common_1.Controller)('impact'),
    __metadata("design:paramtypes", [typeof (_a = typeof impact_service_1.ImpactService !== "undefined" && impact_service_1.ImpactService) === "function" ? _a : Object])
], ImpactController);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumsModule = void 0;
const common_1 = __webpack_require__(2);
const forums_service_1 = __webpack_require__(49);
const forums_controller_1 = __webpack_require__(50);
const prisma_module_1 = __webpack_require__(10);
let ForumsModule = class ForumsModule {
};
exports.ForumsModule = ForumsModule;
exports.ForumsModule = ForumsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [forums_controller_1.ForumsController],
        providers: [forums_service_1.ForumsService],
        exports: [forums_service_1.ForumsService],
    })
], ForumsModule);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let ForumsService = class ForumsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForum(dto) {
        return this.prisma.forum.create({
            data: {
                ...dto,
                slug: this.generateSlug(dto.name),
            },
        });
    }
    async getForums() {
        return this.prisma.forum.findMany({
            where: { id: { not: undefined } },
            include: {
                _count: {
                    select: {
                        threads: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createThread(forumId, userId, dto) {
        return this.prisma.forumThread.create({
            data: {
                forumId,
                authorId: userId,
                ...dto,
            },
        });
    }
    async getThreads(forumId, filters) {
        const where = { forumId };
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { content: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.forumThread.findMany({
            where,
            include: {
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: filters?.sort === 'popular'
                ? { createdAt: 'desc' }
                : { createdAt: 'desc' },
        });
    }
    async getThread(id) {
        const thread = await this.prisma.forumThread.findUnique({
            where: { id },
            include: {
                posts: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        await this.prisma.forumThread.update({
            where: { id },
            data: { content: thread.content },
        });
        return thread;
    }
    async createPost(threadId, userId, dto) {
        return this.prisma.forumPost.create({
            data: {
                threadId,
                authorId: userId,
                ...dto,
            },
        });
    }
    async createComment(postId, userId, dto) {
        return this.prisma.forumComment.create({
            data: {
                postId,
                authorId: userId,
                ...dto,
            },
        });
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
};
exports.ForumsService = ForumsService;
exports.ForumsService = ForumsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ForumsService);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const forums_service_1 = __webpack_require__(49);
const jwt_auth_guard_1 = __webpack_require__(23);
let ForumsController = class ForumsController {
    constructor(forumsService) {
        this.forumsService = forumsService;
    }
    createForum(dto) {
        return this.forumsService.createForum(dto);
    }
    getForums() {
        return this.forumsService.getForums();
    }
    createThread(forumId, req, dto) {
        return this.forumsService.createThread(forumId, req.user.userId, dto);
    }
    getThreads(forumId, filters) {
        return this.forumsService.getThreads(forumId, filters);
    }
    getThread(id) {
        return this.forumsService.getThread(id);
    }
    createPost(threadId, req, dto) {
        return this.forumsService.createPost(threadId, req.user.userId, dto);
    }
    createComment(postId, req, dto) {
        return this.forumsService.createComment(postId, req.user.userId, dto);
    }
};
exports.ForumsController = ForumsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create forum' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "createForum", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all forums' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "getForums", null);
__decorate([
    (0, common_1.Post)(':forumId/threads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create thread' }),
    __param(0, (0, common_1.Param)('forumId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "createThread", null);
__decorate([
    (0, common_1.Get)(':forumId/threads'),
    (0, swagger_1.ApiOperation)({ summary: 'Get threads' }),
    __param(0, (0, common_1.Param)('forumId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "getThreads", null);
__decorate([
    (0, common_1.Get)('threads/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get thread' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "getThread", null);
__decorate([
    (0, common_1.Post)('threads/:threadId/posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create post' }),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Post)('posts/:postId/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create comment' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ForumsController.prototype, "createComment", null);
exports.ForumsController = ForumsController = __decorate([
    (0, swagger_1.ApiTags)('forums'),
    (0, common_1.Controller)('forums'),
    __metadata("design:paramtypes", [typeof (_a = typeof forums_service_1.ForumsService !== "undefined" && forums_service_1.ForumsService) === "function" ? _a : Object])
], ForumsController);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationsModule = void 0;
const common_1 = __webpack_require__(2);
const communications_service_1 = __webpack_require__(52);
const communications_controller_1 = __webpack_require__(55);
const prisma_module_1 = __webpack_require__(10);
let CommunicationsModule = class CommunicationsModule {
};
exports.CommunicationsModule = CommunicationsModule;
exports.CommunicationsModule = CommunicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [communications_controller_1.CommunicationsController],
        providers: [communications_service_1.CommunicationsService],
        exports: [communications_service_1.CommunicationsService],
    })
], CommunicationsModule);


/***/ }),
/* 52 */
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
const sgMail = __importStar(__webpack_require__(53));
const twilio = __importStar(__webpack_require__(54));
let CommunicationsService = class CommunicationsService {
    constructor(prisma) {
        this.prisma = prisma;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
    }
    async sendEmail(dto) {
        try {
            const msg = {
                to: dto.to,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@civicplatform.org',
                subject: dto.subject,
                text: dto.text,
                html: dto.html,
            };
            await sgMail.send(msg);
            await this.prisma.notification.create({
                data: {
                    userId: dto.userId,
                    type: 'EMAIL',
                    title: dto.subject,
                    content: dto.text,
                    read: false,
                },
            });
            return { success: true };
        }
        catch (error) {
            console.error('Email send error:', error);
            return { success: false, error };
        }
    }
    async sendSMS(dto) {
        if (!this.twilioClient) {
            return { success: false, error: 'Twilio not configured' };
        }
        try {
            await this.twilioClient.messages.create({
                body: dto.message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: dto.to,
            });
            await this.prisma.notification.create({
                data: {
                    userId: dto.userId,
                    type: 'SMS',
                    title: 'SMS Notification',
                    content: dto.message,
                    read: false,
                },
            });
            return { success: true };
        }
        catch (error) {
            console.error('SMS send error:', error);
            return { success: false, error };
        }
    }
    async createEmailCampaign(nonprofitId, dto) {
        return this.prisma.emailCampaign.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
    async getNotifications(userId, filters) {
        const where = { userId };
        if (filters?.unread) {
            where.read = false;
        }
        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(userId, notificationId) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { read: true },
        });
    }
    async updatePreferences(userId, dto) {
        return this.prisma.communicationPreference.upsert({
            where: { userId },
            update: dto,
            create: { userId, ...dto },
        });
    }
    async getPreferences(userId) {
        return this.prisma.communicationPreference.findUnique({
            where: { userId },
        });
    }
};
exports.CommunicationsService = CommunicationsService;
exports.CommunicationsService = CommunicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CommunicationsService);


/***/ }),
/* 53 */
/***/ ((module) => {

module.exports = require("@sendgrid/mail");

/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("twilio");

/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const communications_service_1 = __webpack_require__(52);
const jwt_auth_guard_1 = __webpack_require__(23);
let CommunicationsController = class CommunicationsController {
    constructor(communicationsService) {
        this.communicationsService = communicationsService;
    }
    sendEmail(dto) {
        return this.communicationsService.sendEmail(dto);
    }
    sendSMS(dto) {
        return this.communicationsService.sendSMS(dto);
    }
    createCampaign(dto) {
        return this.communicationsService.createEmailCampaign(dto.nonprofitId, dto);
    }
    getNotifications(req, filters) {
        return this.communicationsService.getNotifications(req.user.userId, filters);
    }
    markAsRead(req, id) {
        return this.communicationsService.markAsRead(req.user.userId, id);
    }
    getPreferences(req) {
        return this.communicationsService.getPreferences(req.user.userId);
    }
    updatePreferences(req, dto) {
        return this.communicationsService.updatePreferences(req.user.userId, dto);
    }
};
exports.CommunicationsController = CommunicationsController;
__decorate([
    (0, common_1.Post)('email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send email' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('sms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send SMS' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "sendSMS", null);
__decorate([
    (0, common_1.Post)('campaigns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create email campaign' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get notifications' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/:id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get preferences' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Post)('preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update preferences' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommunicationsController.prototype, "updatePreferences", null);
exports.CommunicationsController = CommunicationsController = __decorate([
    (0, swagger_1.ApiTags)('communications'),
    (0, common_1.Controller)('communications'),
    __metadata("design:paramtypes", [typeof (_a = typeof communications_service_1.CommunicationsService !== "undefined" && communications_service_1.CommunicationsService) === "function" ? _a : Object])
], CommunicationsController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const common_1 = __webpack_require__(2);
const analytics_service_1 = __webpack_require__(57);
const analytics_controller_1 = __webpack_require__(58);
const prisma_module_1 = __webpack_require__(10);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDonorAnalytics(userId) {
        const totalDonated = await this.prisma.donation.aggregate({
            where: { userId, status: 'COMPLETED' },
            _sum: { amount: true },
            _count: true,
        });
        const nonprofitsSupported = await this.prisma.donation.groupBy({
            by: ['nonprofitId'],
            where: { userId, status: 'COMPLETED' },
        });
        const recentDonations = await this.prisma.donation.findMany({
            where: { userId, status: 'COMPLETED' },
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
        });
        return {
            totalDonated: totalDonated._sum.amount || 0,
            totalDonations: totalDonated._count,
            nonprofitsSupported: nonprofitsSupported.length,
            recentDonations,
        };
    }
    async getCampaignAnalytics(campaignId) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                donations: {
                    where: { status: 'COMPLETED' },
                },
            },
        });
        if (!campaign)
            return null;
        const donationsByDay = await this.prisma.$queryRaw `
      SELECT DATE(created_at) as date, SUM(amount) as amount, COUNT(*) as count
      FROM "Donation"
      WHERE campaign_id = ${campaignId} AND status = 'COMPLETED'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
        const topDonors = await this.prisma.donation.groupBy({
            by: ['userId'],
            where: { campaignId, status: 'COMPLETED', anonymous: false },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 10,
        });
        return {
            totalRaised: campaign.currentAmount,
            goalPercentage: (campaign.currentAmount / campaign.goalAmount) * 100,
            totalDonors: campaign.donorCount,
            averageDonation: campaign.donations.length > 0
                ? campaign.currentAmount / campaign.donations.length
                : 0,
            donationsByDay,
            topDonors,
        };
    }
    async getNonprofitAnalytics(nonprofitId) {
        const nonprofit = await this.prisma.nonprofit.findUnique({
            where: { id: nonprofitId },
        });
        if (!nonprofit)
            return null;
        const campaignStats = await this.prisma.campaign.aggregate({
            where: { nonprofitId },
            _count: true,
            _sum: { currentAmount: true },
        });
        const volunteerStats = await this.prisma.volunteerHours.aggregate({
            where: {
                application: {
                    opportunity: { nonprofitId },
                },
                verified: true,
            },
            _sum: { hours: true },
            _count: true,
        });
        const eventStats = await this.prisma.eventRegistration.aggregate({
            where: {
                event: { nonprofitId },
            },
            _count: true,
        });
        const monthlyDonations = await this.prisma.$queryRaw `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as amount,
        COUNT(*) as count
      FROM "Donation"
      WHERE nonprofit_id = ${nonprofitId} AND status = 'COMPLETED'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
        return {
            totalDonations: nonprofit.totalDonations,
            totalDonors: nonprofit.donorCount,
            activeCampaigns: campaignStats._count,
            totalRaised: campaignStats._sum.currentAmount || 0,
            volunteerHours: volunteerStats._sum.hours || 0,
            totalVolunteers: volunteerStats._count,
            eventAttendees: eventStats._count,
            monthlyDonations,
        };
    }
    async getPlatformStats() {
        const nonprofits = await this.prisma.nonprofit.count();
        const verifiedNonprofits = await this.prisma.nonprofit.count({
            where: { verified: true },
        });
        const campaigns = await this.prisma.campaign.count();
        const activeCampaigns = await this.prisma.campaign.count({
            where: { status: 'ACTIVE' },
        });
        const totalDonations = await this.prisma.donation.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
            _count: true,
        });
        const volunteers = await this.prisma.volunteerProfile.count();
        const volunteerHours = await this.prisma.volunteerHours.aggregate({
            where: { verified: true },
            _sum: { hours: true },
        });
        const petitions = await this.prisma.petition.count();
        const petitionSignatures = await this.prisma.petitionSignature.count();
        return {
            nonprofits,
            verifiedNonprofits,
            campaigns,
            activeCampaigns,
            totalDonations: totalDonations._sum.amount || 0,
            donationCount: totalDonations._count,
            volunteers,
            volunteerHours: volunteerHours._sum.hours || 0,
            petitions,
            petitionSignatures,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AnalyticsService);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const analytics_service_1 = __webpack_require__(57);
const jwt_auth_guard_1 = __webpack_require__(23);
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getDonorAnalytics(req) {
        return this.analyticsService.getDonorAnalytics(req.user.userId);
    }
    getCampaignAnalytics(id) {
        return this.analyticsService.getCampaignAnalytics(id);
    }
    getNonprofitAnalytics(id) {
        return this.analyticsService.getNonprofitAnalytics(id);
    }
    getPlatformStats() {
        return this.analyticsService.getPlatformStats();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('donor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get donor analytics' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getDonorAnalytics", null);
__decorate([
    (0, common_1.Get)('campaign/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign analytics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getCampaignAnalytics", null);
__decorate([
    (0, common_1.Get)('nonprofit/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get nonprofit analytics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getNonprofitAnalytics", null);
__decorate([
    (0, common_1.Get)('platform'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getPlatformStats", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object])
], AnalyticsController);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(2);
const admin_service_1 = __webpack_require__(60);
const admin_controller_1 = __webpack_require__(61);
const prisma_module_1 = __webpack_require__(10);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAdminRole(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'SUPER_ADMIN') {
            throw new common_1.ForbiddenException('Admin access required');
        }
    }
    async verifyNonprofit(userId, nonprofitId, dto) {
        await this.checkAdminRole(userId);
        return this.prisma.nonprofit.update({
            where: { id: nonprofitId },
            data: {
                verified: dto.verified,
                verifiedAt: dto.verified ? new Date() : null,
            },
        });
    }
    async getAllUsers(userId, filters) {
        await this.checkAdminRole(userId);
        const where = {};
        if (filters?.role)
            where.role = filters.role;
        if (filters?.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { profile: { firstName: { contains: filters.search, mode: 'insensitive' } } },
                { profile: { lastName: { contains: filters.search, mode: 'insensitive' } } },
            ];
        }
        return this.prisma.user.findMany({
            where,
            include: { profile: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserRole(userId, targetUserId, role) {
        await this.checkAdminRole(userId);
        return this.prisma.user.update({
            where: { id: targetUserId },
            data: { role },
        });
    }
    async getPendingVerifications(userId) {
        await this.checkAdminRole(userId);
        return this.prisma.nonprofit.findMany({
            where: {
                verified: false,
                taxExemptDocument: { not: null },
            },
            include: {
                admins: {
                    include: {
                        user: {
                            include: { profile: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPlatformStats(userId) {
        await this.checkAdminRole(userId);
        const users = await this.prisma.user.count();
        const nonprofits = await this.prisma.nonprofit.count();
        const campaigns = await this.prisma.campaign.count();
        const donations = await this.prisma.donation.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true, platformFee: true },
            _count: true,
        });
        const recentActivity = await this.prisma.donation.findMany({
            where: { status: 'COMPLETED' },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                nonprofit: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return {
            users,
            nonprofits,
            campaigns,
            totalDonations: donations._sum.amount || 0,
            donationCount: donations._count,
            platformRevenue: donations._sum.platformFee || 0,
            recentActivity,
        };
    }
    async moderateContent(userId, contentType, contentId, action) {
        await this.checkAdminRole(userId);
        switch (contentType) {
            case 'petition':
                return this.prisma.petition.update({
                    where: { id: contentId },
                    data: { status: action === 'approve' ? 'ACTIVE' : 'CLOSED' },
                });
            case 'thread':
                return this.prisma.forumThread.update({
                    where: { id: contentId },
                    data: { deleted: action === 'delete' },
                });
            case 'post':
                return this.prisma.forumPost.update({
                    where: { id: contentId },
                    data: { deleted: action === 'delete' },
                });
            default:
                throw new common_1.ForbiddenException('Invalid content type');
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdminService);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const admin_service_1 = __webpack_require__(60);
const jwt_auth_guard_1 = __webpack_require__(23);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers(req, filters) {
        return this.adminService.getAllUsers(req.user.userId, filters);
    }
    updateUserRole(req, id, dto) {
        return this.adminService.updateUserRole(req.user.userId, id, dto.role);
    }
    getPendingVerifications(req) {
        return this.adminService.getPendingVerifications(req.user.userId);
    }
    verifyNonprofit(req, id, dto) {
        return this.adminService.verifyNonprofit(req.user.userId, id, dto);
    }
    getPlatformStats(req) {
        return this.adminService.getPlatformStats(req.user.userId);
    }
    moderateContent(req, dto) {
        return this.adminService.moderateContent(req.user.userId, dto.contentType, dto.contentId, dto.action);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user role' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Get)('verifications/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending verifications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Patch)('nonprofits/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify nonprofit' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyNonprofit", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform stats' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPlatformStats", null);
__decorate([
    (0, common_1.Post)('moderate'),
    (0, swagger_1.ApiOperation)({ summary: 'Moderate content' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "moderateContent", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 62 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),
/* 63 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 64 */
/***/ ((module) => {

module.exports = require("compression");

/***/ })
/******/ 	]);
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
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;