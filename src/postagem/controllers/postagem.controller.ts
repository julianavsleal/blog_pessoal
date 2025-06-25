import { Postagem } from '../entities/postagem.entity';
import { PostagemService } from './../services/postagem.service';
import { Body, Controller,
        Delete,
        Get, 
        HttpCode, 
        HttpStatus, 
        Param, 
        ParseArrayPipe, 
        Post,
        Put
        } from "@nestjs/common";



@Controller("/postagens")
export class PostagemController{
constructor(private readonly PostagemService: PostagemService){}

@Get()
@HttpCode(HttpStatus.OK)
findAll(): Promise<Postagem[]> {
return this.PostagemService.findAll();
}

@Get("/:id")
@HttpCode(HttpStatus.OK)
findById(@Param("id",ParseArrayPipe)id: number): Promise<Postagem>{
return this.PostagemService.findById(id);
}

@Get("/titulo/:titulo")
@HttpCode(HttpStatus.OK)
findByTitulo(@Param("titulo")titulo: string): Promise<Postagem[]>{
    return this.PostagemService.findByTitulo(titulo);
}

@Post()
@HttpCode(HttpStatus.CREATED)
create(@Body() postagem: Postagem): Promise<Postagem>{
return this.PostagemService.create(postagem);
}

@Put()
@HttpCode(HttpStatus.OK)
update(@Body() postagem: Postagem): Promise<Postagem>{
    return this.PostagemService.update(postagem);
}

@Delete("/:id")
@HttpCode(HttpStatus.NO_CONTENT)
delete(@Param("id", ParseArrayPipe)id: number){
    return this.PostagemService.delete(id);
}

}