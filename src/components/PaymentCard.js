"use client";

export default function PaymentCard({ payment }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  const calculateActiveUntil = (createdAt) => {
    if (!createdAt) return "";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const activeUntil = new Date(date);
    activeUntil.setMonth(activeUntil.getMonth() + 1);

    return (
      activeUntil.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      " " +
      activeUntil.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Determine payment type and amount
  const getPaymentInfo = () => {
    const type = payment.type || "";

    if (type === "subscription") {
      return {
        title: "SUBSCRIPTION",
        description: "Monthly Subscription",
        amount: 275000,
        isSubscription: true,
      };
    } else if (type === "consultation") {
      return {
        title: "BASIC",
        description: "1x Consultation",
        amount: 50000,
        isSubscription: false,
      };
    } else {
      return {
        title: "BASIC",
        description: "1x Consultation",
        amount: 50000,
        isSubscription: false,
      };
    }
  };

  const paymentInfo = getPaymentInfo();

  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-3xl p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-1">{paymentInfo.title}</h3>
          <p className="text-purple-100 text-sm opacity-80">
            {paymentInfo.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {formatPrice(paymentInfo.amount)}
          </div>
          <p className="text-purple-100 text-xs opacity-80 mt-1">
            {payment.paymentMethod && payment.paymentMethod.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Deatil */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 text-sm items-center">
        {/* Tanggal */}
        <div>
          <p className="text-purple-100 opacity-80 mb-1">Ordered on</p>
          <p className="font-medium">{formatDate(payment.createdAt)}</p>
        </div>

        {/* Divider */}
        <div className="border-l-2 border-white/30 h-18  text-center"></div>

        {/* Status */}
        <div className="text-right">
          <p className="text-purple-100 opacity-80 mb-1">
            {paymentInfo.isSubscription ? "Active until" : "Status"}
          </p>
          <p className="font-medium">
            {paymentInfo.isSubscription
              ? calculateActiveUntil(payment.createdAt)
              : payment.status === "success"
              ? "Completed"
              : payment.status}
          </p>
        </div>
      </div>

      {/* Payment ID */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-purple-100 opacity-60 text-xs">
          Payment ID: {payment.paymentId}
        </p>
      </div>
    </div>
  );
}
