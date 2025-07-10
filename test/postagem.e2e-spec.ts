import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe("Testes do Módulo Postagem (e2e)", () => {
let app: INestApplication;
let token: string;
let usuarioId: number;
let temaId: number;
let postagemId: number;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
        TypeOrmModule.forRoot({
        type: "sqlite",
        database: ":memory:",
        entities: [__dirname + "/../src/**/entities/*.entity.ts"],
        synchronize: true,
        dropSchema: true,
        }),
        AppModule,],
}).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    
    const cadastro = await request(app.getHttpServer())
    .post("/usuarios/cadastrar")
    .send({
        nome: "Root",
        usuario: "root@root.com",
        senha: "rootroot",
        foto: '-',
    });

    usuarioId = cadastro.body.id;

    const login = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
        usuario: "root@root.com",
        senha: "rootroot",
    });

    token = login.body.token;

    const tema = await request(app.getHttpServer())
    .post("/temas")
    .set("Authorization", `${token}`)
    .send({
        descricao: "Tecnologia",
});

    temaId = tema.body.id;
});

afterAll(async () => {
    await app.close();
});

it("01 - Deve criar uma nova Postagem", async () => {
    const resposta = await request(app.getHttpServer())
    .post("/postagens")
    .set("Authorization", `${token}`)
    .send({
        titulo: "Postagem de Teste",
        texto: "Conteúdo da postagem",
        tema: { id: temaId },
        usuario: { id: usuarioId },
})
.expect(201);

    postagemId = resposta.body.id;
    expect(resposta.body.titulo).toEqual("Postagem de Teste");
});

it("02 - Deve listar todas as Postagens", async () => {
    const resposta = await request(app.getHttpServer())
    .get("/postagens")
    .set("Authorization", `${token}`)
    .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
});

it("03 - Deve buscar uma Postagem por ID", async () => {
    const resposta = await request(app.getHttpServer())
    .get(`/postagens/${postagemId}`)
    .set("Authorization", `${token}`)
    .expect(200);

    expect(resposta.body.id).toEqual(postagemId);
});

it("04 - Deve atualizar uma Postagem", async () => {
    const resposta = await request(app.getHttpServer())
    .put("/postagens")
    .set("Authorization", `${token}`)
    .send({
        id: postagemId,
        titulo: "Postagem Atualizada",
        texto: "Texto atualizado",
        tema: { id: temaId },
        usuario: { id: usuarioId },
})
.expect(200);

    expect(resposta.body.titulo).toEqual("Postagem Atualizada");
});

it("05 - Deve deletar uma Postagem", async () => {
    await request(app.getHttpServer())
    .delete(`/postagens/${postagemId}`)
    .set("Authorization", `${token}`)
    .expect(204);
});
});