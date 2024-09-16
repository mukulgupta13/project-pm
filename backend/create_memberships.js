const databaseConnection = require("./databaseSetup");
const { createPlan } = require("./common/razorpay_helper");
const { Membership } = require("./models/Payment");

databaseConnection();

const membershipData = [
  {
    name: "student-sub-test",
    amount: 10000,
    user_type: "student",
    subscription_type: "yearly",
  },
  {
    name: "school-sub-test",
    amount: 9000,
    user_type: "school",
    subscription_type: "monthly",
  },
];

(async function () {
  try {
    membershipData.forEach(async (doc) => {
      console.log(`creating razorpay plan for ${doc.name}`);
      const membership = new Membership(doc);
      const sub = await membership.save();
      const plan = await createPlan(sub);
      sub.razorpay_plan_id = plan.id;
      await sub.save();
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  setTimeout(() => {
    process.exit(0);
  }, 5000);
})();
