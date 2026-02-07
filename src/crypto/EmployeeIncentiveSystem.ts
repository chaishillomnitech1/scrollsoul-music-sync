import { v4 as uuidv4 } from 'uuid';

/**
 * Crypto token types
 */
export enum TokenType {
  SRT = 'SRT', // ScrollSoul Reward Token
  BTC = 'BTC',
  ETH = 'ETH',
  USDC = 'USDC',
  CUSTOM = 'CUSTOM',
}

/**
 * Token transaction types
 */
export enum TransactionType {
  REWARD = 'REWARD',
  BONUS = 'BONUS',
  REFERRAL = 'REFERRAL',
  PERFORMANCE = 'PERFORMANCE',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
  CONVERSION = 'CONVERSION',
  REDEMPTION = 'REDEMPTION',
  TRANSFER = 'TRANSFER',
}

/**
 * Vesting schedule status
 */
export enum VestingStatus {
  PENDING = 'PENDING',
  VESTING = 'VESTING',
  VESTED = 'VESTED',
  CANCELLED = 'CANCELLED',
}

/**
 * Employee wallet
 */
export interface EmployeeWallet {
  id: string;
  employeeId: string;
  companyId: string;
  walletAddress: string;
  balances: Map<TokenType, number>;
  stakedBalance: number;
  vestedBalance: number;
  pendingVesting: number;
  createdAt: Date;
  lastActivity: Date;
}

/**
 * Token transaction
 */
export interface TokenTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  tokenType: TokenType;
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
  transactionHash?: string;
  createdAt: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

/**
 * Vesting schedule
 */
export interface VestingSchedule {
  id: string;
  walletId: string;
  tokenType: TokenType;
  totalAmount: number;
  vestedAmount: number;
  remainingAmount: number;
  startDate: Date;
  endDate: Date;
  cliffDate?: Date; // Tokens don't vest until after this date
  vestingPeriod: number; // in days
  status: VestingStatus;
}

/**
 * Reward milestone
 */
export interface RewardMilestone {
  id: string;
  name: string;
  description: string;
  tokenReward: number;
  tokenType: TokenType;
  criteria: {
    type: 'STREAMING' | 'ENGAGEMENT' | 'REFERRAL' | 'PERFORMANCE' | 'COLLABORATION';
    threshold: number;
  };
  isActive: boolean;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  employeeId: string;
  employeeName: string;
  totalTokens: number;
  rank: number;
  achievements: string[];
  lastMonthEarnings: number;
}

/**
 * Staking pool
 */
export interface StakingPool {
  id: string;
  name: string;
  tokenType: TokenType;
  apr: number; // Annual percentage rate
  minStakeAmount: number;
  totalStaked: number;
  lockPeriod: number; // in days
  rewards: number;
}

/**
 * Employee Crypto Incentive System
 * Revolutionary employee rewards using blockchain technology
 */
export class EmployeeIncentiveSystem {
  private wallets: Map<string, EmployeeWallet> = new Map();
  private transactions: Map<string, TokenTransaction> = new Map();
  private vestingSchedules: Map<string, VestingSchedule> = new Map();
  private milestones: Map<string, RewardMilestone> = new Map();
  private stakingPools: Map<string, StakingPool> = new Map();

  // Token exchange rates (simplified - in production would connect to real exchanges)
  private exchangeRates: Map<string, number> = new Map([
    ['SRT_TO_USD', 0.10],
    ['SRT_TO_BTC', 0.000002],
    ['SRT_TO_ETH', 0.00003],
    ['SRT_TO_USDC', 0.10],
  ]);

  constructor() {
    this.initializeDefaultMilestones();
    this.initializeStakingPools();
  }

