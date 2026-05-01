import { DeliveryEntry, FuelData } from '../types';

export const calculateEntryTotals = (entry: DeliveryEntry) => {
  let cashTip = 0;
  let spayTip = 0;
  let amountToTransfer = 0;

  if (entry.hasCashPayment && entry.customerPaid > entry.customerOwe) {
    cashTip = entry.customerPaid - entry.customerOwe;
    amountToTransfer = entry.customerOwe;
  }

  if (entry.hasSeparateTip) {
    if (entry.separateTipType === 'cash') {
      cashTip += entry.separateTipAmount;
    } else {
      spayTip += entry.separateTipAmount;
    }
  }

  return {
    spayIncome: entry.spayIncome,
    cashTip,
    spayTip,
    amountToTransfer,
  };
};

export const calculateSessionTotals = (entries: DeliveryEntry[], fuel: FuelData) => {
  let totalSpayIncome = 0;
  let totalCashTip = 0;
  let totalSpayTip = 0;
  let totalAmountToTransfer = 0;

  entries.forEach(entry => {
    const { spayIncome, cashTip, spayTip, amountToTransfer } = calculateEntryTotals(entry);
    totalSpayIncome += spayIncome;
    totalCashTip += cashTip;
    totalSpayTip += spayTip;
    totalAmountToTransfer += amountToTransfer;
  });

  const totalTip = totalCashTip + totalSpayTip;
  const totalIncome = totalSpayIncome + totalTip;

  const litresConsumed = fuel.kmPerL > 0 ? fuel.distance / fuel.kmPerL : 0;
  const fuelExpenseRaw = litresConsumed * fuel.costPerLitre;
  const fuelExpense = Math.ceil(fuelExpenseRaw/100) * 100

  const netEarnings = totalIncome - fuelExpense;

  return {
    totalSpayIncome,
    totalCashTip,
    totalSpayTip,
    totalTip,
    totalIncome,
    fuelExpense,
    litresConsumed,
    netEarnings,
    totalAmountToTransfer,
  };
};
