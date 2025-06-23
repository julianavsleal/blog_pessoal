import { Postagem } from '../entities/postagem.entity';
import { PostagemService } from './../services/postagem.service';
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";



@Controller("/postagens")
export class PostagemController{
    constructor(private readonly PostagemService: PostagemService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Postagem[]> {
        return this.PostagemService.findAll();
    }
}