  /**
   * Initialize default reward milestones
   */
  private initializeDefaultMilestones() {
    const defaultMilestones: Omit<RewardMilestone, 'id'>[] = [
      {
        name: 'Music Streamer',
        description: 'Stream 100 hours of music',
        tokenReward: 50,
        tokenType: TokenType.SRT,
        criteria: { type: 'STREAMING', threshold: 100 },
        isActive: true,
      },
      {
        name: 'Power User',
        description: 'Stream 500 hours of music',
        tokenReward: 300,
        tokenType: TokenType.SRT,
        criteria: { type: 'STREAMING', threshold: 500 },
        isActive: true,
      },
      {
        name: 'Platform Ambassador',
        description: 'Refer 10 new users',
        tokenReward: 200,
        tokenType: TokenType.SRT,
        criteria: { type: 'REFERRAL', threshold: 10 },
        isActive: true,
      },
      {
        name: 'Top Performer',
        description: 'Achieve 95% performance rating',
        tokenReward: 500,
        tokenType: TokenType.SRT,
        criteria: { type: 'PERFORMANCE', threshold: 95 },
        isActive: true,
      },
      {
        name: 'Team Player',
        description: 'Complete 50 collaboration tasks',
        tokenReward: 250,
        tokenType: TokenType.SRT,
        criteria: { type: 'COLLABORATION', threshold: 50 },
        isActive: true,
      },
    ];

    defaultMilestones.forEach((milestone) => {
      const id = uuidv4();
      this.milestones.set(id, { ...milestone, id });
    });
  }

  /**
   * Initialize staking pools
   */
  private initializeStakingPools() {
    const pools: Omit<StakingPool, 'id'>[] = [
      {
        name: 'Basic Staking',
        tokenType: TokenType.SRT,
        apr: 5,
        minStakeAmount: 100,
        totalStaked: 0,
        lockPeriod: 30,
        rewards: 0,
      },
      {
        name: 'Premium Staking',
        tokenType: TokenType.SRT,
        apr: 10,
        minStakeAmount: 1000,
        totalStaked: 0,
        lockPeriod: 90,
        rewards: 0,
      },
      {
        name: 'Elite Staking',
        tokenType: TokenType.SRT,
        apr: 15,
        minStakeAmount: 10000,
        totalStaked: 0,
        lockPeriod: 365,
        rewards: 0,
      },
    ];

    pools.forEach((pool) => {
      const id = uuidv4();
      this.stakingPools.set(id, { ...pool, id });
    });
  }

