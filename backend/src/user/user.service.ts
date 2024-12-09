import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
    ;
  }

  findByUsername(email: string) {
    return this.userRepository.findOneBy({email});
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
