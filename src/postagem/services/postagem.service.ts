import { TemaService } from './../../tema/services/tema.service';
import { Postagem } from './../entities/postagem.entity';
import { DeleteResult, ILike, Repository } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostagemService {
    constructor(
        @InjectRepository(Postagem)
        private PostagemRepository: Repository<Postagem>,
        private TemaService:TemaService
    ){}


async findAll(): Promise<Postagem[]> {
    return await this.PostagemRepository.find({
        relations:{
                tema: true }
            });
}

async findById(id: number): Promise<Postagem>{
    let postagem = await this.PostagemRepository.findOne({
        where:{
            id,
        },
        relations:{
                tema: true
            }
    });

if(!postagem){
    throw new HttpException("Postagem não encontrada!", HttpStatus.NOT_FOUND);
}

return postagem;
}

async findByTitulo(titulo: string): Promise<Postagem[]>{
    return await this.PostagemRepository.find({
        where:{
            titulo:ILike(`%${titulo}%`)
        },
        relations:{
                tema: true
            }
    })
}

async create(postagem: Postagem): Promise<Postagem>{

await this.TemaService.findById(postagem.tema.id);

return await this.PostagemRepository.save(postagem);
}

async update(postagem: Postagem):Promise<Postagem>{

await this.findById(postagem.id)

await this.TemaService.findById(postagem.tema.id);

return await this.PostagemRepository.save(postagem);
}

async delete(id: number): Promise<DeleteResult>{

await this.findById(id)

return await this.PostagemRepository.delete(id);
}
}

