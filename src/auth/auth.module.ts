import { forwardRef, Module } from "@nestjs/common";
import { Bcrypt } from "./bcrypt/bcrypt";
import { AuthController } from "./controllers/auth.contoller";
import { AuthService } from "./services/auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { UsuarioModule } from "../usuario/usuario.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants/constants";
import { JwtStrategy } from "./strategy/jwt.strategy";



@Module({
imports: [forwardRef(() => UsuarioModule), PassportModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {expiresIn: "10h"},
})
],
providers: [Bcrypt, AuthService, LocalStrategy, JwtStrategy],
controllers: [AuthController],
exports: [Bcrypt],
})

export class AuthModule{};