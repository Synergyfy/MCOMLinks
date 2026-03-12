
import { validate } from 'class-validator';
import { CreateOfferDto } from './src/dashboard/offers/dto/create-offer.dto';
import { plainToInstance } from 'class-transformer';

async function test() {
    const payload = {
        businessName: "Test",
        headline: "Test",
        description: "Test",
        imageUrl: "https://example.com/img.jpg",
        endDate: new Date().toISOString(),
        visibility: "hyperlocal",
        targetPostcode: "E1 6AN",
        isPremium: true
    };

    const instance = plainToInstance(CreateOfferDto, payload);
    const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true });
    
    console.log('Errors:', JSON.stringify(errors, null, 2));
    console.log('Instance:', JSON.stringify(instance, null, 2));
}

test();
