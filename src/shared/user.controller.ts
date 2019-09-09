import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    Response,
    Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserGuard } from '../guards/user.guard';
import { Book } from '../types/book';
import { User as UserDocument, User } from '../types/user';
import { Users } from '../utilities/user.decorator';
import { UserService } from './user.service';
import { LoginDTO } from 'src/auth/auth.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'), UserGuard)
    async listAll(): Promise<User[]> {
        return await this.userService.find();
    }

    @Get('/:id')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    async getUserById(@Request() req): Promise<User[]> {
        const user = await this.userService.findUserById(req.params.id);
        console.log(user)
        return [user];
    }

    // @Get('/mine')
    // @UseGuards(AuthGuard('jwt'), UseGuards)
    // async listMine(@Users() user: UserDocument): Promise<User[]> {
    //   const { id } = user;
    //   return await this.userService.findByOwner(id);
    // }

    // @Get('/userLogin')
    // @UseGuards(AuthGuard('jwt', UseGuards))
    // async getUserLogin(@Users user : UserDocument, userDTO : LoginDTO ) : Promise<User>{
    //         return await this.userService.findByLogin(userDTO);
    // }
}
