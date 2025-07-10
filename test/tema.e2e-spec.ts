import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe("Testes do Módulo Tema (e2e)", () => {
let app: INestApplication;
let token: string;
let temaId: number;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
        TypeOrmModule.forRoot({
        type: "sqlite",
        database: ":memory:",
        entities: [__dirname + "./../src/**/entities/*.entity.ts"],
        synchronize: true,
        dropSchema: true,
        }),
        AppModule,
],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();


    await request(app.getHttpServer())
    .post("/usuarios/cadastrar")
    .send({
        nome: "Root",
        usuario: "root@root.com",
        senha: "rootroot",
        foto: '-',
});

    const resposta = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
        usuario: "root@root.com",
        senha: "rootroot",
});

    token = resposta.body.token;
});

afterAll(async () => {
    await app.close();
});

it("01 - Deve criar um novo Tema", async () => {
    const resposta = await request(app.getHttpServer())
    .post("/temas")
    .set("Authorization", `${token}`)
    .send({
        descricao: "Tecnologia",
})
.expect(201);

    temaId = resposta.body.id;
    expect(resposta.body.descricao).toEqual("Tecnologia");
});

it("02 - Deve listar todos os Temas", async () => {
    const resposta = await request(app.getHttpServer())
    .get("/temas")
    .set("Authorization", `${token}`)
    .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
});

it("03 - Deve buscar um Tema por ID", async () => {
    const resposta = await request(app.getHttpServer())
    .get(`/temas/${temaId}`)
    .set("Authorization", `${token}`)
    .expect(200);

    expect(resposta.body.id).toEqual(temaId);
});

it("04 - Deve atualizar um Tema", async () => {
    const resposta = await request(app.getHttpServer())
    .put("/temas")
    .set("Authorization", ` ${token}`)
    .send({
        id: temaId,
        descricao: "Tecnologia Atualizada",
})
.expect(200);

    expect(resposta.body.descricao).toEqual("Tecnologia Atualizada");
});

it("05 - Deve deletar um Tema", async () => {
    await request(app.getHttpServer())
    .delete(`/temas/${temaId}`)
    .set("Authorization", `${token}`)
    .expect(204);
});
});