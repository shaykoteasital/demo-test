import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: UserWithoutPassword; message: string }> {
    const { email, username, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword as string,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = savedUser;
    return {
      user: userWithoutPassword as UserWithoutPassword,
      message: 'User registered successfully',
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: UserWithoutPassword; message: string }> {
    const { username, password } = loginDto;

    // Find user by username
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Compare passwords
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as UserWithoutPassword,
      message: 'Login successful',
    };
  }

  async findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