  /**
   * Create employee wallet
   */
  createEmployeeWallet(employeeId: string, companyId: string): EmployeeWallet {
    // Generate a mock wallet address (in production, would generate real blockchain address)
    const walletAddress = `0x${uuidv4().replace(/-/g, '').substring(0, 40)}`;

    const wallet: EmployeeWallet = {
      id: uuidv4(),
      employeeId,
      companyId,
      walletAddress,
      balances: new Map([[TokenType.SRT, 0]]),
      stakedBalance: 0,
      vestedBalance: 0,
      pendingVesting: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  /**
   * Get wallet by employee ID
   */
  getWalletByEmployee(employeeId: string): EmployeeWallet | undefined {
    return Array.from(this.wallets.values()).find((w) => w.employeeId === employeeId);
  }

  /**
   * Get wallet balance
   */
  getBalance(walletId: string, tokenType: TokenType = TokenType.SRT): number {
    const wallet = this.wallets.get(walletId);
    return wallet?.balances.get(tokenType) || 0;
  }

  /**
   * Award tokens to employee
   */
  awardTokens(
    walletId: string,
    amount: number,
    reason: string,
    type: TransactionType = TransactionType.REWARD,
    tokenType: TokenType = TokenType.SRT,
    metadata?: Record<string, any>
  ): TokenTransaction {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    // Update wallet balance
    const currentBalance = wallet.balances.get(tokenType) || 0;
    wallet.balances.set(tokenType, currentBalance + amount);
    wallet.lastActivity = new Date();

    // Create transaction record
    const transaction: TokenTransaction = {
      id: uuidv4(),
      walletId,
      type,
      tokenType,
      amount,
      reason,
      metadata,
      transactionHash: `0x${uuidv4().replace(/-/g, '')}`,
      createdAt: new Date(),
      status: 'COMPLETED',
    };

    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Create vesting schedule
   */
  createVestingSchedule(
    walletId: string,
    tokenType: TokenType,
    totalAmount: number,
    vestingPeriod: number,
    cliffPeriod?: number
  ): VestingSchedule {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + vestingPeriod);

    let cliffDate: Date | undefined;
    if (cliffPeriod) {
      cliffDate = new Date(startDate);
      cliffDate.setDate(cliffDate.getDate() + cliffPeriod);
    }

    const vestingSchedule: VestingSchedule = {
      id: uuidv4(),
      walletId,
      tokenType,
      totalAmount,
      vestedAmount: 0,
      remainingAmount: totalAmount,
      startDate,
      endDate,
      cliffDate,
      vestingPeriod,
      status: VestingStatus.VESTING,
    };

    this.vestingSchedules.set(vestingSchedule.id, vestingSchedule);
    wallet.pendingVesting += totalAmount;

    return vestingSchedule;
  }

  /**
   * Process vesting (should be called periodically)
   */
  processVesting(vestingScheduleId: string): number {
    const schedule = this.vestingSchedules.get(vestingScheduleId);
    if (!schedule || schedule.status !== VestingStatus.VESTING) {
      return 0;
    }

    const wallet = this.wallets.get(schedule.walletId);
    if (!wallet) {
      return 0;
    }

    const now = new Date();

    // Check if still in cliff period
    if (schedule.cliffDate && now < schedule.cliffDate) {
      return 0;
    }

    // Calculate vested amount based on time elapsed
    const totalTime = schedule.endDate.getTime() - schedule.startDate.getTime();
    const elapsedTime = now.getTime() - schedule.startDate.getTime();
    const vestingProgress = Math.min(1, elapsedTime / totalTime);

    const totalVested = Math.floor(schedule.totalAmount * vestingProgress);
    const newlyVested = totalVested - schedule.vestedAmount;

    if (newlyVested > 0) {
      schedule.vestedAmount += newlyVested;
      schedule.remainingAmount -= newlyVested;
      wallet.vestedBalance += newlyVested;
      wallet.pendingVesting -= newlyVested;

      // Update wallet balance
      const currentBalance = wallet.balances.get(schedule.tokenType) || 0;
      wallet.balances.set(schedule.tokenType, currentBalance + newlyVested);

      // Create transaction
      this.awardTokens(
        wallet.id,
        0, // Don't double-add
        'Vesting distribution',
        TransactionType.REWARD,
        schedule.tokenType,
        { vestingScheduleId }
      );
    }

    // Check if fully vested
    if (vestingProgress >= 1) {
      schedule.status = VestingStatus.VESTED;
    }

    return newlyVested;
  }

  /**
   * Stake tokens
   */
  stakeTokens(walletId: string, amount: number, poolId: string): TokenTransaction {
    const wallet = this.wallets.get(walletId);
    const pool = this.stakingPools.get(poolId);

    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }
    if (!pool) {
      throw new Error(`Staking pool not found: ${poolId}`);
    }

    const balance = wallet.balances.get(pool.tokenType) || 0;
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    if (amount < pool.minStakeAmount) {
      throw new Error(`Minimum stake amount is ${pool.minStakeAmount}`);
    }

    // Update wallet
    wallet.balances.set(pool.tokenType, balance - amount);
    wallet.stakedBalance += amount;

    // Update pool
    pool.totalStaked += amount;

    // Create transaction
    return this.awardTokens(
      walletId,
      -amount,
      `Staked in ${pool.name}`,
      TransactionType.STAKE,
      pool.tokenType,
      { poolId }
    );
  }

  /**
   * Unstake tokens
   */
  unstakeTokens(walletId: string, amount: number, poolId: string): TokenTransaction {
    const wallet = this.wallets.get(walletId);
    const pool = this.stakingPools.get(poolId);

    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }
    if (!pool) {
      throw new Error(`Staking pool not found: ${poolId}`);
    }
    if (wallet.stakedBalance < amount) {
      throw new Error('Insufficient staked balance');
    }

    // Calculate rewards
    const rewards = this.calculateStakingRewards(amount, pool.apr, pool.lockPeriod);

    // Update wallet
    const balance = wallet.balances.get(pool.tokenType) || 0;
    wallet.balances.set(pool.tokenType, balance + amount + rewards);
    wallet.stakedBalance -= amount;

    // Update pool
    pool.totalStaked -= amount;

    // Create transaction
    return this.awardTokens(
      walletId,
      amount + rewards,
      `Unstaked from ${pool.name} with rewards`,
      TransactionType.UNSTAKE,
      pool.tokenType,
      { poolId, rewards }
    );
  }

