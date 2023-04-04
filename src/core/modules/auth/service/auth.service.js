import { pick } from 'lodash';
import { JwtPayload } from 'core/modules/auth/dto/jwt-sign.dto';
import { UserDataService } from 'core/modules/user/services/userData.service';
import { joinUserRoles } from 'core/utils/userFilter';
import { UserService } from 'core/modules/user/services/user.service';
import { OAuthService } from './oauth.service';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { UserRepository } from '../../user/user.repository';
import { UnAuthorizedException } from '../../../../packages/httpException';
import { CreateUserWithGoogleDto } from '../../user/dto';
import { Optional } from '../../../utils';

class Service {
    constructor() {
        this.userRepository = UserRepository;
        this.jwtService = JwtService;
        this.bcryptService = BcryptService;
        this.userService = UserService;
        this.userDataService = UserDataService;
        this.oAuthService = OAuthService;
    }

    login = async loginDto => {
        const user = await this.userRepository.findByEmail(loginDto.email);

        const foundUser = joinUserRoles(user);
        if (user && this.bcryptService.compare(loginDto.password, foundUser.password)) {
            return {
                user: foundUser,
                accessToken: this.jwtService.sign(JwtPayload(foundUser)),
            };
        }

        throw new UnAuthorizedException('Email or password is incorrect');
    };

    #getUserInfo = user => pick(user, ['_id', 'email', 'username', 'roles']);

    loginWithGoogle = async token => {
        const userInfo = Optional.of(await this.oAuthService.verify(token))
            .throwIfNotPresent(new UnAuthorizedException('Invalid token'))
            .get();

        let user = await this.userRepository.findByEmail(userInfo.email);
        if (!user) {
            user = await this.userService.createOneWithGoogleAccount(CreateUserWithGoogleDto(userInfo));
        }

        const accessToken = this.jwtService.sign({ email: userInfo.email, userId: user.id });
        return { email: user.email, username: user.username, accessToken };
    };
}

export const AuthService = new Service();
