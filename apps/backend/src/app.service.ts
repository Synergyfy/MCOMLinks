import { Injectable } from '@nestjs/common';
import { Link } from '@mcom/common';

@Injectable()
export class AppService {
  getHello(): Link {
    return {
      id: '1',
      url: 'https://mcom.com',
      title: 'Mcom',
      createdAt: new Date(),
    };
  }
}
