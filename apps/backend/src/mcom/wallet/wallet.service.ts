import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_CENTRAL_URL = 'http://localhost:3010';

export interface WalletBalanceResponse {
  success: boolean;
  balance: number;
  availableBalance: number;
  currency: string;
  status: string;
}

export interface WalletDebitReceipt {
  success: boolean;
  transactionId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  reference?: string;
  idempotencyKey: string;
  processedAt: string;
}

export interface DebitOptions {
  category?: string;
  description: string;
  reference?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

@Injectable()
export class McomWalletService {
  private readonly logger = new Logger(McomWalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  private centralUrl(): string {
    return (process.env.MCOM_SOLUTIONS_URL || DEFAULT_CENTRAL_URL).replace(
      /\/+$/,
      '',
    );
  }

  private clientId(): string {
    return process.env.MCOM_CLIENT_ID || 'mcom-links';
  }

  private hmacSecret(): string {
    return process.env.MCOM_HMAC_SECRET || '';
  }

  private sign(payload: string): string {
    return (
      'sha256=' +
      crypto
        .createHmac('sha256', this.hmacSecret())
        .update(payload)
        .digest('hex')
    );
  }

  async getBalance(userId: string): Promise<WalletBalanceResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mcomUserId) {
      return {
        success: false,
        balance: 0,
        availableBalance: 0,
        currency: 'MCOM',
        status: 'UNLINKED',
      };
    }

    const signature = this.sign('');
    try {
      const res = await axios.get<WalletBalanceResponse>(
        `${this.centralUrl()}/api/v1/wallet/partner/balance/${user.mcomUserId}`,
        {
          headers: {
            'X-Mcom-Client-ID': this.clientId(),
            'X-Mcom-Signature': signature,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );
      return res.data;
    } catch (err: any) {
      this.logger.error(
        `Failed to fetch wallet balance for user ${user.mcomUserId}: ${err?.response?.data?.message || err.message}`,
      );
      throw new UnprocessableEntityException(
        err?.response?.data?.message || 'Could not retrieve MCOM Wallet balance',
      );
    }
  }

  async debitWallet(
    userId: string,
    amount: number,
    opts: DebitOptions,
  ): Promise<WalletDebitReceipt> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mcomUserId) {
      throw new UnauthorizedException('User is not linked to MCOM Central Hub');
    }

    const body = {
      userId: user.mcomUserId,
      amount,
      category: opts.category || 'SUBSCRIPTION',
      description: opts.description,
      reference: opts.reference,
      metadata: opts.metadata || {},
    };

    const payload = JSON.stringify(body);
    const signature = this.sign(payload);
    const idempotencyKey =
      opts.idempotencyKey || `mcom-links-sub-${user.id}-${Date.now()}`;

    try {
      const res = await axios.post<WalletDebitReceipt>(
        `${this.centralUrl()}/api/v1/wallet/partner/debit`,
        body,
        {
          headers: {
            'X-Mcom-Client-ID': this.clientId(),
            'X-Mcom-Signature': signature,
            'X-Idempotency-Key': idempotencyKey,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );
      return res.data;
    } catch (err: any) {
      const responseData = err?.response?.data;
      if (
        err?.response?.status === 422 &&
        responseData?.error === 'INSUFFICIENT_BALANCE'
      ) {
        throw new UnprocessableEntityException({
          error: 'INSUFFICIENT_BALANCE',
          message: responseData.message || 'Insufficient wallet balance',
          availableBalance: responseData.availableBalance,
        });
      }
      this.logger.error(
        `Wallet debit failed: ${responseData?.message || err.message}`,
      );
      throw new UnprocessableEntityException(
        responseData?.message || 'Failed to debit MCOM Wallet',
      );
    }
  }
}
