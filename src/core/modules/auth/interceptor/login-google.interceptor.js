import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const LoginWithGoogleInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        tokenId: JoiUtils.requiredString()
    })
);
