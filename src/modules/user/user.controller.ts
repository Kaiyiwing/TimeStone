import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './common/entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post('profile')
  getProfile(
    @Body() findUserDto: Pick<CreateUserDto, 'email'>,
    @Req() req,
  ): Promise<User | undefined> {
    console.log(req.user);
    return this.userService.findOne(findUserDto);
  }
}
