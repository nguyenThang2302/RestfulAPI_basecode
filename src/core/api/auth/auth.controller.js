import { AuthService } from '../../modules/auth/service/auth.service';
import { LoginDto, LoginWithGoogleDto } from '../../modules/auth';
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = async req => {
        const data = await this.service.login(LoginDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    loginWithGoogle = async req => {
        const data = await this.service.loginWithGoogle(LoginWithGoogleDto(req.body).tokenId);
        return ValidHttpResponse.toOkResponse(data);
    }
}

export const AuthController = new Controller();
