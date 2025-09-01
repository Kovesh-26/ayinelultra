import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.getById(id);
  }

  @Get('username/:username')
  getByUsername(@Param('username') username: string) {
    return this.users.getByUsername(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.users.update(id, dto);
  }

  @Get(':id/friends')
  getFriends(@Param('id') id: string) {
    return this.users.getFriends(id);
  }
}