  /**
   * Calculate staking rewards
   */
  private calculateStakingRewards(amount: number, apr: number, days: number): number {
    return (amount * apr * days) / (365 * 100);
  }

  /**
   * Convert tokens
   */
  convertTokens(
    walletId: string,
    fromToken: TokenType,
    toToken: TokenType,
    amount: number
  ): TokenTransaction {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    const fromBalance = wallet.balances.get(fromToken) || 0;
    if (fromBalance < amount) {
      throw new Error('Insufficient balance for conversion');
    }

    // Get exchange rate
    const rateKey = `${fromToken}_TO_${toToken}`;
    const rate = this.exchangeRates.get(rateKey);
    if (!rate) {
      throw new Error(`Exchange rate not available for ${fromToken} to ${toToken}`);
    }

    const convertedAmount = amount * rate;

    // Update balances
    wallet.balances.set(fromToken, fromBalance - amount);
    const toBalance = wallet.balances.get(toToken) || 0;
    wallet.balances.set(toToken, toBalance + convertedAmount);

    // Create transaction
    return this.awardTokens(
      walletId,
      0,
      `Converted ${amount} ${fromToken} to ${convertedAmount} ${toToken}`,
      TransactionType.CONVERSION,
      fromToken,
      { toToken, convertedAmount, rate }
    );
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(companyId: string, limit: number = 10): LeaderboardEntry[] {
    const companyWallets = Array.from(this.wallets.values()).filter(
      (w) => w.companyId === companyId
    );

    const entries = companyWallets.map((wallet) => {
      const totalTokens = wallet.balances.get(TokenType.SRT) || 0;
      const lastMonthTransactions = Array.from(this.transactions.values()).filter(
        (t) =>
          t.walletId === wallet.id &&
          t.createdAt.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
      );
      const lastMonthEarnings = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

      return {
        employeeId: wallet.employeeId,
        employeeName: `Employee ${wallet.employeeId.substring(0, 8)}`,
        totalTokens,
        rank: 0,
        achievements: [], // Would be populated from milestone tracking
        lastMonthEarnings,
      };
    });

    // Sort by total tokens and assign ranks
    entries.sort((a, b) => b.totalTokens - a.totalTokens);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, limit);
  }

  /**
   * Get wallet transactions
   */
  getTransactionHistory(walletId: string, limit: number = 50): TokenTransaction[] {
    return Array.from(this.transactions.values())
      .filter((t) => t.walletId === walletId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get all reward milestones
   */
  getAllMilestones(): RewardMilestone[] {
    return Array.from(this.milestones.values()).filter((m) => m.isActive);
  }

  /**
   * Get all staking pools
   */
  getAllStakingPools(): StakingPool[] {
    return Array.from(this.stakingPools.values());
  }

  /**
   * Get system statistics
   */
  getStats(companyId?: string) {
    let wallets = Array.from(this.wallets.values());
    if (companyId) {
      wallets = wallets.filter((w) => w.companyId === companyId);
    }

    const transactions = Array.from(this.transactions.values()).filter((t) =>
      wallets.some((w) => w.id === t.walletId)
    );

    const totalTokensIssued = wallets.reduce(
      (sum, w) => sum + (w.balances.get(TokenType.SRT) || 0),
      0
    );

    const totalStaked = wallets.reduce((sum, w) => sum + w.stakedBalance, 0);

    return {
      totalWallets: wallets.length,
      totalTokensIssued,
      totalStaked,
      totalTransactions: transactions.length,
      activeVestingSchedules: Array.from(this.vestingSchedules.values()).filter(
        (v) => v.status === VestingStatus.VESTING
      ).length,
      totalStakingPools: this.stakingPools.size,
      activeMilestones: Array.from(this.milestones.values()).filter((m) => m.isActive).length,
    };
  }
}
