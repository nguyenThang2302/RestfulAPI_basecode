import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('LoginWithGoogleDto',
    {
        tokenId: SwaggerDocument.ApiProperty({ type: 'string' })
    });

export const LoginWithGoogleDto = body => ({
    tokenId: body.tokenId
});
